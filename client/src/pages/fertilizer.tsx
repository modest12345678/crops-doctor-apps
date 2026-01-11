import { useState } from "react";
import { Loader2, Sprout, Calculator } from "lucide-react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/lib/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import FeatureNav from "@/components/FeatureNav";
import { FloatingActions } from "@/components/FloatingActions";
import { ProcessingAnimation } from "@/components/ProcessingAnimation";

type CropType = "potato" | "tomato" | "corn" | "wheat" | "rice" | "jute" | "sugarcane" | "tea" | "mustard" | "mango" | "banana" | "brinjal" | "chili" | "onion" | "garlic" | "ginger" | "turmeric" | "lentil" | "watermelon" | "papaya";
type Unit = "acre" | "bigha";

interface FertilizerResult {
    cropName: string;
    area: number;
    unit: string;
    recommendations: string[];
    organicOptions: string[];
    perUnitList: string[];
}

export default function Fertilizer() {
    const [selectedCrop, setSelectedCrop] = useState<CropType>("rice");
    const [area, setArea] = useState<string>("");
    const [unit, setUnit] = useState<Unit>("bigha");
    const [result, setResult] = useState<FertilizerResult | null>(null);
    const { language, t } = useLanguage();
    const { toast } = useToast();

    const cropOptions: { value: CropType; label: string; icon: string }[] = [
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

    const calculateMutation = useMutation({
        mutationFn: async (params: { cropType: CropType; area: number; unit: Unit; language: "en" | "bn" }) => {
            return await apiRequest<FertilizerResult>("POST", "/api/fertilizer", params);
        },
        onSuccess: (data) => {
            setResult(data);
            queryClient.invalidateQueries({ queryKey: ["/api/history/fertilizer"] });
        },
        onError: (error: Error) => {
            toast({
                title: t.calculationFailed,
                description: error.message,
                variant: "destructive",
            });
        },
    });

    const toEnglishNumber = (text: string): string => {
        const bengaliToEnglish: { [key: string]: string } = {
            '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
            '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
        };
        return text.replace(/[০-৯]/g, (digit) => bengaliToEnglish[digit]);
    };

    const handleCalculate = () => {
        const areaInEnglish = toEnglishNumber(area);
        const areaNumber = parseFloat(areaInEnglish);

        if (isNaN(areaNumber) || areaNumber <= 0) {
            toast({
                title: t.calculationFailed,
                description: t.validAreaError,
                variant: "destructive",
            });
            return;
        }

        calculateMutation.mutate({
            cropType: selectedCrop,
            area: areaNumber,
            unit,
            language,
        });
    };

    const renderList = (items: string[]) => {
        if (!items || items.length === 0) return null;
        return (
            <ul className="list-disc pl-5 space-y-1">
                {items.map((item, index) => (
                    <li key={index} className="text-sm">{item}</li>
                ))}
            </ul>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <SEO
                title="Fertilizer Calculator"
                description="Calculate exact fertilizer requirements for your crops including Urea, TSP, and Potash based on land area."
                image="/fertilizer-calculator.png"
            />
            <FeatureNav />
            <div
                className="relative bg-cover bg-center overflow-hidden mb-8"
                style={{ backgroundImage: 'url("/hero-bg.png")' }}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />

                <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sprout className="w-12 h-12 text-green-400" />
                            <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
                                {t.fertilizerCalculator}
                            </h1>
                        </div>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
                            {t.fertilizerDescription}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 pb-8">
                <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-primary" />
                                {t.fertilizerCalculator}
                            </CardTitle>
                            <CardDescription>
                                {t.fertilizerDescription}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="crop-select">{t.selectCrop}</Label>
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

                            <div>
                                <Label htmlFor="area-input">{t.area}</Label>
                                <Input
                                    id="area-input"
                                    type="text"
                                    inputMode="decimal"
                                    placeholder={t.areaPlaceholder}
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="unit-select">{t.selectUnit}</Label>
                                <Select value={unit} onValueChange={(value) => setUnit(value as Unit)}>
                                    <SelectTrigger id="unit-select">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="acre">{t.acre}</SelectItem>
                                        <SelectItem value="bigha">{t.bigha}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button
                                className="w-full"
                                onClick={handleCalculate}
                                disabled={calculateMutation.isPending || !area}
                            >
                                {calculateMutation.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {t.calculating}
                                    </>
                                ) : (
                                    <>
                                        <Calculator className="w-4 h-4 mr-2" />
                                        {t.calculate}
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    <div>
                        {calculateMutation.isPending && (
                            <Card>
                                <CardContent className="py-12">
                                    <ProcessingAnimation
                                        message={language === "bn"
                                            ? "আপনার ফসলের জন্য সার সুপারিশ তৈরি করা হচ্ছে..."
                                            : "Generating fertilizer recommendations for your crop..."}
                                    />
                                </CardContent>
                            </Card>
                        )}

                        {result && !calculateMutation.isPending && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Sprout className="w-5 h-5 text-primary" />
                                        {t.fertilizerRecommendations}
                                    </CardTitle>
                                    <CardDescription>
                                        {result.cropName} - {result.area} {result.unit}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="p-4 bg-muted rounded-lg">
                                        <h4 className="font-semibold mb-2">{t.recommendations}</h4>
                                        {renderList(result.recommendations)}
                                    </div>

                                    {result.perUnitList && result.perUnitList.length > 0 && (
                                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                                            <h4 className="font-semibold mb-2 text-primary">
                                                {language === "bn"
                                                    ? `প্রতি ${result.unit === 'bigha' ? 'বিঘা' : 'একর'} সারের তালিকা`
                                                    : `Fertilizer List Per ${result.unit === 'bigha' ? 'Bigha' : 'Acre'}`}
                                            </h4>
                                            {renderList(result.perUnitList)}
                                        </div>
                                    )}

                                    <div className="p-4 bg-muted rounded-lg">
                                        <h4 className="font-semibold mb-2">{t.organicOptions}</h4>
                                        {renderList(result.organicOptions)}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {!result && !calculateMutation.isPending && (
                            <Card>
                                <CardContent className="py-12">
                                    <div className="text-center text-muted-foreground">
                                        <Sprout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                        <p className="text-lg mb-2">
                                            {language === "bn" ? "সার সুপারিশ পেতে গণনা করুন" : "Calculate to get fertilizer recommendations"}
                                        </p>
                                        <p className="text-sm">
                                            {language === "bn"
                                                ? "আপনার ফসল, এলাকা এবং একক নির্বাচন করুন"
                                                : "Select your crop, area, and unit"}
                                        </p>
                                    </div>
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
