import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

function getScoreColor(score: number): { bg: string; text: string; label: string } {
  if (score >= 700) return { bg: 'bg-success/10', text: 'text-success', label: 'Low Risk' };
  if (score >= 600) return { bg: 'bg-warning/10', text: 'text-warning', label: 'Medium Risk' };
  return { bg: 'bg-destructive/10', text: 'text-destructive', label: 'High Risk' };
}

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5 font-semibold',
};

export function ScoreBadge({ score, size = 'md', showLabel = false }: ScoreBadgeProps) {
  const { bg, text, label } = getScoreColor(score);

  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full font-medium",
      bg, text, sizeStyles[size]
    )}>
      <span>{score}</span>
      {showLabel && <span className="opacity-80">• {label}</span>}
    </span>
  );
}
