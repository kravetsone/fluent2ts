import fs from "node:fs/promises";
import {
	type Entry,
	type Message,
	type PatternElement,
	type Placeable,
	type SelectExpression,
	type VariableReference,
	parse,
} from "@fluent/syntax";
import { glob } from "glob";
import minimist from "minimist";
import prettier from "prettier";

const args = minimist(process.argv.slice(2));

const pattern = args._.at(0) ?? "**/*.ftl";

const paths = await glob(pattern);

function isMessage(x: Entry): x is Message {
	return x.type === "Message";
}

function isPlaceable(x: PatternElement): x is Placeable & {
	expression:
		| VariableReference
		| (SelectExpression & { selector: VariableReference });
} {
	return (
		x.type === "Placeable" &&
		(x.expression.type === "VariableReference" ||
			(x.expression.type === "SelectExpression" &&
				x.expression.selector.type === "VariableReference"))
	);
}

for await (const path of paths) {
	const file = String(await fs.readFile(path));

	const resource = parse(file, {});

	const generated: string[] = [
		`import type { FluentBundle, FluentVariable } from "@fluent/bundle"`,
		"",
		"export interface LocalesMap {",
		...resource.body.filter(isMessage).map((entry) => {
			if (!entry.value?.elements.filter(isPlaceable).length)
				return `${entry.id.name}: never;`;
			return `"${entry.id.name}": {
				${entry.value.elements
					.filter(isPlaceable)
					.map((element) => {
						if (element.expression.type === "SelectExpression")
							return `${element.expression.selector.id.name}: FluentVariable;`;
						return `${element.expression.id.name}: FluentVariable;`;
					})
					.join("\n")}
			}`;
		}),
		"}",
		"",
		"export interface Message<Key extends keyof LocalesMap> {",
		"	id: Key;",
		"	value: Key;",
		"	attributes: Record<string, Key>;",
		"}",
		"",
		"export interface TypedFluentBundle extends FluentBundle {",
		"	getMessage<Key extends keyof LocalesMap>(key: Key): Message<Key>;",
		"	formatPattern<Key extends keyof LocalesMap>(key: Key, ...args: LocalesMap[Key][]): string;",
		"	formatPattern<Key extends keyof LocalesMap>(key: Key, args?: LocalesMap[Key], errors?: Error[] | null): string;",
		"}",
	];

	fs.writeFile(
		args.o ?? "src/locales.types.ts",
		await prettier.format(generated.join("\n"), {
			tabWidth: 4,
			parser: "typescript",
			endOfLine: "auto",
			semi: false,
		}),
	);
}
