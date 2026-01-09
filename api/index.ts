import { app, setupApp } from "../server/index.js";

// Initialize the app once
let isReady = false;

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!isReady) {
        await setupApp();
        isReady = true;
    }

    // Forward the request to the Express app
    app(req, res);
}
