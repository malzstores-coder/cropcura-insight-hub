import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'declined' | 'under_review';
}

const statusStyles = {
  pending: 'bg-warning/10 text-warning border-warning/20',
  approved: 'bg-success/10 text-success border-success/20',
  declined: 'bg-destructive/10 text-destructive border-destructive/20',
  under_review: 'bg-info/10 text-info border-info/20',
};

const labels = {
  pending: 'Pending',
  approved: 'Approved',
  declined: 'Declined',
  under_review: 'Under Review',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
      statusStyles[status]
    )}>
      {labels[status]}
    </span>
  );
}
