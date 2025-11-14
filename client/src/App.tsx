import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider, useLanguage } from "@/lib/LanguageContext";
import Home from "@/pages/home";
import History from "@/pages/history";
import Training from "@/pages/training";
import NotFound from "@/pages/not-found";
import { Leaf, Home as HomeIcon, History as HistoryIcon, GraduationCap, Languages, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function Navigation() {
  const [location] = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { path: "/", label: t.navDetect, icon: HomeIcon, testId: "nav-home" },
    { path: "/history", label: t.navHistory, icon: HistoryIcon, testId: "nav-history" },
    { path: "/training", label: t.navTrainAI, icon: GraduationCap, testId: "nav-training" },
  ];

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate px-3 py-2 rounded-md" data-testid="logo">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <Stethoscope className="w-2.5 h-2.5 text-primary-foreground" />
                </div>
              </div>
              <span className="font-bold text-lg">{t.appTitle}</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-muted-foreground" />
              <Select value={language} onValueChange={(value) => setLanguage(value as "en" | "bn")}>
                <SelectTrigger className="w-32 h-8" data-testid="select-language">
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
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="gap-2"
                    data-testid={item.testId}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/history" component={History} />
      <Route path="/training" component={Training} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Navigation />
          <Router />
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
