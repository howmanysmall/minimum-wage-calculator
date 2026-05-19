import arrayTypeGeneric from "@oxlint-rules/array-type-generic";
import banInstances from "@oxlint-rules/ban-instances";
import banReactFc from "@oxlint-rules/ban-react-fc";
import banTypes from "@oxlint-rules/ban-types";
import memoizedEffectDependencies from "@oxlint-rules/memoized-effect-dependencies";
import noArrayConstructorElements from "@oxlint-rules/no-array-constructor-elements";
import noArraySizeAssignment from "@oxlint-rules/no-array-size-assignment";
import noAsyncConstructor from "@oxlint-rules/no-async-constructor";
import noCascadingSetState from "@oxlint-rules/no-cascading-set-state";
import noCommentedCode from "@oxlint-rules/no-commented-code";
import noConstantConditionWithBreak from "@oxlint-rules/no-constant-condition-with-break";
import noGiantComponent from "@oxlint-rules/no-giant-component";
import noInlinePropertyOnMemoComponent from "@oxlint-rules/no-inline-property-on-memo-component";
import noInstanceMethodsWithoutThis from "@oxlint-rules/no-instance-methods-without-this";
import noRenderHelperFunctions from "@oxlint-rules/no-render-helper-functions";
import noStaticReactCreateElement from "@oxlint-rules/no-static-react-create-element";
import noUnderscoreReactProperties from "@oxlint-rules/no-underscore-react-properties";
import noUnusedImports from "@oxlint-rules/no-unused-imports";
import noUnusedUseMemo from "@oxlint-rules/no-unused-use-memo";
import noUseMemoSimpleExpression from "@oxlint-rules/no-use-memo-simple-expression";
import noUselessUseEffect from "@oxlint-rules/no-useless-use-effect";
import noUselessUseMemo from "@oxlint-rules/no-useless-use-memo";
import preferClassProperties from "@oxlint-rules/prefer-class-properties";
import preferEarlyReturn from "@oxlint-rules/prefer-early-return";
import preferExpectAssertions from "@oxlint-rules/prefer-expect-assertions";
import preferHoistedJsxElements from "@oxlint-rules/prefer-hoisted-jsx-elements";
import preferHoistedJsxObjectProperties from "@oxlint-rules/prefer-hoisted-jsx-object-properties";
import preferModuleScopeConstants from "@oxlint-rules/prefer-module-scope-constants";
import preferPascalCaseEnums from "@oxlint-rules/prefer-pascal-case-enums";
import preferSingularEnums from "@oxlint-rules/prefer-singular-enums";
import preferTernaryConditionalRendering from "@oxlint-rules/prefer-ternary-conditional-rendering";
import preferUseReducer from "@oxlint-rules/prefer-use-reducer";
import preventAbbreviations from "@oxlint-rules/prevent-abbreviations";
import reactHooksStrictReturn from "@oxlint-rules/react-hooks-strict-return";
import requireAsyncSuffix from "@oxlint-rules/require-async-suffix";
import requireModuleLevelInstantiation from "@oxlint-rules/require-module-level-instantiation";
import requireNamedEffectFunctions from "@oxlint-rules/require-named-effect-functions";
import requireReactComponentKeys from "@oxlint-rules/require-react-component-keys";
import requireReactDisplayNames from "@oxlint-rules/require-react-display-names";
import requireSwitchCaseBraces from "@oxlint-rules/require-switch-case-braces";
import requireUnicodeRegex from "@oxlint-rules/require-unicode-regex";
import rerenderMemoWithDefaultValue from "@oxlint-rules/rerender-memo-with-default-value";
import strictComponentBoundaries from "@oxlint-rules/strict-component-boundaries";
import useExhaustiveDependencies from "@oxlint-rules/use-exhaustive-dependencies";
import useHookAtTopLevel from "@oxlint-rules/use-hook-at-top-level";
import { definePlugin } from "oxlint-plugin-utilities";

import noUselessConstants from "./rules/no-useless-constants";

const smallRules = definePlugin({
	meta: { name: "small-rules" },
	rules: {
		"array-type-generic": arrayTypeGeneric,
		"ban-instances": banInstances,
		"ban-react-fc": banReactFc,
		"ban-types": banTypes,
		"memoized-effect-dependencies": memoizedEffectDependencies,
		"no-array-constructor-elements": noArrayConstructorElements,
		"no-array-size-assignment": noArraySizeAssignment,
		"no-async-constructor": noAsyncConstructor,
		"no-cascading-set-state": noCascadingSetState,
		"no-commented-code": noCommentedCode,
		"no-constant-condition-with-break": noConstantConditionWithBreak,
		"no-giant-component": noGiantComponent,
		"no-inline-property-on-memo-component": noInlinePropertyOnMemoComponent,
		"no-instance-methods-without-this": noInstanceMethodsWithoutThis,
		"no-render-helper-functions": noRenderHelperFunctions,
		"no-static-react-create-element": noStaticReactCreateElement,
		"no-underscore-react-props": noUnderscoreReactProperties,
		"no-unused-imports": noUnusedImports,
		"no-unused-use-memo": noUnusedUseMemo,
		"no-use-memo-simple-expression": noUseMemoSimpleExpression,
		"no-useless-constants": noUselessConstants,
		"no-useless-use-effect": noUselessUseEffect,
		"no-useless-use-memo": noUselessUseMemo,
		"prefer-class-properties": preferClassProperties,
		"prefer-early-return": preferEarlyReturn,
		"prefer-expect-assertions": preferExpectAssertions,
		"prefer-hoisted-jsx-elements": preferHoistedJsxElements,
		"prefer-hoisted-jsx-object-properties": preferHoistedJsxObjectProperties,
		"prefer-module-scope-constants": preferModuleScopeConstants,
		"prefer-pascal-case-enums": preferPascalCaseEnums,
		"prefer-singular-enums": preferSingularEnums,
		"prefer-ternary-conditional-rendering": preferTernaryConditionalRendering,
		"prefer-use-reducer": preferUseReducer,
		"prevent-abbreviations": preventAbbreviations,
		"react-hooks-strict-return": reactHooksStrictReturn,
		"require-async-suffix": requireAsyncSuffix,
		"require-module-level-instantiation": requireModuleLevelInstantiation,
		"require-named-effect-functions": requireNamedEffectFunctions,
		"require-react-component-keys": requireReactComponentKeys,
		"require-react-display-names": requireReactDisplayNames,
		"require-switch-case-braces": requireSwitchCaseBraces,
		"require-unicode-regex": requireUnicodeRegex,
		"rerender-memo-with-default-value": rerenderMemoWithDefaultValue,
		"strict-component-boundaries": strictComponentBoundaries,
		"use-exhaustive-dependencies": useExhaustiveDependencies,
		"use-hook-at-top-level": useHookAtTopLevel,
	},
});

export default smallRules;
