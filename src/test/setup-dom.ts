/// <reference types="bun" />

import { GlobalRegistrator } from "@happy-dom/global-registrator";

declare global {
	var IS_REACT_ACT_ENVIRONMENT: boolean;
}

GlobalRegistrator.register();
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const originalFetch = globalThis.fetch.bind(globalThis);

function resolveUrl(input: RequestInfo | URL): URL | undefined {
	if (input instanceof URL) return input;
	if (typeof input === "string") {
		try {
			return new URL(input);
		} catch {
			return undefined;
		}
	}
	if (input instanceof Request) return new URL(input.url);
	return undefined;
}

async function patchedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
	const url = resolveUrl(input);
	if (url?.protocol !== "file:") return originalFetch(input, init);
	if (!("Bun" in globalThis)) return new Response(undefined, { status: 500 });

	const snapshotFile = globalThis.Bun.file(decodeURIComponent(url.pathname));
	if (!(await snapshotFile.exists())) return new Response(undefined, { status: 404 });

	let snapshotText: string;
	try {
		snapshotText = await snapshotFile.text();
	} catch {
		return new Response(undefined, { status: 404 });
	}

	return new Response(snapshotText, {
		headers: { "content-type": "application/json" },
		status: 200,
	});
}

Object.defineProperty(globalThis, "fetch", {
	configurable: true,
	value: patchedFetch,
	writable: true,
});
