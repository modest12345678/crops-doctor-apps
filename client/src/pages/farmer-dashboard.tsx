import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Plus, Sprout, Calendar, MapPin, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { FarmingCycle } from "@shared/schema";
import { format } from "date-fns";

export default function FarmerDashboard() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newCycle, setNewCycle] = useState({
        farmerName: "",
        crop: "potato",
        location: "",
        startDate: format(new Date(), "yyyy-MM-dd"),
    });

    const { toast } = useToast();
    const queryClient = useQueryClient();
    const [, setLocation] = useLocation();

    const { data: cycles, isLoading } = useQuery<FarmingCycle[]>({
        queryKey: ["/api/farming-cycles"],
    });

    const createCycleMutation = useMutation({
        mutationFn: async (data: typeof newCycle) => {
            return await apiRequest("POST", "/api/farming-cycles", {
                ...data,
                startDate: new Date(data.startDate).toISOString(),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/api/farming-cycles"] });
            setIsDialogOpen(false);
            toast({
                title: "Cycle Created",
                description: "New farming cycle has been started successfully.",
            });
            setNewCycle({
                farmerName: "",
                crop: "potato",
                location: "",
                startDate: format(new Date(), "yyyy-MM-dd"),
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create farming cycle.",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = () => {
        if (!newCycle.farmerName || !newCycle.location) {
            toast({
                title: "Missing Information",
                description: "Please fill in all fields.",
                variant: "destructive",
            });
            return;
        }
        createCycleMutation.mutate(newCycle);
    };

    return (
        <div className="min-h-screen bg-background p-4 pb-24">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">My Farm</h1>
                        <p className="text-muted-foreground">Manage your crops and traceability</p>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                New Cycle
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Start New Farming Cycle</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Farmer Name</Label>
                                    <Input
                                        value={newCycle.farmerName}
                                        onChange={(e) => setNewCycle({ ...newCycle, farmerName: e.target.value })}
                                        placeholder="e.g. Rahim Uddin"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Crop</Label>
                                    <Select
                                        value={newCycle.crop}
                                        onValueChange={(val) => setNewCycle({ ...newCycle, crop: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="potato">Potato</SelectItem>
                                            <SelectItem value="tomato">Tomato</SelectItem>
                                            <SelectItem value="corn">Corn</SelectItem>
                                            <SelectItem value="rice">Rice</SelectItem>
                                            <SelectItem value="wheat">Wheat</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input
                                        value={newCycle.location}
                                        onChange={(e) => setNewCycle({ ...newCycle, location: e.target.value })}
                                        placeholder="e.g. Bogura, Bangladesh"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={newCycle.startDate}
                                        onChange={(e) => setNewCycle({ ...newCycle, startDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit} disabled={createCycleMutation.isPending}>
                                    {createCycleMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Create Cycle
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {cycles?.map((cycle) => (
                            <Card
                                key={cycle.id}
                                className="hover:border-primary/50 transition-colors cursor-pointer"
                                onClick={() => setLocation(`/dashboard/cycle/${cycle.id}`)}
                            >
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="flex items-center gap-2 capitalize">
                                            <Sprout className="w-5 h-5 text-primary" />
                                            {cycle.crop}
                                        </CardTitle>
                                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <CardDescription>{cycle.farmerName}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {cycle.location}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            Started: {format(new Date(cycle.startDate), "MMM d, yyyy")}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {(!cycles || cycles.length === 0) && (
                            <div className="col-span-full text-center py-12 text-muted-foreground">
                                <Sprout className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>No active farming cycles found.</p>
                                <p className="text-sm">Start a new cycle to begin tracking.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
