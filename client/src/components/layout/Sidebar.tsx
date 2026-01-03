import { Link, useLocation } from "wouter";
import { ShieldAlert, LayoutDashboard, Camera, Bell, BarChart3, Settings, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSafety } from "@/lib/context";

export function Sidebar() {
  const [location] = useLocation();
  const { isEmergency } = useSafety();

  const links = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/feeds", icon: Camera, label: "Live Feeds" },
    { href: "/alerts", icon: Bell, label: "Alerts" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  const mobileLinks = [
    { href: "/mobile/sos", icon: ShieldAlert, label: "Mobile SOS App" },
    { href: "/mobile/guard", icon: Phone, label: "Guard App" },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card/50 backdrop-blur flex flex-col h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-border flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded bg-primary flex items-center justify-center", isEmergency && "animate-pulse")}>
          <ShieldAlert className="text-primary-foreground w-5 h-5" />
        </div>
        <h1 className="font-mono font-bold text-lg tracking-tight">SafeNet AI</h1>
      </div>

      <nav className="flex-1 p-4 space-y-6">
        <div>
          <h2 className="text-xs font-mono uppercase text-muted-foreground mb-3 px-2">Operations</h2>
          <div className="space-y-1">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  location === link.href 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-mono uppercase text-muted-foreground mb-3 px-2">Simulations</h2>
          <div className="space-y-1">
            {mobileLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  location === link.href 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <button className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
