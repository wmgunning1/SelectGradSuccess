import { useState, useEffect, useCallback } from 'react';
import USISharePointService, { ProducerData } from '../services/USISharePointService';

export interface SharePointUser {
  username: string;
  name: string;
  account: any;
}

export interface UseUSISharePointReturn {
  isLoggedIn: boolean;
  user: SharePointUser | null;
  isLoading: boolean;
  error: string | null;
  connectionStatus: any;
  producers: ProducerData[];
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loadProducerData: () => Promise<void>;
  getProducerById: (id: string) => Promise<ProducerData | null>;
  refreshData: () => Promise<void>;
}

export const useUSISharePoint = (): UseUSISharePointReturn => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<SharePointUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<any>({});
  const [producers, setProducers] = useState<ProducerData[]>([]);
  
  const sharePointService = USISharePointService.getInstance();

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
          
          // Get connection status
          const status = sharePointService.getConnectionStatus();
          setConnectionStatus(status);
          
          // If already connected, try to load data
          if (status.listConnected) {
            await loadProducerDataInternal();
          }
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
      
      // Update connection status
      const status = sharePointService.getConnectionStatus();
      setConnectionStatus(status);
      
      // Automatically load producer data after successful login
      await loadProducerDataInternal();
      
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
      setConnectionStatus({});
      setProducers([]);
    } catch (err) {
      setError(`Logout failed: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadProducerDataInternal = async () => {
    try {
      setError(null);
      const producerData = await sharePointService.getProducerData();
      setProducers(producerData);
      console.log(`Loaded ${producerData.length} producers from SharePoint`);
    } catch (err) {
      const errorMessage = `Failed to load producer data: ${err}`;
      setError(errorMessage);
      console.error(errorMessage);
      throw err;
    }
  };

  const loadProducerData = useCallback(async () => {
    setIsLoading(true);
    try {
      await loadProducerDataInternal();
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getProducerById = useCallback(async (id: string): Promise<ProducerData | null> => {
    try {
      setError(null);
      return await sharePointService.getProducerById(id);
    } catch (err) {
      setError(`Failed to fetch producer ${id}: ${err}`);
      throw err;
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (!isLoggedIn) {
      setError('Please login first to refresh data');
      return;
    }
    
    setIsLoading(true);
    try {
      // Refresh connection status
      const status = sharePointService.getConnectionStatus();
      setConnectionStatus(status);
      
      if (status.listConnected) {
        await loadProducerDataInternal();
      } else {
        // Reconnect if needed
        await sharePointService.getSiteInfo();
        await sharePointService.getListInfo();
        await loadProducerDataInternal();
      }
    } catch (err) {
      setError(`Failed to refresh data: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  return {
    isLoggedIn,
    user,
    isLoading,
    error,
    connectionStatus,
    producers,
    login,
    logout,
    loadProducerData,
    getProducerById,
    refreshData,
  };
};
