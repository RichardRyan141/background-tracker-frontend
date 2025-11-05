import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "./App";

export function render(locations) {
  const html = ReactDOMServer.renderToString(<App initialLocations={locations} />);
  return { html, locations };
}
