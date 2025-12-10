import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { FieldMap } from '@/components/fields/FieldMap';
import { FieldList } from '@/components/fields/FieldList';
import { AddFieldModal } from '@/components/fields/AddFieldModal';
import { FieldDetailsTooltip } from '@/components/fields/FieldDetailsTooltip';
import { mockFields } from '@/data/fieldsData';
import { Field, FieldCoordinate, HealthStatus } from '@/types/fields';
import { Plus, Map, List } from 'lucide-react';
import { toast } from 'sonner';

const healthStatuses: HealthStatus[] = ['healthy', 'moderate', 'unhealthy'];

export default function Fields() {
  const [fields, setFields] = useState<Field[]>(mockFields);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');

  const handleAddField = useCallback((name: string, coordinates: FieldCoordinate[]) => {
    const newField: Field = {
      id: `field-${Date.now()}`,
      name,
      coordinates,
      healthStatus: healthStatuses[Math.floor(Math.random() * healthStatuses.length)],
      lastUpdated: new Date().toISOString(),
      area: Math.round(Math.random() * 20 * 10) / 10 + 2,
    };
    setFields((prev) => [...prev, newField]);
    toast.success(`Field "${name}" has been added successfully`);
  }, []);

  const handleFieldClick = useCallback((field: Field) => {
    setSelectedField(field);
  }, []);

  const handleCloseTooltip = useCallback(() => {
    setSelectedField(null);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Fields</h1>
          <p className="text-muted-foreground">
            Manage your farm fields and monitor crop health
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="hidden md:flex items-center bg-muted rounded-lg p-1">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Map className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Field
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        {viewMode === 'split' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Section */}
            <div className="lg:col-span-2 bg-card rounded-xl shadow-lg border overflow-hidden relative">
              <FieldMap
                fields={fields}
                hoveredFieldId={hoveredFieldId}
                selectedField={selectedField}
                onFieldClick={handleFieldClick}
              />
              
              {/* Field Details Tooltip */}
              {selectedField && (
                <div className="absolute top-4 left-4 z-[1000]">
                  <FieldDetailsTooltip
                    field={selectedField}
                    onClose={handleCloseTooltip}
                  />
                </div>
              )}

              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border p-3 z-[1000]">
                <p className="text-xs font-medium text-foreground mb-2">Crop Health</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-xs text-muted-foreground">Healthy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-xs text-muted-foreground">Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-xs text-muted-foreground">Unhealthy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fields List */}
            <div className="bg-card rounded-xl shadow-lg border p-4 overflow-hidden flex flex-col">
              <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <List className="w-4 h-4" />
                Fields ({fields.length})
              </h2>
              <div className="flex-1 min-h-0">
                <FieldList
                  fields={fields}
                  hoveredFieldId={hoveredFieldId}
                  onHover={setHoveredFieldId}
                  onViewDetails={handleFieldClick}
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'map' && (
          <div className="h-full bg-card rounded-xl shadow-lg border overflow-hidden relative">
            <FieldMap
              fields={fields}
              hoveredFieldId={hoveredFieldId}
              selectedField={selectedField}
              onFieldClick={handleFieldClick}
            />
            
            {selectedField && (
              <div className="absolute top-4 left-4 z-[1000]">
                <FieldDetailsTooltip
                  field={selectedField}
                  onClose={handleCloseTooltip}
                />
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg shadow-lg border p-3 z-[1000]">
              <p className="text-xs font-medium text-foreground mb-2">Crop Health</p>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs text-muted-foreground">Healthy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-xs text-muted-foreground">Moderate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs text-muted-foreground">Unhealthy</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'list' && (
          <div className="h-full bg-card rounded-xl shadow-lg border p-6 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="cursor-pointer"
                  onClick={() => handleFieldClick(field)}
                >
                  <div className="bg-muted/50 rounded-xl p-4 border hover:border-primary transition-colors">
                    <FieldList
                      fields={[field]}
                      hoveredFieldId={hoveredFieldId}
                      onHover={setHoveredFieldId}
                      onViewDetails={handleFieldClick}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Field Modal */}
      <AddFieldModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddField}
      />
    </div>
  );
}
