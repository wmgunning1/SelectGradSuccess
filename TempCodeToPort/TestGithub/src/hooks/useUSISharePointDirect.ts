import { useState, useEffect, useCallback } from 'react';
import USISharePointDirectService, { ProducerData } from '../services/USISharePointDirectService';

export interface SharePointUser {
  username: string;
  name: string;
  account: any;
}

export interface UseUSISharePointDirectReturn {
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

export const useUSISharePointDirect = (): UseUSISharePointDirectReturn => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<SharePointUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<any>({});
  const [producers, setProducers] = useState<ProducerData[]>([]);
  
  const sharePointService = USISharePointDirectService.getInstance();

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
          
          // Try to load data automatically
          await loadProducerDataInternal();
        }
      } catch (err) {
        setError(`Failed to initialize SharePoint: ${err}`);
        console.error('Initialize error:', err);
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
      
      // Test connection by getting site info
      await sharePointService.getSiteInfo();
      
      // Automatically load producer data after successful login
      await loadProducerDataInternal();
      
    } catch (err) {
      const errorMessage = `Login failed: ${err}`;
      setError(errorMessage);
      console.error('Login error:', err);
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
      console.log('Loading producer data from SharePoint...');
      const producerData = await sharePointService.getProducerData();
      setProducers(producerData);
      console.log(`Successfully loaded ${producerData.length} producers from SharePoint`);
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
      
      // Test connection and reload data
      await sharePointService.getSiteInfo();
      await loadProducerDataInternal();
      
    } catch (err) {
      const errorMessage = `Failed to refresh data: ${err}`;
      setError(errorMessage);
      console.error('Refresh error:', err);
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
