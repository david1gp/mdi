import { expect, test } from "bun:test"
import { iconBluesky } from "../src/brands/iconBluesky.js"

test("iconBluesky is a non-empty svg path", () => {
  expect(iconBluesky.length).toBeGreaterThan(40)
  expect(iconBluesky.startsWith("m12 11")).toBe(true)
})
