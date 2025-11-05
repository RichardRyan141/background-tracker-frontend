/* eslint-env node */
import express from "express";
import fetch from "node-fetch";
import { render } from "./src/main_server.jsx";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ✅ Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static assets (built frontend)
app.use("/assets", express.static(path.join(__dirname, "dist/client/assets")));

// Proxy for frontend fetches after hydration
app.get("/api/*", async (req, res) => {
  const backendURL = `http://background-tracker-backend.railway.internal:8080${req.path.replace(/^\/api/, "")}`;
  try {
    const r = await fetch(backendURL);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error("API proxy error:", err);
    res.status(500).json({ error: "Proxy failed" });
  }
});

// SSR route
app.get("*", async (req, res) => {
  try {
    const backendURL = `http://background-tracker-backend.railway.internal:8080/locations`;
    const r = await fetch(backendURL);
    const data = await r.json();

    const { html } = render(data);
    const template = fs.readFileSync(
      path.join(__dirname, "dist/client/index.html"),
      "utf-8"
    );

    const finalHtml = template
      .replace(`<!--app-html-->`, html)
      .replace(
        `<!--app-data-->`,
        `<script>window.__INITIAL_DATA__ = ${JSON.stringify(data)};</script>`
      );

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(finalHtml);
  } catch (err) {
    console.error("SSR error:", err);
    res.status(500).send("SSR failed");
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`SSR server running on port ${PORT}`);
});
