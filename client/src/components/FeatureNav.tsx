import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Stethoscope, Sprout, Bug } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function FeatureNav() {
    const [location] = useLocation();
    const { t } = useLanguage();

    const isActive = (path: string) => location === path;

    return (
        <div className="bg-background border-b sticky top-[calc(4rem+env(safe-area-inset-top))] z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex gap-4 justify-center">
                <Link href="/detect">
                    <Button
                        variant={isActive("/detect") ? "default" : "outline"}
                        className="gap-2 text-base px-6"
                    >
                        <Stethoscope className="w-5 h-5" />
                        {t.navDetect || "Disease Detector"}
                    </Button>
                </Link>
                <Link href="/fertilizer">
                    <Button
                        variant={isActive("/fertilizer") ? "default" : "outline"}
                        className="gap-2 text-base px-6"
                    >
                        <Sprout className="w-5 h-5" />
                        {t.fertilizerCalculator || "Fertilizer Calculator"}
                    </Button>
                </Link>
                <Link href="/pesticide">
                    <Button
                        variant={isActive("/pesticide") ? "default" : "outline"}
                        className="gap-2 text-base px-6"
                    >
                        <Bug className="w-5 h-5" />
                        {t.pesticideCalculator || "Pesticide Calculator"}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
