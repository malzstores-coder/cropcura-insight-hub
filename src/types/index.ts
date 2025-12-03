export interface Farmer {
  id: string;
  name: string;
  location: string;
  region: string;
  cropType: 'maize' | 'rice' | 'cassava' | 'wheat' | 'soybeans';
  cropCuraScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  farmSize: number; // in hectares
  registeredDate: string;
  lastAssessment: string;
  phoneNumber: string;
  email?: string;
}

export interface LoanApplication {
  id: string;
  farmerId: string;
  farmerName: string;
  loanAmount: number;
  cropType: string;
  cropCuraScore: number;
  status: 'pending' | 'approved' | 'declined' | 'under_review';
  applicationDate: string;
  purpose: string;
  term: number; // months
  interestRate: number;
  farmSize: number;
  location: string;
}

export interface RiskAlert {
  id: string;
  farmerId: string;
  farmerName: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: string;
  isResolved: boolean;
  scoreChange?: number;
  previousScore?: number;
  currentScore?: number;
}

export interface DashboardMetrics {
  totalFarmers: number;
  pendingApplications: number;
  averageScore: number;
  highRiskFarmers: number;
}

export interface RiskDistribution {
  low: number;
  medium: number;
  high: number;
}

export interface ScoreTrend {
  month: string;
  averageScore: number;
  highRisk: number;
  lowRisk: number;
}

export interface User {
  bankName: string;
  loanOfficer: string;
  role: string;
}

export interface Settings {
  autoApproveThreshold: number;
  reviewThreshold: number;
  autoDeclineThreshold: number;
  notifications: {
    emailAlerts: boolean;
    criticalOnly: boolean;
    dailyDigest: boolean;
  };
}
