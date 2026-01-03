import { useSafety } from "@/lib/context";
import { AlertTriangle, Siren } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AlertBanner() {
  const { isEmergency } = useSafety();

  return (
    <AnimatePresence>
      {isEmergency && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-destructive text-destructive-foreground overflow-hidden"
        >
          <div className="container mx-auto px-6 py-3 flex items-center justify-between animate-pulse-fast">
            <div className="flex items-center gap-3">
              <Siren className="w-6 h-6 animate-spin-slow" />
              <span className="font-mono font-bold text-lg tracking-wider">EMERGENCY DETECTED: LIBRARY ENTRANCE</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded">CONFIDENCE: 98%</span>
              <span className="text-sm font-mono">T-MINUS 00:00:12</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
