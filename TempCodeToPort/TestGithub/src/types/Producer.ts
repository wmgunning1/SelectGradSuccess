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
  currentBookSizeExpected: string;
  ltmNBExpected: number;
  prospectsExpected: number;
  firstAppointmentsExpected: number;
  secondAppointmentsExpected: number;
  rideAlongsExpected: number;
  advanceRatioExpected: number;
  closingRatioExpected: number;
  numberOfWinsExpected: number;
  averageWinSizeExpected: string;
  numberSplitWins: number;
  partnersWhoPairUpFlag: string;
  pipHistory: number;
  pipFlag: string;
  ccat: string;
  ccatFlag: string;
  epp: string;
  eppFlag: string;
  illustrate: string;
  illustrateFlag: string;
  sgbvToExpectedBV: string;
  baseSalaryTooLowRelativeToBVFlag: string;
  sgnbToExpectedNB: string;
  baseSalaryTooLowRelativeToNBFlag: string;
  percentile: number;
}

// Simplified interface for table display
export interface ProducerSummary {
  employeeId: string;
  surrogateKey: string; // Added surrogate key for URL routing
  name: string;
  region: string;
  office: string;
  vertical: string;
  manager: string;
  successScore: number;
  currentBV: string;
  ltmNB: string;
  percentile: number;
}
