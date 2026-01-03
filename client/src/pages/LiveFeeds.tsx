import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CameraGrid } from "@/components/dashboard/CameraGrid";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Camera, Radio, Upload, Brain, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function LiveFeeds() {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("zone_id", "Zone-A-South");

    try {
      const response = await fetch("/analyze/video/upload", {
        method: "POST",
        headers: {
          "X-SafeNet-API-Key": "safenet_admin_2026"
        },
        body: formData
      });

      const data = await response.json();
      if (data.status === "ANALYSIS_COMPLETE") {
        setPrediction(data.predictions);
        toast({
          title: "AI Analysis Complete",
          description: `Detection: ${data.predictions.threat_type || 'None'}`,
          variant: data.predictions.threat_detected ? "destructive" : "default"
        });
      }
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not process video for AI prediction.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 relative z-0 pl-16">
        <div className="p-8">
          <header className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Live Video Intelligence</h2>
              <p className="text-muted-foreground font-mono text-sm uppercase">Privacy-First Posture & Behavior Analysis Active</p>
            </div>
            
            <div className="flex gap-4">
              <input 
                type="file" 
                id="video-upload" 
                className="hidden" 
                accept="video/*,image/*" 
                onChange={handleVideoUpload}
              />
              <Button 
                asChild 
                variant="outline" 
                className="gap-2 font-mono text-xs border-primary/50 text-primary hover:bg-primary/10"
              >
                <label htmlFor="video-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4" />
                  {isUploading ? "ANALYZING..." : "UPLOAD FEED FOR AI PREDICTION"}
                </label>
              </Button>
            </div>
          </header>

          <div className="grid gap-6">
            {prediction && (
              <Card className={cn(
                "border-2 transition-all duration-500",
                prediction.threat_detected ? "border-destructive bg-destructive/5" : "border-emerald-500/50 bg-emerald-500/5"
              )}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-full",
                      prediction.threat_detected ? "bg-destructive/20 text-destructive" : "bg-emerald-500/20 text-emerald-500"
                    )}>
                      {prediction.threat_detected ? <AlertTriangle className="w-6 h-6" /> : <Brain className="w-6 h-6" />}
                    </div>
                    <div>
                      <p className="font-mono text-xs uppercase text-muted-foreground">AI Prediction Result</p>
                      <h4 className="font-bold text-lg">
                        {prediction.threat_detected ? `THREAT DETECTED: ${prediction.threat_type}` : "NO THREAT DETECTED"}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-muted-foreground">CONFIDENCE SCORE</p>
                    <p className="font-mono font-bold text-xl">{(prediction.confidence * 100).toFixed(1)}%</p>
                  </div>
                </CardContent>
              </Card>
            )}

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
