import { useState, useRef } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, Upload, Video, Image as ImageIcon, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { FarmingCycle } from "@shared/schema";
import { format } from "date-fns";

export default function AddStage() {
    const [, params] = useRoute("/dashboard/cycle/:id");
    const cycleId = params?.id;
    const [, setLocation] = useLocation();
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const [stageData, setStageData] = useState({
        stageName: "Sowing",
        description: "",
        date: format(new Date(), "yyyy-MM-dd"),
        imageUrl: "",
        videoUrl: "",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoDuration, setVideoDuration] = useState<number>(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    const { data: cycle } = useQuery<FarmingCycle>({
        queryKey: [`/api/farming-cycles/${cycleId}`],
        enabled: !!cycleId,
    });

    const createStageMutation = useMutation({
        mutationFn: async (data: typeof stageData) => {
            // In a real app, we would upload files to Firebase/S3 here
            // For prototype, we'll use data URLs or mock URLs
            return await apiRequest("POST", "/api/farming-stages", {
                ...data,
                cycleId,
                date: new Date(data.date).toISOString(),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [`/api/farming-cycles/${cycleId}`] });
            toast({
                title: "Stage Added",
                description: "Farming stage has been recorded successfully.",
            });
            setLocation("/dashboard");
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to add farming stage.",
                variant: "destructive",
            });
        },
    });

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setStageData(prev => ({ ...prev, imageUrl: e.target?.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Create a temporary URL to check duration
            const url = URL.createObjectURL(file);
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = function () {
                window.URL.revokeObjectURL(url);
                if (video.duration > 30) {
                    toast({
                        title: "Video too long",
                        description: "Video must be 30 seconds or less.",
                        variant: "destructive",
                    });
                    setVideoFile(null);
                    setStageData(prev => ({ ...prev, videoUrl: "" }));
                } else {
                    setVideoFile(file);
                    setVideoDuration(video.duration);
                    // For prototype, we'll just use a placeholder or data URL if small enough
                    // Real implementation would upload to storage
                    setStageData(prev => ({ ...prev, videoUrl: "https://example.com/video-placeholder.mp4" }));
                    toast({
                        title: "Video Selected",
                        description: `Duration: ${video.duration.toFixed(1)}s`,
                    });
                }
            }
            video.src = url;
        }
    };

    const handleSubmit = () => {
        if (!stageData.description) {
            toast({
                title: "Missing Information",
                description: "Please provide a description.",
                variant: "destructive",
            });
            return;
        }
        createStageMutation.mutate(stageData);
    };

    if (!cycle) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="min-h-screen bg-background p-4 pb-24">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Add Stage</h1>
                        <p className="text-muted-foreground">{cycle.crop} - {cycle.farmerName}</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Stage Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Stage Name</Label>
                            <Select
                                value={stageData.stageName}
                                onValueChange={(val) => setStageData(prev => ({ ...prev, stageName: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Sowing">Sowing / Planting</SelectItem>
                                    <SelectItem value="Irrigation">Irrigation</SelectItem>
                                    <SelectItem value="Fertilizer">Fertilizer Application</SelectItem>
                                    <SelectItem value="Pest Control">Pest Control</SelectItem>
                                    <SelectItem value="Growth">Growth Monitoring</SelectItem>
                                    <SelectItem value="Harvesting">Harvesting</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={stageData.date}
                                onChange={(e) => setStageData(prev => ({ ...prev, date: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Describe what was done..."
                                value={stageData.description}
                                onChange={(e) => setStageData(prev => ({ ...prev, description: e.target.value }))}
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Photo</Label>
                                <div
                                    className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => document.getElementById('photo-upload')?.click()}
                                >
                                    {stageData.imageUrl ? (
                                        <div className="relative aspect-video rounded overflow-hidden">
                                            <img src={stageData.imageUrl} alt="Preview" className="object-cover w-full h-full" />
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Upload Photo</span>
                                        </div>
                                    )}
                                    <input
                                        id="photo-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageSelect}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Video (Max 30s)</Label>
                                <div
                                    className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 cursor-pointer transition-colors"
                                    onClick={() => document.getElementById('video-upload')?.click()}
                                >
                                    {videoFile ? (
                                        <div className="py-8 text-primary">
                                            <Video className="w-8 h-8 mx-auto mb-2" />
                                            <span className="text-xs font-medium">Video Selected</span>
                                            <p className="text-[10px] text-muted-foreground">{videoDuration.toFixed(1)}s</p>
                                        </div>
                                    ) : (
                                        <div className="py-8">
                                            <Video className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                                            <span className="text-xs text-muted-foreground">Upload Video</span>
                                        </div>
                                    )}
                                    <input
                                        id="video-upload"
                                        type="file"
                                        accept="video/*"
                                        className="hidden"
                                        onChange={handleVideoSelect}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button className="w-full" onClick={handleSubmit} disabled={createStageMutation.isPending}>
                            {createStageMutation.isPending ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            Save Stage
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
