import { useState, useEffect, useCallback } from 'react';
import SharePointService from '../services/SharePointService';

export interface SharePointUser {
  username: string;
  name: string;
  account: any;
}

export interface UseSharePointReturn {
  isLoggedIn: boolean;
  user: SharePointUser | null;
  isLoading: boolean;
  error: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getSites: () => Promise<any[]>;
  getLists: (siteId: string) => Promise<any[]>;
  getListItems: (siteId: string, listId: string) => Promise<any[]>;
  getDocuments: (siteId: string, driveId?: string) => Promise<any[]>;
  uploadDocument: (siteId: string, fileName: string, file: File) => Promise<any>;
}

export const useSharePoint = (): UseSharePointReturn => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<SharePointUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sharePointService = SharePointService.getInstance();

  useEffect(() => {
    const initializeSharePoint = async () => {
      try {
        await sharePointService.initialize();
        const currentUser = sharePointService.getCurrentUser();
        
        if (currentUser) {
          setUser({
            username: currentUser.username,
            name: currentUser.name || currentUser.username,
            account: currentUser,
          });
          setIsLoggedIn(true);
        }
      } catch (err) {
        setError(`Failed to initialize SharePoint: ${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSharePoint();
  }, []);

  const login = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await sharePointService.login();
      setUser({
        username: result.account.username,
        name: result.account.name || result.account.username,
        account: result.account,
      });
      setIsLoggedIn(true);
    } catch (err) {
      setError(`Login failed: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await sharePointService.logout();
      setUser(null);
      setIsLoggedIn(false);
      setError(null);
    } catch (err) {
      setError(`Logout failed: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSites = useCallback(async () => {
    try {
      setError(null);
      return await sharePointService.getSites();
    } catch (err) {
      setError(`Failed to fetch sites: ${err}`);
      throw err;
    }
  }, []);

  const getLists = useCallback(async (siteId: string) => {
    try {
      setError(null);
      return await sharePointService.getLists(siteId);
    } catch (err) {
      setError(`Failed to fetch lists: ${err}`);
      throw err;
    }
  }, []);

  const getListItems = useCallback(async (siteId: string, listId: string) => {
    try {
      setError(null);
      return await sharePointService.getListItems(siteId, listId);
    } catch (err) {
      setError(`Failed to fetch list items: ${err}`);
      throw err;
    }
  }, []);

  const getDocuments = useCallback(async (siteId: string, driveId?: string) => {
    try {
      setError(null);
      return await sharePointService.getDocuments(siteId, driveId);
    } catch (err) {
      setError(`Failed to fetch documents: ${err}`);
      throw err;
    }
  }, []);

  const uploadDocument = useCallback(async (siteId: string, fileName: string, file: File) => {
    try {
      setError(null);
      return await sharePointService.uploadDocument(siteId, fileName, file);
    } catch (err) {
      setError(`Failed to upload document: ${err}`);
      throw err;
    }
  }, []);

  return {
    isLoggedIn,
    user,
    isLoading,
    error,
    login,
    logout,
    getSites,
    getLists,
    getListItems,
    getDocuments,
    uploadDocument,
  };
};
