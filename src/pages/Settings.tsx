import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCcw, Shield, Bell, Gauge } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const { settings, updateSettings, resetDemo } = useApp();

  const handleThresholdChange = (key: keyof typeof settings, value: number[]) => {
    updateSettings({ [key]: value[0] });
  };

  const handleNotificationChange = (key: keyof typeof settings.notifications, value: boolean) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    });
  };

  const handleReset = () => {
    resetDemo();
    toast({
      title: "Demo Reset",
      description: "All data has been reset to initial state.",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure risk thresholds and notification preferences</p>
      </div>

      {/* Risk Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Risk Thresholds
          </CardTitle>
          <CardDescription>
            Configure automatic approval and review thresholds based on CropCura Scores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Auto-Approve Threshold</Label>
              <span className="text-sm font-medium text-success bg-success/10 px-2 py-1 rounded">
                ≥ {settings.autoApproveThreshold}
              </span>
            </div>
            <Slider
              value={[settings.autoApproveThreshold]}
              onValueChange={(v) => handleThresholdChange('autoApproveThreshold', v)}
              min={600}
              max={800}
              step={10}
              className="[&_[role=slider]]:bg-success"
            />
            <p className="text-sm text-muted-foreground">
              Loans with CropCura Scores at or above this threshold will be recommended for automatic approval.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Review Required Threshold</Label>
              <span className="text-sm font-medium text-warning bg-warning/10 px-2 py-1 rounded">
                {settings.reviewThreshold} - {settings.autoApproveThreshold - 1}
              </span>
            </div>
            <Slider
              value={[settings.reviewThreshold]}
              onValueChange={(v) => handleThresholdChange('reviewThreshold', v)}
              min={400}
              max={699}
              step={10}
              className="[&_[role=slider]]:bg-warning"
            />
            <p className="text-sm text-muted-foreground">
              Loans in this range require manual review by a loan officer.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Auto-Decline Threshold</Label>
              <span className="text-sm font-medium text-destructive bg-destructive/10 px-2 py-1 rounded">
                &lt; {settings.autoDeclineThreshold}
              </span>
            </div>
            <Slider
              value={[settings.autoDeclineThreshold]}
              onValueChange={(v) => handleThresholdChange('autoDeclineThreshold', v)}
              min={300}
              max={599}
              step={10}
              className="[&_[role=slider]]:bg-destructive"
            />
            <p className="text-sm text-muted-foreground">
              Loans with scores below this threshold will be flagged for likely decline.
            </p>
          </div>

          {/* Visual Score Scale */}
          <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-foreground">Score Decision Scale</span>
            </div>
            <div className="relative h-8 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div 
                  className="bg-destructive/70 h-full"
                  style={{ width: `${((settings.autoDeclineThreshold - 250) / 600) * 100}%` }}
                />
                <div 
                  className="bg-warning/70 h-full"
                  style={{ width: `${((settings.reviewThreshold - settings.autoDeclineThreshold) / 600) * 100}%` }}
                />
                <div 
                  className="bg-warning/40 h-full"
                  style={{ width: `${((settings.autoApproveThreshold - settings.reviewThreshold) / 600) * 100}%` }}
                />
                <div className="bg-success/70 h-full flex-1" />
              </div>
              <div className="absolute inset-0 flex items-center justify-around text-xs font-medium">
                <span className="text-destructive-foreground">Decline</span>
                <span className="text-warning-foreground">Review</span>
                <span className="text-success-foreground">Approve</span>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>250</span>
              <span>{settings.autoDeclineThreshold}</span>
              <span>{settings.reviewThreshold}</span>
              <span>{settings.autoApproveThreshold}</span>
              <span>850</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Configure how you receive alerts and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Email Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive alerts via email</p>
            </div>
            <Switch
              checked={settings.notifications.emailAlerts}
              onCheckedChange={(v) => handleNotificationChange('emailAlerts', v)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Critical Only</Label>
              <p className="text-sm text-muted-foreground">Only receive critical risk alerts</p>
            </div>
            <Switch
              checked={settings.notifications.criticalOnly}
              onCheckedChange={(v) => handleNotificationChange('criticalOnly', v)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-foreground">Daily Digest</Label>
              <p className="text-sm text-muted-foreground">Receive a daily summary of portfolio activity</p>
            </div>
            <Switch
              checked={settings.notifications.dailyDigest}
              onCheckedChange={(v) => handleNotificationChange('dailyDigest', v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Demo Controls */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCcw className="w-5 h-5 text-muted-foreground" />
            Demo Controls
          </CardTitle>
          <CardDescription>
            Reset the demo to its initial state
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset Demo Data
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            This will reset all loan statuses, alerts, and settings to their default values.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
