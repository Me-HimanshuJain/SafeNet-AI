import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SafetyProvider } from "@/lib/context";
import Dashboard from "@/pages/Dashboard";
import Analytics from "@/pages/Analytics";
import MobileSOS from "@/pages/MobileSOS";
import MobileGuard from "@/pages/MobileGuard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/mobile/sos" component={MobileSOS} />
      <Route path="/mobile/guard" component={MobileGuard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafetyProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </SafetyProvider>
    </QueryClientProvider>
  );
}

export default App;
