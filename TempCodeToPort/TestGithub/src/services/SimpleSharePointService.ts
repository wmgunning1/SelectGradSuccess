// Simple SharePoint connection using browser's existing session
export interface ProducerData {
  id: string;
  name: string;
  directManager: string;
  vertical: string;
  currentSalary: string;
  mmBook: string;
  ltmMmNb: string;
  mmTenure: string;
  percentileRank: string;
  flags: number;
  successScore: number;
  bookSize: string;
  numberOfWins: number;
  region?: string;
  lineOfBusiness?: string;
}

export class SimpleSharePointService {
  private static instance: SimpleSharePointService;
  private siteUrl = 'https://usii.sharepoint.com/sites/PRSandA';
  private listName = 'SelectGradPredictorData';

  private constructor() {}

  static getInstance(): SimpleSharePointService {
    if (!SimpleSharePointService.instance) {
      SimpleSharePointService.instance = new SimpleSharePointService();
    }
    return SimpleSharePointService.instance;
  }

  // Method 1: Direct fetch with credentials
  async getProducerDataDirect(): Promise<ProducerData[]> {
    try {
      const endpoint = `${this.siteUrl}/_api/web/lists/getbytitle('${this.listName}')/items`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include', // Use browser's existing SharePoint session
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformSharePointData(data.d.results);
    } catch (error) {
      console.error('Direct SharePoint fetch failed:', error);
      throw error;
    }
  }

  // Method 2: Use iframe to connect to SharePoint
  async getProducerDataViaIframe(): Promise<ProducerData[]> {
    return new Promise((resolve, reject) => {
      // Create hidden iframe to SharePoint
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = `${this.siteUrl}/Lists/${this.listName}/AllItems.aspx`;
      
      iframe.onload = async () => {
        try {
          // Try to access SharePoint data through iframe
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            // Extract data from SharePoint list view
            const listData = this.extractDataFromSharePointPage(iframeDoc);
            resolve(listData);
          } else {
            reject(new Error('Cannot access iframe content due to CORS'));
          }
        } catch (error) {
          reject(error);
        } finally {
          document.body.removeChild(iframe);
        }
      };

      iframe.onerror = () => {
        document.body.removeChild(iframe);
        reject(new Error('Failed to load SharePoint page'));
      };

      document.body.appendChild(iframe);
    });
  }

  // Method 3: CORS proxy approach
  async getProducerDataViaProxy(): Promise<ProducerData[]> {
    try {
      // Use a CORS proxy service (you can set up your own or use a public one)
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
      const targetUrl = `${this.siteUrl}/_api/web/lists/getbytitle('${this.listName}')/items`;
      
      const response = await fetch(proxyUrl + targetUrl, {
        headers: {
          'Accept': 'application/json;odata=verbose',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.ok) {
        throw new Error(`Proxy request failed: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSharePointData(data.d.results);
    } catch (error) {
      console.error('Proxy method failed:', error);
      throw error;
    }
  }

  // Transform SharePoint data to our format
  private transformSharePointData(items: any[]): ProducerData[] {
    return items.map((item: any) => ({
      id: item.Id?.toString() || '',
      name: item.Title || '',
      directManager: item.DirectManager || '',
      vertical: item.Vertical || item.LineOfBusiness || '',
      currentSalary: item.CurrentSalary || '',
      mmBook: item.MMBook || item.BookSize || '',
      ltmMmNb: item.LTM_MMNb || item.LTMNewBusiness || '',
      mmTenure: item.MMTenure || item.Tenure || '',
      percentileRank: item.PercentileRank || '',
      flags: parseInt(item.Flags) || 0,
      successScore: parseInt(item.SuccessScore) || 0,
      bookSize: item.BookSize || item.MMBook || '',
      numberOfWins: parseInt(item.NumberOfWins) || 0,
      region: item.Region || '',
      lineOfBusiness: item.LineOfBusiness || item.Vertical || '',
    }));
  }

  // Extract data from SharePoint page HTML
  private extractDataFromSharePointPage(doc: Document): ProducerData[] {
    const producers: ProducerData[] = [];
    
    try {
      // Look for SharePoint list table
      const listTable = doc.querySelector('[data-automationid="DetailsListInstance"] table, .ms-List table, .od-FieldRenderer table');
      
      if (listTable) {
        const rows = listTable.querySelectorAll('tr');
        
        for (let i = 1; i < rows.length; i++) { // Skip header row
          const cells = rows[i].querySelectorAll('td');
          if (cells.length > 0) {
            const producer: ProducerData = {
              id: i.toString(),
              name: cells[0]?.textContent?.trim() || '',
              directManager: cells[1]?.textContent?.trim() || '',
              vertical: cells[2]?.textContent?.trim() || '',
              currentSalary: cells[3]?.textContent?.trim() || '',
              mmBook: cells[4]?.textContent?.trim() || '',
              ltmMmNb: cells[5]?.textContent?.trim() || '',
              mmTenure: cells[6]?.textContent?.trim() || '',
              percentileRank: cells[7]?.textContent?.trim() || '',
              flags: parseInt(cells[8]?.textContent?.trim() || '0'),
              successScore: parseInt(cells[9]?.textContent?.trim() || '0'),
              bookSize: cells[4]?.textContent?.trim() || '',
              numberOfWins: parseInt(cells[10]?.textContent?.trim() || '0'),
              region: cells[11]?.textContent?.trim() || '',
              lineOfBusiness: cells[2]?.textContent?.trim() || '',
            };
            producers.push(producer);
          }
        }
      }
    } catch (error) {
      console.error('Error extracting data from SharePoint page:', error);
    }
    
    return producers;
  }

  // Try all methods in sequence
  async getProducerData(): Promise<ProducerData[]> {
    const methods = [
      { name: 'Direct', method: () => this.getProducerDataDirect() },
      { name: 'Iframe', method: () => this.getProducerDataViaIframe() },
      { name: 'Proxy', method: () => this.getProducerDataViaProxy() },
    ];

    for (const { name, method } of methods) {
      try {
        console.log(`Trying ${name} method to connect to SharePoint...`);
        const data = await method();
        console.log(`${name} method succeeded! Got ${data.length} producers`);
        return data;
      } catch (error) {
        console.warn(`${name} method failed:`, error);
      }
    }

    throw new Error('All SharePoint connection methods failed');
  }

  // Get SharePoint list URL for manual access
  getSharePointListUrl(): string {
    return `${this.siteUrl}/Lists/${this.listName}/AllItems.aspx`;
  }

  // Check if user has access to SharePoint
  async checkAccess(): Promise<boolean> {
    try {
      const response = await fetch(this.siteUrl, {
        method: 'HEAD',
        credentials: 'include',
        mode: 'no-cors',
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default SimpleSharePointService;
