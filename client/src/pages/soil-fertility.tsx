import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Loader2, Droplets, Sprout, TestTube2, AlertCircle, Info, CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { SEO } from "@/components/SEO";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ProcessingAnimation } from "@/components/ProcessingAnimation";
import { Geolocation } from '@capacitor/geolocation';

interface NutrientDeficiency {
    nutrient: string;
    level: "Low" | "Optimal" | "High";
    value: number;
    unit: string;
    reason: string;
    solution: string; // New: Solution Key
}

interface SoilData {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    ph: number;
    moisture: number;
    organicMatter: number;
    sulfur: number;
    zinc: number;
    fertilityIndex: number;
    locationName?: string; // New: Area Name
    deficiencies: NutrientDeficiency[]; // Replaces recommendedCrops
}

export default function SoilFertility() {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

    // Translation helpers for local UI elements
    const translations = {
        title: language === "bn" ? "মাটির উর্বরতা সূচক" : "Soil Fertility Index",
        getLocation: language === "bn" ? "অবস্থান নির্ণয় করুন" : "Get My Location",
        analyzing: language === "bn" ? "বিশ্লেষণ করা হচ্ছে..." : "Analyzing Soil Data...",
        results: language === "bn" ? "বিশ্লেষণের ফলাফল" : "Analysis Results",
        nitrogen: language === "bn" ? "নাইট্রোজেন" : "Nitrogen",
        phosphorus: language === "bn" ? "ফসফরাস" : "Phosphorus",
        potassium: language === "bn" ? "পটাশিয়াম" : "Potassium",
        sulfur: language === "bn" ? "সালফার" : "Sulfur",
        zinc: language === "bn" ? "জিঙ্ক" : "Zinc",
        ph: language === "bn" ? "পিএইচ (pH)" : "pH Level",
        moisture: language === "bn" ? "আর্দ্রতা" : "Moisture",
        organic: language === "bn" ? "জৈব পদার্থ" : "Organic Matter",
        index: language === "bn" ? "উর্বরতা স্কোর" : "Fertility Score",
        locationError: language === "bn" ? "অবস্থান পাওয়া যায়নি" : "Could not retrieve location",
        fetchError: language === "bn" ? "তথ্য সংগ্রহে ব্যর্থ" : "Failed to fetch soil data",
        retry: language === "bn" ? "আবার চেষ্টা করুন" : "Retry",

        // New Keys
        deficiencyReport: (t as any).deficiencyReport || "Nutrient Health Analysis",
        whyNecessary: (t as any).whyNecessary || "Why it is necessary:",
        howToCure: (t as any).howToCure || "How to overcome:",
        statusLow: (t as any).status_Low || "Low",
        statusOptimal: (t as any).status_Optimal || "Optimal",
        statusHigh: (t as any).status_High || "High",
        near: language === "bn" ? "কাছাকাছি:" : "Near:",
    };

    const getNutrientName = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("nitrogen")) return translations.nitrogen;
        if (lowerName.includes("phosphorus")) return translations.phosphorus;
        if (lowerName.includes("potassium")) return translations.potassium;
        if (lowerName.includes("sulfur")) return translations.sulfur;
        if (lowerName.includes("zinc")) return translations.zinc;
        if (lowerName.includes("ph")) return translations.ph;
        return name;
    };

    const soilMutation = useMutation({
        mutationFn: async (location: { lat: number; lng: number }) => {
            const res = await apiRequest<SoilData>("POST", "/api/soil-data", location);
            return res;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/history/soil"] });
        }
    });

    const handleGetLocation = async () => {
        try {
            toast({
                title: translations.analyzing,
                description: language === "bn" ? "অনুগ্রহ করে অপেক্ষা করুন..." : "Please wait..."
            });

            const position = await Geolocation.getCurrentPosition();

            const newCoords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            setCoords(newCoords);
            soilMutation.mutate(newCoords);
        } catch (error: any) {
            console.error("Geolocation error:", error);
            let errorMessage = error.message;
            if (error.code === 1) {
                errorMessage = "Location permission denied. Please enable location services.";
            } else if (error.code === 2) {
                errorMessage = "Location unavailable.";
            } else if (error.code === 3) {
                errorMessage = "Location request timed out.";
            }

            toast({
                title: translations.locationError,
                description: errorMessage,
                variant: "destructive"
            });
        }
    };

    const data = soilMutation.data;

    // Prepare chart data
    const chartData = data ? [
        { name: 'N', value: data.nitrogen, full: translations.nitrogen, color: '#22c55e' }, // Green
        { name: 'P', value: data.phosphorus, full: translations.phosphorus, color: '#eab308' }, // Yellow
        { name: 'K', value: data.potassium, full: translations.potassium, color: '#f97316' }, // Orange
    ] : [];

    // Helper to get Status Color/Icon
    const getStatusInfo = (level: string) => {
        if (level === "Low") return { color: "text-red-500", bg: "bg-red-50 border-red-200", icon: AlertCircle };
        if (level === "High") return { color: "text-amber-500", bg: "bg-amber-50 border-amber-200", icon: AlertTriangle };
        return { color: "text-green-500", bg: "bg-green-50 border-green-200", icon: CheckCircle2 };
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
            <SEO
                title="Soil Fertility Analysis"
                description="Analyze soil nutrients (NPK, pH, Moisture) using your GPS location to check land fertility and productivity."
                image="/soil-satellite.png"
            />
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-3">
                    <Sprout className="w-8 h-8" />
                    {translations.title}
                </h1>
                <p className="text-muted-foreground">
                    {language === "bn"
                        ? "আপনার জমির জিপিএস অবস্থান ব্যবহার করে মাটির পুষ্টি উপাদান এবং উর্বরতা পরীক্ষা করুন।"
                        : "Analyze your soil nutrients and fertility using your GPS location."}
                </p>
            </div>

            {/* GPS Action Section */}
            <Card className="border-2 border-primary/10 shadow-lg">
                <CardContent className="p-8 flex flex-col items-center justify-center gap-6">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                        <MapPin className="w-10 h-10 text-primary" />
                    </div>

                    {soilMutation.isPending ? (
                        <div className="py-4">
                            <ProcessingAnimation message={translations.analyzing} />
                        </div>
                    ) : (
                        <Button
                            size="lg"
                            onClick={handleGetLocation}
                            className="text-lg px-8 py-6 rounded-full shadow-xl hover:scale-105 transition-transform"
                        >
                            {coords ? translations.retry : translations.getLocation}
                        </Button>
                    )}

                    {coords && !soilMutation.isPending && (
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground font-mono mb-1">
                                {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                            </p>
                            {data?.locationName && (
                                <p className="text-sm font-semibold text-primary flex items-center justify-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {data.locationName}
                                </p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Error State */}
            {soilMutation.isError && (
                <Card className="bg-destructive/10 border-destructive/20">
                    <CardContent className="p-6 flex items-center gap-4 text-destructive">
                        <AlertCircle className="w-6 h-6" />
                        <p>{translations.fetchError}</p>
                    </CardContent>
                </Card>
            )}

            {/* Results Section */}
            {data && (
                <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
                    <h2 className="text-2xl font-bold text-center border-b pb-4">{translations.results}</h2>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200">
                            <CardContent className="p-4 text-center">
                                <p className="text-sm font-medium text-muted-foreground">{translations.nitrogen}</p>
                                <p className="text-2xl font-bold text-green-700">{data.nitrogen} <span className="text-xs">mg/kg</span></p>
                            </CardContent>
                        </Card>
                        <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200">
                            <CardContent className="p-4 text-center">
                                <p className="text-sm font-medium text-muted-foreground">{translations.phosphorus}</p>
                                <p className="text-2xl font-bold text-yellow-700">{data.phosphorus} <span className="text-xs">mg/kg</span></p>
                            </CardContent>
                        </Card>
                        <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200">
                            <CardContent className="p-4 text-center">
                                <p className="text-sm font-medium text-muted-foreground">{translations.potassium}</p>
                                <p className="text-2xl font-bold text-orange-700">{data.potassium} <span className="text-xs">mg/kg</span></p>
                            </CardContent>
                        </Card>
                        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
                            <CardContent className="p-4 text-center">
                                <p className="text-sm font-medium text-muted-foreground">{translations.ph}</p>
                                <p className="text-2xl font-bold text-blue-700">{data.ph}</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200">
                            <CardContent className="p-4 text-center">
                                <p className="text-sm font-medium text-muted-foreground">{translations.sulfur}</p>
                                <p className="text-2xl font-bold text-amber-700">{data.sulfur || '--'} <span className="text-xs">ppm</span></p>
                            </CardContent>
                        </Card>
                        <Card className="bg-slate-50 dark:bg-slate-950/20 border-slate-200">
                            <CardContent className="p-4 text-center">
                                <p className="text-sm font-medium text-muted-foreground">{translations.zinc}</p>
                                <p className="text-2xl font-bold text-slate-700">{data.zinc || '--'} <span className="text-xs">ppm</span></p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart & Secondary Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* NPK Chart */}
                        <Card className="shadow-md">
                            <CardHeader>
                                <CardTitle className="text-lg">NPK Levels</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            formatter={(value: number) => [`${value} mg/kg`, '']}
                                        />
                                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Other Metrics */}
                        <div className="space-y-4">
                            {/* Fertility Score */}
                            <Card className="h-full shadow-md flex flex-col justify-center items-center bg-gradient-to-br from-primary/5 to-transparent">
                                <CardHeader>
                                    <CardTitle className="text-center text-primary">{translations.index}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <div className="relative inline-flex items-center justify-center">
                                        <svg className="h-32 w-32 transform -rotate-90">
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={351} strokeDashoffset={351 - (351 * data.fertilityIndex) / 100} className="text-primary" />
                                        </svg>
                                        <span className="absolute text-4xl font-bold text-primary">{data.fertilityIndex}</span>
                                    </div>
                                    <div className="mt-4 grid grid-cols-2 gap-4 text-left w-full">
                                        <div className="flex items-center gap-2 bg-background p-3 rounded-lg shadow-sm">
                                            <Droplets className="w-5 h-5 text-blue-500" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">{translations.moisture}</p>
                                                <p className="font-bold">{data.moisture}%</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-background p-3 rounded-lg shadow-sm">
                                            <TestTube2 className="w-5 h-5 text-amber-900" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">{translations.organic}</p>
                                                <p className="font-bold">{data.organicMatter}%</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* NEW: Nutrient Health Report Section */}
                    <div className="space-y-4 pt-4 border-t">
                        <div className="flex items-center gap-2 mb-2">
                            <TestTube2 className="w-6 h-6 text-primary" />
                            <h3 className="text-xl font-bold text-primary">{translations.deficiencyReport}</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.deficiencies.map((item, i) => {
                                const status = getStatusInfo(item.level);
                                const StatusIcon = status.icon;

                                // Translate status text
                                let statusText = translations.statusOptimal;
                                if (item.level === "Low") statusText = translations.statusLow;
                                if (item.level === "High") statusText = translations.statusHigh;

                                // Translate reason & solution text
                                // @ts-ignore
                                const reasonTranslation = t[item.reason] || item.reason;
                                // @ts-ignore
                                const solutionTranslation = t[item.solution] || item.solution;

                                return (
                                    <Card key={i} className={`border-l-4 ${status.bg} border-l-[${status.color.replace('text-', '')}] hover:shadow-md transition-all`}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h4 className="font-bold text-lg">{getNutrientName(item.nutrient)}</h4>
                                                    <p className={`text-sm font-bold ${status.color} flex items-center gap-1`}>
                                                        <StatusIcon className="w-4 h-4" />
                                                        {statusText} ({item.value} {item.unit})
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Reason Section */}
                                            <div className="bg-white/50 p-2 rounded-md mt-2">
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1 font-semibold">
                                                    <Info className="w-3 h-3" />
                                                    {translations.whyNecessary}
                                                </p>
                                                <p className="text-sm text-foreground/90 italic">
                                                    "{reasonTranslation}"
                                                </p>
                                            </div>

                                            {/* Solution Section (Only show if not optimal) */}
                                            {item.level !== "Optimal" && (
                                                <div className="bg-green-50/50 p-2 rounded-md mt-2 border border-green-100">
                                                    <p className="text-xs text-green-700 flex items-center gap-1 mb-1 font-bold">
                                                        <Lightbulb className="w-3 h-3" />
                                                        {translations.howToCure}
                                                    </p>
                                                    <p className="text-sm text-foreground/90 font-medium">
                                                        {solutionTranslation}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    <div className="text-center p-4">
                        <p className="text-xs text-muted-foreground italic">
                            {t.satelliteDisclaimer}
                        </p>
                    </div>
                </div>
            )
            }
        </div >
    );
}
