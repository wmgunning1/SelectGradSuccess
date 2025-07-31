import { PublicClientApplication, Configuration, AuthenticationResult } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';

// MSAL configuration for USI tenant - using common endpoint for existing credentials
const msalConfig: Configuration = {
  auth: {
    clientId: '00000003-0000-0ff1-ce00-000000000000', // SharePoint Online Client ID (universal)
    authority: 'https://login.microsoftonline.com/common',
    redirectUri: window.location.origin,
    knownAuthorities: ['login.microsoftonline.com'],
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// SharePoint scopes for USI tenant
const sharePointScopes = [
  'https://graph.microsoft.com/Sites.Read.All',
  'https://graph.microsoft.com/Files.Read.All',
  'https://usii.sharepoint.com/.default'
];

// USI SharePoint site configuration
const USI_SITE_CONFIG = {
  siteUrl: 'https://usii.sharepoint.com/sites/PRSandA',
  listName: 'SelectGradPredictorData',
  siteId: '', // Will be populated after connecting
  listId: '', // Will be populated after connecting
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

export class USISharePointService {
  private static instance: USISharePointService;
  private graphClient: Client | null = null;
  private siteInfo: any = null;
  private listInfo: any = null;

  private constructor() {}

  static getInstance(): USISharePointService {
    if (!USISharePointService.instance) {
      USISharePointService.instance = new USISharePointService();
    }
    return USISharePointService.instance;
  }

  async initialize(): Promise<void> {
    await msalInstance.initialize();
  }

  async login(): Promise<AuthenticationResult> {
    try {
      const loginRequest = {
        scopes: sharePointScopes,
      };

      const response = await msalInstance.loginPopup(loginRequest);
      this.setupGraphClient(response.accessToken);
      
      // After login, get site and list information
      await this.getSiteInfo();
      await this.getListInfo();
      
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
      this.setupGraphClient(response.accessToken);
      return response.accessToken;
    } catch (error) {
      // Fall back to interactive login
      const response = await msalInstance.acquireTokenPopup(silentRequest);
      this.setupGraphClient(response.accessToken);
      return response.accessToken;
    }
  }

  private setupGraphClient(accessToken: string): void {
    this.graphClient = Client.init({
      authProvider: (done) => {
        done(null, accessToken);
      },
    });
  }

  async logout(): Promise<void> {
    const logoutRequest = {
      account: msalInstance.getAllAccounts()[0],
    };
    await msalInstance.logoutPopup(logoutRequest);
    this.graphClient = null;
    this.siteInfo = null;
    this.listInfo = null;
  }

  // Get USI SharePoint site information
  async getSiteInfo(): Promise<any> {
    if (!this.graphClient) {
      await this.getAccessToken();
    }

    try {
      // Get site by URL
      const hostName = 'usii.sharepoint.com';
      const sitePath = '/sites/PRSandA';
      
      const site = await this.graphClient!
        .api(`/sites/${hostName}:${sitePath}`)
        .get();
      
      this.siteInfo = site;
      USI_SITE_CONFIG.siteId = site.id;
      
      console.log('Connected to USI SharePoint site:', site.displayName);
      return site;
    } catch (error) {
      console.error('Error fetching USI site:', error);
      throw new Error(`Failed to connect to USI SharePoint site: ${error}`);
    }
  }

  // Get the SelectGradPredictorData list information
  async getListInfo(): Promise<any> {
    if (!this.siteInfo) {
      await this.getSiteInfo();
    }

    try {
      const lists = await this.graphClient!
        .api(`/sites/${this.siteInfo.id}/lists`)
        .filter(`displayName eq '${USI_SITE_CONFIG.listName}'`)
        .get();

      if (lists.value.length === 0) {
        throw new Error(`List '${USI_SITE_CONFIG.listName}' not found`);
      }

      this.listInfo = lists.value[0];
      USI_SITE_CONFIG.listId = this.listInfo.id;
      
      console.log('Connected to list:', this.listInfo.displayName);
      return this.listInfo;
    } catch (error) {
      console.error('Error fetching list info:', error);
      throw new Error(`Failed to connect to list '${USI_SITE_CONFIG.listName}': ${error}`);
    }
  }

  // Get all producer data from SharePoint list
  async getProducerData(): Promise<ProducerData[]> {
    if (!this.listInfo) {
      await this.getListInfo();
    }

    try {
      const items = await this.graphClient!
        .api(`/sites/${this.siteInfo.id}/lists/${this.listInfo.id}/items`)
        .expand('fields')
        .get();

      // Transform SharePoint list items to ProducerData format
      const producers: ProducerData[] = items.value.map((item: any) => {
        const fields = item.fields;
        return {
          id: fields.ID || item.id,
          name: fields.Title || fields.ProducerName || '',
          directManager: fields.DirectManager || '',
          vertical: fields.Vertical || fields.LineOfBusiness || '',
          currentSalary: fields.CurrentSalary || '',
          mmBook: fields.MMBook || fields.BookSize || '',
          ltmMmNb: fields.LTM_MMNb || fields.LTMNewBusiness || '',
          mmTenure: fields.MMTenure || fields.Tenure || '',
          percentileRank: fields.PercentileRank || '',
          flags: parseInt(fields.Flags) || 0,
          successScore: parseInt(fields.SuccessScore) || 0,
          bookSize: fields.BookSize || fields.MMBook || '',
          numberOfWins: parseInt(fields.NumberOfWins) || 0,
          region: fields.Region || '',
          lineOfBusiness: fields.LineOfBusiness || fields.Vertical || '',
        };
      });

      console.log(`Retrieved ${producers.length} producers from SharePoint`);
      return producers;
    } catch (error) {
      console.error('Error fetching producer data:', error);
      throw new Error(`Failed to retrieve producer data: ${error}`);
    }
  }

  // Get specific producer by ID
  async getProducerById(producerId: string): Promise<ProducerData | null> {
    if (!this.listInfo) {
      await this.getListInfo();
    }

    try {
      const item = await this.graphClient!
        .api(`/sites/${this.siteInfo.id}/lists/${this.listInfo.id}/items/${producerId}`)
        .expand('fields')
        .get();

      const fields = item.fields;
      return {
        id: fields.ID || item.id,
        name: fields.Title || fields.ProducerName || '',
        directManager: fields.DirectManager || '',
        vertical: fields.Vertical || fields.LineOfBusiness || '',
        currentSalary: fields.CurrentSalary || '',
        mmBook: fields.MMBook || fields.BookSize || '',
        ltmMmNb: fields.LTM_MMNb || fields.LTMNewBusiness || '',
        mmTenure: fields.MMTenure || fields.Tenure || '',
        percentileRank: fields.PercentileRank || '',
        flags: parseInt(fields.Flags) || 0,
        successScore: parseInt(fields.SuccessScore) || 0,
        bookSize: fields.BookSize || fields.MMBook || '',
        numberOfWins: parseInt(fields.NumberOfWins) || 0,
        region: fields.Region || '',
        lineOfBusiness: fields.LineOfBusiness || fields.Vertical || '',
      };
    } catch (error) {
      console.error(`Error fetching producer ${producerId}:`, error);
      return null;
    }
  }

  // Get list schema to understand available fields
  async getListSchema(): Promise<any> {
    if (!this.listInfo) {
      await this.getListInfo();
    }

    try {
      const columns = await this.graphClient!
        .api(`/sites/${this.siteInfo.id}/lists/${this.listInfo.id}/columns`)
        .get();

      console.log('Available columns:', columns.value.map((col: any) => col.displayName));
      return columns.value;
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
    siteConnected: boolean;
    listConnected: boolean;
    siteName?: string;
    listName?: string;
  } {
    return {
      isConnected: this.isLoggedIn(),
      siteConnected: !!this.siteInfo,
      listConnected: !!this.listInfo,
      siteName: this.siteInfo?.displayName,
      listName: this.listInfo?.displayName,
    };
  }
}

export default USISharePointService;
