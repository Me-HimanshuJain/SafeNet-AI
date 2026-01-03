import { useSafety } from "@/lib/context";
import { cn } from "@/lib/utils";
import cctvLibrary from "@assets/generated_images/cctv_library_entrance.png";
import cctvQuad from "@assets/generated_images/cctv_main_quad.png";
import cctvDorm from "@assets/generated_images/cctv_dorm_lobby.png";
import cctvParking from "@assets/generated_images/cctv_parking_lot.png";

const FEEDS = [
  { id: 1, name: "Library Entrance", src: cctvLibrary, status: "Alert" },
  { id: 2, name: "Main Quad", src: cctvQuad, status: "Normal" },
  { id: 3, name: "Dorm Lobby", src: cctvDorm, status: "Normal" },
  { id: 4, name: "Parking Lot B", src: cctvParking, status: "Normal" },
];

export function CameraGrid() {
  const { isEmergency } = useSafety();

  return (
    <div className="grid grid-cols-2 gap-4 h-full min-h-[500px]">
      {FEEDS.map((feed) => (
        <div 
          key={feed.id} 
          className={cn(
            "relative bg-black rounded-lg overflow-hidden border-2 group",
            isEmergency && feed.name === "Library Entrance" ? "border-destructive shadow-[0_0_20px_rgba(239,68,68,0.5)]" : "border-border/50"
          )}
        >
          {/* Video Feed Simulation */}
          <div className="absolute inset-0 bg-black/20 z-10 scanline pointer-events-none" />
          <img 
            src={feed.src} 
            alt={feed.name} 
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105 transform"
          />

          {/* Overlay UI */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
            <span className="text-[10px] font-mono bg-black/60 text-white px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10">
              CAM-{feed.id.toString().padStart(2, '0')}
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-wider text-glow">
              {feed.name}
            </span>
          </div>

          <div className="absolute top-3 right-3 z-20">
             <div className={cn(
               "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border",
               isEmergency && feed.name === "Library Entrance" 
                 ? "bg-destructive/80 text-white border-destructive/50 animate-pulse" 
                 : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
             )}>
               <div className={cn("w-1.5 h-1.5 rounded-full", isEmergency && feed.name === "Library Entrance" ? "bg-white" : "bg-emerald-400")} />
               {isEmergency && feed.name === "Library Entrance" ? "DETECTING" : "LIVE"}
             </div>
          </div>

          <div className="absolute bottom-3 left-3 z-20 font-mono text-[10px] text-white/70">
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </div>
          
          {/* AI Detection Box Simulation */}
          {isEmergency && feed.name === "Library Entrance" && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-48 border-2 border-destructive/80 z-10 flex flex-col items-center justify-end pb-2">
               <span className="bg-destructive text-white text-[9px] px-1 font-bold uppercase">Person Down</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
