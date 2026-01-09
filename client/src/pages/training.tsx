import { useState, useRef } from "react";
import { Upload, GraduationCap, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { TrainingData } from "@shared/schema";
import { useLanguage } from "@/lib/LanguageContext";

export default function Training() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [diseaseName, setDiseaseName] = useState("");
  const [userNotes, setUserNotes] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const { data: trainingDataList, isLoading } = useQuery<TrainingData[]>({
    queryKey: ["/api/training"],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { imageData: string; diseaseName: string; userNotes?: string }) => {
      return await apiRequest<TrainingData>("POST", "/api/training", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/training"] });
      toast({
        title: t.trainingSubmitted,
        description: t.trainingSubmittedDesc,
      });
      setSelectedImage(null);
      setDiseaseName("");
      setUserNotes("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (error: Error) => {
      toast({
        title: t.submissionFailed,
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
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedImage && diseaseName) {
      submitMutation.mutate({
        imageData: selectedImage,
        diseaseName,
        userNotes: userNotes || undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
            <GraduationCap className="w-8 h-8" />
            {t.trainAI}
          </h1>
          <p className="text-muted-foreground">
            {t.trainAIDescription}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <Card data-testid="card-training-form">
              <CardHeader>
                <CardTitle>{t.submitTrainingData}</CardTitle>
                <CardDescription>
                  {t.submitDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">{t.diseaseImage}</Label>
                    {!selectedImage ? (
                      <div
                        className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate active-elevate-2 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                        data-testid="dropzone-training"
                      >
                        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-1">
                          {t.clickToUploadImage}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.fileTypes}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="relative rounded-lg overflow-hidden border">
                          <img
                            src={selectedImage}
                            alt="Training image"
                            className="w-full h-auto"
                            data-testid="img-training-preview"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            setSelectedImage(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                          data-testid="button-change-image"
                        >
                          {t.changeImage}
                        </Button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                      data-testid="input-training-file"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diseaseName">{t.diseaseName} *</Label>
                    <Input
                      id="diseaseName"
                      placeholder={t.diseaseNamePlaceholder}
                      value={diseaseName}
                      onChange={(e) => setDiseaseName(e.target.value)}
                      required
                      data-testid="input-disease-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">{t.additionalNotes}</Label>
                    <Textarea
                      id="notes"
                      placeholder={t.notesPlaceholder}
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      rows={4}
                      data-testid="textarea-notes"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!selectedImage || !diseaseName || submitMutation.isPending}
                    data-testid="button-submit-training"
                  >
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t.submitting}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        {t.submit}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t.yourContributions}</CardTitle>
                <CardDescription>
                  {isLoading ? t.analyzing : t.samplesSubmitted(trainingDataList?.length || 0)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                )}

                {!isLoading && (!trainingDataList || trainingDataList.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">{t.noSamples}</p>
                  </div>
                )}

                {!isLoading && trainingDataList && trainingDataList.length > 0 && (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {trainingDataList.map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 p-3 border rounded-lg hover-elevate"
                        data-testid={`training-item-${item.id}`}
                      >
                        <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.imageData}
                            alt={item.diseaseName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate" data-testid={`training-disease-${item.id}`}>
                            {item.diseaseName}
                          </h4>
                          {item.userNotes && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                              {item.userNotes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
