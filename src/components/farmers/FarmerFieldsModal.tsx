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
import { ScrollArea } from '@/components/ui/scroll-area';

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
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] h-[90vh] sm:h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
        {/* Header - Collapsible on mobile */}
        <DialogHeader className="p-3 sm:p-4 md:p-6 pb-2 sm:pb-3 md:pb-4 border-b flex-shrink-0">
          <DialogTitle className="text-base sm:text-lg md:text-xl flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
            <span className="truncate">{farmer.name}'s Fields</span>
          </DialogTitle>
          
          {/* Info row - wraps on mobile */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate max-w-[100px] sm:max-w-none">{farmer.location}</span>
            </span>
            <span className="flex items-center gap-1">
              <Wheat className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="capitalize">{farmer.cropType}</span> • {farmer.farmSize} ha
            </span>
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              {fields.length} field{fields.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {/* Health Summary - hidden on very small screens */}
          {fields.length > 0 && (
            <div className="hidden xs:flex items-center gap-2 sm:gap-3 mt-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Health:</span>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {healthyCounts > 0 && (
                  <span className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500"></span>
                    <span className="text-green-600 font-medium">{healthyCounts}</span>
                  </span>
                )}
                {moderateCounts > 0 && (
                  <span className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500"></span>
                    <span className="text-yellow-600 font-medium">{moderateCounts}</span>
                  </span>
                )}
                {unhealthyCounts > 0 && (
                  <span className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500"></span>
                    <span className="text-red-600 font-medium">{unhealthyCounts}</span>
                  </span>
                )}
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Tabs for Map and Scanned Crops */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="px-3 sm:px-4 md:px-6 pt-2 sm:pt-3 border-b flex-shrink-0">
            <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
              <TabsTrigger value="map" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <Map className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Field</span> Map
              </TabsTrigger>
              <TabsTrigger value="scans" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
                <ScanLine className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Scanned</span> Crops
                {cropScans.length > 0 && (
                  <span className="ml-1 bg-primary/10 text-primary text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full">
                    {cropScans.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Map Tab Content */}
          <TabsContent value="map" className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0 m-0 data-[state=inactive]:hidden">
            {/* Map Section */}
            <div className="flex-1 relative min-h-[200px] sm:min-h-[250px] md:min-h-0">
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
                <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs text-muted-foreground shadow-md border border-border z-[500]">
                  Tap a field to see details
                </div>
              )}
            </div>

            {/* Fields List - Scrollable */}
            <div className="md:w-72 lg:w-80 border-t md:border-t-0 md:border-l bg-background flex flex-col max-h-[40vh] md:max-h-none overflow-hidden">
              <div className="p-3 sm:p-4 pb-2 flex-shrink-0">
                <h3 className="font-semibold text-sm sm:text-base">Fields ({fields.length})</h3>
              </div>
              
              <ScrollArea className="flex-1 px-3 sm:px-4 pb-3 sm:pb-4">
                {fields.length === 0 ? (
                  <div className="text-center py-6 sm:py-8">
                    <Layers className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground/30 mb-2 sm:mb-3" />
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      No fields registered
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {fields.map((field) => (
                      <div
                        key={field.id}
                        className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                          hoveredFieldId === field.id || selectedField?.id === field.id
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-border hover:border-primary/50 active:border-primary/50'
                        }`}
                        onMouseEnter={() => setHoveredFieldId(field.id)}
                        onMouseLeave={() => setHoveredFieldId(null)}
                        onClick={() => setSelectedField(field)}
                      >
                        <div className="flex items-start justify-between mb-1 sm:mb-2 gap-2">
                          <h4 className="font-medium text-xs sm:text-sm leading-tight">{field.name}</h4>
                          <FieldStatusBadge status={field.healthStatus} />
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground space-y-0.5 sm:space-y-1">
                          <p>{field.area} ha • {field.cropType || 'Mixed'}</p>
                          <p className="flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            {field.lastUpdated}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Scanned Crops Tab Content */}
          <TabsContent value="scans" className="flex-1 overflow-hidden m-0 data-[state=inactive]:hidden">
            <ScannedCropsSection scans={cropScans} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
