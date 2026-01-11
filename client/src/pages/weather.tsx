import { useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Loader2, Cloud, CloudRain, Sun, Wind, Droplets, Thermometer, Calendar } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface WeatherData {
    current: {
        temperature_2m: number;
        relative_humidity_2m: number;
        precipitation: number;
        weather_code: number;
        wind_speed_10m: number;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
        precipitation: number[];
        precipitation_probability: number[];
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_probability_max: number[];
    };
    soil: {
        temperature_0cm: number;
        moisture_0_1cm: number;
    }
}

export default function WeatherForecast() {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

    // Helper: Convert digits to Bangla if needed
    const toBn = (num: number | string) => {
        if (language !== "bn") return num;
        return num.toString().replace(/[0-9]/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
    };

    // Helper: Get Translation safely
    const T = (key: string, fallback: string) => {
        // @ts-ignore
        return t[key] || fallback;
    };

    // Header Labels
    const labels = {
        title: language === "bn" ? "মাইক্রো-ক্লাইমেট আবহাওয়া" : "Micro-Climate Weather",
        getLocation: language === "bn" ? "অবস্থান নির্ণয় করুন" : "Get My Location",
        analyzing: language === "bn" ? "আবহাওয়া তথ্য লোড হচ্ছে..." : "Fetching Weather Data...",
        results: language === "bn" ? "আবহাওয়ার পূর্বাভাস" : "Weather Forecast",
        locationError: language === "bn" ? "অবস্থান পাওয়া যায়নি" : "Could not retrieve location",
        retry: language === "bn" ? "আবার চেষ্টা করুন" : "Retry",
    };

    const weatherMutation = useMutation({
        mutationFn: async (location: { lat: number; lng: number }) => {
            const res = await apiRequest<WeatherData>("POST", "/api/weather", location);
            return res;
        }
    });

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            toast({
                title: "Error",
                description: "Geolocation is not supported",
                variant: "destructive"
            });
            return;
        }

        toast({
            title: labels.analyzing,
            description: language === "bn" ? "অনুগ্রহ করে অপেক্ষা করুন..." : "Please wait..."
        });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newCoords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                setCoords(newCoords);
                weatherMutation.mutate(newCoords);
            },
            (error) => {
                console.error(error);
                toast({
                    title: labels.locationError,
                    description: error.message,
                    variant: "destructive"
                });
            }
        );
    };

    const data = weatherMutation.data;

    // Format Data for Chart with Localized Time
    const chartData = data ? data.hourly.time.map((time, i) => ({
        time: new Date(time).toLocaleTimeString(language === "bn" ? "bn-BD" : "en-US", { hour: '2-digit', hour12: true }),
        temp: data.hourly.temperature_2m[i],
        rain: data.hourly.precipitation[i],
    })) : [];

    // Helper for Day Name
    const getDayName = (dateStr: string) => {
        const date = new Date(dateStr);
        const daysFn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const daysBn = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"];
        return language === "bn" ? daysBn[date.getDay()] : daysFn[date.getDay()];
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
            <SEO
                title="Weather Forecast"
                description="Get hyper-local farming weather forecasts including soil temperature, rain probability, and humidity."
            />
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold text-primary flex items-center justify-center gap-3">
                    <Cloud className="w-10 h-10 text-blue-500" />
                    {labels.title}
                </h1>
                <p className="text-muted-foreground">
                    {language === "bn" ? "সরাসরি আপনার খামারের অবস্থান থেকে রিয়েল-টাইম পূর্বাভাস।" : "Real-time hyper-local forecasts directly from your farm's coordinates."}
                </p>
            </div>

            {/* GPS Action Section */}
            <Card className="border-2 border-primary/10 shadow-lg">
                <CardContent className="p-8 flex flex-col items-center justify-center gap-6">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center animate-pulse">
                        <MapPin className="w-10 h-10 text-blue-600" />
                    </div>

                    {weatherMutation.isPending ? (
                        <div className="flex flex-col items-center gap-3">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <p className="text-lg font-medium text-primary">{labels.analyzing}</p>
                        </div>
                    ) : (
                        <Button
                            size="lg"
                            onClick={handleGetLocation}
                            className="text-lg px-8 py-6 rounded-full shadow-xl hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700"
                        >
                            {coords ? labels.retry : labels.getLocation}
                        </Button>
                    )}
                </CardContent>
            </Card>

            {data && (
                <div className="space-y-6 animate-in slide-in-from-bottom-10 fade-in duration-500">

                    {/* Current Conditions Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Temp */}
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <Thermometer className="w-8 h-8 text-blue-600 mb-2" />
                                <p className="text-sm text-muted-foreground">{T("temperature", "Temperature")}</p>
                                <p className="text-2xl font-bold text-blue-800">{toBn(data.current.temperature_2m)}°C</p>
                            </CardContent>
                        </Card>
                        {/* Rain */}
                        <Card className="bg-slate-50 border-slate-200">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <CloudRain className="w-8 h-8 text-slate-600 mb-2" />
                                <p className="text-sm text-muted-foreground">{T("rain", "Rain")}</p>
                                <p className="text-2xl font-bold text-slate-800">{toBn(data.current.precipitation)} mm</p>
                            </CardContent>
                        </Card>
                        {/* Wind */}
                        <Card className="bg-cyan-50 border-cyan-200">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <Wind className="w-8 h-8 text-cyan-600 mb-2" />
                                <p className="text-sm text-muted-foreground">{T("wind", "Wind")}</p>
                                <p className="text-2xl font-bold text-cyan-800">{toBn(data.current.wind_speed_10m)} km/h</p>
                            </CardContent>
                        </Card>
                        {/* Soil Temp */}
                        <Card className="bg-amber-50 border-amber-200">
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                                <Droplets className="w-8 h-8 text-amber-600 mb-2" />
                                <p className="text-sm text-muted-foreground">{T("soilTemp", "Soil Temp")}</p>
                                <p className="text-2xl font-bold text-amber-800">{toBn(data.soil.temperature_0cm)}°C</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Hourly Chart */}
                    <Card className="shadow-md">
                        <CardHeader>
                            <CardTitle>{language === "bn" ? "২৪ ঘন্টার প্রবণতা" : "24-Hour Trends"}</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                    <XAxis dataKey="time" tick={{ fontSize: 12 }} interval={3} />
                                    <YAxis yAxisId="left" stroke="#2563eb" label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
                                    <YAxis yAxisId="right" orientation="right" stroke="#64748b" label={{ value: 'mm', angle: 90, position: 'insideRight' }} />
                                    <RechartsTooltip />
                                    <Legend />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="temp"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        name={T("temperature", "Temperature") + " (°C)"}
                                        dot={false}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="rain"
                                        stroke="#64748b"
                                        strokeWidth={2}
                                        name={T("rain", "Rain") + " (mm)"}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* 7-Day Forecast */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {T("forecast", "7-Day Forecast")}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                            {data.daily.time.map((day, i) => (
                                <Card key={i} className="text-center bg-card hover:bg-accent/50 transition-colors">
                                    <CardContent className="p-3">
                                        <p className="font-bold text-primary mb-1">{getDayName(day)}</p>
                                        <div className="flex justify-center my-2">
                                            {data.daily.precipitation_probability_max[i] > 50 ? (
                                                <CloudRain className="text-blue-500 w-6 h-6" />
                                            ) : (
                                                <Sun className="text-orange-500 w-6 h-6" />
                                            )}
                                        </div>
                                        <div className="text-sm">
                                            <span className="font-bold text-red-500">{toBn(Math.round(data.daily.temperature_2m_max[i]))}°</span>
                                            {" / "}
                                            <span className="text-blue-500">{toBn(Math.round(data.daily.temperature_2m_min[i]))}°</span>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1 bg-blue-50 rounded px-1">
                                            {T("rain", "Rain")}: {toBn(data.daily.precipitation_probability_max[i])}%
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
