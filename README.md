# @adaptive-ds/mdi

Material Design Icons as one ESM file per path string. Import only the icons you use — nothing else ships into your bundle.

Typical MDI JS packages ship 7,400+ icons as one 2.8 MB file. Bundlers can tree-shake that, but TypeScript, install size, and CommonJS still pay for every icon.

- **One file per icon** – `@adaptive-ds/mdi/mdiAccount.js`
- **No barrel** – there is no `from "@adaptive-ds/mdi"`. Always import a subpath.
- **ESM only** – no CommonJS, no UMD
- **Zero runtime deps** – each file is a path string constant
- **Typed as `const`** – one `.d.ts` per icon

Same names and path strings as [`@mdi/js`](https://www.npmjs.com/package/@mdi/js). Render the SVG yourself.

Quick Links

- code - https://github.com/david1gp/mdi
- npm - https://www.npmjs.com/package/@adaptive-ds/mdi
- browse icons - https://pictogrammers.com/library/mdi/

## Install

```bash
bun add @adaptive-ds/mdi
# or
npm install @adaptive-ds/mdi
```

## Usage

Always import a **specific file**. The `.js` extension is required (NodeNext / bundler resolution).

```ts
import { mdiAccount } from "@adaptive-ds/mdi/mdiAccount.js"
import { mdiGithub } from "@adaptive-ds/mdi/mdiGithub.js"
import { mdiEmailOutline } from "@adaptive-ds/mdi/mdiEmailOutline.js"

console.log(mdiAccount)
// "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12..."
```

This package ships path strings only. Render them in your own SVG:

```tsx
<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
  <path d={mdiAccount} />
</svg>
```

### Migrating from `@mdi/js`

```diff
- import { mdiAccount, mdiGithub } from "@mdi/js"
+ import { mdiAccount } from "@adaptive-ds/mdi/mdiAccount.js"
+ import { mdiGithub } from "@adaptive-ds/mdi/mdiGithub.js"
```

Names and path data match [`@mdi/js@7.4.47`](https://www.npmjs.com/package/@mdi/js).

### Icon component (Solid + Tailwind)

A reference implementation you can copy into a UI kit. It assumes [Tailwind](https://tailwindcss.com/) for sizing and `fill-current`. `cn` is inlined so you do not need a utils import.

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

## Scripts

| Script | What it does |
| --- | --- |
| `bun run generate` | Write one `src/*.ts` file per icon |
| `bun run dev` | Watch the MDI source and regenerate |
| `bun test` | Check a few icon paths |
| `bun run build` | Generate + `tsc` → `dist/` |
| `bun run format` | Biome format |
| `bun run release` | Changelog, tag, GitHub release |

## License

[Apache-2.0](LICENSE). Icon path data is from [Pictogrammers / Material Design Icons](https://pictogrammers.com/), also Apache-2.0.

## Acknowledgments

Icon paths come from [Pictogrammers / Material Design Icons](https://github.com/Templarian/MaterialDesign).
