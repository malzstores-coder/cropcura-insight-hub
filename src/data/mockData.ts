import { Farmer, LoanApplication, RiskAlert, ScoreTrend } from '@/types';

const firstNames = [
  'Amara', 'Kwame', 'Fatima', 'Oluwole', 'Ngozi', 'Ibrahim', 'Zainab', 'Kofi',
  'Aisha', 'Emmanuel', 'Blessing', 'Chidi', 'Halima', 'Yusuf', 'Grace', 'Samuel',
  'Mariama', 'Abdullahi', 'Comfort', 'Daniel', 'Hadiza', 'Joseph', 'Kemi', 'Hassan',
  'Adaeze', 'Mohammed', 'Florence', 'Usman', 'Rita', 'Musa', 'Chioma', 'Ahmed',
  'Patience', 'Suleiman', 'Victoria', 'Isa', 'Joy', 'Aliyu', 'Mercy', 'Tunde',
  'Funke', 'Bello', 'Sandra', 'Yakubu', 'Esther', 'Garba', 'Helen', 'Idris',
  'Lilian', 'Danladi'
];

const lastNames = [
  'Okonkwo', 'Mensah', 'Ibrahim', 'Adeyemi', 'Nwosu', 'Bello', 'Osei', 'Mohammed',
  'Eze', 'Abubakar', 'Olumide', 'Danjuma', 'Asante', 'Yusuf', 'Nnamdi', 'Hassan',
  'Boateng', 'Sani', 'Okoro', 'Musa', 'Adjei', 'Lawal', 'Chukwu', 'Abdullahi',
  'Owusu', 'Garba', 'Nnaji', 'Idris', 'Amponsah', 'Aliyu', 'Obi', 'Yakubu',
  'Koffi', 'Suleiman', 'Agu', 'Ismail', 'Darko', 'Balogun', 'Ugwu', 'Umar',
  'Asiedu', 'Afolabi', 'Nwachukwu', 'Nuhu', 'Gyasi', 'Olawale', 'Obiora', 'Shehu',
  'Appiah', 'Adebayo'
];

const locations = [
  { name: 'Kano', region: 'Northern Nigeria' },
  { name: 'Kaduna', region: 'Northern Nigeria' },
  { name: 'Lagos', region: 'Southwest Nigeria' },
  { name: 'Ibadan', region: 'Southwest Nigeria' },
  { name: 'Enugu', region: 'Southeast Nigeria' },
  { name: 'Port Harcourt', region: 'Niger Delta' },
  { name: 'Accra', region: 'Greater Accra, Ghana' },
  { name: 'Kumasi', region: 'Ashanti, Ghana' },
  { name: 'Tamale', region: 'Northern Ghana' },
  { name: 'Nairobi', region: 'Central Kenya' },
  { name: 'Mombasa', region: 'Coastal Kenya' },
  { name: 'Kisumu', region: 'Western Kenya' },
];

const cropTypes: Array<'maize' | 'rice' | 'cassava' | 'wheat' | 'soybeans'> = [
  'maize', 'rice', 'cassava', 'wheat', 'soybeans'
];

const loanPurposes = [
  'Seed purchase', 'Equipment upgrade', 'Irrigation system', 'Land expansion',
  'Fertilizer procurement', 'Storage facility', 'Transportation', 'Harvest labor'
];

function generateScore(): number {
  // Weighted to create realistic distribution
  const rand = Math.random();
  if (rand < 0.15) return Math.floor(Math.random() * 150) + 250; // 250-400 (15%)
  if (rand < 0.35) return Math.floor(Math.random() * 100) + 500; // 500-600 (20%)
  if (rand < 0.70) return Math.floor(Math.random() * 100) + 600; // 600-700 (35%)
  return Math.floor(Math.random() * 150) + 700; // 700-850 (30%)
}

function getRiskLevel(score: number): 'low' | 'medium' | 'high' {
  if (score >= 700) return 'low';
  if (score >= 600) return 'medium';
  return 'high';
}

function generateDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

export const farmers: Farmer[] = Array.from({ length: 55 }, (_, i) => {
  const score = generateScore();
  const location = locations[Math.floor(Math.random() * locations.length)];
  return {
    id: `FRM-${String(i + 1001).padStart(4, '0')}`,
    name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
    location: location.name,
    region: location.region,
    cropType: cropTypes[Math.floor(Math.random() * cropTypes.length)],
    cropCuraScore: score,
    riskLevel: getRiskLevel(score),
    farmSize: Math.floor(Math.random() * 45) + 5,
    registeredDate: generateDate(Math.floor(Math.random() * 365) + 30),
    lastAssessment: generateDate(Math.floor(Math.random() * 30)),
    phoneNumber: `+234${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    email: Math.random() > 0.4 ? `${firstNames[i % firstNames.length].toLowerCase()}@email.com` : undefined,
  };
});

export const loanApplications: LoanApplication[] = Array.from({ length: 42 }, (_, i) => {
  const farmer = farmers[Math.floor(Math.random() * farmers.length)];
  const statuses: Array<'pending' | 'approved' | 'declined' | 'under_review'> = 
    ['pending', 'approved', 'declined', 'under_review'];
  const status = i < 20 ? 'pending' : statuses[Math.floor(Math.random() * statuses.length)];
  
  return {
    id: `LN-${String(i + 2001).padStart(4, '0')}`,
    farmerId: farmer.id,
    farmerName: farmer.name,
    loanAmount: (Math.floor(Math.random() * 90) + 10) * 1000,
    cropType: farmer.cropType,
    cropCuraScore: farmer.cropCuraScore,
    status,
    applicationDate: generateDate(Math.floor(Math.random() * 60)),
    purpose: loanPurposes[Math.floor(Math.random() * loanPurposes.length)],
    term: [6, 12, 18, 24][Math.floor(Math.random() * 4)],
    interestRate: Math.floor(Math.random() * 8) + 8,
    farmSize: farmer.farmSize,
    location: farmer.location,
  };
});

export const riskAlerts: RiskAlert[] = [
  {
    id: 'ALT-001',
    farmerId: 'FRM-1003',
    farmerName: farmers[2].name,
    type: 'critical',
    message: 'CropCura Score dropped below 500. Immediate review required.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isResolved: false,
    scoreChange: -85,
    previousScore: 582,
    currentScore: 497,
  },
  {
    id: 'ALT-002',
    farmerId: 'FRM-1007',
    farmerName: farmers[6].name,
    type: 'critical',
    message: 'Crop failure detected via satellite imagery. High risk of default.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isResolved: false,
  },
  {
    id: 'ALT-003',
    farmerId: 'FRM-1012',
    farmerName: farmers[11].name,
    type: 'warning',
    message: 'Score trending downward for 3 consecutive assessments.',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    isResolved: false,
    scoreChange: -45,
    previousScore: 680,
    currentScore: 635,
  },
  {
    id: 'ALT-004',
    farmerId: 'FRM-1018',
    farmerName: farmers[17].name,
    type: 'warning',
    message: 'Unusual weather patterns detected in farming region.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    isResolved: false,
  },
  {
    id: 'ALT-005',
    farmerId: 'FRM-1025',
    farmerName: farmers[24].name,
    type: 'info',
    message: 'New crop cycle started. Score reassessment scheduled.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    isResolved: false,
  },
  {
    id: 'ALT-006',
    farmerId: 'FRM-1030',
    farmerName: farmers[29].name,
    type: 'info',
    message: 'Farm size expansion detected. Positive growth indicator.',
    timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    isResolved: true,
  },
  {
    id: 'ALT-007',
    farmerId: 'FRM-1008',
    farmerName: farmers[7].name,
    type: 'critical',
    message: 'Payment overdue by 30+ days. Collections review needed.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    isResolved: false,
  },
  {
    id: 'ALT-008',
    farmerId: 'FRM-1042',
    farmerName: farmers[41].name,
    type: 'warning',
    message: 'Irrigation system malfunction reported. Monitoring impact.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    isResolved: false,
  },
];

export const scoreTrends: ScoreTrend[] = [
  { month: 'Jul', averageScore: 658, highRisk: 22, lowRisk: 45 },
  { month: 'Aug', averageScore: 665, highRisk: 20, lowRisk: 48 },
  { month: 'Sep', averageScore: 672, highRisk: 19, lowRisk: 50 },
  { month: 'Oct', averageScore: 678, highRisk: 18, lowRisk: 52 },
  { month: 'Nov', averageScore: 682, highRisk: 17, lowRisk: 54 },
  { month: 'Dec', averageScore: 685, highRisk: 18, lowRisk: 53 },
];

export const riskDistribution = {
  low: farmers.filter(f => f.riskLevel === 'low').length,
  medium: farmers.filter(f => f.riskLevel === 'medium').length,
  high: farmers.filter(f => f.riskLevel === 'high').length,
};

export const dashboardMetrics = {
  totalFarmers: farmers.length,
  pendingApplications: loanApplications.filter(a => a.status === 'pending').length,
  averageScore: Math.round(farmers.reduce((acc, f) => acc + f.cropCuraScore, 0) / farmers.length),
  highRiskFarmers: farmers.filter(f => f.riskLevel === 'high').length,
};
