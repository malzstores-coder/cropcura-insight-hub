import { Field } from '@/types/fields';

// Generate fields for farmers - using farmer IDs to link them
export const farmerFieldsMap: Record<string, Field[]> = {
  'FRM001': [
    {
      id: 'field-1',
      name: 'Main Maize Plot',
      coordinates: [
        { lat: -1.2821, lng: 36.8219 },
        { lat: -1.2831, lng: 36.8249 },
        { lat: -1.2861, lng: 36.8239 },
        { lat: -1.2851, lng: 36.8209 },
      ],
      healthStatus: 'healthy',
      lastUpdated: '2 days ago',
      area: 2.5,
      cropType: 'Maize',
    },
    {
      id: 'field-2',
      name: 'South Rice Field',
      coordinates: [
        { lat: -1.2881, lng: 36.8229 },
        { lat: -1.2891, lng: 36.8259 },
        { lat: -1.2921, lng: 36.8249 },
        { lat: -1.2911, lng: 36.8219 },
      ],
      healthStatus: 'moderate',
      lastUpdated: '1 week ago',
      area: 1.8,
      cropType: 'Rice',
    },
  ],
  'FRM002': [
    {
      id: 'field-3',
      name: 'Northern Wheat Section',
      coordinates: [
        { lat: 0.5143, lng: 35.2698 },
        { lat: 0.5153, lng: 35.2728 },
        { lat: 0.5183, lng: 35.2718 },
        { lat: 0.5173, lng: 35.2688 },
      ],
      healthStatus: 'healthy',
      lastUpdated: '3 days ago',
      area: 3.2,
      cropType: 'Wheat',
    },
  ],
  'FRM003': [
    {
      id: 'field-4',
      name: 'Cassava Field A',
      coordinates: [
        { lat: -0.0917, lng: 34.7680 },
        { lat: -0.0927, lng: 34.7710 },
        { lat: -0.0957, lng: 34.7700 },
        { lat: -0.0947, lng: 34.7670 },
      ],
      healthStatus: 'unhealthy',
      lastUpdated: '1 day ago',
      area: 1.5,
      cropType: 'Cassava',
    },
    {
      id: 'field-5',
      name: 'Cassava Field B',
      coordinates: [
        { lat: -0.0977, lng: 34.7690 },
        { lat: -0.0987, lng: 34.7720 },
        { lat: -0.1017, lng: 34.7710 },
        { lat: -0.1007, lng: 34.7680 },
      ],
      healthStatus: 'moderate',
      lastUpdated: '4 days ago',
      area: 2.0,
      cropType: 'Cassava',
    },
  ],
  'FRM004': [
    {
      id: 'field-6',
      name: 'Soybean Plot',
      coordinates: [
        { lat: -1.0432, lng: 37.0732 },
        { lat: -1.0442, lng: 37.0762 },
        { lat: -1.0472, lng: 37.0752 },
        { lat: -1.0462, lng: 37.0722 },
      ],
      healthStatus: 'healthy',
      lastUpdated: '5 days ago',
      area: 4.0,
      cropType: 'Soybeans',
    },
  ],
  'FRM005': [
    {
      id: 'field-7',
      name: 'Rice Paddy East',
      coordinates: [
        { lat: -4.0435, lng: 39.6682 },
        { lat: -4.0445, lng: 39.6712 },
        { lat: -4.0475, lng: 39.6702 },
        { lat: -4.0465, lng: 39.6672 },
      ],
      healthStatus: 'healthy',
      lastUpdated: '2 days ago',
      area: 2.8,
      cropType: 'Rice',
    },
    {
      id: 'field-8',
      name: 'Rice Paddy West',
      coordinates: [
        { lat: -4.0495, lng: 39.6642 },
        { lat: -4.0505, lng: 39.6672 },
        { lat: -4.0535, lng: 39.6662 },
        { lat: -4.0525, lng: 39.6632 },
      ],
      healthStatus: 'moderate',
      lastUpdated: '1 week ago',
      area: 2.2,
      cropType: 'Rice',
    },
  ],
};

// Get fields for a farmer, with fallback empty array
export function getFieldsForFarmer(farmerId: string): Field[] {
  return farmerFieldsMap[farmerId] || [];
}
