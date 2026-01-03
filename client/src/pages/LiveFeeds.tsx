import { Sidebar } from "@/components/layout/Sidebar";
import { CameraGrid } from "@/components/dashboard/CameraGrid";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Camera, Radio } from "lucide-react";

export default function LiveFeeds() {
  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 relative z-0 pl-16">
        <div className="p-8">
          <header className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">Live Video Intelligence</h2>
            <p className="text-muted-foreground font-mono text-sm uppercase">Privacy-First Posture & Behavior Analysis Active</p>
          </header>

          <div className="grid gap-6">
            <Card className="bg-card/30 border-border p-1">
              <CameraGrid />
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card/50 border-border">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <Camera className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-mono uppercase">Node Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42/42</div>
                  <p className="text-xs text-emerald-500">All camera nodes online</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border">
                <CardHeader className="flex flex-row items-center gap-2 pb-2">
                  <Radio className="w-4 h-4 text-primary" />
                  <CardTitle className="text-sm font-mono uppercase">AI Load</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">14%</div>
                  <p className="text-xs text-muted-foreground">Vision processing optimized</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
