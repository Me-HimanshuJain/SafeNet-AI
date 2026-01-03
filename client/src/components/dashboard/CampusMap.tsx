import { useSafety } from "@/lib/context";
import { cn } from "@/lib/utils";
import mapImage from "@assets/generated_images/campus_map_dark_mode.png";
import { MapPin } from "lucide-react";

export function CampusMap() {
  const { isEmergency } = useSafety();

  return (
    <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden border border-border group">
      <img 
        src={mapImage} 
        alt="Campus Map" 
        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
      />
      
      {/* Map Markers */}
      <div className="absolute top-[30%] left-[45%] group/marker">
        <MapPin className="text-blue-400 w-6 h-6 -translate-x-1/2 -translate-y-full drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[140%] opacity-0 group-hover/marker:opacity-100 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity">
          Main Quad
        </div>
      </div>

      <div className="absolute top-[60%] right-[30%] group/marker">
        <MapPin className={cn(
          "w-6 h-6 -translate-x-1/2 -translate-y-full drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] transition-colors",
          isEmergency ? "text-destructive animate-bounce" : "text-blue-400"
        )} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[140%] opacity-0 group-hover/marker:opacity-100 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none transition-opacity">
          Library Entrance
        </div>
      </div>
      
      <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white/50 font-mono border border-white/10">
        Lat: 34.0522 N | Lon: 118.2437 W
      </div>
    </div>
  );
}
