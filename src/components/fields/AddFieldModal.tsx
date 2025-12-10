import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldMap } from './FieldMap';
import { FieldCoordinate } from '@/types/fields';
import { MapPin, Navigation, X } from 'lucide-react';
import { toast } from 'sonner';

interface AddFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, coordinates: FieldCoordinate[]) => void;
}

export function AddFieldModal({ isOpen, onClose, onSave }: AddFieldModalProps) {
  const [fieldName, setFieldName] = useState('');
  const [coordinates, setCoordinates] = useState<FieldCoordinate[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  const handlePolygonDrawn = useCallback((coords: FieldCoordinate[]) => {
    setCoordinates(coords);
  }, []);

  const handleUseMyLocation = useCallback(() => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          toast.success('Location found! The map will center on your position.');
          setIsLocating(false);
        },
        (error) => {
          toast.error('Could not get your location. Please allow location access.');
          setIsLocating(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser.');
      setIsLocating(false);
    }
  }, []);

  const handleSave = useCallback(() => {
    if (!fieldName.trim()) {
      toast.error('Please enter a field name');
      return;
    }
    if (coordinates.length < 3) {
      toast.error('Please draw a field boundary on the map');
      return;
    }
    onSave(fieldName.trim(), coordinates);
    setFieldName('');
    setCoordinates([]);
    onClose();
  }, [fieldName, coordinates, onSave, onClose]);

  const handleClose = () => {
    setFieldName('');
    setCoordinates([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Add New Field
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
          {/* Form Section */}
          <div className="lg:w-72 xl:w-80 p-4 sm:p-6 border-b lg:border-b-0 lg:border-r space-y-4 overflow-y-auto flex-shrink-0 bg-background relative z-10">
            <div className="space-y-2">
              <Label htmlFor="fieldName">Field Name</Label>
              <Input
                id="fieldName"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="e.g., North Maize Plot"
              />
            </div>

            <div className="space-y-2">
              <Label>Location</Label>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleUseMyLocation}
                disabled={isLocating}
              >
                <Navigation className="w-4 h-4 mr-2" />
                {isLocating ? 'Getting location...' : 'Use My Location'}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <h4 className="text-sm font-medium mb-2">Instructions</h4>
              <p className="text-sm text-muted-foreground">
                Draw your field boundary on the map using the polygon tool.
              </p>
              <ol className="text-sm text-muted-foreground mt-2 space-y-1 list-decimal list-inside">
                <li>Click the polygon icon</li>
                <li>Click on the map to add points</li>
                <li>Click the first point to close</li>
              </ol>
            </div>

            {coordinates.length > 0 && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                  ✓ Field boundary drawn ({coordinates.length} points)
                </p>
              </div>
            )}
          </div>

          {/* Map Section */}
          <div className="flex-1 relative min-h-[250px] sm:min-h-[300px] lg:min-h-0">
            <FieldMap
              fields={[]}
              hoveredFieldId={null}
              selectedField={null}
              onFieldClick={() => {}}
              isDrawingMode={true}
              onPolygonDrawn={handlePolygonDrawn}
              drawnCoordinates={coordinates}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-3 flex-shrink-0 bg-background relative z-10">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!fieldName.trim() || coordinates.length < 3}>
            Save Field
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
