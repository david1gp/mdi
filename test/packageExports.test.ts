import { expect, test } from "bun:test"
import packageJson from "../package.json" with { type: "json" }

test("package has no barrel export", () => {
  const exports = packageJson.exports as Record<string, unknown>
  expect("." in exports).toBe(false)
  expect("./*.js" in exports).toBe(true)
  expect("./brands/*.js" in exports).toBe(true)
})

test("package is esm-only with no runtime deps", () => {
  expect(packageJson.type).toBe("module")
  expect(packageJson.sideEffects).toBe(false)
  expect(packageJson).not.toHaveProperty("dependencies")
  expect(packageJson).not.toHaveProperty("main")
})
