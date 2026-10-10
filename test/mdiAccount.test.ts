import { expect, test } from "bun:test"
import { mdiAccount } from "../src/mdiAccount.js"

test("mdiAccount is the classic person path", () => {
  expect(mdiAccount.startsWith("M12,4A4,4")).toBe(true)
  expect(mdiAccount.endsWith("Z")).toBe(true)
})
