import { Bot } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface ProcessingAnimationProps {
    message?: string;
}

export function ProcessingAnimation({ message }: ProcessingAnimationProps) {
    const { t, language } = useLanguage();

    const defaultMessage = language === "bn"
        ? "বিশ্লেষণ করা হচ্ছে..."
        : "Analyzing...";

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary animate-robot-bounce" />
            </div>
            <p className="text-lg font-medium text-primary animate-pulse">
                {message || defaultMessage}
            </p>
        </div>
    );
}
