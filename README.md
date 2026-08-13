# @adaptive-ds/mdi

Material Design Icons as **one ESM file per icon**. Import the path you need. Nothing else ships into your bundle.

A modern remake of [`@mdi/js`](https://github.com/Templarian/MaterialDesign-JS): ESM-only, no barrel, no CJS, no extra runtime dependencies.

```ts
import { mdiAccount } from "@adaptive-ds/mdi/mdiAccount.js"

console.log(mdiAccount)
// "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12..."
```

Render it yourself — keep the SVG in your UI kit:

```tsx
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d={mdiAccount} />
</svg>
```

### Icon component (Solid + Tailwind)

Reference implementation. Assumes [Tailwind](https://tailwindcss.com/) for sizing and `fill-current`. `cn` is inlined so you can drop this into a UI kit without a utils import.

```tsx
import { type JSX, splitProps } from "solid-js"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type IconProps = JSX.SvgSVGAttributes<SVGSVGElement> & {
  /** An SVG path string, e.g. `import { mdiRobotOutline } from "@adaptive-ds/mdi/mdiRobotOutline.js"`. */
  path: string
  /** Accessible label. When omitted the icon is decorative (`aria-hidden`). */
  title?: string
}

// splitProps (not destructuring) so dynamic props like `class` stay reactive.
export function Icon(props: IconProps) {
  const [local, rest] = splitProps(props, ["path", "title", "class"])
  return (
    <svg
      viewBox="0 0 24 24"
      class={cn("size-6 fill-current", local.class)}
      role={local.title ? "img" : undefined}
      aria-hidden={local.title ? undefined : true}
      {...rest}
    >
      <title>{local.title}</title>
      <path d={local.path} />
    </svg>
  )
}
```

```tsx
import { mdiRobotOutline } from "@adaptive-ds/mdi/mdiRobotOutline.js"

<Icon path={mdiRobotOutline} title="Robot" class="size-8" />
```

## Why this package

`@mdi/js` is a 2.8 MB monolith of 7,400+ `export var`s. Bundlers can tree-shake it, but TypeScript, install size, and CJS still pay for every icon.

This package:

- **One file per icon** — `@adaptive-ds/mdi/mdiAccount.js`
- **No barrel** — there is no `from "@adaptive-ds/mdi"`. Always use a subpath.
- **ESM only** — no CommonJS, no UMD
- **Zero runtime deps** — just string constants
- **Your TypeScript** — `const` + `.d.ts` from `tsc`
- **Brand logos** live under `brands/` so they stay separate from official Pictogrammers paths

## Install

```bash
bun add @adaptive-ds/mdi
# or
npm install @adaptive-ds/mdi
```

## Usage

Always import a **specific file**. The `.js` extension is required (NodeNext / bundler resolution).

```ts
import { mdiGithub } from "@adaptive-ds/mdi/mdiGithub.js"
import { mdiEmailOutline } from "@adaptive-ds/mdi/mdiEmailOutline.js"
import { iconBluesky } from "@adaptive-ds/mdi/brands/iconBluesky.js"
```

### Migrating from `@mdi/js`

```diff
- import { mdiAccount, mdiGithub } from "@mdi/js"
+ import { mdiAccount } from "@adaptive-ds/mdi/mdiAccount.js"
+ import { mdiGithub } from "@adaptive-ds/mdi/mdiGithub.js"
```

Names and path data match `@mdi/js@7.4.47` (Material Design Icons / Pictogrammers).

## Extra brand icons

Official MDI paths stay at the package root. Brand logos that Pictogrammers is missing or outdated on live under `brands/` and use the same `viewBox="0 0 24 24"` convention. Paths come from the [homepage](https://github.com/david1gp/homepage) project.

| Export | File |
| --- | --- |
| `iconXcom` | `@adaptive-ds/mdi/brands/iconXcom.js` |
| `iconLinkedin` | `@adaptive-ds/mdi/brands/iconLinkedin.js` |
| `iconBluesky` | `@adaptive-ds/mdi/brands/iconBluesky.js` |
| `iconDevTo` | `@adaptive-ds/mdi/brands/iconDevTo.js` |

## Scripts

| Script | What it does |
| --- | --- |
| `bun run generate` | Write one `src/*.ts` file per icon |
| `bun run dev` | Watch the MDI source and regenerate |
| `bun test` | Check a few paths and brand icons |
| `bun run build` | Generate + `tsc` → `dist/` |
| `bun run format` | Biome format |
| `bun run release` | Changelog, tag, GitHub release |

## License

Icon path data: [Pictogrammers Free License](https://pictogrammers.com/) / Apache-2.0 (Material Design Icons).

Packaging and extra brand paths: MIT.

## Related

- Upstream icons: [Pictogrammers / MaterialDesign](https://github.com/Templarian/MaterialDesign)
- Previous JS dist: [`@mdi/js`](https://www.npmjs.com/package/@mdi/js)
- Other Adaptive packages: [david1gp](https://github.com/david1gp)
