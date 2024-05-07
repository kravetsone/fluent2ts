# fluent2ts

[Fluent](https://projectfluent.org/) is an great **DSL** for localization. This project allows you to generate TypeScript types for yours `.ftl` files.

WIP.

## Usage

```bash [npm]
npx fluent2ts
```

```bash [yarn]
yarn dlx fluent2ts
```

```bash [pnpm]
pnpm exec fluent2ts
```

```bash [bun]
bunx fluent2ts
```

After that, the `locales.types.ts` file is **automatically** generated in the `src` folder. You can also change this location by specifying the `-o` (or `--output`) argument. For example - `npx fluent2ts -o src/some/i18n.ts`.

You can also specify the [glob pattern](<https://en.wikipedia.org/wiki/Glob_(programming)?useskin=vector>) to search for `.ftl` files are specified after the command. For example `npx fluent2ts locales/**/*.ftl`. By default it is `**/*.ftl`.
