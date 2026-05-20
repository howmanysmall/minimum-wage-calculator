import { describe } from "vitest";
import rule from "@oxlint-rules/memoized-effect-dependencies";

import { ts } from "./rule-testers";

describe("memoized-effect-dependencies", () => {
	// @ts-expect-error -- Shut up
	ts.run("memoized-effect-dependencies", rule, {
		invalid: [
			{
				code: `
import { useEffect } from "@rbxts/react";

function Component() {
    const dep = {};
    useEffect(() => {}, [dep]);
}
`,
				errors: [{ messageId: "unmemoizedDependency" }],
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: `
import React from "@rbxts/react";

function Component() {
    const dep = () => {};
    React.useEffect(() => {}, [dep]);
}
`,
				errors: [{ messageId: "unmemoizedDependency" }],
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: `
import { useEffect } from "@rbxts/react";

class Foo {}

function Component() {
    useEffect(() => {}, [() => {}, {}, [], new Foo()]);
}
`,
				errors: [
					{ messageId: "unmemoizedDependency" },
					{ messageId: "unmemoizedDependency" },
					{ messageId: "unmemoizedDependency" },
					{ messageId: "unmemoizedDependency" },
				],
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: `
import { useEffect } from "@rbxts/react";

function compute() {
    return {};
}

function Component() {
    const dep = compute();
    useEffect(() => {}, [dep]);
}
`,
				errors: [{ messageId: "unmemoizedDependency" }],
				options: [{ environment: "roblox-ts", mode: "moderate" }],
			},
			{
				code: `
import { useEffect, useRef } from "@rbxts/react";

function Component() {
    const stableRef = useRef({});
    let dep = stableRef;
    useEffect(() => {}, [dep]);
}
`,
				errors: [{ messageId: "unmemoizedDependency" }],
				options: [{ environment: "roblox-ts", mode: "aggressive" }],
			},
		],
		valid: [
			{
				code: `
import { useEffect, useMemo, useCallback } from "@rbxts/react";

function Component() {
    const memo = useMemo(() => ({}), []);
    const callback = useCallback(() => {}, []);
    useEffect(() => {}, [memo, callback]);
}
`,
				options: [{ environment: "roblox-ts" }],
			},

			// useEffect with undeclared variable (should be skipped)
			{
				code: `
import { useEffect } from "@rbxts/react";

function Component() {
    useEffect(() => {}, [noSuchVar]);
}
`,
				options: [{ environment: "roblox-ts" }],
			},

			// Variable with no initializer
			{
				code: `
import { useEffect } from "@rbxts/react";

function Component() {
    let dep;
    useEffect(() => {}, [dep]);
}
`,
				options: [{ environment: "roblox-ts" }],
			},

			// React.useMemo member-expression memo hook
			{
				code: `
import React from "@rbxts/react";

function Component() {
    const memo = React.useMemo(() => ({}), []);
    useEffect(() => {}, [memo]);
}
`,
				options: [{ environment: "roblox-ts" }],
			},

			// useRef as memoized dependency
			{
				code: `
import { useRef, useEffect } from "@rbxts/react";

function Component() {
    const stableRef = useRef({});
    useEffect(() => {}, [stableRef]);
}
`,
				options: [{ environment: "roblox-ts" }],
			},

			// Spread element in deps (definite mode, should be skipped)
			{
				code: `
import { useEffect } from "@rbxts/react";

function Component() {
    const arr = [1];
    useEffect(() => {}, [...arr]);
}
`,
				options: [{ environment: "roblox-ts", mode: "definite" }],
			},

			// Direct call expression in dependency array (definite mode)
			{
				code: `
import { useEffect } from "@rbxts/react";

function compute() {
    return {};
}

function Component() {
    useEffect(() => {}, [compute()]);
}
`,
				options: [{ environment: "roblox-ts", mode: "definite" }],
			},
			{
				code: `
import { useEffect, useState } from "@rbxts/react";

function Component() {
    const [count, setCount] = useState(0);
    useEffect(() => {}, [setCount]);
}
`,
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: `
import { useEffect } from "@rbxts/react";

const stable = {};

function Component() {
    useEffect(() => {}, [stable]);
}
`,
				options: [{ environment: "roblox-ts" }],
			},
			{
				code: `
import { useEffect } from "@rbxts/react";

function Component(props: { value: number }) {
    useEffect(() => {}, [props.value]);
}
`,
				options: [{ environment: "roblox-ts" }],
			},
		],
	});
});
