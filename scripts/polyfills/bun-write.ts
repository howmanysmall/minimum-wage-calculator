import { createWriteStream } from "node:fs";
import { chmod, mkdir, stat, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { Writable } from "node:stream";

import type { PathLike } from "@scripts-polyfills/bun-types";

type StreamWriteInput = Array<BlobPart> | Blob | ReadableStream | Response;
type WriteInput = ArrayBufferLike | NodeJS.TypedArray | StreamWriteInput | string;

interface ReadableStreamWithPipeTo {
	pipeTo(destination: WritableStream<Uint8Array>): Promise<void>;
}

interface WriteOptions {
	readonly createPath?: boolean;
	readonly mode?: number;
}

const BUFFER_EXISTS = typeof Buffer !== "undefined";
const textDecoder = new TextDecoder();

// oxlint-disable-next-line small-rules/require-async-suffix
export async function write(destination: PathLike, input: WriteInput, options?: WriteOptions): Promise<number> {
	const destinationPath = fromPathLike(destination);

	if (options?.mode !== undefined) {
		const { mode } = options;
		if (!Number.isInteger(mode) || mode < 0 || mode > 0o777) {
			const error = new RangeError("mode must be an integer between 0 and 0o777");
			Error.captureStackTrace(error, write);
			throw error;
		}
	}

	if (options?.createPath !== false) await mkdir(dirname(destinationPath), { recursive: true });

	if (isReadableStreamInput(input)) {
		return writeReadableStreamAsync(destinationPath, toReadableStream(input), options);
	}

	if (isBlobLikeInput(input)) {
		const text = await input.text();
		await writeFileWithModeAsync(destinationPath, text, options);
		return Buffer.byteLength(text);
	}

	const data = toWriteFileData(input);
	await writeFileWithModeAsync(destinationPath, data, options);
	return typeof data === "string" ? Buffer.byteLength(data) : data.byteLength;
}

async function writeReadableStreamAsync(
	destinationPath: string,
	stream: ReadableStreamWithPipeTo,
	options?: WriteOptions,
): Promise<number> {
	const writeStream = createWriteStream(destinationPath, { mode: options?.mode });
	await stream.pipeTo(Writable.toWeb(writeStream));
	await chmodCreatedFileAsync(destinationPath, options?.mode);
	const fileStat = await stat(destinationPath);
	return fileStat.size;
}

async function writeFileWithModeAsync(
	destinationPath: string,
	data: Buffer | string,
	options?: WriteOptions,
): Promise<void> {
	await writeFile(destinationPath, data, { mode: options?.mode });
	await chmodCreatedFileAsync(destinationPath, options?.mode);
}

async function chmodCreatedFileAsync(destinationPath: string, mode: number | undefined): Promise<void> {
	if (mode === undefined) return;
	await chmod(destinationPath, mode);
}

function hasTextMethod(value: unknown): value is { text(): Promise<string> } {
	return isRecord(value) && typeof value.text === "function";
}

function isBlobLikeInput(input: unknown): input is { text(): Promise<string> } {
	return hasTextMethod(input) && !isResponseOrReadableStream(input);
}

function isResponseOrReadableStream(input: unknown): input is ReadableStream | Response {
	return input instanceof Response || input instanceof ReadableStream;
}

function isReadableStreamInput(input: WriteInput): input is Array<BlobPart> | ReadableStream | Response {
	return input instanceof Response || input instanceof ReadableStream || Array.isArray(input);
}

function toReadableStream(input: Array<BlobPart> | ReadableStream | Response): ReadableStreamWithPipeTo {
	if (input instanceof ReadableStream) return input;
	if (input instanceof Response) return input.body ?? new Blob().stream();
	return new Blob(input).stream();
}

function toWriteFileData(input: Exclude<WriteInput, StreamWriteInput | { text(): Promise<string> }>): Buffer | string {
	if (typeof input === "string") return input;
	if (ArrayBuffer.isView(input)) return Buffer.from(input.buffer, input.byteOffset, input.byteLength);
	return Buffer.from(input);
}

function fromPathLike(pathLike: PathLike): string {
	if (typeof pathLike === "string") return pathLike;
	if (pathLike instanceof URL) return pathLike.pathname;
	if (BUFFER_EXISTS && Buffer.isBuffer(pathLike)) return pathLike.toString();

	if (pathLike instanceof ArrayBuffer || ArrayBuffer.isView(pathLike)) {
		const bytes =
			pathLike instanceof ArrayBuffer
				? new Uint8Array(pathLike)
				: new Uint8Array(pathLike.buffer, pathLike.byteOffset, pathLike.byteLength);

		return textDecoder.decode(bytes);
	}

	const error = new TypeError(`Unsupported path type: ${Object.prototype.toString.call(pathLike)}`);
	Error.captureStackTrace(error, fromPathLike);
	throw error;
}

function isString(value: unknown): value is string {
	return typeof value === "string";
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return value !== null && typeof value === "object" && !Array.isArray(value) && Object.keys(value).every(isString);
}
