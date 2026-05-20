import React from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app";

function getRootElement(): HTMLElement {
	const rootElement = document.querySelector("#root");
	if (!(rootElement instanceof HTMLElement)) throw new Error("Unable to find root element '#root'.");
	return rootElement;
}

createRoot(getRootElement()).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
