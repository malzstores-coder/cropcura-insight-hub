import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FieldMap } from '@/components/fields/FieldMap';
import { FieldStatusBadge } from '@/components/fields/FieldStatusBadge';
import { ScannedCropsSection } from './ScannedCropsSection';
import { getCropScansForFarmer } from '@/data/cropScansData';
import { Farmer } from '@/types';
import { Field } from '@/types/fields';
import { MapPin, Wheat, Calendar, Layers, Map, ScanLine } from 'lucide-react';
import { useState } from 'react';

interface FarmerFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: Farmer | null;
  fields: Field[];
}

export function FarmerFieldsModal({ isOpen, onClose, farmer, fields }: FarmerFieldsModalProps) {
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [activeTab, setActiveTab] = useState<string>('map');

  if (!farmer) return null;

  // Get crop scans for this farmer
  const cropScans = getCropScansForFarmer(farmer.id);

  // Count fields by health status
  const healthyCounts = fields.filter(f => f.healthStatus === 'healthy').length;
  const moderateCounts = fields.filter(f => f.healthStatus === 'moderate').length;
  const unhealthyCounts = fields.filter(f => f.healthStatus === 'unhealthy').length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-6 pb-3 sm:pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-lg sm:text-xl flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {farmer.name}'s Fields
          </DialogTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {farmer.location}
            </span>
            <span className="flex items-center gap-1">
              <Wheat className="w-4 h-4" />
              {farmer.cropType} • {farmer.farmSize} ha
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-4 h-4" />
              {fields.length} field{fields.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Health Summary */}
          {fields.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-muted-foreground">Health Summary:</span>
              <div className="flex items-center gap-3">
                {healthyCounts > 0 && (
                  <span className="flex items-center gap-1 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-green-600 font-medium">{healthyCounts} Healthy</span>
                  </span>
                )}
                {moderateCounts > 0 && (
                  <span className="flex items-center gap-1 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="text-yellow-600 font-medium">{moderateCounts} Moderate</span>
                  </span>
                )}
                {unhealthyCounts > 0 && (
                  <span className="flex items-center gap-1 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="text-red-600 font-medium">{unhealthyCounts} Unhealthy</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Tabs for Map and Scanned Crops */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 sm:px-6 pt-3 border-b flex-shrink-0">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map className="w-4 h-4" />
                Field Map
              </TabsTrigger>
              <TabsTrigger value="scans" className="flex items-center gap-2">
                <ScanLine className="w-4 h-4" />
                Scanned Crops
                {cropScans.length > 0 && (
                  <span className="ml-1 bg-primary/10 text-primary text-xs px-1.5 py-0.5 rounded-full">
                    {cropScans.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Map Tab Content */}
          <TabsContent value="map" className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 m-0">
            {/* Map Section */}
            <div className="flex-1 relative min-h-[300px] lg:min-h-0">
              <FieldMap
                fields={fields}
                hoveredFieldId={hoveredFieldId}
                selectedField={selectedField}
                onFieldClick={(field) => setSelectedField(field)}
                isDrawingMode={false}
                onPolygonDrawn={() => {}}
                drawnCoordinates={[]}
              />
              
              {/* Click instruction */}
              {fields.length > 0 && !selectedField && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-muted-foreground shadow-md border border-border z-[500]">
                  Click on a field to see health details
                </div>
              )}
            </div>

            {/* Fields List */}
            <div className="lg:w-80 p-4 border-t lg:border-t-0 lg:border-l overflow-y-auto bg-background">
              <h3 className="font-semibold mb-4">Fields ({fields.length})</h3>
              
              {fields.length === 0 ? (
                <div className="text-center py-8">
                  <Layers className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No fields registered for this farmer
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        hoveredFieldId === field.id || selectedField?.id === field.id
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onMouseEnter={() => setHoveredFieldId(field.id)}
                      onMouseLeave={() => setHoveredFieldId(null)}
                      onClick={() => setSelectedField(field)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{field.name}</h4>
                        <FieldStatusBadge status={field.healthStatus} />
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>{field.area} hectares • {field.cropType || 'Mixed crops'}</p>
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Updated {field.lastUpdated}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Scanned Crops Tab Content */}
          <TabsContent value="scans" className="flex-1 overflow-hidden m-0">
            <ScannedCropsSection scans={cropScans} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
