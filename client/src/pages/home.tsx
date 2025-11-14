import { useState, useRef } from "react";
import { Camera, Upload, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Detection } from "@shared/schema";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<Detection | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const detectMutation = useMutation({
    mutationFn: async (imageData: string) => {
      return await apiRequest<Detection>("POST", "/api/detect", { imageData });
    },
    onSuccess: (data) => {
      setDetectionResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/detections"] });
      toast({
        title: "Disease Detected!",
        description: `Identified: ${data.diseaseName} with ${data.confidence}% confidence`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Detection Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setSelectedImage(imageData);
        setDetectionResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = () => {
    if (selectedImage) {
      detectMutation.mutate(selectedImage);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setDetectionResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
            Potato Disease Detector
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload or capture a photo of your potato plant to instantly identify diseases using AI-powered analysis
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <Card data-testid="card-upload-section">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Upload Image
                </CardTitle>
                <CardDescription>
                  Take a photo with your camera or select an image from your gallery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedImage ? (
                  <div className="space-y-4">
                    <div
                      className="border-2 border-dashed rounded-lg p-12 text-center hover-elevate active-elevate-2 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="dropzone-upload"
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-2">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="button-gallery"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        From Gallery
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full"
                        onClick={() => cameraInputRef.current?.click()}
                        data-testid="button-camera"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                      data-testid="input-file"
                    />
                    <input
                      ref={cameraInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={handleFileSelect}
                      data-testid="input-camera"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden border">
                      <img
                        src={selectedImage}
                        alt="Selected potato plant"
                        className="w-full h-auto"
                        data-testid="img-preview"
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={handleReset}
                        disabled={detectMutation.isPending}
                        data-testid="button-reset"
                      >
                        Change Image
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleAnalyze}
                        disabled={detectMutation.isPending}
                        data-testid="button-analyze"
                      >
                        {detectMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Analyze Image
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            {detectMutation.isPending && (
              <Card data-testid="card-analyzing">
                <CardContent className="py-12">
                  <div className="text-center space-y-4">
                    <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Analyzing Image</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI is examining your potato plant for disease symptoms...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {detectionResult && !detectMutation.isPending && (
              <Card data-testid="card-result">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Detection Result
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold" data-testid="text-disease-name">
                        {detectionResult.diseaseName}
                      </h3>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Confidence</div>
                        <div className="text-2xl font-bold text-primary" data-testid="text-confidence">
                          {detectionResult.confidence}%
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground" data-testid="text-description">
                      {detectionResult.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        Symptoms
                      </h4>
                      <p className="text-sm text-muted-foreground" data-testid="text-symptoms">
                        {detectionResult.symptoms}
                      </p>
                    </div>

                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-primary">
                        Recommended Treatment
                      </h4>
                      <p className="text-sm" data-testid="text-treatment">
                        {detectionResult.treatment}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleReset}
                    data-testid="button-new-analysis"
                  >
                    Analyze Another Image
                  </Button>
                </CardContent>
              </Card>
            )}

            {!selectedImage && !detectionResult && !detectMutation.isPending && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-muted-foreground">
                    <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Upload or capture an image to get started</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
