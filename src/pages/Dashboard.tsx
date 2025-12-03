import { MetricCard } from '@/components/ui/MetricCard';
import { Users, FileText, TrendingUp, AlertTriangle } from 'lucide-react';
import { dashboardMetrics, scoreTrends, riskDistribution } from '@/data/mockData';
import { useApp } from '@/contexts/AppContext';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { RiskAlert } from '@/types';

const pieColors = ['hsl(142, 76%, 36%)', 'hsl(38, 92%, 50%)', 'hsl(0, 84%, 60%)'];

const pieData = [
  { name: 'Low Risk', value: riskDistribution.low, color: pieColors[0] },
  { name: 'Medium Risk', value: riskDistribution.medium, color: pieColors[1] },
  { name: 'High Risk', value: riskDistribution.high, color: pieColors[2] },
];

function RecentActivity({ alerts }: { alerts: RiskAlert[] }) {
  const recentAlerts = alerts.slice(0, 5);

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-card">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {recentAlerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
              alert.type === 'critical' ? 'bg-destructive' :
              alert.type === 'warning' ? 'bg-warning' : 'bg-info'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{alert.farmerName}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { alerts, loans } = useApp();
  const pendingCount = loans.filter(l => l.status === 'pending').length;
  const highRiskCount = alerts.filter(a => a.type === 'critical' && !a.isResolved).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Monitor your agricultural loan portfolio performance</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Farmers"
          value={dashboardMetrics.totalFarmers.toLocaleString()}
          icon={Users}
          variant="primary"
          trend={{ value: 8.2, isPositive: true }}
        />
        <MetricCard
          title="Pending Applications"
          value={pendingCount}
          icon={FileText}
          variant="warning"
        />
        <MetricCard
          title="Average CropCura Score"
          value={dashboardMetrics.averageScore}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 2.5, isPositive: true }}
        />
        <MetricCard
          title="High Risk Alerts"
          value={highRiskCount}
          icon={AlertTriangle}
          variant="danger"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Health Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Portfolio Health Trend</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[600, 720]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="averageScore" 
                  name="Avg Score"
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="lowRisk" 
                  name="Low Risk Count"
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Pie */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Risk Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity alerts={alerts} />
        
        {/* API Integration Panel */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">CropCura API Integration</h3>
          <div className="space-y-4">
            <div className="p-4 bg-sidebar rounded-lg font-mono text-sm">
              <p className="text-sidebar-muted mb-2">// Sample API Request</p>
              <p className="text-sidebar-foreground">
                <span className="text-accent">GET</span> /api/v1/scores/FRM-1001
              </p>
            </div>
            <div className="p-4 bg-sidebar rounded-lg font-mono text-sm overflow-x-auto">
              <p className="text-sidebar-muted mb-2">// Response</p>
              <pre className="text-sidebar-foreground text-xs">
{`{
  "farmerId": "FRM-1001",
  "cropCuraScore": 724,
  "riskLevel": "low",
  "lastUpdated": "2024-12-01",
  "factors": {
    "cropHealth": 0.85,
    "weatherRisk": 0.12,
    "soilQuality": 0.78
  }
}`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              Real-time score updates via satellite imagery and AI analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
