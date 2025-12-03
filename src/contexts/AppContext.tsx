import React, { createContext, useContext, useState, useCallback } from 'react';
import { Settings, LoanApplication, RiskAlert } from '@/types';
import { loanApplications as initialLoans, riskAlerts as initialAlerts } from '@/data/mockData';

interface AppContextType {
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
  loans: LoanApplication[];
  updateLoanStatus: (loanId: string, status: 'approved' | 'declined') => void;
  alerts: RiskAlert[];
  resolveAlert: (alertId: string) => void;
  resetDemo: () => void;
}

const defaultSettings: Settings = {
  autoApproveThreshold: 700,
  reviewThreshold: 600,
  autoDeclineThreshold: 500,
  notifications: {
    emailAlerts: true,
    criticalOnly: false,
    dailyDigest: true,
  },
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loans, setLoans] = useState<LoanApplication[]>(initialLoans);
  const [alerts, setAlerts] = useState<RiskAlert[]>(initialAlerts);

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const updateLoanStatus = useCallback((loanId: string, status: 'approved' | 'declined') => {
    setLoans(prev => prev.map(loan => 
      loan.id === loanId ? { ...loan, status } : loan
    ));
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isResolved: true } : alert
    ));
  }, []);

  const resetDemo = useCallback(() => {
    setSettings(defaultSettings);
    setLoans(initialLoans);
    setAlerts(initialAlerts);
  }, []);

  return (
    <AppContext.Provider value={{
      settings,
      updateSettings,
      loans,
      updateLoanStatus,
      alerts,
      resolveAlert,
      resetDemo,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
