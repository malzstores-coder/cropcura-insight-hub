import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Check, X, Eye } from 'lucide-react';
import { LoanApplication } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function Applications() {
  const { loans, updateLoanStatus, settings } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      loan.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (loan: LoanApplication) => {
    updateLoanStatus(loan.id, 'approved');
    toast({
      title: "Loan Approved",
      description: `Loan ${loan.id} for ${loan.farmerName} has been approved.`,
    });
    setSelectedLoan(null);
  };

  const handleDecline = (loan: LoanApplication) => {
    updateLoanStatus(loan.id, 'declined');
    toast({
      title: "Loan Declined",
      description: `Loan ${loan.id} for ${loan.farmerName} has been declined.`,
      variant: "destructive",
    });
    setSelectedLoan(null);
  };

  const getRecommendation = (score: number) => {
    if (score >= settings.autoApproveThreshold) {
      return { text: 'Recommended for Approval', color: 'text-success' };
    }
    if (score >= settings.reviewThreshold) {
      return { text: 'Manual Review Required', color: 'text-warning' };
    }
    return { text: 'High Risk - Review Carefully', color: 'text-destructive' };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Loan Applications</h1>
        <p className="text-muted-foreground mt-1">Review and manage farmer loan applications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Applications</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-secondary/50 border-b border-border">
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Farmer Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Loan Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Crop Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">CropCura Score</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-foreground">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => (
                <tr 
                  key={loan.id} 
                  className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedLoan(loan)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">{loan.farmerName}</p>
                      <p className="text-sm text-muted-foreground">{loan.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">
                    ${loan.loanAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-foreground">{loan.cropType}</span>
                  </td>
                  <td className="px-6 py-4">
                    <ScoreBadge score={loan.cropCuraScore} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={loan.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {loan.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-success hover:bg-success/10"
                            onClick={() => handleApprove(loan)}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="text-destructive hover:bg-destructive/10"
                            onClick={() => handleDecline(loan)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setSelectedLoan(loan)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredLoans.length === 0 && (
          <div className="px-6 py-12 text-center text-muted-foreground">
            No applications found matching your criteria
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedLoan} onOpenChange={() => setSelectedLoan(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Loan Application Details</DialogTitle>
            <DialogDescription>Application {selectedLoan?.id}</DialogDescription>
          </DialogHeader>
          
          {selectedLoan && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Farmer Name</p>
                    <p className="font-medium text-foreground">{selectedLoan.farmerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{selectedLoan.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Farm Size</p>
                    <p className="font-medium text-foreground">{selectedLoan.farmSize} hectares</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Primary Crop</p>
                    <p className="font-medium text-foreground capitalize">{selectedLoan.cropType}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="text-2xl font-bold text-foreground">${selectedLoan.loanAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="font-medium text-foreground">{selectedLoan.purpose}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Term & Rate</p>
                    <p className="font-medium text-foreground">{selectedLoan.term} months at {selectedLoan.interestRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Application Date</p>
                    <p className="font-medium text-foreground">{new Date(selectedLoan.applicationDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-foreground">CropCura Score Assessment</p>
                  <ScoreBadge score={selectedLoan.cropCuraScore} size="lg" showLabel />
                </div>
                <p className={`text-sm font-medium ${getRecommendation(selectedLoan.cropCuraScore).color}`}>
                  {getRecommendation(selectedLoan.cropCuraScore).text}
                </p>
              </div>

              {selectedLoan.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-border">
                  <Button 
                    className="flex-1 bg-success hover:bg-success/90"
                    onClick={() => handleApprove(selectedLoan)}
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve Loan
                  </Button>
                  <Button 
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDecline(selectedLoan)}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Decline Loan
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
