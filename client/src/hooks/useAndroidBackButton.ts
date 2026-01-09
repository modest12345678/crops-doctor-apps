import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

/**
 * Custom hook to handle Android back button navigation
 * Tracks navigation history and ensures home page is the final destination,
 * but allows closing modals (via history) even on Home page.
 */
export function useAndroidBackButton() {
    const [location, setLocation] = useLocation();

    useEffect(() => {
        // Only run on Android
        if (Capacitor.getPlatform() !== 'android') {
            return;
        }

        let listenerHandle: any;

        const setupListener = async () => {
            listenerHandle = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
                // If we're on the home page
                if (location === '/') {
                    // CRITICAL: Check if we have a modal open (pushed history state)
                    // If yes, we should go back (close modal) instead of exiting.
                    if (window.history.state && window.history.state.modal) {
                        window.history.back();
                    } else {
                        // Truly at the root state of Home -> Exit App
                        CapacitorApp.exitApp();
                    }
                    return;
                }

                // For any other page, use browser history to go back
                // This will naturally track the user's movement history
                if (canGoBack) {
                    window.history.back();
                } else {
                    // If there's no history, go to home page
                    setLocation('/');
                }
            });
        };

        setupListener();

        // Cleanup listener on unmount
        return () => {
            if (listenerHandle) {
                listenerHandle.remove();
            }
        };
    }, [location, setLocation]);
}
