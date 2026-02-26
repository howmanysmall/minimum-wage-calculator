import { describe, expect, test } from "bun:test";
import {
	getFoodBaselineForSingleAdult,
	getHouseholdFoodBaseline,
	isZipFormatValid,
	lookupZipRent,
	normalizeZip,
} from "./data-lookup";

describe("data lookup helpers", () => {
	test("normalizes and validates ZIP values", () => {
		expect(normalizeZip("10001-1234")).toBe("10001");
		expect(isZipFormatValid("10001")).toBe(true);
		expect(isZipFormatValid("1000")).toBe(false);
	});

	test("returns HUD snapshot rent data for a known ZIP", () => {
		const record = lookupZipRent("76437");
		expect(record).toBeDefined();
		expect(record?.twoBedroom).toBe(1090);
	});

	test("computes household food baseline from profile", () => {
		const singleAdultModerate = getFoodBaselineForSingleAdult("moderate");
		const householdBaseline = getHouseholdFoodBaseline({
			adults: 2,
			children: 1,
			foodPlanTier: "moderate",
		});

		expect(singleAdultModerate).toBeGreaterThan(0);
		expect(householdBaseline).toBeGreaterThan(singleAdultModerate);
	});
});
