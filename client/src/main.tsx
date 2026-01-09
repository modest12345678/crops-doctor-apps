import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Register PWA service worker
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
    onNeedRefresh() {
        // Show a prompt to the user to reload the app
        if (confirm('New content available. Reload?')) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        console.log('App ready to work offline');
    },
});

createRoot(document.getElementById("root")!).render(<App />);
