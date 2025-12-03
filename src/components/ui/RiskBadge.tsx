import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md';
}

const levelStyles = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-destructive/10 text-destructive border-destructive/20',
};

const labels = {
  low: 'Low Risk',
  medium: 'Medium Risk',
  high: 'High Risk',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

export function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium border",
      levelStyles[level],
      sizeStyles[size]
    )}>
      {labels[level]}
    </span>
  );
}
