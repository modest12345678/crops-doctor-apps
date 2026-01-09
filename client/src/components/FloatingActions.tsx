import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";
import { CropCalendar } from "@/components/CropCalendar";
import { useLanguage } from "@/lib/LanguageContext";

interface FloatingActionsProps {
    isChatOpen?: boolean;
    onChatOpenChange?: (open: boolean) => void;
    isCalendarOpen?: boolean;
    onCalendarOpenChange?: (open: boolean) => void;
    alwaysShowLabels?: boolean;
}

export function FloatingActions({
    isChatOpen: propChatOpen,
    onChatOpenChange: propSetChatOpen,
    isCalendarOpen: propCalOpen,
    onCalendarOpenChange: propSetCalOpen,
    alwaysShowLabels = false
}: FloatingActionsProps = {}) {
    const [internalChatOpen, setInternalChatOpen] = useState(false);
    const [internalCalendarOpen, setInternalCalendarOpen] = useState(false);

    // Derived state: Use prop if available, otherwise internal state
    const isChatOpen = propChatOpen !== undefined ? propChatOpen : internalChatOpen;
    const isCalendarOpen = propCalOpen !== undefined ? propCalOpen : internalCalendarOpen;

    // Internal helper to set state (propagating to prop if exists)
    const _setIsChatOpen = (val: boolean) => {
        if (propSetChatOpen) propSetChatOpen(val);
        else setInternalChatOpen(val);
    };

    const _setIsCalendarOpen = (val: boolean) => {
        if (propSetCalOpen) propSetCalOpen(val);
        else setInternalCalendarOpen(val);
    };

    // HISTORY HANDLING
    useEffect(() => {
        const handlePopState = () => {
            // Screen went back: Close all modals
            // If they are already closed, this is no-op
            if (isChatOpen || isCalendarOpen) {
                // We use the direct setters here because we are reacting to history
                // We do NOT want to call history.back() again
                if (propSetChatOpen) propSetChatOpen(false); else setInternalChatOpen(false);
                if (propSetCalOpen) propSetCalOpen(false); else setInternalCalendarOpen(false);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [isChatOpen, isCalendarOpen, propSetChatOpen, propSetCalOpen]);

    // Handlers for UI interactions
    const handleChatToggle = (targetOpen: boolean) => {
        if (targetOpen) {
            window.history.pushState({ modal: 'chat' }, '');
            _setIsChatOpen(true);
        } else {
            window.history.back();
        }
    };

    const handleCalendarToggle = (targetOpen: boolean) => {
        if (targetOpen) {
            window.history.pushState({ modal: 'calendar' }, '');
            _setIsCalendarOpen(true);
        } else {
            window.history.back();
        }
    };

    const [showCalendarLabel, setShowCalendarLabel] = useState(false);
    const { t } = useLanguage();

    return (
        <>
            {/* Floating Calendar Button - Aligned with ChatInterface (right-0) and stacked above (bottom-36) */}
            <div
                className="fixed bottom-36 right-0 z-50 flex items-center pr-0"
                onMouseEnter={() => setShowCalendarLabel(true)}
                onMouseLeave={() => setShowCalendarLabel(false)}
            >
                {!isCalendarOpen && (showCalendarLabel || alwaysShowLabels) && (
                    <span className="text-[10px] sm:text-xs font-medium bg-blue-500 text-white backdrop-blur px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shadow-sm whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-200 mr-2">
                        {t.cropCalendar}
                    </span>
                )}
                <Button
                    size="lg"
                    className="rounded-l-full rounded-r-none h-10 w-12 sm:h-12 sm:w-14 shadow-lg bg-blue-500 hover:bg-blue-600 transition-all hover:scale-110 p-0 pl-1"
                    onClick={() => handleCalendarToggle(!isCalendarOpen)}
                >
                    <Calendar className="h-5 w-5" />
                </Button>
            </div>

            {/* Floating AI Assistant Button */}
            <ChatInterface
                isOpen={isChatOpen}
                onOpenChange={handleChatToggle}
                alwaysShowLabel={alwaysShowLabels}
            />

            {/* Calendar Dialog - Note: onOpenChange callback from Dialog (e.g. clicking backdrop) needs to handle history too */}
            <CropCalendar
                isOpen={isCalendarOpen}
                onOpenChange={(open) => {
                    // Dialog's open change (e.g. clicking outside or ESC)
                    if (open) handleCalendarToggle(true);
                    else {
                        // If it's closing via backdrop click, we need to go back in history
                        handleCalendarToggle(false);
                    }
                }}
            />
        </>
    );
}
