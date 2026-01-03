import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Phone, Mic, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function MobileSOS() {
  const [triggered, setTriggered] = useState(false);
  const [countdown, setCountdown] = useState(10);

  const handleSOS = () => {
    setTriggered(true);
    setCountdown(10);
  };

  const handleCancel = () => {
    setTriggered(false);
    setCountdown(10);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (triggered && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [triggered, countdown]);

  return (
    <div className="min-h-screen bg-black text-white flex justify-center bg-zinc-900">
      <div className="w-full max-w-md bg-background min-h-screen relative flex flex-col shadow-2xl overflow-hidden border-x border-zinc-800">
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between z-10">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800")}>
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <span className="font-bold text-lg tracking-wider">SafeNet App</span>
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 gap-8 relative">
          
          {/* Animated Rings Background */}
          {!triggered && (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
              <div className="w-[300px] h-[300px] border border-red-900/20 rounded-full absolute animate-ping duration-[3s]" />
              <div className="w-[500px] h-[500px] border border-red-900/10 rounded-full absolute animate-ping delay-700 duration-[3s]" />
            </div>
          )}

          {triggered ? (
            <div className="flex flex-col items-center gap-6 animate-in zoom-in duration-300">
              <div className="w-64 h-64 rounded-full bg-red-600 flex items-center justify-center relative shadow-[0_0_50px_rgba(220,38,38,0.6)]">
                <div className="text-6xl font-black font-mono">{countdown}</div>
                <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-spin-slow" style={{ animationDuration: '10s' }} />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-red-500">SENDING SOS</h2>
                <p className="text-zinc-400">Security and EMS will be dispatched to your location.</p>
              </div>
              <Button 
                size="lg" 
                variant="outline" 
                className="w-full mt-8 border-zinc-700 hover:bg-zinc-800 h-14 text-lg"
                onClick={handleCancel}
              >
                CANCEL ALERT
              </Button>
            </div>
          ) : (
            <>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="w-64 h-64 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(220,38,38,0.5)] border-4 border-red-500/30 relative z-20 group cursor-pointer"
                onClick={handleSOS}
              >
                <ShieldAlert className="w-24 h-24 text-white mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-2xl font-black tracking-widest text-white">SOS</span>
                <span className="text-xs text-red-200 mt-1 uppercase tracking-wide">Tap for Emergency</span>
              </motion.button>

              <div className="grid grid-cols-2 gap-4 w-full mt-8">
                <Button className="h-20 flex flex-col gap-2 bg-zinc-800 hover:bg-zinc-700 border-none rounded-2xl">
                  <Mic className="w-6 h-6 text-blue-400" />
                  <span className="text-xs font-bold text-zinc-300">Voice Trigger</span>
                </Button>
                <Button className="h-20 flex flex-col gap-2 bg-zinc-800 hover:bg-zinc-700 border-none rounded-2xl">
                  <Phone className="w-6 h-6 text-green-400" />
                  <span className="text-xs font-bold text-zinc-300">Call Campus Security</span>
                </Button>
              </div>
            </>
          )}
        </div>
        
        {/* Bottom Status */}
        <div className="p-6 bg-zinc-900 border-t border-zinc-800">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-xs font-mono text-zinc-500 uppercase">Location Tracking Active</span>
          </div>
          <p className="text-xs text-zinc-600 mt-1">Lat: 34.0522 • Lon: -118.2437</p>
        </div>
      </div>
    </div>
  );
}
