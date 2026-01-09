import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Global flag to track if app is initialized
let isAppInitialized = false;
let expressApp: any = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        // Only initialize once per cold start
        if (!isAppInitialized) {
            console.log('Initializing serverless function...');

            // Import directly from TypeScript source (Vercel compiles it)
            const serverModule = await import('../server/index.js');

            // Setup the app
            await serverModule.setupApp();
            expressApp = serverModule.app;

            isAppInitialized = true;
            console.log('Serverless function initialized successfully');
        }

        // Forward the request to Express
        expressApp(req, res);
    } catch (error) {
        console.error('Serverless function error:', error);

        // Return detailed error for debugging
        res.status(500).json({
            message: 'Server initialization failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });
    }
}
