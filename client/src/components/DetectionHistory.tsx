import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, History as HistoryIcon, Image as ImageIcon, Leaf, Sprout } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/LanguageContext";
import type { Detection, FertilizerHistory, SoilHistory } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { enUS, bn } from "date-fns/locale";

export default function DetectionHistory() {
    const { language, t } = useLanguage();
    const dateLocale = language === "bn" ? bn : enUS;

    const { data: detections, isLoading: isLoadingDetections } = useQuery<Detection[]>({
        queryKey: ["/api/detections"],
    });

    const { data: fertilizerHistory, isLoading: isLoadingFertilizer } = useQuery<FertilizerHistory[]>({
        queryKey: ["/api/history/fertilizer"],
    });

    const { data: soilHistory, isLoading: isLoadingSoil } = useQuery<SoilHistory[]>({
        queryKey: ["/api/history/soil"],
    });

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <HistoryIcon className="w-5 h-5" />
                    {t.detectionHistory || "Activity History"}
                </CardTitle>
                <CardDescription>{t.historyDescription || "View your past activities"}</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="disease" className="w-full">
                    <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-4 h-auto">
                        <TabsTrigger value="disease">{t.diseaseDetectorButton || "Disease"}</TabsTrigger>
                        <TabsTrigger value="fertilizer">{t.fertilizerCalculatorButton || "Fertilizer"}</TabsTrigger>
                        <TabsTrigger value="soil">{t.soilFertility || "Soil"}</TabsTrigger>
                    </TabsList>

                    {/* Disease History */}
                    <TabsContent value="disease">
                        {isLoadingDetections && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}
                        {!isLoadingDetections && (!detections || detections.length === 0) && (
                            <div className="text-center text-muted-foreground py-8">
                                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg mb-2">{t.noDetections || "No records found"}</p>
                            </div>
                        )}
                        {!isLoadingDetections && detections && detections.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {detections.slice(0, 6).map((detection) => (
                                    <Card key={detection.id} className="hover-elevate overflow-hidden">
                                        <div className="relative aspect-video bg-muted">
                                            <img src={detection.imageData} alt={detection.diseaseName} className="w-full h-full object-cover" />
                                            <div className="absolute top-2 left-2">
                                                <Badge variant="default" className="bg-primary/90 backdrop-blur-sm capitalize">
                                                    {detection.cropType}
                                                </Badge>
                                            </div>
                                            <div className="absolute top-2 right-2">
                                                <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                                                    {detection.confidence}%
                                                </Badge>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <CardTitle className="text-lg mb-2 line-clamp-1">{detection.diseaseName}</CardTitle>
                                            <CardDescription className="text-sm mb-3 line-clamp-2">{detection.description}</CardDescription>
                                            <div className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(detection.createdAt), { addSuffix: true, locale: dateLocale })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Fertilizer History */}
                    <TabsContent value="fertilizer">
                        {isLoadingFertilizer && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}
                        {!isLoadingFertilizer && (!fertilizerHistory || fertilizerHistory.length === 0) && (
                            <div className="text-center text-muted-foreground py-8">
                                <Leaf className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg mb-2">No fertilizer records</p>
                            </div>
                        )}
                        {!isLoadingFertilizer && fertilizerHistory && fertilizerHistory.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {fertilizerHistory.slice(0, 6).map((item) => (
                                    <Card key={item.id} className="hover-elevate">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="outline" className="capitalize">{item.crop}</Badge>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: dateLocale })}
                                                </div>
                                            </div>
                                            <CardTitle className="text-base mt-2">
                                                {item.area} {item.unit}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded max-h-24 overflow-y-auto">
                                                {/* Parsing JSON result specifically for recommendation text if possible, else showing raw */}
                                                {(() => {
                                                    try {
                                                        const res = JSON.parse(item.result);
                                                        return res.recommendation || "Calculation saved";
                                                    } catch {
                                                        return "Calculation saved";
                                                    }
                                                })()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    {/* Soil History */}
                    <TabsContent value="soil">
                        {isLoadingSoil && (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        )}
                        {!isLoadingSoil && (!soilHistory || soilHistory.length === 0) && (
                            <div className="text-center text-muted-foreground py-8">
                                <Sprout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg mb-2">No soil records</p>
                            </div>
                        )}
                        {!isLoadingSoil && soilHistory && soilHistory.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {soilHistory.slice(0, 6).map((item) => (
                                    <Card key={item.id} className="hover-elevate">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="outline">GPS Analysis</Badge>
                                                <div className="text-xs text-muted-foreground">
                                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: dateLocale })}
                                                </div>
                                            </div>
                                            <CardTitle className="text-base mt-2 cursor-help" title={item.location}>
                                                Location: {item.location.split(',').map(c => Number(c).toFixed(2)).join(', ')}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-3 gap-2 text-center">
                                                {/* Parsing NPK from result */}
                                                {(() => {
                                                    try {
                                                        const res = JSON.parse(item.result);
                                                        return (
                                                            <>
                                                                <div className="bg-red-50 p-1 rounded">
                                                                    <div className="text-xs font-bold text-red-600">N</div>
                                                                    <div className="text-sm">{res.nitrogen?.toFixed(0) || "-"}</div>
                                                                </div>
                                                                <div className="bg-orange-50 p-1 rounded">
                                                                    <div className="text-xs font-bold text-orange-600">P</div>
                                                                    <div className="text-sm">{res.phosphorus?.toFixed(0) || "-"}</div>
                                                                </div>
                                                                <div className="bg-yellow-50 p-1 rounded">
                                                                    <div className="text-xs font-bold text-yellow-600">K</div>
                                                                    <div className="text-sm">{res.potassium?.toFixed(0) || "-"}</div>
                                                                </div>
                                                            </>
                                                        );
                                                    } catch {
                                                        return <div className="col-span-3 text-xs">Data unavailable</div>;
                                                    }
                                                })()}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
