import React, { useState, useEffect } from 'react';
import { useSharePoint } from '../hooks/useSharePoint';

interface SharePointData {
  sites: any[];
  lists: any[];
  documents: any[];
}

const SharePointIntegration: React.FC = () => {
  const {
    isLoggedIn,
    user,
    isLoading,
    error,
    login,
    logout,
    getSites,
    getLists,
    getDocuments,
  } = useSharePoint();

  const [data, setData] = useState<SharePointData>({
    sites: [],
    lists: [],
    documents: [],
  });
  const [selectedSite, setSelectedSite] = useState<string>('');
  const [loadingData, setLoadingData] = useState(false);

  const handleLogin = async () => {
    try {
      await login();
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setData({ sites: [], lists: [], documents: [] });
      setSelectedSite('');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const loadSites = async () => {
    if (!isLoggedIn) return;
    
    setLoadingData(true);
    try {
      const sites = await getSites();
      setData(prev => ({ ...prev, sites }));
    } catch (err) {
      console.error('Error loading sites:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const loadLists = async (siteId: string) => {
    if (!siteId) return;
    
    setLoadingData(true);
    try {
      const lists = await getLists(siteId);
      setData(prev => ({ ...prev, lists }));
    } catch (err) {
      console.error('Error loading lists:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const loadDocuments = async (siteId: string) => {
    if (!siteId) return;
    
    setLoadingData(true);
    try {
      const documents = await getDocuments(siteId);
      setData(prev => ({ ...prev, documents }));
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSiteSelect = async (siteId: string) => {
    setSelectedSite(siteId);
    await Promise.all([
      loadLists(siteId),
      loadDocuments(siteId),
    ]);
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadSites();
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return (
      <div className="sharepoint-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading SharePoint...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sharepoint-container" style={{ padding: '2rem' }}>
      <div className="sharepoint-header" style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>SharePoint Integration</h2>
        
        {!isLoggedIn ? (
          <div>
            <p style={{ marginBottom: '1rem' }}>Connect to SharePoint to access your sites, lists, and documents.</p>
            <button
              onClick={handleLogin}
              style={{
                background: '#1e40af',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Connect to SharePoint
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ margin: 0, color: '#6b7280' }}>
                Connected as: <strong>{user?.name}</strong>
              </p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      {isLoggedIn && (
        <div className="sharepoint-content">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
            {/* Sites */}
            <div className="sharepoint-section">
              <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Sites</h3>
              {loadingData ? (
                <div>Loading...</div>
              ) : (
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {data.sites.map((site) => (
                    <div
                      key={site.id}
                      onClick={() => handleSiteSelect(site.id)}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        marginBottom: '0.5rem',
                        cursor: 'pointer',
                        backgroundColor: selectedSite === site.id ? '#e0f2fe' : 'white',
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{site.displayName}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {site.webUrl}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lists */}
            <div className="sharepoint-section">
              <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Lists</h3>
              {selectedSite ? (
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {data.lists.map((list) => (
                    <div
                      key={list.id}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        marginBottom: '0.5rem',
                        backgroundColor: 'white',
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{list.displayName}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        Items: {list.list?.itemCount || 0}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#6b7280' }}>Select a site to view lists</div>
              )}
            </div>

            {/* Documents */}
            <div className="sharepoint-section">
              <h3 style={{ color: '#374151', marginBottom: '1rem' }}>Documents</h3>
              {selectedSite ? (
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {data.documents.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        padding: '0.75rem',
                        border: '1px solid #e5e7eb',
                        borderRadius: '4px',
                        marginBottom: '0.5rem',
                        backgroundColor: 'white',
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        {doc.file ? `${Math.round(doc.size / 1024)} KB` : 'Folder'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#6b7280' }}>Select a site to view documents</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharePointIntegration;
