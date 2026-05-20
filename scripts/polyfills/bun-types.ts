import { type } from "arktype";

const isTypedArray = type.or(
	type.instanceOf(Int8Array),
	type.instanceOf(Uint8Array),
	type.instanceOf(Uint8ClampedArray),
	type.instanceOf(Int16Array),
	type.instanceOf(Uint16Array),
	type.instanceOf(Int32Array),
	type.instanceOf(Uint32Array),
	type.instanceOf(Float32Array),
	type.instanceOf(Float64Array),
	type.instanceOf(BigInt64Array),
	type.instanceOf(BigUint64Array),
);

export const isPathLike = type("string | URL | ArrayBuffer").or(type.instanceOf(SharedArrayBuffer)).or(isTypedArray);
export type PathLike = typeof isPathLike.infer;
