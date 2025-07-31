import { PublicClientApplication, Configuration, AuthenticationResult } from '@azure/msal-browser';
import { Client } from '@microsoft/microsoft-graph-client';

// MSAL configuration
const msalConfig: Configuration = {
  auth: {
    clientId: 'YOUR_CLIENT_ID', // Replace with your Azure App Registration Client ID
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID', // Replace with your tenant ID
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

// Create MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

// SharePoint scopes
const sharePointScopes = ['https://graph.microsoft.com/Sites.Read.All', 'https://graph.microsoft.com/Files.Read.All'];

export class SharePointService {
  private static instance: SharePointService;
  private graphClient: Client | null = null;

  private constructor() {}

  static getInstance(): SharePointService {
    if (!SharePointService.instance) {
      SharePointService.instance = new SharePointService();
    }
    return SharePointService.instance;
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
  }

  // SharePoint Site operations
  async getSites(): Promise<any[]> {
    if (!this.graphClient) {
      await this.getAccessToken();
    }

    try {
      const sites = await this.graphClient!.api('/sites').get();
      return sites.value;
    } catch (error) {
      console.error('Error fetching sites:', error);
      throw error;
    }
  }

  async getSiteById(siteId: string): Promise<any> {
    if (!this.graphClient) {
      await this.getAccessToken();
    }

    try {
      const site = await this.graphClient!.api(`/sites/${siteId}`).get();
      return site;
    } catch (error) {
      console.error('Error fetching site:', error);
      throw error;
    }
  }

  // SharePoint Lists operations
  async getLists(siteId: string): Promise<any[]> {
    if (!this.graphClient) {
      await this.getAccessToken();
    }

    try {
      const lists = await this.graphClient!.api(`/sites/${siteId}/lists`).get();
      return lists.value;
    } catch (error) {
      console.error('Error fetching lists:', error);
      throw error;
    }
  }

  async getListItems(siteId: string, listId: string): Promise<any[]> {
    if (!this.graphClient) {
      await this.getAccessToken();
    }

    try {
      const items = await this.graphClient!
        .api(`/sites/${siteId}/lists/${listId}/items`)
        .expand('fields')
        .get();
      return items.value;
    } catch (error) {
      console.error('Error fetching list items:', error);
      throw error;
    }
  }

  // Document Library operations
  async getDocuments(siteId: string, driveId?: string): Promise<any[]> {
    if (!this.graphClient) {
      await this.getAccessToken();
    }

    try {
      let endpoint = `/sites/${siteId}/drive/root/children`;
      if (driveId) {
        endpoint = `/drives/${driveId}/root/children`;
      }

      const documents = await this.graphClient!.api(endpoint).get();
      return documents.value;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  async uploadDocument(siteId: string, fileName: string, fileContent: File): Promise<any> {
    if (!this.graphClient) {
      await this.getAccessToken();
    }

    try {
      const response = await this.graphClient!
        .api(`/sites/${siteId}/drive/root:/${fileName}:/content`)
        .put(fileContent);
      return response;
    } catch (error) {
      console.error('Error uploading document:', error);
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
}

export default SharePointService;
