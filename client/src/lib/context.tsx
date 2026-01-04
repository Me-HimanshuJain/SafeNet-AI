import { createContext, useContext, useState, ReactNode } from "react";

export type AlertType = "Medical" | "Fire" | "Assault" | "Suspicious";

export interface Alert {
  id: string;
  type: AlertType;
  location: string;
  timestamp: string;
  confidence: number;
  status: "Active" | "Resolved" | "Investigating";
}

interface SafetyContextType {
  isEmergency: boolean;
  toggleEmergency: () => void;
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  resolveAlert: (id: string) => void;
}

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export function SafetyProvider({ children }: { children: ReactNode }) {
  const [isEmergency, setIsEmergency] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "Suspicious",
      location: "CAM-04 (Parking Lot B)",
      timestamp: "10:42 AM",
      confidence: 85,
      status: "Investigating",
    },
  ]);

  const toggleEmergency = () => {
    const newState = !isEmergency;
    setIsEmergency(newState);
    
    if (newState) {
      // Simulate new emergency alert
      const newAlert: Alert = {
        id: Date.now().toString(),
        type: "Assault",
        location: "CAM-01 (Library Entrance)",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 98,
        status: "Active",
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
  };

  const addAlert = (alert: Alert) => setAlerts(prev => [alert, ...prev]);
  
  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: "Resolved" } : a));
    // If all active high-priority alerts are resolved, turn off emergency mode
    if (isEmergency) {
      const hasActive = alerts.some(a => a.id !== id && a.status === "Active");
      if (!hasActive) setIsEmergency(false);
    }
  };

  return (
    <SafetyContext.Provider value={{ isEmergency, toggleEmergency, alerts, addAlert, resolveAlert }}>
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety() {
  const context = useContext(SafetyContext);
  if (!context) throw new Error("useSafety must be used within a SafetyProvider");
  return context;
}
