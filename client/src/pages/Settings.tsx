import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield, Bell, Eye, Lock } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 relative z-0">
        <div className="p-8 max-w-4xl mx-auto">
          <header className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
            <p className="text-muted-foreground">Manage SafeNet AI security protocols and privacy standards.</p>
          </header>

          <div className="grid gap-6">
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="flex flex-row items-center gap-4">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Security Protocols</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enhanced Threat Detection</Label>
                    <p className="text-sm text-muted-foreground">Use advanced AI models for posture analysis.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automated EMS Dispatch</Label>
                    <p className="text-sm text-muted-foreground">Automatically notify emergency services for critical falls.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="flex flex-row items-center gap-4">
                <Lock className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Privacy & GDPR</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Zero-Storage Policy</Label>
                    <p className="text-sm text-muted-foreground">Raw video data is never persisted on disk.</p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Metadata Anonymization</Label>
                    <p className="text-sm text-muted-foreground">Remove identifying information from incident logs.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="flex flex-row items-center gap-4">
                <Bell className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Critical Alerts</Label>
                    <p className="text-sm text-muted-foreground">Push notifications for life-safety events.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
