
import { useState, useRef } from "react";
import { Loader2, Sparkles, Upload, Camera, X, Stethoscope } from "lucide-react";
import { ProcessingAnimation } from "@/components/ProcessingAnimation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/lib/LanguageContext";
import type { Detection } from "@shared/schema";
import FeatureNav from "./FeatureNav";
import { FloatingActions } from "./FloatingActions";

type CropType =
    | "potato" | "tomato" | "corn" | "wheat" | "rice" | "jute" | "sugarcane" | "tea" | "mustard" | "mango" | "banana" | "brinjal" | "chili" | "onion" | "garlic" | "ginger" | "turmeric" | "lentil" | "watermelon" | "papaya";

export default function DiseaseDetector() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedCrop, setSelectedCrop] = useState<CropType>("potato");
    const [detectionResult, setDetectionResult] = useState<Detection | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { language, t } = useLanguage();

    const cropOptions = [
        { value: "potato", label: t.crops.potato, icon: "🥔" },
        { value: "tomato", label: t.crops.tomato, icon: "🍅" },
        { value: "corn", label: t.crops.corn, icon: "🌽" },
        { value: "wheat", label: t.crops.wheat, icon: "🌾" },
        { value: "rice", label: t.crops.rice, icon: "🍚" },
        { value: "jute", label: t.crops.jute, icon: "🌿" },
        { value: "sugarcane", label: t.crops.sugarcane, icon: "🎋" },
        { value: "tea", label: t.crops.tea, icon: "🍵" },
        { value: "mustard", label: t.crops.mustard, icon: "🌼" },
        { value: "mango", label: t.crops.mango, icon: "🥭" },
        { value: "banana", label: t.crops.banana, icon: "🍌" },
        { value: "brinjal", label: t.crops.brinjal, icon: "🍆" },
        { value: "chili", label: t.crops.chili, icon: "🌶️" },
        { value: "onion", label: t.crops.onion, icon: "🧅" },
        { value: "garlic", label: t.crops.garlic, icon: "🧄" },
        { value: "ginger", label: t.crops.ginger, icon: "🫚" },
        { value: "turmeric", label: t.crops.turmeric, icon: "🧡" },
        { value: "lentil", label: t.crops.lentil, icon: "🍲" },
        { value: "watermelon", label: t.crops.watermelon, icon: "🍉" },
        { value: "papaya", label: t.crops.papaya, icon: "🍈" },
    ];

    const detectMutation = useMutation({
        mutationFn: async (params: { imageData: string; cropType: CropType; language: "en" | "bn" }) =>
            await apiRequest<Detection>("POST", "/api/detect", params),
        onSuccess: (data) => {
            setDetectionResult(data);
            queryClient.invalidateQueries({ queryKey: ["/api/detections"] });
            toast({ title: t.diseaseDetected, description: t.diseaseIdentified(data.diseaseName, data.confidence) });
        },
        onError: (error: Error) => {
            toast({ title: t.detectionFailed, description: error.message, variant: "destructive" });
        },
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const imageData = ev.target?.result as string;
                setSelectedImage(imageData);
                setDetectionResult(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = () => {
        if (selectedImage) {
            detectMutation.mutate({ imageData: selectedImage, cropType: selectedCrop, language });
        }
    };

    const handleReset = () => {
        setSelectedImage(null);
        setDetectionResult(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    };

    return (
        <div className="min-h-screen bg-background pb-8">
            <FeatureNav />
            <div
                className="relative bg-cover bg-center overflow-hidden mb-8"
                style={{ backgroundImage: 'url("/hero-bg.png")' }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Stethoscope className="w-12 h-12 text-primary" />
                            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                                {t.diseaseDetectorTitle}
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
                            {t.diseaseDetectorHeroDesc}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4">
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5 text-primary" />
                                {t.uploadImage}
                            </CardTitle>
                            <CardDescription>{t.uploadDescription}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="crop-select" className="mb-2 block">{t.selectCrop}</Label>
                                <Select value={selectedCrop} onValueChange={(value) => setSelectedCrop(value as CropType)}>
                                    <SelectTrigger id="crop-select">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cropOptions.map((crop) => (
                                            <SelectItem key={crop.value} value={crop.value}>
                                                <span className="mr-2">{crop.icon}</span>
                                                {crop.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {!selectedImage ? (
                                <div className="space-y-4">
                                    <div
                                        className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate active-elevate-2 transition-colors cursor-pointer bg-muted/30"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground font-medium">{t.clickToUpload}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{t.fileTypes}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                                            <Upload className="w-4 h-4 mr-2" />
                                            {t.fromGallery}
                                        </Button>
                                        <Button variant="outline" onClick={() => cameraInputRef.current?.click()} className="w-full">
                                            <Camera className="w-4 h-4 mr-2" />
                                            {t.takePhoto}
                                        </Button>
                                    </div>
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                                    <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="relative rounded-lg overflow-hidden border aspect-video bg-muted">
                                        <img src={selectedImage} alt="Selected crop" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1" onClick={handleReset} disabled={detectMutation.isPending}>
                                            {t.changeImage}
                                        </Button>
                                        <Button className="flex-1" onClick={handleAnalyze} disabled={detectMutation.isPending}>
                                            {detectMutation.isPending ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    {t.analyzing}
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    {t.analyzeImage}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        {detectMutation.isPending && (
                            <Card className="h-full flex items-center justify-center min-h-[300px]">
                                <CardContent className="text-center space-y-4">
                                    <ProcessingAnimation
                                        message={t.analyzingMessage(cropOptions.find((c) => c.value === selectedCrop)?.label || "")}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {!detectionResult && !detectMutation.isPending && (
                            <Card className="h-full flex items-center justify-center min-h-[300px] bg-muted/30 border-dashed">
                                <CardContent className="text-center text-muted-foreground p-8">
                                    <Stethoscope className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                    <h3 className="text-xl font-semibold mb-2">{t.readyToAnalyze}</h3>
                                    <p className="max-w-xs mx-auto">{t.readyToAnalyzeDesc}</p>
                                </CardContent>
                            </Card>
                        )}

                        {detectionResult && !detectMutation.isPending && (
                            <Card className="border-primary/50 shadow-md">
                                <CardHeader className="bg-primary/5 border-b border-primary/10">
                                    <CardTitle className="flex items-center gap-2 text-primary">
                                        <Sparkles className="w-5 h-5" />
                                        {t.detectionResult}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 space-y-6">
                                    <div>
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                                {detectionResult.diseaseName}
                                            </h3>
                                            <Badge variant="secondary" className="text-lg px-3 py-1">
                                                {detectionResult.confidence}%
                                            </Badge>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">{detectionResult.description}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-muted rounded-lg">
                                            <h4 className="font-semibold mb-2 flex items-center gap-2 text-foreground/80">
                                                {t.symptoms}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">{detectionResult.symptoms}</p>
                                        </div>

                                        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900 rounded-lg">
                                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-700 dark:text-green-400">
                                                {t.recommendedTreatment}
                                            </h4>
                                            {Array.isArray(detectionResult.treatment) ? (
                                                <ul className="space-y-2">
                                                    {detectionResult.treatment.map((step, idx) => (
                                                        <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                                            <span className="leading-relaxed">{step}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm leading-relaxed">{detectionResult.treatment}</p>
                                            )}
                                        </div>
                                    </div>

                                    <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary" onClick={handleReset}>
                                        {t.analyzeAnother}
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <FloatingActions />
        </div>
    );
}
