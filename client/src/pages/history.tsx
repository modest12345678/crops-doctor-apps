import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, History as HistoryIcon, Image as ImageIcon } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useLanguage } from "@/lib/LanguageContext";
import type { Detection } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { enUS, bn } from "date-fns/locale";

export default function History() {
  const { data: detections, isLoading } = useQuery<Detection[]>({
    queryKey: ["/api/detections"],
  });
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

  const dateLocale = language === "bn" ? bn : enUS;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="History"
        description="View your past crop disease detections and analysis history."
      />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <HistoryIcon className="w-8 h-8" />
            {t.detectionHistory}
          </h1>
          <p className="text-muted-foreground">
            {t.historyDescription}
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && (!detections || detections.length === 0) && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">{t.noDetections}</p>
                <p className="text-sm">{t.startAnalyzing}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && detections && detections.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {detections.map((detection) => (
              <Card key={detection.id} className="hover-elevate" data-testid={`card-detection-${detection.id}`}>
                <CardHeader className="p-0">
                  <div className="relative aspect-video rounded-t-lg overflow-hidden bg-muted">
                    <img
                      src={detection.imageData}
                      alt={detection.diseaseName}
                      className="w-full h-full object-cover"
                      data-testid={`img-detection-${detection.id}`}
                    />
                    <div className="absolute top-2 left-2">
                      <Badge variant="default" className="bg-primary/90 backdrop-blur-sm capitalize" data-testid={`badge-crop-${detection.id}`}>
                        {cropOptions.find(c => c.value === detection.cropType)?.label || detection.cropType}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm" data-testid={`badge-confidence-${detection.id}`}>
                        {detection.confidence}% {t.confident}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2" data-testid={`text-disease-${detection.id}`}>
                    {detection.diseaseName}
                  </CardTitle>
                  <CardDescription className="text-sm mb-3 line-clamp-2" data-testid={`text-description-${detection.id}`}>
                    {detection.description}
                  </CardDescription>
                  <div className="text-xs text-muted-foreground" data-testid={`text-date-${detection.id}`}>
                    {formatDistanceToNow(new Date(detection.createdAt), { addSuffix: true, locale: dateLocale })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
