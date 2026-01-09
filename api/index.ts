import { app, setupApp } from "../server/index.js";

// Initialize the app once
let isReady = false;

export default async function handler(req, res) {
    if (!isReady) {
        await setupApp();
        isReady = true;
    }

    // Forward the request to the Express app
    app(req, res);
}
