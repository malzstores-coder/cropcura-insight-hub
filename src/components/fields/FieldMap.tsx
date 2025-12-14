import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { Field, FieldCoordinate } from '@/types/fields';
import { getHealthStatusColor } from '@/data/fieldsData';

interface FieldMapProps {
  fields: Field[];
  hoveredFieldId: string | null;
  selectedField: Field | null;
  onFieldClick: (field: Field) => void;
  isDrawingMode?: boolean;
  onPolygonDrawn?: (coordinates: FieldCoordinate[]) => void;
  drawnCoordinates?: FieldCoordinate[];
}

export function FieldMap({
  fields,
  hoveredFieldId,
  selectedField,
  onFieldClick,
  isDrawingMode = false,
  onPolygonDrawn,
}: FieldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const drawnLayerRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const popupRef = useRef<L.Popup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [-1.2821, 36.8219],
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    }).addTo(map);

    // Add labels layer on top
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle drawing mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (isDrawingMode) {
      // Create drawn items layer
      if (!drawnLayerRef.current) {
        drawnLayerRef.current = new L.FeatureGroup();
        map.addLayer(drawnLayerRef.current);
      }

      // Add draw control
      if (!drawControlRef.current) {
        drawControlRef.current = new L.Control.Draw({
          position: 'topright',
          draw: {
            polygon: {
              allowIntersection: false,
              showArea: true,
              shapeOptions: {
                color: '#3b82f6',
                fillColor: '#3b82f6',
                fillOpacity: 0.3,
              },
            },
            polyline: false,
            circle: false,
            rectangle: false,
            marker: false,
            circlemarker: false,
          },
          edit: {
            featureGroup: drawnLayerRef.current,
            remove: true,
          },
        });
        map.addControl(drawControlRef.current);
      }

      // Handle draw events
      const onCreated = (e: L.LeafletEvent) => {
        const layer = (e as L.DrawEvents.Created).layer as L.Polygon;
        drawnLayerRef.current?.clearLayers();
        drawnLayerRef.current?.addLayer(layer);

        const latLngs = layer.getLatLngs()[0] as L.LatLng[];
        const coordinates: FieldCoordinate[] = latLngs.map((ll) => ({
          lat: ll.lat,
          lng: ll.lng,
        }));
        onPolygonDrawn?.(coordinates);
      };

      const onDeleted = () => {
        onPolygonDrawn?.([]);
      };

      map.on(L.Draw.Event.CREATED, onCreated);
      map.on(L.Draw.Event.DELETED, onDeleted);

      return () => {
        map.off(L.Draw.Event.CREATED, onCreated);
        map.off(L.Draw.Event.DELETED, onDeleted);
      };
    } else {
      // Remove draw control when not in drawing mode
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
      if (drawnLayerRef.current) {
        drawnLayerRef.current.clearLayers();
      }
    }
  }, [isDrawingMode, onPolygonDrawn]);

  // Render field polygons
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || isDrawingMode) return;

    // Clear existing polygons
    polygonsRef.current.forEach((polygon) => polygon.remove());
    polygonsRef.current.clear();

    // Close any existing popup
    if (popupRef.current) {
      map.closePopup(popupRef.current);
    }

    // Add field polygons
    fields.forEach((field) => {
      const latLngs = field.coordinates.map((c) => [c.lat, c.lng] as [number, number]);
      const color = getHealthStatusColor(field.healthStatus);
      const isHovered = hoveredFieldId === field.id;
      const isSelected = selectedField?.id === field.id;

      const polygon = L.polygon(latLngs, {
        color: isHovered || isSelected ? '#ffffff' : color,
        fillColor: color,
        fillOpacity: isHovered || isSelected ? 0.7 : 0.5,
        weight: isHovered || isSelected ? 4 : 2,
      }).addTo(map);

      // Create popup content with health info
      const getHealthLabel = (status: string) => {
        switch (status) {
          case 'healthy': return '<span style="color: #22c55e; font-weight: bold;">● Healthy</span>';
          case 'moderate': return '<span style="color: #eab308; font-weight: bold;">● Moderate</span>';
          case 'unhealthy': return '<span style="color: #ef4444; font-weight: bold;">● Unhealthy</span>';
          default: return status;
        }
      };

      const popupContent = `
        <div style="min-width: 180px; font-family: system-ui, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #1f2937;">${field.name}</h3>
          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #6b7280;">Crop Health:</span>
              ${getHealthLabel(field.healthStatus)}
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280;">Area:</span>
              <span style="font-weight: 500;">${field.area} ha</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280;">Crop:</span>
              <span style="font-weight: 500;">${field.cropType || 'Mixed'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #6b7280;">Updated:</span>
              <span style="font-weight: 500;">${field.lastUpdated}</span>
            </div>
          </div>
          <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
            <div style="font-size: 10px; color: #9ca3af; text-transform: uppercase; margin-bottom: 4px;">Legend</div>
            <div style="display: flex; gap: 8px; font-size: 10px;">
              <span style="color: #22c55e;">● Healthy</span>
              <span style="color: #eab308;">● Moderate</span>
              <span style="color: #ef4444;">● Unhealthy</span>
            </div>
          </div>
        </div>
      `;

      polygon.bindPopup(popupContent, {
        maxWidth: 250,
        className: 'field-health-popup',
      });

      polygon.on('click', () => {
        onFieldClick(field);
        polygon.openPopup();
      });

      polygonsRef.current.set(field.id, polygon);
    });

    // Fit bounds if there are fields
    if (fields.length > 0 && !hoveredFieldId && !selectedField) {
      const allCoords = fields.flatMap((f) =>
        f.coordinates.map((c) => [c.lat, c.lng] as [number, number])
      );
      if (allCoords.length > 0) {
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [fields, hoveredFieldId, selectedField, isDrawingMode, onFieldClick]);

  // Handle hover highlighting
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || isDrawingMode) return;

    polygonsRef.current.forEach((polygon, fieldId) => {
      const field = fields.find((f) => f.id === fieldId);
      if (!field) return;

      const color = getHealthStatusColor(field.healthStatus);
      const isHovered = hoveredFieldId === fieldId;
      const isSelected = selectedField?.id === fieldId;

      polygon.setStyle({
        color: isHovered || isSelected ? '#ffffff' : color,
        fillOpacity: isHovered || isSelected ? 0.7 : 0.5,
        weight: isHovered || isSelected ? 4 : 2,
      });

      if (isHovered && !isSelected) {
        const bounds = polygon.getBounds();
        map.panTo(bounds.getCenter());
      }

      // Open popup for selected field
      if (isSelected) {
        polygon.openPopup();
      }
    });
  }, [hoveredFieldId, selectedField, fields, isDrawingMode]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
      
      {/* Map Legend */}
      {!isDrawingMode && fields.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border z-[500]">
          <p className="text-xs font-semibold mb-2 text-foreground">Crop Health</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="text-foreground">Healthy</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              <span className="text-foreground">Moderate</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span className="text-foreground">Unhealthy</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}