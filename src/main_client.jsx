import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const initialData = window.__INITIAL_DATA__ || [];

ReactDOM.hydrateRoot(document.getElementById("root"), <App initialLocations={initialData} />);
