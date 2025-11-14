import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, History as HistoryIcon, Image as ImageIcon } from "lucide-react";
import type { Detection } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export default function History() {
  const { data: detections, isLoading } = useQuery<Detection[]>({
    queryKey: ["/api/detections"],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <HistoryIcon className="w-8 h-8" />
            Detection History
          </h1>
          <p className="text-muted-foreground">
            View all your previous disease detections and analysis results
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
                <p className="text-lg mb-2">No detections yet</p>
                <p className="text-sm">Start analyzing potato plants to build your history</p>
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
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm" data-testid={`badge-confidence-${detection.id}`}>
                        {detection.confidence}% confident
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
                    {formatDistanceToNow(new Date(detection.createdAt), { addSuffix: true })}
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
