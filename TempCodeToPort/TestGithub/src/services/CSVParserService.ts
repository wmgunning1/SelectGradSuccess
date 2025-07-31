import { Producer, ProducerSummary } from '../types/Producer';

// Surrogate key mapping service
export class SurrogateKeyService {
  private static instance: SurrogateKeyService;
  private employeeIdToSurrogateMap: Map<string, string> = new Map();
  private surrogateToEmployeeIdMap: Map<string, string> = new Map();
  private counter: number = 1;

  static getInstance(): SurrogateKeyService {
    if (!SurrogateKeyService.instance) {
      SurrogateKeyService.instance = new SurrogateKeyService();
    }
    return SurrogateKeyService.instance;
  }

  generateSurrogateKey(employeeId: string): string {
    if (this.employeeIdToSurrogateMap.has(employeeId)) {
      return this.employeeIdToSurrogateMap.get(employeeId)!;
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
        currentBookSizeExpected: values[48] || '',
        ltmNBExpected: parseFloat(values[49]) || 0,
        prospectsExpected: parseFloat(values[50]) || 0,
        firstAppointmentsExpected: parseFloat(values[51]) || 0,
        secondAppointmentsExpected: parseFloat(values[52]) || 0,
        rideAlongsExpected: parseFloat(values[53]) || 0,
        advanceRatioExpected: parseFloat(values[54]) || 0,
        closingRatioExpected: parseFloat(values[55]) || 0,
        numberOfWinsExpected: parseFloat(values[56]) || 0,
        averageWinSizeExpected: values[57] || '',
        numberSplitWins: parseFloat(values[58]) || 0,
        partnersWhoPairUpFlag: values[59] || '',
        pipHistory: parseFloat(values[60]) || 0,
        pipFlag: values[61] || '',
        ccat: values[62] || '',
        ccatFlag: values[63] || '',
        epp: values[64] || '',
        eppFlag: values[65] || '',
        illustrate: values[66] || '',
        illustrateFlag: values[67] || '',
        sgbvToExpectedBV: values[68] || '',
        baseSalaryTooLowRelativeToBVFlag: values[69] || '',
        sgnbToExpectedNB: values[70] || '',
        baseSalaryTooLowRelativeToNBFlag: values[71] || '',
        percentile: parseFloat(values[72]) || 0
      };

      producers.push(producer);
    }

    return producers;
  }

  static convertToProducerSummary(producers: Producer[]): ProducerSummary[] {
    const surrogateService = SurrogateKeyService.getInstance();
    surrogateService.reset(); // Reset to ensure consistent surrogate keys
    
    return producers.map(producer => ({
      employeeId: producer.employeeId,
      surrogateKey: surrogateService.generateSurrogateKey(producer.employeeId),
      name: producer.fullName,
      region: producer.region,
      office: producer.office,
      vertical: producer.vertical,
      manager: producer.directManager,
      successScore: producer.successScore,
      currentBV: producer.currentTotalBV,
      ltmNB: producer.ltmNB,
      percentile: producer.percentile
    }));
  }

  static getProducerBySurrogateKey(surrogateKey: string, producers: Producer[]): Producer | null {
    const surrogateService = SurrogateKeyService.getInstance();
    const employeeId = surrogateService.getEmployeeIdFromSurrogate(surrogateKey);
    
    if (!employeeId) {
      return null;
    }

    return producers.find(producer => producer.employeeId === employeeId) || null;
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
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  static async loadCSVFromFile(): Promise<Producer[]> {
    try {
      // Try to load the CSV file from the data directory
      const response = await fetch('/src/data/PredictGradDummyData.csv');
      if (!response.ok) {
        throw new Error('CSV file not found');
      }
      
      const csvContent = await response.text();
      return this.parseCSVToProducers(csvContent);
    } catch (error) {
      console.error('Error loading CSV file:', error);
      throw error;
    }
  }
}
