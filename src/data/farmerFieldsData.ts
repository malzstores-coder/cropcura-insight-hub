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
      lastUpdated: 'Jan 12, 2024',
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
      lastUpdated: 'Jan 10, 2024',
      area: 1.8,
      cropType: 'Rice',
    },
    {
      id: 'field-1c',
      name: 'Eastern Cassava Farm',
      coordinates: [
        { lat: -1.2941, lng: 36.8279 },
        { lat: -1.2951, lng: 36.8329 },
        { lat: -1.3001, lng: 36.8319 },
        { lat: -1.2991, lng: 36.8269 },
      ],
      healthStatus: 'healthy',
      lastUpdated: 'Jan 15, 2024',
      area: 6.2,
      cropType: 'Cassava',
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
      lastUpdated: 'Jan 14, 2024',
      area: 3.2,
      cropType: 'Wheat',
    },
    {
      id: 'field-3b',
      name: 'Western Maize Plot',
      coordinates: [
        { lat: 0.5103, lng: 35.2658 },
        { lat: 0.5113, lng: 35.2688 },
        { lat: 0.5143, lng: 35.2678 },
        { lat: 0.5133, lng: 35.2648 },
      ],
      healthStatus: 'moderate',
      lastUpdated: 'Jan 11, 2024',
      area: 2.8,
      cropType: 'Maize',
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
      lastUpdated: 'Jan 16, 2024',
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
      lastUpdated: 'Jan 13, 2024',
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
      lastUpdated: 'Jan 12, 2024',
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
      lastUpdated: 'Jan 15, 2024',
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
      lastUpdated: 'Jan 10, 2024',
      area: 2.2,
      cropType: 'Rice',
    },
  ],
  'FRM006': [
    {
      id: 'field-9',
      name: 'Central Maize Field',
      coordinates: [
        { lat: -1.1532, lng: 36.9532 },
        { lat: -1.1542, lng: 36.9562 },
        { lat: -1.1572, lng: 36.9552 },
        { lat: -1.1562, lng: 36.9522 },
      ],
      healthStatus: 'healthy',
      lastUpdated: 'Jan 14, 2024',
      area: 3.5,
      cropType: 'Maize',
    },
  ],
  'FRM007': [
    {
      id: 'field-10',
      name: 'Wheat Valley',
      coordinates: [
        { lat: 0.4243, lng: 35.1798 },
        { lat: 0.4253, lng: 35.1828 },
        { lat: 0.4283, lng: 35.1818 },
        { lat: 0.4273, lng: 35.1788 },
      ],
      healthStatus: 'moderate',
      lastUpdated: 'Jan 13, 2024',
      area: 4.1,
      cropType: 'Wheat',
    },
    {
      id: 'field-10b',
      name: 'Highland Wheat',
      coordinates: [
        { lat: 0.4303, lng: 35.1838 },
        { lat: 0.4313, lng: 35.1868 },
        { lat: 0.4343, lng: 35.1858 },
        { lat: 0.4333, lng: 35.1828 },
      ],
      healthStatus: 'healthy',
      lastUpdated: 'Jan 15, 2024',
      area: 2.9,
      cropType: 'Wheat',
    },
  ],
  'FRM008': [
    {
      id: 'field-11',
      name: 'Riverside Rice',
      coordinates: [
        { lat: -0.2017, lng: 34.8680 },
        { lat: -0.2027, lng: 34.8710 },
        { lat: -0.2057, lng: 34.8700 },
        { lat: -0.2047, lng: 34.8670 },
      ],
      healthStatus: 'unhealthy',
      lastUpdated: 'Jan 16, 2024',
      area: 1.9,
      cropType: 'Rice',
    },
  ],
  'FRM009': [
    {
      id: 'field-12',
      name: 'Soybean Acres North',
      coordinates: [
        { lat: -1.2032, lng: 37.1232 },
        { lat: -1.2042, lng: 37.1262 },
        { lat: -1.2072, lng: 37.1252 },
        { lat: -1.2062, lng: 37.1222 },
      ],
      healthStatus: 'healthy',
      lastUpdated: 'Jan 14, 2024',
      area: 5.2,
      cropType: 'Soybeans',
    },
    {
      id: 'field-12b',
      name: 'Soybean Acres South',
      coordinates: [
        { lat: -1.2092, lng: 37.1242 },
        { lat: -1.2102, lng: 37.1272 },
        { lat: -1.2132, lng: 37.1262 },
        { lat: -1.2122, lng: 37.1232 },
      ],
      healthStatus: 'moderate',
      lastUpdated: 'Jan 12, 2024',
      area: 3.8,
      cropType: 'Soybeans',
    },
  ],
  'FRM010': [
    {
      id: 'field-13',
      name: 'Coastal Cassava',
      coordinates: [
        { lat: -4.1535, lng: 39.7082 },
        { lat: -4.1545, lng: 39.7112 },
        { lat: -4.1575, lng: 39.7102 },
        { lat: -4.1565, lng: 39.7072 },
      ],
      healthStatus: 'healthy',
      lastUpdated: 'Jan 15, 2024',
      area: 2.4,
      cropType: 'Cassava',
    },
  ],
  // Map fields to the demo farmer ID that starts with Amara Okonkwo (FRM-1001)
  'FRM-1001': [
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
      lastUpdated: 'Jan 12, 2024',
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
      lastUpdated: 'Jan 10, 2024',
      area: 1.8,
      cropType: 'Rice',
    },
    {
      id: 'field-1c',
      name: 'Eastern Cassava Farm',
      coordinates: [
        { lat: -1.2941, lng: 36.8279 },
        { lat: -1.2951, lng: 36.8329 },
        { lat: -1.3001, lng: 36.8319 },
        { lat: -1.2991, lng: 36.8269 },
      ],
      healthStatus: 'healthy',
      lastUpdated: 'Jan 15, 2024',
      area: 6.2,
      cropType: 'Cassava',
    },
  ],
};

// Get fields for a farmer, with fallback empty array
export function getFieldsForFarmer(farmerId: string): Field[] {
  return farmerFieldsMap[farmerId] || [];
}
