import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUSISharePointDirect } from '../hooks/useUSISharePointDirect'

const ProducerTableWithSharePoint: React.FC = () => {
  const navigate = useNavigate()
  const {
    isLoggedIn,
    user,
    isLoading,
    error,
    connectionStatus,
    producers,
    login,
    logout,
    loadProducerData,
    refreshData
  } = useUSISharePointDirect()

  const [lineOfBusiness, setLineOfBusiness] = useState('Commercial Lines')
  const [region, setRegion] = useState('All Regions')

  const filteredProducers = producers.filter(producer => {
    const lineMatch = lineOfBusiness === 'All' || producer.lineOfBusiness === lineOfBusiness || producer.vertical === lineOfBusiness
    const regionMatch = region === 'All Regions' || producer.region === region
    return lineMatch && regionMatch
  })

  const getSuccessScoreClass = (score: number) => {
    if (score >= 70) return 'success-score high'
    if (score >= 50) return 'success-score medium'
    return 'success-score low'
  }

  const handleRowClick = (producerId: string) => {
    navigate(`/producer/${producerId}`)
  }

  const handleConnect = async () => {
    try {
      await login()
    } catch (err) {
      console.error('Failed to connect to SharePoint:', err)
    }
  }

  const handleDisconnect = async () => {
    try {
      await logout()
    } catch (err) {
      console.error('Failed to disconnect from SharePoint:', err)
    }
  }

  const handleRefresh = async () => {
    try {
      await refreshData()
    } catch (err) {
      console.error('Failed to refresh data:', err)
    }
  }

  return (
    <div className="App">
      <div className="usi-header" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="usi-logo">USI</div>
          <h1 style={{ margin: '0 0 0 1rem', fontSize: '1.5rem' }}>Select Grad Success Predictor</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => navigate('/predictor')}
            style={{
              background: 'none',
              border: '2px solid white',
              color: 'white',
              padding: '0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1.2rem',
              width: '40px',
              height: '40px'
            }}
            title="Grid View - Stay on Producer Table"
          >
            ⊞
          </button>
          <button 
            onClick={() => navigate('/')}
            className="home-button"
            title="Go to Home"
          >
            🏠
          </button>
        </div>
      </div>
      
      <div className="table-container">
        {/* SharePoint Connection Status */}
        <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, color: '#1e3a8a' }}>SharePoint Data Connection</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {!isLoggedIn ? (
                <button
                  onClick={handleConnect}
                  disabled={isLoading}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.6 : 1,
                  }}
                >
                  {isLoading ? 'Connecting...' : 'Connect to SharePoint'}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      opacity: isLoading ? 0.6 : 1,
                    }}
                  >
                    {isLoading ? 'Refreshing...' : 'Refresh Data'}
                  </button>
                  <button
                    onClick={handleDisconnect}
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
                </>
              )}
            </div>
          </div>
          
          {/* Connection Status */}
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            {isLoggedIn && user ? (
              <div>
                <div>✅ Connected as: <strong>{user.name}</strong></div>
                <div>📊 Site: {connectionStatus.siteName || 'USI PRSandA'}</div>
                <div>📋 List: {connectionStatus.listName || 'SelectGradPredictorData'}</div>
                <div>👥 Producers loaded: <strong>{producers.length}</strong></div>
              </div>
            ) : (
              <div>❌ Not connected to SharePoint</div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Filters */}
        <div className="filter-controls">
          <div>
            <label>Line of Business</label>
            <select 
              className="filter-select"
              value={lineOfBusiness}
              onChange={(e) => setLineOfBusiness(e.target.value)}
            >
              <option>All</option>
              <option>Commercial Lines</option>
              <option>Personal Lines</option>
              <option>Employee Benefits</option>
            </select>
          </div>
          <div>
            <label>Region</label>
            <select 
              className="filter-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option>All Regions</option>
              <option>Northeast</option>
              <option>Southeast</option>
              <option>Midwest</option>
              <option>West</option>
              <option>Southwest</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div>Loading producer data from SharePoint...</div>
          </div>
        )}

        {/* Producer Table */}
        {!isLoading && isLoggedIn && (
          <table className="producer-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>MM Tenure</th>
                <th>LTM MM NB</th>
                <th>Book Size</th>
                <th># of Wins</th>
                <th>Success Score</th>
                <th>Flags</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducers.map((producer) => (
                <tr 
                  key={producer.id} 
                  onClick={() => handleRowClick(producer.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>{producer.name}</td>
                  <td>{producer.mmTenure}</td>
                  <td>{producer.ltmMmNb}</td>
                  <td>{producer.bookSize}</td>
                  <td>{producer.numberOfWins}</td>
                  <td>
                    <span className={getSuccessScoreClass(producer.successScore)}>
                      {producer.successScore}
                    </span>
                  </td>
                  <td>{producer.flags}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* No Data State */}
        {!isLoading && isLoggedIn && producers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <div>No producer data found in SharePoint list.</div>
            <div>Make sure the list "SelectGradPredictorData" exists and contains data.</div>
          </div>
        )}

        {/* Not Connected State */}
        {!isLoggedIn && !isLoading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <div>Please connect to SharePoint to view producer data.</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProducerTableWithSharePoint
