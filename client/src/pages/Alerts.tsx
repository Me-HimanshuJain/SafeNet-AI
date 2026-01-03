import { Sidebar } from "@/components/layout/Sidebar";
import { ActiveAlerts } from "@/components/dashboard/ActiveAlerts";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell, ShieldAlert } from "lucide-react";

export default function AlertsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 relative z-0 pl-16">
        <AlertBanner />
        <div className="p-8">
          <header className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Emergency Alerts Center</h2>
            <p className="text-muted-foreground">Real-time safety notifications and incident management.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 bg-card/50 border-border h-[calc(100vh-250px)] overflow-hidden flex flex-col">
              <CardHeader className="border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    <CardTitle>Live Incident Feed</CardTitle>
                  </div>
                  <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">STREAMING</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4">
                <ActiveAlerts />
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-card/50 border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-destructive" />
                    <CardTitle className="text-sm font-mono uppercase">Safety Protocol</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-4">
                  <p>All alerts are prioritized based on AI risk fusion scoring.</p>
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-destructive font-bold text-xs">CRITICAL INCIDENT PROTOCOL</p>
                    <p className="text-xs mt-1 text-destructive/80">Immediate responder routing is active for all SOS triggers.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
