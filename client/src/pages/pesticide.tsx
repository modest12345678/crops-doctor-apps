import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/SEO";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Bug, Droplets, FlaskConical, AlertTriangle, CheckCircle2 } from "lucide-react";
import { FloatingActions } from "@/components/FloatingActions";
import { ProcessingAnimation } from "@/components/ProcessingAnimation";

type CropType = "potato" | "tomato" | "corn" | "wheat" | "rice" | "jute" | "sugarcane" | "tea" | "mustard" | "mango" | "banana" | "brinjal" | "chili" | "onion" | "garlic" | "ginger" | "turmeric" | "lentil" | "watermelon" | "papaya" | "pineapple";
type Unit = "acre" | "bigha";

interface PesticideRecommendation {
    cropName: string;
    area: number;
    unit: string;
    recommendations: string[];
    calibration: {
        waterRequired: string;
        numberOfTanks: string;
        dosePerTank: string;
    };
    safetyPrecautions: string[];
}

export default function Pesticide() {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [crop, setCrop] = useState<CropType | "">("");
    const [area, setArea] = useState("");
    const [unit, setUnit] = useState<Unit>("bigha");
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const cropOptions: { value: CropType; label: string; icon: string }[] = [
        { value: "rice", label: t.crops.rice, icon: "🌾" },
        { value: "wheat", label: t.crops.wheat, icon: "🌾" },
        { value: "corn", label: t.crops.corn, icon: "🌽" },
        { value: "potato", label: t.crops.potato, icon: "🥔" },
        { value: "mustard", label: t.crops.mustard, icon: "🌼" },
        { value: "tea", label: t.crops.tea, icon: "🍃" },
        { value: "sugarcane", label: t.crops.sugarcane, icon: "🎋" },
        { value: "jute", label: t.crops.jute, icon: "🌿" },
        { value: "mango", label: t.crops.mango, icon: "🥭" },
        { value: "banana", label: t.crops.banana, icon: "🍌" },
        { value: "brinjal", label: t.crops.brinjal, icon: "🍆" },
        { value: "tomato", label: t.crops.tomato, icon: "🍅" },
        { value: "chili", label: t.crops.chili, icon: "🌶️" },
        { value: "onion", label: t.crops.onion, icon: "🧅" },
        { value: "garlic", label: t.crops.garlic, icon: "🧄" },
        { value: "ginger", label: t.crops.ginger, icon: "🫚" },
        { value: "turmeric", label: t.crops.turmeric, icon: "🟧" },
        { value: "lentil", label: t.crops.lentil, icon: "🍲" },
        { value: "watermelon", label: t.crops.watermelon, icon: "🍉" },
        { value: "papaya", label: t.crops.papaya, icon: "🍈" },
        { value: "pineapple", label: t.crops.pineapple, icon: "🍍" },
    ];

    const calculateMutation = useMutation({
        mutationFn: async (data: { cropType: string; area: number; unit: string; language: string }) => {
            return apiRequest<PesticideRecommendation>("POST", "/api/pesticide", data);
        },
        onSuccess: (data) => {
            toast({
                title: t.readyToAnalyze,
                description: t.whyNecessary,
            });
        },
        onError: (error) => {
            toast({
                title: t.errorTitle,
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const handleCalculate = () => {
        if (!crop || !area) {
            toast({
                title: t.errorTitle,
                description: t.validAreaError,
                variant: "destructive",
            });
            return;
        }

        const areaNum = parseFloat(area);
        if (isNaN(areaNum) || areaNum <= 0) {
            toast({
                title: t.errorTitle,
                description: t.validAreaError,
                variant: "destructive",
            });
            return;
        }

        calculateMutation.mutate({
            cropType: crop,
            area: areaNum,
            unit,
            language
        });
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <SEO
                title={t.pesticideCalculator}
                description={t.pesticideDescription}
            />

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8 text-center animate-in fade-in slide-in-from-top duration-500">
                    <div className="bg-red-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-red-200">
                        <Bug className="h-10 w-10 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
                        {t.pesticideCalculator}
                    </h1>
                    <p className="text-muted-foreground max-w-lg mx-auto">
                        {t.pesticideDescription}
                    </p>
                </div>

                <div className="grid md:grid-cols-1 gap-6">
                    <Card className="border-l-4 border-l-red-500 shadow-md">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FlaskConical className="w-5 h-5 text-red-500" />
                                {t.fertilizerCalculator} {/* Fallback or create new key if desired, reusing generic calculator label */}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>{t.selectCrop}</Label>
                                <Select value={crop} onValueChange={(v) => setCrop(v as CropType)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t.selectCrop} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cropOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <span className="mr-2">{option.icon}</span>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t.area}</Label>
                                    <Input
                                        type="number"
                                        placeholder="10"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>{t.selectUnit}</Label>
                                    <Select value={unit} onValueChange={(v) => setUnit(v as Unit)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="acre">{t.acre}</SelectItem>
                                            <SelectItem value="bigha">{t.bigha}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold h-12 text-lg shadow-lg mt-2"
                                onClick={handleCalculate}
                                disabled={calculateMutation.isPending}
                            >
                                {calculateMutation.isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        {t.calculating}
                                    </>
                                ) : (
                                    <>
                                        <Bug className="mr-2 h-5 w-5" />
                                        {t.calculate}
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {calculateMutation.isPending && (
                        <ProcessingAnimation message={t.calculating} />
                    )}

                    {calculateMutation.data && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">

                            {/* Calibration Card - Highlighted */}
                            <Card className="border-l-4 border-l-blue-600 bg-blue-50/50 shadow-lg overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Droplets className="w-24 h-24 text-blue-600" />
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl text-blue-800 flex items-center gap-2">
                                        <Droplets className="w-6 h-6" />
                                        {t.calibration}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex flex-col items-center text-center">
                                            <span className="text-sm text-muted-foreground mb-1">{t.waterRequired}</span>
                                            <span className="text-2xl font-bold text-blue-700">{calculateMutation.data.calibration.waterRequired}</span>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex flex-col items-center text-center">
                                            <span className="text-sm text-muted-foreground mb-1">{t.numberOfTanks}</span>
                                            <span className="text-2xl font-bold text-blue-700">{calculateMutation.data.calibration.numberOfTanks}</span>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100 flex flex-col items-center text-center">
                                            <span className="text-sm text-muted-foreground mb-1">{t.dosePerTank}</span>
                                            <span className="text-2xl font-bold text-blue-700">{calculateMutation.data.calibration.dosePerTank}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Recommendations */}
                            <Card className="shadow-md">
                                <CardHeader>
                                    <CardTitle>{t.recommendations}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {calculateMutation.data.recommendations.map((rec, i) => (
                                            <li key={i} className="flex gap-3 bg-muted/30 p-3 rounded-lg border border-transparent hover:border-border transition-colors">
                                                <div className="mt-1 min-w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                                                    {i + 1}
                                                </div>
                                                <span className="text-foreground/90 leading-relaxed font-medium">{rec}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Safety Precautions */}
                            <Card className="border-l-4 border-l-orange-500 bg-orange-50/30 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-orange-800">
                                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                                        {t.safetyPrecautions}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {calculateMutation.data.safetyPrecautions.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-orange-900/80">
                                                <CheckCircle2 className="w-4 h-4 mt-1 text-orange-600 shrink-0" />
                                                <span className="text-sm font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            <FloatingActions
                isChatOpen={isChatOpen}
                onChatOpenChange={setIsChatOpen}
                isCalendarOpen={isCalendarOpen}
                onCalendarOpenChange={setIsCalendarOpen}
                alwaysShowLabels={true}
            />
        </div>
    );
}
