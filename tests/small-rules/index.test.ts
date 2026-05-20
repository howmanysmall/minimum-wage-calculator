import { describe, expect, it } from "vitest";

describe("small-rules plugin", () => {
	describe("plugin metadata", () => {
		it("has the correct plugin name", async () => {
			expect.assertions(1);

			const smallRules = await import("@oxlint-rules/../index");

			expect(smallRules.default.meta?.name).toBe("small-rules");
		}, 5000);
	});
});
