import { Sidebar } from "@/components/layout/Sidebar";
import { AlertBanner } from "@/components/dashboard/AlertBanner";
import { CameraGrid } from "@/components/dashboard/CameraGrid";
import { CampusMap } from "@/components/dashboard/CampusMap";
import { ActiveAlerts } from "@/components/dashboard/ActiveAlerts";
import { useSafety } from "@/lib/context";
import { Button } from "@/components/ui/button";
import { TriangleAlert, PhoneCall, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { toggleEmergency, isEmergency } = useSafety();

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-64 relative z-0">
        <AlertBanner />
        
        <div className="p-6 h-[calc(100vh-64px)] flex flex-col gap-6">
          <header className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Security Operations Center</h2>
              <p className="text-muted-foreground text-sm font-mono">SYSTEM STATUS: <span className="text-emerald-500">ONLINE</span> | NODES: 42/42</p>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant={isEmergency ? "outline" : "destructive"} 
                className={cn("gap-2 shadow-lg shadow-destructive/20 font-mono font-bold", isEmergency && "animate-pulse border-destructive text-destructive hover:bg-destructive/10")}
                onClick={toggleEmergency}
              >
                <TriangleAlert className="w-4 h-4" />
                {isEmergency ? "CANCEL SIMULATION" : "SIMULATE EMERGENCY"}
              </Button>
            </div>
          </header>

          <div className="flex gap-6 flex-1 min-h-0">
            {/* Left Main Area: Cameras */}
            <div className="flex-[2] flex flex-col gap-4 rounded-xl border border-border bg-card/30 p-1">
              <CameraGrid />
            </div>

            {/* Right Panel: Map & Alerts */}
            <div className="flex-1 flex flex-col gap-6 min-w-[320px]">
              <div className="space-y-4">
                 <h3 className="font-mono text-sm uppercase text-muted-foreground tracking-wider flex items-center gap-2">
                   <Radio className="w-4 h-4" /> 
                   Geospatial Tracking
                 </h3>
                 <CampusMap />
              </div>

              <div className="flex-1 bg-card/50 rounded-xl border border-border p-4 overflow-y-auto">
                <ActiveAlerts />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white border-none font-mono text-xs h-10">
                  <PhoneCall className="w-3 h-3 mr-2" />
                  DISPATCH EMS
                </Button>
                <Button variant="secondary" className="w-full font-mono text-xs h-10 border-border bg-secondary hover:bg-secondary/80">
                  BROADCAST ALERT
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
