// Producer data interface based on the CSV structure
export interface Producer {
  employeeId: string;
  fullName: string;
  region: string;
  office: string;
  lob: string; // Line of Business
  vertical: string;
  directManager: string;
  tenureHire: number;
  tenureSquared: number;
  tenureGraduation: number;
  algebra1: number;
  currentSalary: string;
  graduationSalary: string;
  currentTotalBV: string;
  sgCurrentBV: string;
  sgCurrentBVRatio: string;
  bvAtGraduation: string;
  ltmNB: string;
  sgnb: string;
  sgnbRatio: string;
  prospectInRange: number;
  medianWinSizeDuringSelect: string;
  firstAppointmentsPostGrad: number;
  secondAppointmentsPostGrad: number;
  rideAlongsPostGrad: number;
  pyRideAlongsPerYear: number;
  advanceRatio: string;
  closingRatio: string;
  numberOfWins: number;
  numberOfWinsSinceGraduation: number;
  winsInVerticalPostGrad: number;
  winsInVertical: number;
  medianWinSize: string;
  dVertical: string;
  fappsLTM: number;
  fappsPYLTM: number;
  successScore: number;
  numberOfFlags: number;
  currentBVScore: number;
  ltmNBScore: number;
  prospectsScore: number;
  firstAppointmentsScore: number;
  secondAppointmentsScore: number;
  rideAlongsScore: number;
  advanceRatioScore: number;
  closingRatioScore: number;
  numberOfWinsScore: number;
  averageWinSizeScore: number;
  // Expected values at tenure
  expectedBookStartingSalaryRatio: number;
  expectedLtmNBStartingSalaryRatio: number;
  expectedProspects: number;
  expectedFirstAppointments: number;
  expectedSecondAppointments: number;
  expectedRideAlongs: number;
  expectedAdvanceRatio: number;
  expectedClosingRatio: number;
  expectedNumberOfWins: number;
  expectedMedianWinSize: string;
  // Weighting percentages
  bookWeighting: number;
  ltmNBWeighting: number;
  prospectsWeighting: number;
  firstAppointmentsWeighting: number;
  secondAppointmentsWeighting: number;
  rideAlongsWeighting: number;
  advanceRatioWeighting: number;
  closingRatioWeighting: number;
  numberOfWinsWeighting: number;
  medianWinSizeWeighting: number;
  // Poaching Risks fields
  splitWins: string;
  currentBaseSalaryRelativeToNB: string;
  currentBaseSalaryRelativeToBV: string;
  deltaLeadershipLTM: string;
  commutingDistance: string;
  moveFromPrimaryOffice: string;
  // Other Factors fields
  pipHistory: string;
  ccat: string;
  epp: string;
  illustrate: string;
  // Flag fields (Y/N values from CSV)
  partnersWhoPairUpFlag: string;
  pipFlag: string;
  ccatFlag: string;
  eppFlag: string;
  illustrateFlag: string;
  baseSalaryTooLowRelativeToBVFlag: string;
  baseSalaryTooLowRelativeToNBFlag: string;
}

// Summary interface for table display
export interface ProducerSummary {
  employeeId: string;
  producer: string;
  tenure: number;
  ltmNB: string;
  bookSize: string;
  numberOfWins: number;
  successScore: number;
  flags: number;
  region: string;
  lob: string;
}

// SharePoint data interface
export interface ProducerData {
  employeeId: string;
  name: string;
  region: string;
  successScore: number;
  // Add other relevant fields
}

// Component props interfaces
export interface SelectGradSuccessProps {
  title?: string;
}

export interface ProducerTableProps {
  producers: ProducerSummary[];
  onProducerSelect: (producerId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export interface ProducerDetailProps {
  producerId: string;
}

// Filter and sort interfaces
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface ColumnFilters {
  [key: string]: string;
}

// Connection method type
export type ConnectionMethod = 'none' | 'sharepoint' | 'manual' | 'csv';
