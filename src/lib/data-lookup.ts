import { type } from "arktype";
import foodSnapshotRaw from "../data/food_usda_2026_01.json";
import versionSnapshotRaw from "../data/version.json";
import type { FoodPlanTier, FoodSnapshot, HouseholdProfile, VersionSnapshot, ZipRentRecord } from "../types";
import { isRentSnapshot } from "../types";

const foodSnapshot = foodSnapshotRaw as FoodSnapshot;
const versionSnapshot = versionSnapshotRaw as VersionSnapshot;
const ZIP_PATTERN = /^\d{5}$/;
let zipRentMapPromise: Promise<Map<string, ZipRentRecord>> | undefined;

export function normalizeZip(value: string): string {
	return value.replaceAll(/\D/g, "").slice(0, 5);
}

export function isZipFormatValid(zip: string): boolean {
	return ZIP_PATTERN.test(zip);
}

async function loadZipRentMapAsync(): Promise<Map<string, ZipRentRecord>> {
	const response = await fetch(new URL("../data/zip_rent_safmr_2026.json", import.meta.url));
	if (!response.ok) throw new TypeError(`Failed to load rent snapshot: HTTP ${response.status}`);

	const rentSnapshotValidation = isRentSnapshot(await response.json());
	if (rentSnapshotValidation instanceof type.errors) {
		throw new TypeError(`Rent snapshot payload is invalid: ${rentSnapshotValidation.summary}`);
	}
	const rentSnapshot = rentSnapshotValidation;
	return new Map<string, ZipRentRecord>(rentSnapshot.records.map((record) => [record.zip, record]));
}

async function getZipRentMapAsync(): Promise<ReadonlyMap<string, ZipRentRecord>> {
	zipRentMapPromise ??= loadZipRentMapAsync();

	try {
		return await zipRentMapPromise;
	} catch (error) {
		zipRentMapPromise = undefined;
		throw error;
	}
}

export async function preloadZipRentSnapshotAsync(): Promise<void> {
	await getZipRentMapAsync();
}

export async function lookupZipRentAsync(zip: string): Promise<ZipRentRecord | undefined> {
	const zipRentMap = await getZipRentMapAsync();
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
