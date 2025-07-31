import { PublicClientApplication, Configuration, AuthenticationResult } from '@azure/msal-browser';

// Use Microsoft's well-known SharePoint client ID
const msalConfig: Configuration = {
  auth: {
    clientId: 'd3590ed6-52b3-4102-aeff-aad2292ab01c', // Microsoft Office (SharePoint Online)
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// SharePoint scopes using your USI tenant
const sharePointScopes = [
  'https://usii.sharepoint.com/AllSites.Read',
  'https://usii.sharepoint.com/AllSites.Write',
  'User.Read'
];

// USI SharePoint site configuration
const USI_SITE_CONFIG = {
  siteUrl: 'https://usii.sharepoint.com/sites/PRSandA',
  listName: 'SelectGradPredictorData',
  tenant: 'usii',
};

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

export class USISharePointDirectService {
  private static instance: USISharePointDirectService;
  private accessToken: string | null = null;

  private constructor() {}

  static getInstance(): USISharePointDirectService {
    if (!USISharePointDirectService.instance) {
      USISharePointDirectService.instance = new USISharePointDirectService();
    }
    return USISharePointDirectService.instance;
  }

  async initialize(): Promise<void> {
    await msalInstance.initialize();
  }

  async login(): Promise<AuthenticationResult> {
    try {
      const loginRequest = {
        scopes: sharePointScopes,
        prompt: 'select_account',
      };

      const response = await msalInstance.loginPopup(loginRequest);
      this.accessToken = response.accessToken;
      
      console.log('Successfully logged in to USI SharePoint');
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async getAccessToken(): Promise<string> {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length === 0) {
      throw new Error('No accounts found. Please login first.');
    }

    const silentRequest = {
      scopes: sharePointScopes,
      account: accounts[0],
    };

    try {
      const response = await msalInstance.acquireTokenSilent(silentRequest);
      this.accessToken = response.accessToken;
      return response.accessToken;
    } catch (error) {
      // Fall back to interactive login
      const response = await msalInstance.acquireTokenPopup(silentRequest);
      this.accessToken = response.accessToken;
      return response.accessToken;
    }
  }

  async logout(): Promise<void> {
    const logoutRequest = {
      account: msalInstance.getAllAccounts()[0],
    };
    await msalInstance.logoutPopup(logoutRequest);
    this.accessToken = null;
  }

  // Direct SharePoint REST API calls
  private async makeSharePointRequest(endpoint: string): Promise<any> {
    if (!this.accessToken) {
      await this.getAccessToken();
    }

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Accept': 'application/json;odata=verbose',
        'Content-Type': 'application/json;odata=verbose',
      },
    });

    if (!response.ok) {
      throw new Error(`SharePoint request failed: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  }

  // Get site information
  async getSiteInfo(): Promise<any> {
    try {
      const endpoint = `${USI_SITE_CONFIG.siteUrl}/_api/web`;
      const result = await this.makeSharePointRequest(endpoint);
      console.log('Connected to USI SharePoint site:', result.d.Title);
      return result.d;
    } catch (error) {
      console.error('Error fetching USI site:', error);
      throw new Error(`Failed to connect to USI SharePoint site: ${error}`);
    }
  }

  // Get list information
  async getListInfo(): Promise<any> {
    try {
      const endpoint = `${USI_SITE_CONFIG.siteUrl}/_api/web/lists/getbytitle('${USI_SITE_CONFIG.listName}')`;
      const result = await this.makeSharePointRequest(endpoint);
      console.log('Connected to list:', result.d.Title);
      return result.d;
    } catch (error) {
      console.error('Error fetching list info:', error);
      throw new Error(`Failed to connect to list '${USI_SITE_CONFIG.listName}': ${error}`);
    }
  }

  // Get all producer data from SharePoint list
  async getProducerData(): Promise<ProducerData[]> {
    try {
      const endpoint = `${USI_SITE_CONFIG.siteUrl}/_api/web/lists/getbytitle('${USI_SITE_CONFIG.listName}')/items`;
      const result = await this.makeSharePointRequest(endpoint);

      // Transform SharePoint list items to ProducerData format
      const producers: ProducerData[] = result.d.results.map((item: any) => ({
        id: item.Id.toString(),
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

      console.log(`Retrieved ${producers.length} producers from SharePoint`);
      return producers;
    } catch (error) {
      console.error('Error fetching producer data:', error);
      throw new Error(`Failed to retrieve producer data: ${error}`);
    }
  }

  // Get specific producer by ID
  async getProducerById(producerId: string): Promise<ProducerData | null> {
    try {
      const endpoint = `${USI_SITE_CONFIG.siteUrl}/_api/web/lists/getbytitle('${USI_SITE_CONFIG.listName}')/items(${producerId})`;
      const result = await this.makeSharePointRequest(endpoint);
      
      const item = result.d;
      return {
        id: item.Id.toString(),
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
      };
    } catch (error) {
      console.error(`Error fetching producer ${producerId}:`, error);
      return null;
    }
  }

  // Get list schema to understand available fields
  async getListSchema(): Promise<any> {
    try {
      const endpoint = `${USI_SITE_CONFIG.siteUrl}/_api/web/lists/getbytitle('${USI_SITE_CONFIG.listName}')/fields`;
      const result = await this.makeSharePointRequest(endpoint);
      
      const fields = result.d.results.filter((field: any) => 
        !field.Hidden && 
        !field.ReadOnlyField &&
        field.InternalName !== 'Attachments' &&
        field.InternalName !== 'ContentType'
      );
      
      console.log('Available fields:', fields.map((field: any) => field.InternalName));
      return fields;
    } catch (error) {
      console.error('Error fetching list schema:', error);
      throw error;
    }
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    const accounts = msalInstance.getAllAccounts();
    return accounts.length > 0;
  }

  getCurrentUser(): any {
    const accounts = msalInstance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  // Get connection status
  getConnectionStatus(): {
    isConnected: boolean;
    siteName?: string;
    listName?: string;
    siteUrl?: string;
  } {
    return {
      isConnected: this.isLoggedIn(),
      siteName: 'USI PRSandA',
      listName: USI_SITE_CONFIG.listName,
      siteUrl: USI_SITE_CONFIG.siteUrl,
    };
  }
}

export default USISharePointDirectService;
