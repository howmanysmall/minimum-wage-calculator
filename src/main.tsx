import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import baseStyles from "./index.css?inline";

function ensureStyleElement(styleId: string, styleContent: string): void {
	const selector = `style[data-style-id="${styleId}"]`;
	const existingStyleElement = document.querySelector(selector);
	if (existingStyleElement instanceof HTMLStyleElement) return;

	const styleElement = document.createElement("style");
	styleElement.dataset.styleId = styleId;
	styleElement.textContent = styleContent;
	document.head.append(styleElement);
}

function getRootElement(): HTMLElement {
	const rootElement = document.querySelector("#root");
	if (!(rootElement instanceof HTMLElement)) throw new Error("Unable to find root element '#root'.");
	return rootElement;
}

ensureStyleElement("base", baseStyles);

createRoot(getRootElement()).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
