import DetectionHistory from "@/components/DetectionHistory";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from "@/lib/LanguageContext";
import { FloatingActions } from "@/components/FloatingActions";
import { Calendar, Bot, ChevronRight, MapPin, CloudRain } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { t } = useLanguage();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-cover bg-center overflow-hidden mb-8" style={{ backgroundImage: "url('/hero-bg.png')" }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side: Text Content */}
            <div className="text-left animate-in slide-in-from-left duration-700">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                {t.appTitle}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-lg leading-relaxed drop-shadow font-light">
                {t.appDescription}
              </p>
            </div>

            {/* Right Side: Futuristic Action Panel */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl animate-in slide-in-from-right duration-700 transform hover:scale-[1.01] transition-all">
              <h2 className="text-2xl font-semibold text-white mb-6 text-center border-b border-white/10 pb-4">
                {t.selectFunction}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="w-full lg:w-[48%]">
                  <Link href="/detect">
                    <Button className="w-full text-lg h-32 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 shadow-lg group relative overflow-hidden border-0 flex flex-col items-center justify-center p-4 gap-2">
                      <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm shrink-0 shadow-inner mb-1">
                        <img src="/disease-detector.png" alt="Disease Detector" className="h-10 w-10 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="relative z-10 font-bold text-xl leading-none text-white shadow-sm text-center">
                          {t.diseaseDetectorButton}
                        </span>
                        <span className="text-white/80 text-sm font-medium mt-1 text-center">
                          {t.diseaseDetectorLabel}
                        </span>
                      </div>
                    </Button>
                  </Link>
                </div>

                <div className="w-full lg:w-[48%]">
                  <Link href="/fertilizer">
                    <Button className="w-full text-lg h-32 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-400 hover:to-cyan-500 shadow-lg group border-0 flex flex-col items-center justify-center p-4 gap-2">
                      <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm shrink-0 shadow-inner mb-1">
                        <img src="/fertilizer-calculator.png" alt="Fertilizer Calculator" className="h-10 w-10 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-xl leading-none text-white shadow-sm text-center">
                          {t.fertilizerCalculatorButton}
                        </span>
                        <span className="text-white/80 text-sm font-medium mt-1 text-center">
                          {t.fertilizerCalculatorLabel}
                        </span>
                      </div>
                    </Button>
                  </Link>
                </div>

                <div className="w-full lg:w-[48%]">
                  <Link href="/soil-fertility">
                    <Button className="w-full text-lg h-32 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg group border-0 flex flex-col items-center justify-center p-4 gap-2">
                      <div className="h-14 w-14 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm shrink-0 shadow-inner mb-1">
                        <img src="/soil-satellite.png" alt="Soil Fertility" className="h-12 w-12 object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-xl leading-none text-white shadow-sm text-center">
                          {t.soilFertility}
                        </span>
                        <span className="text-white/80 text-sm font-medium mt-1 text-center max-w-sm">
                          {t.soilFertilityDesc}
                        </span>
                      </div>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>


      <div className="max-w-7xl mx-auto pb-8">
        <DetectionHistory />
      </div>

      <div className="max-w-7xl mx-auto pb-16 px-4">
        <h2 className="text-2xl font-bold mb-6 text-foreground/80">{t.smartFarmingTools}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card
            className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-blue-500 hover:scale-[1.02]"
            onClick={() => setIsCalendarOpen(true)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <CardTitle>{t.cropCalendar}</CardTitle>
                <CardDescription>{t.cropCalendarDesc}</CardDescription>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-blue-500" />
            </CardHeader>
          </Card>



          <Link href="/weather">
            <Card className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-cyan-500 hover:scale-[1.02]">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <CloudRain className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle>{t.weatherForecast}</CardTitle>
                  <CardDescription>{t.weatherDesc}</CardDescription>
                </div>
                <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-cyan-500" />
              </CardHeader>
            </Card>
          </Link>

          <Card
            className="hover:shadow-lg transition-all cursor-pointer group border-l-4 border-l-primary hover:scale-[1.02]"
            onClick={() => setIsChatOpen(true)}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <CardTitle>{t.aiAssistant}</CardTitle>
                <CardDescription>{t.aiAssistantDesc}</CardDescription>
              </div>
              <ChevronRight className="w-5 h-5 ml-auto text-muted-foreground group-hover:text-primary" />
            </CardHeader>
          </Card>
        </div>
      </div>

      <FloatingActions
        isChatOpen={isChatOpen}
        onChatOpenChange={setIsChatOpen}
        isCalendarOpen={isCalendarOpen}
        onCalendarOpenChange={setIsCalendarOpen}
        alwaysShowLabels={true}
      />
    </div >
  );
}
