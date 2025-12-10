import { Field } from '@/types/fields';
import { FieldCard } from './FieldCard';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FieldListProps {
  fields: Field[];
  hoveredFieldId: string | null;
  onHover: (id: string | null) => void;
  onViewDetails: (field: Field) => void;
}

export function FieldList({ fields, hoveredFieldId, onHover, onViewDetails }: FieldListProps) {
  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">🌾</span>
        </div>
        <h3 className="font-semibold text-foreground mb-1">No fields yet</h3>
        <p className="text-sm text-muted-foreground">
          Click "Add Field" to map your first farm field
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-1">
        {fields.map((field) => (
          <FieldCard
            key={field.id}
            field={field}
            isHovered={hoveredFieldId === field.id}
            onHover={onHover}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </ScrollArea>
  );
}
