import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShieldAlert, LayoutDashboard, Camera, Bell, BarChart3, Settings, Phone, MoreHorizontal, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSafety } from "@/lib/context";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const [location] = useLocation();
  const { isEmergency } = useSafety();
  const [isCollapsed, setIsCollapsed] = useState(true);

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
    <aside 
      className={cn(
        "border-r border-border bg-card/50 backdrop-blur flex flex-col h-screen fixed left-0 top-0 z-20 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={cn("w-8 h-8 shrink-0 rounded bg-primary flex items-center justify-center", isEmergency && "animate-pulse")}>
            <ShieldAlert className="text-primary-foreground w-5 h-5" />
          </div>
          {!isCollapsed && <h1 className="font-mono font-bold text-lg tracking-tight whitespace-nowrap">SafeNet AI</h1>}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-accent"
        >
          {isCollapsed ? <MoreHorizontal className="w-5 h-5" /> : <ChevronRight className="w-5 h-5 rotate-180" />}
        </Button>
      </div>

      <nav className="flex-1 p-3 space-y-6 overflow-x-hidden">
        <div>
          {!isCollapsed && <h2 className="text-xs font-mono uppercase text-muted-foreground mb-3 px-2">Operations</h2>}
          <div className="space-y-1">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  location === link.href 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <link.icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">{link.label}</span>}
              </Link>
            ))}
          </div>
        </div>

        <div>
          {!isCollapsed && <h2 className="text-xs font-mono uppercase text-muted-foreground mb-3 px-2">Simulations</h2>}
          <div className="space-y-1">
            {mobileLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  location === link.href 
                    ? "bg-accent text-accent-foreground font-medium" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <link.icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span className="whitespace-nowrap">{link.label}</span>}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-3 border-t border-border">
        <Link href="/settings">
          <button className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors w-full",
            location === "/settings"
              ? "bg-primary/10 text-primary font-medium"
              : "text-muted-foreground hover:bg-accent hover:text-foreground",
            isCollapsed && "justify-center px-0"
          )}>
            <Settings className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="whitespace-nowrap">Settings</span>}
          </button>
        </Link>
      </div>
    </aside>
  );
}
