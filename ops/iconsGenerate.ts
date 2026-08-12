import { mkdir, readdir, rm, writeFile } from "node:fs/promises"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import { watch } from "node:fs"
import { brandIcons } from "./brandIcons.ts"

const op = "iconsGenerate"
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..")
const srcDir = join(rootDir, "src")
const brandsDir = join(srcDir, "brands")
const defaultMdiJs = join(process.env.HOME ?? "", "opensource/mdi/mdi.js")
const mdiJsPath = process.env.MDI_JS ?? defaultMdiJs
const mdiJsUrl =
  process.env.MDI_JS_URL ?? "https://raw.githubusercontent.com/Templarian/MaterialDesign-JS/master/mdi.js"

const iconExportPattern = /^export var (mdi\w+) = "([^"]*)";$/gm

function iconFileContent(name: string, path: string): string {
  const escaped = path.replaceAll("\\", "\\\\").replaceAll('"', '\\"')
  return `export const ${name} = "${escaped}" as const\n`
}

function iconsParse(source: string): Map<string, string> {
  const icons = new Map<string, string>()
  for (const match of source.matchAll(iconExportPattern)) {
    const name = match[1]
    const path = match[2]
    if (!name || path === undefined) continue
    icons.set(name, path)
  }
  return icons
}

async function dirTsClear(dir: string): Promise<void> {
  const existing = await readdir(dir).catch(() => [])
  await Promise.all(existing.filter((file) => file.endsWith(".ts")).map((file) => rm(join(dir, file))))
}

async function iconsWrite(icons: Map<string, string>): Promise<void> {
  await mkdir(srcDir, { recursive: true })
  await mkdir(brandsDir, { recursive: true })
  await dirTsClear(srcDir)
  await dirTsClear(brandsDir)

  const writes: Promise<void>[] = []
  for (const [name, path] of icons) {
    writes.push(writeFile(join(srcDir, `${name}.ts`), iconFileContent(name, path)))
  }
  for (const [name, path] of Object.entries(brandIcons)) {
    writes.push(writeFile(join(brandsDir, `${name}.ts`), iconFileContent(name, path)))
  }
  await Promise.all(writes)
}

async function mdiSourceRead(): Promise<string> {
  const local = Bun.file(mdiJsPath)
  if (await local.exists()) return local.text()

  const response = await fetch(mdiJsUrl)
  if (!response.ok) {
    throw new Error(
      `${op}: missing ${mdiJsPath} and fetch ${mdiJsUrl} failed (${response.status} ${response.statusText})`,
    )
  }
  return response.text()
}

async function iconsGenerate(): Promise<void> {
  const icons = iconsParse(await mdiSourceRead())
  if (icons.size === 0) {
    throw new Error(`${op}: parsed 0 icons from ${mdiJsPath}`)
  }

  await iconsWrite(icons)
  console.log(`wrote ${icons.size} mdi icons to src/ + ${Object.keys(brandIcons).length} brand icons to src/brands/`)
}

const watchMode = process.argv.includes("--watch")
await iconsGenerate()

if (watchMode) {
  console.log(`watching ${mdiJsPath}`)
  watch(mdiJsPath, async () => {
    try {
      await iconsGenerate()
    } catch (error) {
      console.error(error)
    }
  })
}
