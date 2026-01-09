import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sprout, Droplets, Sun, Scissors, Bug, QrCode, Calendar, MapPin, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { FarmingCycle, FarmingStage } from "@shared/schema";

const STAGE_ICONS: Record<string, any> = {
    "Sowing": Sprout,
    "Irrigation": Droplets,
    "Growth": Sun,
    "Harvesting": Scissors,
    "Pest Control": Bug,
    "Fertilizer": Sprout,
};

const MOCK_TRACE_DATA = {
    id: "demo-123",
    farmerName: "Abdul Karim",
    crop: "Premium Potato (Diamond)",
    location: "Bogura, Bangladesh",
    startDate: "2024-11-15T00:00:00.000Z",
    stages: [
        {
            stageName: "Sowing",
            description: "High-quality certified seeds were sown after proper land preparation.",
            date: "2024-11-15T00:00:00.000Z",
            imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000",
        },
        {
            stageName: "Irrigation",
            description: "First irrigation applied to ensure proper germination.",
            date: "2024-11-25T00:00:00.000Z",
            imageUrl: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?auto=format&fit=crop&q=80&w=1000",
        },
        {
            stageName: "Growth",
            description: "Regular monitoring shows healthy vegetative growth. No pests detected.",
            date: "2024-12-10T00:00:00.000Z",
            imageUrl: "https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?auto=format&fit=crop&q=80&w=1000",
        },
        {
            stageName: "Harvesting",
            description: "Mature potatoes harvested carefully to avoid damage.",
            date: "2025-02-20T00:00:00.000Z",
            imageUrl: "https://images.unsplash.com/photo-1518977676601-b53f82a6b69d?auto=format&fit=crop&q=80&w=1000",
        }
    ]
};

import { useLanguage } from "@/lib/LanguageContext";

export default function TracePage() {
    const { t } = useLanguage();
    const [, params] = useRoute("/trace/:id");
    const cycleId = params?.id;

    const { data: cycle, isLoading, error } = useQuery<FarmingCycle & { stages: FarmingStage[] }>({
        queryKey: [`/api/farming-cycles/${cycleId}`],
        enabled: !!cycleId && cycleId !== "demo-123",
    });

    // Keep mock data for demo
    const isDemo = cycleId === "demo-123";
    const displayData = isDemo ? MOCK_TRACE_DATA : cycle;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || (!displayData && !isLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center text-muted-foreground">
                <p>Traceability record not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pb-12">
            {/* Hero Section */}
            <div className="bg-primary/5 border-b border-primary/10">
                <div className="max-w-3xl mx-auto px-4 py-12 text-center">
                    <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-6">
                        <QrCode className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{t.farmToForkJourney}</h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        {t.transparentTracking}
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 -mt-8">
                {/* Product Card */}
                <Card className="mb-8 shadow-lg border-primary/20">
                    <CardHeader className="text-center border-b bg-card/50">
                        <Badge variant="secondary" className="w-fit mx-auto mb-2 capitalize">
                            {displayData?.crop}
                        </Badge>
                        <CardTitle className="text-2xl">{displayData?.crop} - {displayData?.location}</CardTitle>
                        <CardDescription className="flex items-center justify-center gap-2">
                            <User className="w-4 h-4" />
                            {t.farmer}: <span className="font-medium text-foreground">{displayData?.farmerName}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-wider">{t.origin}</span>
                                </div>
                                <p className="font-medium">{displayData?.location}</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-xs uppercase tracking-wider">{t.started}</span>
                                </div>
                                <p className="font-medium">
                                    {displayData?.startDate ? format(new Date(displayData.startDate), "MMM d, yyyy") : "N/A"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Timeline */}
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                    {displayData?.stages?.map((stage: any, index: number) => {
                        const Icon = STAGE_ICONS[stage.stageName] || Sprout;
                        return (
                            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                {/* Icon */}
                                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                    <Icon className="w-5 h-5" />
                                </div>

                                {/* Content Card */}
                                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] shadow-md hover:shadow-lg transition-shadow">
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="outline" className="mb-2">{stage.stageName}</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {format(new Date(stage.date), "MMM d, yyyy")}
                                            </span>
                                        </div>
                                        <CardTitle className="text-base">{stage.description}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2 space-y-3">
                                        {stage.imageUrl && (
                                            <div className="rounded-md overflow-hidden border">
                                                <img src={stage.imageUrl} alt={stage.stageName} className="w-full h-48 object-cover" />
                                            </div>
                                        )}
                                        {stage.videoUrl && (
                                            <div className="rounded-md overflow-hidden border bg-black">
                                                <video controls className="w-full max-h-64">
                                                    <source src={stage.videoUrl} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground">
                        {t.verifiedBy}
                    </p>
                </div>
            </div>
        </div>
    );
}
