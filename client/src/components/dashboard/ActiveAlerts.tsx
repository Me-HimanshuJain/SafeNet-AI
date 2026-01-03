import { useSafety, Alert } from "@/lib/context";
import { cn } from "@/lib/utils";
import { AlertCircle, Flame, Ambulance, Activity, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AlertIcon = ({ type }: { type: Alert["type"] }) => {
  switch (type) {
    case "Fire": return <Flame className="w-4 h-4 text-orange-500" />;
    case "Medical": return <Ambulance className="w-4 h-4 text-red-500" />;
    case "Assault": return <Activity className="w-4 h-4 text-rose-600" />;
    case "Suspicious": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    default: return <AlertCircle className="w-4 h-4" />;
  }
};

export function ActiveAlerts() {
  const { alerts, resolveAlert } = useSafety();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-sm uppercase text-muted-foreground tracking-wider">Active Incidents</h3>
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono">{alerts.filter(a => a.status === 'Active').length} LIVE</span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div 
            key={alert.id} 
            className={cn(
              "p-3 rounded-lg border flex flex-col gap-3 transition-all",
              alert.status === "Active" 
                ? "bg-card border-l-4 border-l-destructive border-y-border border-r-border shadow-sm" 
                : "bg-card/50 border-border opacity-70"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={cn("p-2 rounded bg-background border border-border", alert.status === "Active" && "animate-pulse")}>
                  <AlertIcon type={alert.type} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{alert.type} Alert</h4>
                  <p className="text-xs text-muted-foreground font-mono">{alert.location}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-muted-foreground">{alert.timestamp}</span>
                {alert.status === "Active" && (
                   <div className="text-[10px] font-bold text-destructive mt-1">CONF: {alert.confidence}%</div>
                )}
              </div>
            </div>

            {alert.status === "Active" && (
              <div className="flex gap-2 mt-1">
                <Button size="sm" variant="outline" className="h-7 text-xs flex-1 bg-background hover:bg-accent border-border" onClick={() => resolveAlert(alert.id)}>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Mark Resolved
                </Button>
                <Button size="sm" className="h-7 text-xs flex-1 bg-primary hover:bg-primary/90 text-primary-foreground border-none">
                  Notify Guard
                </Button>
              </div>
            )}
          </div>
        ))}
        
        {alerts.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm font-mono border border-dashed border-border rounded">
            NO ACTIVE INCIDENTS
          </div>
        )}
      </div>
    </div>
  );
}
