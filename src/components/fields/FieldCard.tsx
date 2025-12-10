import { Field } from '@/types/fields';
import { FieldStatusBadge } from './FieldStatusBadge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface FieldCardProps {
  field: Field;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onViewDetails: (field: Field) => void;
}

export function FieldCard({ field, isHovered, onHover, onViewDetails }: FieldCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border shadow-sm p-4 transition-all duration-200 cursor-pointer',
        isHovered ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
      )}
      onMouseEnter={() => onHover(field.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{field.name}</h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            {field.area.toFixed(1)} hectares
          </p>
        </div>
        <FieldStatusBadge status={field.healthStatus} />
      </div>

      {field.snapshot ? (
        <div className="w-full h-24 rounded-lg overflow-hidden mb-3 bg-muted">
          <img
            src={field.snapshot}
            alt={`${field.name} snapshot`}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-24 rounded-lg mb-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-green-600/50" />
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {format(new Date(field.lastUpdated), 'MMM d, yyyy')}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onViewDetails(field)}
          className="h-7 text-xs"
        >
          <Maximize2 className="w-3 h-3 mr-1" />
          View Details
        </Button>
      </div>
    </div>
  );
}
