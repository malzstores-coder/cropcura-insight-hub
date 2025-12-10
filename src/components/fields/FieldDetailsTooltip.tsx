import { Field } from '@/types/fields';
import { FieldStatusBadge } from './FieldStatusBadge';
import { format } from 'date-fns';
import { X } from 'lucide-react';

interface FieldDetailsTooltipProps {
  field: Field;
  onClose: () => void;
}

export function FieldDetailsTooltip({ field, onClose }: FieldDetailsTooltipProps) {
  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-4 min-w-[200px] animate-fade-in">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-foreground">{field.name}</h4>
        <button
          onClick={onClose}
          className="p-0.5 hover:bg-muted rounded transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <FieldStatusBadge status={field.healthStatus} />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Area</span>
          <span className="text-sm font-medium">{field.area.toFixed(1)} ha</span>
        </div>
        
        {field.cropType && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Crop</span>
            <span className="text-sm font-medium">{field.cropType}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last Updated</span>
          <span className="text-sm font-medium">
            {format(new Date(field.lastUpdated), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    </div>
  );
}
