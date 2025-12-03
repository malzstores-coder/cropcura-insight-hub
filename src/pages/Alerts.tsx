import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, AlertTriangle, Info, CheckCircle, Clock, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function Alerts() {
  const { alerts, resolveAlert } = useApp();
  const [filter, setFilter] = useState<string>('all');
  const [showResolved, setShowResolved] = useState(false);

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.type === filter;
    const matchesResolved = showResolved || !alert.isResolved;
    return matchesFilter && matchesResolved;
  });

  const handleResolve = (alertId: string) => {
    resolveAlert(alertId);
    toast({
      title: "Alert Resolved",
      description: "The alert has been marked as resolved.",
    });
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-destructive/30 bg-destructive/5';
      case 'warning':
        return 'border-warning/30 bg-warning/5';
      default:
        return 'border-info/30 bg-info/5';
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-destructive/10 text-destructive';
      case 'warning':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-info/10 text-info';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return `${diffMins} minutes ago`;
    }
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    return date.toLocaleDateString();
  };

  const unresolvedCount = alerts.filter(a => !a.isResolved).length;
  const criticalCount = alerts.filter(a => a.type === 'critical' && !a.isResolved).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risk Alerts</h1>
          <p className="text-muted-foreground mt-1">Monitor and respond to farmer risk notifications</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{unresolvedCount}</p>
            <p className="text-sm text-muted-foreground">Unresolved</p>
          </div>
          {criticalCount > 0 && (
            <div className="text-right">
              <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px] bg-card">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Alerts</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={showResolved ? "default" : "outline"}
          onClick={() => setShowResolved(!showResolved)}
          className="gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          {showResolved ? 'Hide Resolved' : 'Show Resolved'}
        </Button>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, index) => (
          <div
            key={alert.id}
            className={cn(
              "rounded-xl border p-5 transition-all duration-300 animate-slide-up",
              getAlertStyles(alert.type),
              alert.isResolved && "opacity-60"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                getIconStyles(alert.type)
              )}>
                {getAlertIcon(alert.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-xs font-semibold uppercase px-2 py-0.5 rounded",
                        alert.type === 'critical' && "bg-destructive/20 text-destructive",
                        alert.type === 'warning' && "bg-warning/20 text-warning",
                        alert.type === 'info' && "bg-info/20 text-info"
                      )}>
                        {alert.type}
                      </span>
                      {alert.isResolved && (
                        <span className="text-xs font-medium text-success flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Resolved
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground">{alert.farmerName}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                    
                    {alert.scoreChange && (
                      <div className="flex items-center gap-2 mt-3 text-sm">
                        <TrendingDown className="w-4 h-4 text-destructive" />
                        <span className="text-destructive font-medium">
                          Score dropped {Math.abs(alert.scoreChange)} points
                        </span>
                        <span className="text-muted-foreground">
                          ({alert.previousScore} → {alert.currentScore})
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {formatTimestamp(alert.timestamp)}
                    </div>
                    {!alert.isResolved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolve(alert.id)}
                        className="gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle className="w-12 h-12 mx-auto text-success mb-4" />
          <p className="text-lg font-medium text-foreground">All caught up!</p>
          <p className="text-muted-foreground">No alerts match your current filters.</p>
        </div>
      )}
    </div>
  );
}
