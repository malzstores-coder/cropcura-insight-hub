import { HealthStatus } from '@/types/fields';
import { getHealthStatusBgClass } from '@/data/fieldsData';
import { cn } from '@/lib/utils';

interface FieldStatusBadgeProps {
  status: HealthStatus;
  className?: string;
}

export function FieldStatusBadge({ status, className }: FieldStatusBadgeProps) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getHealthStatusBgClass(status),
        className
      )}
    >
      <span className={cn(
        'w-1.5 h-1.5 rounded-full mr-1.5',
        status === 'healthy' && 'bg-green-500',
        status === 'moderate' && 'bg-yellow-500',
        status === 'unhealthy' && 'bg-red-500'
      )} />
      {label}
    </span>
  );
}
