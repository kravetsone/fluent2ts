# fluent2ts

[Fluent](https://projectfluent.org/) is an great **DSL** for **localization**. This project allows you to generate **TypeScript** types for yours `.ftl` files.

## Usage

Npm:

```bash
npx fluent2ts
```

Bun:

```bash [bun]
bunx fluent2ts
```

Yarn:

```bash [yarn]
yarn dlx fluent2ts
```

Pnpm:

```bash [pnpm]
pnpm exec fluent2ts
```

After that, the `locales.types.ts` file is **automatically** generated in the `src` folder. You can also change this path by specifying the `-o` (or `--output`) argument. For example - `npx fluent2ts -o src/some/i18n.ts`.

You can also specify the [glob pattern](<https://en.wikipedia.org/wiki/Glob_(programming)?useskin=vector>) to search for `.ftl` files are specified after the command. For example `npx fluent2ts locales/**/*.ftl`. By default it is `**/*.ftl`.

## Watch mode

You can also use `watch mode` and regenerate the types when the file has been modified. To do this, simply specify the `--watch` (or `-w`) argument. For example, `npx fluent2ts -w`.

<video controls autoplay>
  <source src="https://github.com/kravetsone/fluent2ts/assets/57632712/318350a0-318a-43a0-82f6-b70cdb431ab6" type="video/mp4">
</video>

### Output

For example for this:

```fluent
# Simple things are simple.
hello-user = Hello, {$userName}!

# Complex things are possible.
shared-photos =
    {$userName} {$photoCount ->
        [one] added a new photo
       *[other] added {$photoCount} new photos
    } to {$userGender ->
        [male] his stream
        [female] her stream
       *[other] their stream
    }.
```

The following will be generated:

```ts
import type {
    FluentBundle,
    FluentVariable,
    Message as FluentMessage,
    // @ts-ignore
} from "@fluent/bundle";

export interface LocalesMap {
    "hello-user": {
        userName: FluentVariable;
    };
    "shared-photos": {
        userName: FluentVariable;
        photoCount: FluentVariable;
        userGender: FluentVariable;
    };
}

export interface Message<Key extends keyof LocalesMap> extends FluentMessage {
    id: Key;
}

export interface TypedFluentBundle extends FluentBundle {
    getMessage<Key extends keyof LocalesMap>(key: Key): Message<Key>;
    formatPattern<Key extends keyof LocalesMap>(
        key: Key,
        ...args: LocalesMap[Key] extends never ? [] : [args: LocalesMap[Key]]
    ): string;
    formatPattern<Key extends keyof LocalesMap>(
        key: Key,
        args: LocalesMap[Key] extends never ? null : LocalesMap[Key],
        errors?: Error[] | null
    ): string;
}
```
