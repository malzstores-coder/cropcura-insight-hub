export type HealthStatus = 'healthy' | 'moderate' | 'unhealthy';

export interface FieldCoordinate {
  lat: number;
  lng: number;
}

export interface Field {
  id: string;
  name: string;
  coordinates: FieldCoordinate[];
  healthStatus: HealthStatus;
  lastUpdated: string;
  snapshot?: string;
  area: number; // in hectares
  cropType?: string;
}

export interface FieldFormData {
  name: string;
  coordinates: FieldCoordinate[];
}
