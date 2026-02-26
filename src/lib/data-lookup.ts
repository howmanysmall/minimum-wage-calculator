import foodSnapshotRaw from "../data/food_usda_2026_01.json";
import versionSnapshotRaw from "../data/version.json";
import rentSnapshotRaw from "../data/zip_rent_safmr_2026.json";
import type {
	FoodPlanTier,
	FoodSnapshot,
	HouseholdProfile,
	RentSnapshot,
	VersionSnapshot,
	ZipRentRecord,
} from "../types";

const foodSnapshot = foodSnapshotRaw as FoodSnapshot;
const rentSnapshot = rentSnapshotRaw as RentSnapshot;
const versionSnapshot = versionSnapshotRaw as VersionSnapshot;
const zipRentMap = new Map<string, ZipRentRecord>(rentSnapshot.records.map((record) => [record.zip, record]));
const ZIP_PATTERN = /^\d{5}$/;

export function normalizeZip(value: string): string {
	return value.replaceAll(/\D/g, "").slice(0, 5);
}

export function isZipFormatValid(zip: string): boolean {
	return ZIP_PATTERN.test(zip);
}

export function lookupZipRent(zip: string): ZipRentRecord | undefined {
	return zipRentMap.get(zip);
}

export function getFoodBaselineForSingleAdult(tier: FoodPlanTier = "moderate"): number {
	return foodSnapshot.singleAdult[tier];
}

export function getHouseholdFoodBaseline(profile: HouseholdProfile): number {
	const adults = Math.max(1, Math.floor(profile.adults));
	const children = Math.max(0, Math.floor(profile.children));
	const tier = profile.foodPlanTier;

	return adults * foodSnapshot.adultPerPerson[tier] + children * foodSnapshot.childPerPerson[tier];
}

export function getDataVersion(): VersionSnapshot {
	return versionSnapshot;
}
