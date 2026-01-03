import { useState } from "react";
import { Link } from "wouter";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, MapPin, Navigation, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import mapImage from "@assets/generated_images/campus_map_dark_mode.png";

export default function MobileGuard() {
  const [responding, setResponding] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex justify-center">
      <div className="w-full max-w-md bg-background min-h-screen relative flex flex-col shadow-2xl overflow-hidden border-x border-zinc-800">
        
        {/* Header */}
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between z-10 shadow-md">
          <Link href="/" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800")}>
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <span className="font-bold text-lg tracking-wider text-emerald-500">GUARD CONSOLE</span>
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <span className="text-xs font-bold">JD</span>
          </div>
        </div>

        {/* Incident Card */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h2 className="text-sm font-mono text-zinc-500 uppercase mb-4">Active Dispatch</h2>
          
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden mb-6">
            <div className="bg-red-500/10 border-b border-red-500/20 p-4 flex justify-between items-center">
              <span className="text-red-500 font-bold flex items-center gap-2">
                <Clock className="w-4 h-4" /> NOW
              </span>
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded font-bold">ASSAULT ALERT</span>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Library Entrance</h3>
                  <p className="text-zinc-400 text-sm">North Wing, Main Doors</p>
                </div>
              </div>
              
              <div className="h-40 rounded-lg overflow-hidden relative border border-zinc-700">
                <img src={mapImage} className="w-full h-full object-cover" alt="Map" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-ping absolute opacity-50" />
                   <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative z-10" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <span className="text-zinc-500 block text-xs mb-1">Subject</span>
                  <span className="font-mono">Male, ~6ft</span>
                </div>
                <div className="bg-zinc-800 p-3 rounded-lg">
                  <span className="text-zinc-500 block text-xs mb-1">Status</span>
                  <span className="font-mono text-orange-400">Escalating</span>
                </div>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            className={cn(
              "w-full h-14 font-bold text-lg transition-all",
              responding 
                ? "bg-emerald-600 hover:bg-emerald-700 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
            onClick={() => setResponding(!responding)}
          >
            {responding ? (
              <>
                <CheckCircle className="w-6 h-6 mr-2" />
                ARRIVED AT SCENE
              </>
            ) : (
              <>
                <Navigation className="w-6 h-6 mr-2" />
                RESPOND TO INCIDENT
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
