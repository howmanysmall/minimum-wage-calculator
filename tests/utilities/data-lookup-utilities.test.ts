import { describe, expect, it } from "vitest";
import {
	getFoodBaselineForSingleAdult,
	getHouseholdFoodBaseline,
	isZipFormatValid,
	lookupZipRentAsync,
	normalizeZip,
} from "@utilities/data-lookup-utilities";

describe("data-lookup-utilities", () => {
	describe("normalizeZip", () => {
		it("should normalize and validate ZIP values", () => {
			expect.assertions(3);

			expect(normalizeZip("10001-1234")).toBe("10001");
			expect(isZipFormatValid("10001")).toBe(true);
			expect(isZipFormatValid("1000")).toBe(false);
		}, 250);
	});

	describe("lookupZipRentAsync", () => {
		it("should return a HUD snapshot of rent data for a known ZIP", async () => {
			expect.assertions(2);

			const record = await lookupZipRentAsync("76437");
			expect(record).toBeDefined();
			expect(record?.twoBedroom).toBe(1090);
		}, 10000);
	});

	describe("baseline functions", () => {
		it("should compute household food baseline from the profile", () => {
			expect.assertions(2);
			const singleAdultModerate = getFoodBaselineForSingleAdult("moderate");
			const householdBaseline = getHouseholdFoodBaseline({
				adults: 2,
				children: 1,
				foodPlanTier: "moderate",
			});

			expect(singleAdultModerate).toBeGreaterThan(0);
			expect(householdBaseline).toBeGreaterThan(singleAdultModerate);
		}, 500);
	});
});
