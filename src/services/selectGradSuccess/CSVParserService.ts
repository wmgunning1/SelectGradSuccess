import { Producer, ProducerSummary } from '@/pages/SelectGradSuccess/types';

// Surrogate key mapping service
export class SurrogateKeyService {
  private static instance: SurrogateKeyService;

  private employeeIdToSurrogateMap: Map<string, string> = new Map();

  private surrogateToEmployeeIdMap: Map<string, string> = new Map();

  private counter = 1;

  static getInstance(): SurrogateKeyService {
    if (!SurrogateKeyService.instance) {
      SurrogateKeyService.instance = new SurrogateKeyService();
    }
    return SurrogateKeyService.instance;
  }

  generateSurrogateKey(employeeId: string): string {
    if (this.employeeIdToSurrogateMap.has(employeeId)) {
      return this.employeeIdToSurrogateMap.get(employeeId) || '';
    }

    const surrogateKey = this.counter.toString();
    this.counter++;

    this.employeeIdToSurrogateMap.set(employeeId, surrogateKey);
    this.surrogateToEmployeeIdMap.set(surrogateKey, employeeId);

    return surrogateKey;
  }

  getEmployeeIdFromSurrogate(surrogateKey: string): string | undefined {
    return this.surrogateToEmployeeIdMap.get(surrogateKey);
  }

  getSurrogateFromEmployeeId(employeeId: string): string | undefined {
    return this.employeeIdToSurrogateMap.get(employeeId);
  }

  reset(): void {
    this.employeeIdToSurrogateMap.clear();
    this.surrogateToEmployeeIdMap.clear();
    this.counter = 1;
  }
}

export class CSVParserService {
  static parseCSVToProducers(csvContent: string): Producer[] {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',');
    const producers: Producer[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = this.parseCSVLine(line);
      if (values.length < headers.length) continue;

      const producer: Producer = {
        employeeId: values[0] || '',
        fullName: values[1] || '',
        region: values[2] || '',
        office: values[3] || '',
        lob: values[4] || '',
        vertical: values[5] || '',
        directManager: values[6] || '',
        tenureHire: parseFloat(values[7]) || 0,
        tenureSquared: parseFloat(values[8]) || 0,
        tenureGraduation: parseFloat(values[9]) || 0,
        algebra1: parseFloat(values[10]) || 0,
        currentSalary: values[11] || '',
        graduationSalary: values[12] || '',
        currentTotalBV: values[13] || '',
        sgCurrentBV: values[14] || '',
        sgCurrentBVRatio: values[15] || '',
        bvAtGraduation: values[16] || '',
        ltmNB: values[17] || '',
        sgnb: values[18] || '',
        sgnbRatio: values[19] || '',
        prospectInRange: parseFloat(values[20]) || 0,
        medianWinSizeDuringSelect: values[21] || '',
        firstAppointmentsPostGrad: parseFloat(values[22]) || 0,
        secondAppointmentsPostGrad: parseFloat(values[23]) || 0,
        rideAlongsPostGrad: parseFloat(values[24]) || 0,
        pyRideAlongsPerYear: parseFloat(values[25]) || 0,
        advanceRatio: values[26] || '',
        closingRatio: values[27] || '',
        numberOfWins: parseFloat(values[28]) || 0,
        numberOfWinsSinceGraduation: parseFloat(values[29]) || 0,
        winsInVerticalPostGrad: parseFloat(values[30]) || 0,
        winsInVertical: parseFloat(values[31]) || 0,
        medianWinSize: values[32] || '',
        dVertical: values[33] || '',
        fappsLTM: parseFloat(values[34]) || 0,
        fappsPYLTM: parseFloat(values[35]) || 0,
        successScore: parseFloat(values[36]) || 0,
        numberOfFlags: parseFloat(values[37]) || 0,
        currentBVScore: parseFloat(values[38]) || 0,
        ltmNBScore: parseFloat(values[39]) || 0,
        prospectsScore: parseFloat(values[40]) || 0,
        firstAppointmentsScore: parseFloat(values[41]) || 0,
        secondAppointmentsScore: parseFloat(values[42]) || 0,
        rideAlongsScore: parseFloat(values[43]) || 0,
        advanceRatioScore: parseFloat(values[44]) || 0,
        closingRatioScore: parseFloat(values[45]) || 0,
        numberOfWinsScore: parseFloat(values[46]) || 0,
        averageWinSizeScore: parseFloat(values[47]) || 0,
        // Expected values at tenure (using calculated values for now)
        expectedBookStartingSalaryRatio: 0.26, // Default expected ratio
        expectedLtmNBStartingSalaryRatio: 0.35, // Default expected ratio
        expectedProspects: 100, // Default expected prospects
        expectedFirstAppointments: 55, // Default expected first appointments
        expectedSecondAppointments: 18, // Default expected second appointments
        expectedRideAlongs: 27, // Default expected ride-alongs
        expectedAdvanceRatio: 0.33, // Default expected advance ratio (33%)
        expectedClosingRatio: 0.03, // Default expected closing ratio (3%)
        expectedNumberOfWins: 2, // Default expected number of wins
        expectedMedianWinSize: '$35,482', // Default expected median win size
        // Weighting percentages (from screenshot)
        bookWeighting: 10, // 10%
        ltmNBWeighting: 14, // 14%
        prospectsWeighting: 10, // 10%
        firstAppointmentsWeighting: 14, // 14%
        secondAppointmentsWeighting: 7, // 7%
        rideAlongsWeighting: 10, // 10%
        advanceRatioWeighting: 7, // 7%
        closingRatioWeighting: 14, // 14%
        numberOfWinsWeighting: 7, // 7%
        medianWinSizeWeighting: 7, // 7%
        // Poaching Risks fields (from CSV columns)
        splitWins: values[63] || '0', // Number Split Wins
        currentBaseSalaryRelativeToNB: values[75] || '0%', // SGNB to Expected NB
        currentBaseSalaryRelativeToBV: values[73] || '0%', // SGBV to Expected BV
        deltaLeadershipLTM: 'Stable', // Default value (not in CSV)
        commutingDistance: 'Normal', // Default value (not in CSV)
        moveFromPrimaryOffice: 'No', // Default value (not in CSV)
        // Other Factors fields (from CSV columns)
        pipHistory: values[65] || '0', // PIP History
        ccat: values[67] || 'No Criteria Data', // CCAT
        epp: values[69] || 'No Criteria Data', // EPP
        illustrate: values[71] || 'No Criteria Data', // Illustrate
        // Flag values (Y/N from CSV)
        partnersWhoPairUpFlag: values[64] || 'N', // Partners Who Pair Up Flag
        pipFlag: values[66] || 'N', // PIP Flag
        ccatFlag: values[68] || 'N', // CCAT Flag
        eppFlag: values[70] || 'N', // EPP Flag
        illustrateFlag: values[72] || 'N', // Illustrate Flag
        baseSalaryTooLowRelativeToBVFlag: values[74] || 'N', // Base Salary too low Relative to BV Flag
        baseSalaryTooLowRelativeToNBFlag: values[76] || 'N', // Base Salary too low Relative to NB Flag
      };

      producers.push(producer);
    }

    return producers;
  }

  static convertToProducerSummary(producers: Producer[]): ProducerSummary[] {
    return producers.map((producer) => ({
      employeeId: producer.employeeId,
      producer: producer.fullName,
      tenure: producer.tenureHire,
      ltmNB: producer.ltmNB,
      bookSize: producer.currentTotalBV,
      numberOfWins: producer.numberOfWins,
      successScore: producer.successScore,
      flags: producer.numberOfFlags,
      region: producer.region,
      lob: producer.lob,
    }));
  }

  static getProducerById(employeeId: string, producers: Producer[]): Producer | null {
    return producers.find((producer) => producer.employeeId === employeeId) || null;
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"(.*)"$/, '$1')); // Remove surrounding quotes
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim().replace(/^"(.*)"$/, '$1')); // Remove surrounding quotes from last field
    return result;
  }

  static async loadCSVFromFile(): Promise<Producer[]> {
    // Load the CSV file from the public directory
    // Use the current base path to resolve the file
    const basePath = import.meta.env.BASE_URL || '/';
    const csvPath = `${basePath}data/PredictGradDummyData.csv`;
    const response = await fetch(csvPath);
    if (!response.ok) {
      throw new Error(`CSV file not found at ${csvPath}`);
    }

    const csvContent = await response.text();
    return this.parseCSVToProducers(csvContent);
  }
}
