export type HealthStatus = 'healthy' | 'moderate' | 'unhealthy';

export interface FieldCoordinate {
  lat: number;
  lng: number;
}

export interface CropScan {
  id: string;
  fieldId: string;
  fieldName: string;
  scanDate: string;
  imageUrl: string;
  healthStatus: HealthStatus;
  ndviScore: number; // 0-1 scale
  moistureLevel: 'low' | 'optimal' | 'high';
  pestDetection: boolean;
  diseaseDetection: string | null;
  recommendations: string[];
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
