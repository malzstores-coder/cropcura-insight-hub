import { Field, HealthStatus } from '@/types/fields';

const healthStatuses: HealthStatus[] = ['healthy', 'moderate', 'unhealthy'];

export const mockFields: Field[] = [
  {
    id: 'field-1',
    name: 'North Maize Plot',
    coordinates: [
      { lat: -1.2821, lng: 36.8219 },
      { lat: -1.2801, lng: 36.8259 },
      { lat: -1.2841, lng: 36.8279 },
      { lat: -1.2861, lng: 36.8239 },
    ],
    healthStatus: 'healthy',
    lastUpdated: '2024-01-15T10:30:00Z',
    area: 12.5,
    cropType: 'Maize',
  },
  {
    id: 'field-2',
    name: 'River Valley Rice',
    coordinates: [
      { lat: -1.2751, lng: 36.8319 },
      { lat: -1.2731, lng: 36.8359 },
      { lat: -1.2771, lng: 36.8379 },
      { lat: -1.2791, lng: 36.8339 },
    ],
    healthStatus: 'moderate',
    lastUpdated: '2024-01-14T14:20:00Z',
    area: 8.3,
    cropType: 'Rice',
  },
  {
    id: 'field-3',
    name: 'Highland Wheat Field',
    coordinates: [
      { lat: -1.2891, lng: 36.8119 },
      { lat: -1.2871, lng: 36.8159 },
      { lat: -1.2911, lng: 36.8179 },
      { lat: -1.2931, lng: 36.8139 },
    ],
    healthStatus: 'unhealthy',
    lastUpdated: '2024-01-13T09:15:00Z',
    area: 15.7,
    cropType: 'Wheat',
  },
  {
    id: 'field-4',
    name: 'Eastern Cassava Farm',
    coordinates: [
      { lat: -1.2681, lng: 36.8419 },
      { lat: -1.2661, lng: 36.8459 },
      { lat: -1.2701, lng: 36.8479 },
      { lat: -1.2721, lng: 36.8439 },
    ],
    healthStatus: 'healthy',
    lastUpdated: '2024-01-15T08:45:00Z',
    area: 6.2,
    cropType: 'Cassava',
  },
  {
    id: 'field-5',
    name: 'South Soybean Patch',
    coordinates: [
      { lat: -1.2951, lng: 36.8019 },
      { lat: -1.2931, lng: 36.8059 },
      { lat: -1.2971, lng: 36.8079 },
      { lat: -1.2991, lng: 36.8039 },
    ],
    healthStatus: 'moderate',
    lastUpdated: '2024-01-12T16:30:00Z',
    area: 9.8,
    cropType: 'Soybeans',
  },
];

export const getHealthStatusColor = (status: HealthStatus): string => {
  switch (status) {
    case 'healthy':
      return '#22c55e'; // green-500
    case 'moderate':
      return '#eab308'; // yellow-500
    case 'unhealthy':
      return '#ef4444'; // red-500
    default:
      return '#6b7280'; // gray-500
  }
};

export const getHealthStatusBgClass = (status: HealthStatus): string => {
  switch (status) {
    case 'healthy':
      return 'bg-green-500/20 text-green-700 border-green-500/30';
    case 'moderate':
      return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
    case 'unhealthy':
      return 'bg-red-500/20 text-red-700 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
  }
};
