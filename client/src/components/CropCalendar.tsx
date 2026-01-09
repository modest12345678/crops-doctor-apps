import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { cropSeasons, getCropsForMonth } from "@/lib/cropSeasons";
import { cn } from "@/lib/utils";

interface CropCalendarProps {
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CropCalendar({ isOpen: propIsOpen, onOpenChange }: CropCalendarProps) {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    // Use controlled state if prop is provided, otherwise internal state
    const isControlled = propIsOpen !== undefined;
    const isOpen = isControlled ? propIsOpen : internalIsOpen;

    const setIsOpen = (value: boolean) => {
        if (onOpenChange) {
            onOpenChange(value);
        }
        if (!isControlled) {
            setInternalIsOpen(value);
        }
    };
    const [currentDate, setCurrentDate] = useState(new Date());
    const { t, language } = useLanguage();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and number of days
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    const previousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const { planting, harvesting } = getCropsForMonth(month);

    // Generate calendar days
    const calendarDays = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const isToday = (day: number | null) => {
        if (!day) return false;
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <CalendarIcon className="w-6 h-6 text-primary" />
                        {t.cropCalendar}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Month Navigation */}
                    <div className="flex items-center justify-between">
                        <Button variant="outline" size="sm" onClick={previousMonth}>
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold">
                                {t.months[month]} {language === "bn" ? year.toLocaleString("bn-BD").replace(/,/g, "") : year}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t.months[month]}
                            </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={nextMonth}>
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Calendar Grid */}
                    <div>
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {t.daysShort.map((day, idx) => (
                                <div key={idx} className="text-center font-semibold text-sm py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, idx) => {
                                const hasActivities = day !== null && (planting.length > 0 || harvesting.length > 0);

                                return (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "aspect-square flex flex-col items-center justify-center p-1 rounded-lg border relative",
                                            day === null && "border-transparent",
                                            isToday(day) && "bg-primary text-primary-foreground border-primary font-bold",
                                            !isToday(day) && day !== null && "hover:bg-muted"
                                        )}
                                    >
                                        {day !== null && (
                                            <>
                                                <span className="text-sm font-medium mb-1">{day}</span>
                                                {hasActivities && (
                                                    <div className="flex gap-0.5 flex-wrap justify-center items-center max-w-full">
                                                        {/* Show planting crop icons */}
                                                        {planting.slice(0, 3).map((crop, cropIdx) => (
                                                            <span
                                                                key={`p-${cropIdx}`}
                                                                className="text-[10px]"
                                                                title={`${crop.cropBn} - ${t.plantingSeason}`}
                                                            >
                                                                {crop.icon}
                                                            </span>
                                                        ))}
                                                        {/* Show harvesting crop icons */}
                                                        {harvesting.slice(0, 3).map((crop, cropIdx) => (
                                                            <span
                                                                key={`h-${cropIdx}`}
                                                                className="text-[10px] opacity-60"
                                                                title={`${crop.cropBn} - ${t.harvestingSeason}`}
                                                            >
                                                                {crop.icon}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Crop Season Information for current month */}
                    <div className="space-y-4">
                        {planting.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                                    {t.plantingSeason}
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {planting.map((crop, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 p-2 rounded-lg border bg-card"
                                        >
                                            <span className="text-xl">{crop.icon}</span>
                                            <div className="text-sm">
                                                <div className="font-medium">{crop.cropBn}</div>
                                                <div className="text-xs text-muted-foreground">{crop.crop}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {harvesting.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                                    {t.harvestingSeason}
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {harvesting.map((crop, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center gap-2 p-2 rounded-lg border bg-card"
                                        >
                                            <span className="text-xl">{crop.icon}</span>
                                            <div className="text-sm">
                                                <div className="font-medium">{crop.cropBn}</div>
                                                <div className="text-xs text-muted-foreground">{crop.crop}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Legend - All crops */}
                        <div>
                            <h4 className="font-semibold text-lg mb-2">{t.legend}</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {cropSeasons.map((crop, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 p-2 rounded-lg border bg-card text-xs"
                                    >
                                        <span className="text-base">{crop.icon}</span>
                                        <div>
                                            <div className="font-medium">{crop.cropBn}</div>
                                            <div className="text-muted-foreground">{crop.crop}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
