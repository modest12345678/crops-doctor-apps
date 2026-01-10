import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider, useLanguage } from "@/lib/LanguageContext";
import Home from "@/pages/home";
import History from "@/pages/history";
import Fertilizer from "@/pages/fertilizer";
import NotFound from "@/pages/not-found";
import Training from "@/pages/training";
import TracePage from "@/pages/trace";
import FarmerDashboard from "@/pages/farmer-dashboard";
import AddStage from "@/pages/add-stage";
import DetectPage from "@/pages/detect";
import SoilFertility from "@/pages/soil-fertility";
import WeatherForecast from "@/pages/weather";
import { Leaf, Home as HomeIcon, History as HistoryIcon, GraduationCap, Languages, Stethoscope, Sprout, FileText, LayoutGrid, CloudRain, Calendar as CalendarIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Navigation() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon, testId: "nav-home" },
  ];

  return (
    <nav className="border-b-0 bg-primary text-primary-foreground shadow-md sticky top-0 z-50 transition-colors duration-300 pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity px-2 py-1 rounded-md" data-testid="logo">
              <div className="h-14 w-14 flex items-center justify-center">
                <img src="/logo.png" alt="AI Crops-Doctor Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-bold text-2xl tracking-tight shadow-sm stroke-black hidden sm:block font-display">{t.appTitle}</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-primary-foreground/80" />
              <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "bn")}>
                <SelectTrigger className="w-32 h-8 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 focus:ring-primary-foreground/50 transition-colors" data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en" data-testid="option-language-en">
                    {t.english}
                  </SelectItem>
                  <SelectItem value="bn" data-testid="option-language-bn">
                    {t.bangla}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 transition-all duration-200 ${isActive
                      ? "bg-white text-primary hover:bg-white/90 shadow-sm font-semibold"
                      : "text-primary-foreground hover:bg-white/10 hover:text-white"
                      }`}
                    data-testid={item.testId}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-primary-foreground hover:bg-white/10 hover:text-white" data-testid="nav-tools">
                  <LayoutGrid className="w-5 h-5" />
                  <span className="hidden sm:inline">{t.actions || "Tools"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t.actions || "Tools"}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <Link href="/detect">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <Stethoscope className="w-4 h-4" />
                    <span>{t.diseaseDetectorButton || "Disease Detector"}</span>
                  </DropdownMenuItem>
                </Link>

                <Link href="/fertilizer">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <Sprout className="w-4 h-4" />
                    <span>{t.fertilizerCalculatorButton || "Fertilizer Calculator"}</span>
                  </DropdownMenuItem>
                </Link>

                <Link href="/soil-fertility">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{t.soilFertility || "Soil Analysis"}</span>
                  </DropdownMenuItem>
                </Link>

                <Link href="/weather">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <CloudRain className="w-4 h-4" />
                    <span>{t.weatherForecast || "Weather"}</span>
                  </DropdownMenuItem>
                </Link>

                <DropdownMenuSeparator />

                <Link href="/history">
                  <DropdownMenuItem className="cursor-pointer gap-2">
                    <HistoryIcon className="w-4 h-4" />
                    <span>{t.navHistory || "History"}</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t py-6 mt-auto bg-card/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-4 text-sm text-muted-foreground">
        <span>© 2025 Crop Doctor AI</span>
        <span>•</span>
        <Link href="/whitepaper">
          <a className="hover:text-primary transition-colors flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {t.whitepaper}
          </a>
        </Link>
      </div>
    </footer>
  );
}

import Whitepaper from "@/pages/whitepaper";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/fertilizer" component={Fertilizer} />
      <Route path="/history" component={History} />
      <Route path="/training" component={Training} />
      <Route path="/whitepaper" component={Whitepaper} />
      <Route path="/dashboard" component={FarmerDashboard} />
      <Route path="/dashboard/cycle/:id" component={AddStage} />
      <Route path="/trace/:id" component={TracePage} />
      <Route path="/detect" component={DetectPage} />
      <Route path="/soil-fertility" component={SoilFertility} />
      <Route path="/weather" component={WeatherForecast} />
      <Route component={NotFound} />
    </Switch>
  );
}

import { useEffect } from "react";
import { Device } from "@capacitor/device";
import { apiRequest } from "./lib/queryClient";
import { useAndroidBackButton } from "@/hooks/useAndroidBackButton";

function App() {
  // Handle Android back button navigation
  useAndroidBackButton();

  useEffect(() => {
    const registerDevice = async () => {
      try {
        const info = await Device.getInfo();
        await apiRequest("POST", "/api/register", {
          deviceInfo: info
        });
      } catch (error) {
        console.error("Failed to register device:", error);
      }
    };

    registerDevice();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Navigation />
          <div className="min-h-[calc(100vh-4rem-5rem)] pb-[env(safe-area-inset-bottom)]">
            <Router />
          </div>
          <Footer />
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
