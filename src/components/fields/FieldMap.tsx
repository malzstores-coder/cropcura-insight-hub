import { useEffect, useRef, useCallback } from 'react';
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
  drawnCoordinates,
}: FieldMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonsRef = useRef<Map<string, L.Polygon>>(new Map());
  const drawnLayerRef = useRef<L.FeatureGroup | null>(null);
  const drawControlRef = useRef<L.Control.Draw | null>(null);

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

    // Add field polygons
    fields.forEach((field) => {
      const latLngs = field.coordinates.map((c) => [c.lat, c.lng] as [number, number]);
      const color = getHealthStatusColor(field.healthStatus);
      const isHovered = hoveredFieldId === field.id;
      const isSelected = selectedField?.id === field.id;

      const polygon = L.polygon(latLngs, {
        color: isHovered || isSelected ? '#3b82f6' : color,
        fillColor: color,
        fillOpacity: isHovered || isSelected ? 0.6 : 0.4,
        weight: isHovered || isSelected ? 3 : 2,
      }).addTo(map);

      polygon.on('click', () => onFieldClick(field));

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
        color: isHovered || isSelected ? '#3b82f6' : color,
        fillOpacity: isHovered || isSelected ? 0.6 : 0.4,
        weight: isHovered || isSelected ? 3 : 2,
      });

      if (isHovered && !isSelected) {
        const bounds = polygon.getBounds();
        map.panTo(bounds.getCenter());
      }
    });
  }, [hoveredFieldId, selectedField, fields, isDrawingMode]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" />
  );
}
