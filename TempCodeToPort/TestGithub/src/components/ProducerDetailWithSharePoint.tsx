import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUSISharePointDirect } from '../hooks/useUSISharePointDirect'

interface MetricRow {
  category: string
  field: string
  currentValue: string | number
  expectedAtTenure: string | number
  successScore: number
  weighting: string
  riskFactors?: string
}

const ProducerDetailWithSharePoint: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    isLoggedIn,
    user,
    isLoading,
    error,
    producers,
    login,
    getProducerById,
    loadProducerData
  } = useUSISharePointDirect()

  const [selectedProducer, setSelectedProducer] = useState<any>(null)
  const [loadingProducer, setLoadingProducer] = useState(false)

  // Mock detailed metrics - in a real scenario, this would also come from SharePoint
  const getDetailedMetrics = (producer: any): MetricRow[] => {
    if (!producer) return []
    
    return [
      {
        category: 'Book & NB',
        field: 'Book / Starting MM Salary',
        currentValue: 0.0,
        expectedAtTenure: 0.3,
        successScore: 2,
        weighting: '10%'
      },
      {
        category: 'Book & NB',
        field: 'LTM NB / Starting MM Salary',
        currentValue: 0.0,
        expectedAtTenure: 0.1,
        successScore: 2,
        weighting: '10%'
      },
      {
        category: 'Activities',
        field: '# Prospects (20-50K Revenue)',
        currentValue: 50,
        expectedAtTenure: 60,
        successScore: 5,
        weighting: '10%'
      },
      {
        category: 'Activities',
        field: '# Prospects (50K+ Revenue)',
        currentValue: 15,
        expectedAtTenure: 20,
        successScore: 4,
        weighting: '10%'
      },
      {
        category: 'Activities',
        field: 'Total # Marketing Activities',
        currentValue: 120,
        expectedAtTenure: 100,
        successScore: 7,
        weighting: '5%'
      },
      {
        category: 'Pipeline',
        field: 'Total Pipeline Revenue',
        currentValue: '$150,000',
        expectedAtTenure: '$200,000',
        successScore: 5,
        weighting: '15%'
      },
      {
        category: 'Pipeline',
        field: 'Pipeline Revenue (>50% Prob)',
        currentValue: '$75,000',
        expectedAtTenure: '$100,000',
        successScore: 5,
        weighting: '10%'
      },
      {
        category: 'Performance',
        field: 'Close Rate (%)',
        currentValue: '15%',
        expectedAtTenure: '20%',
        successScore: 4,
        weighting: '10%'
      },
      {
        category: 'Performance',
        field: 'Avg Deal Size',
        currentValue: '$8,500',
        expectedAtTenure: '$10,000',
        successScore: 6,
        weighting: '5%'
      },
      {
        category: 'Quality',
        field: 'Retention Rate (%)',
        currentValue: '95%',
        expectedAtTenure: '90%',
        successScore: 8,
        weighting: '10%'
      },
      {
        category: 'Quality',
        field: 'Customer Satisfaction Score',
        currentValue: 4.2,
        expectedAtTenure: 4.0,
        successScore: 7,
        weighting: '5%'
      }
    ]
  }

  const getScoreColor = (score: number) => {
    if (score >= 7) return '#059669' // Green
    if (score >= 4) return '#d97706' // Orange
    return '#dc2626' // Red
  }

  const loadProducerDetails = async (producerId: string) => {
    setLoadingProducer(true)
    try {
      // First try to find in loaded producers
      let producer = producers.find(p => p.id === producerId)
      
      // If not found, try to load from SharePoint
      if (!producer && isLoggedIn) {
        const fetchedProducer = await getProducerById(producerId)
        if (fetchedProducer) {
          producer = fetchedProducer
        }
      }
      
      setSelectedProducer(producer)
    } catch (err) {
      console.error('Failed to load producer details:', err)
    } finally {
      setLoadingProducer(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadProducerDetails(id)
    }
  }, [id, producers, isLoggedIn])

  useEffect(() => {
    if (isLoggedIn && producers.length === 0) {
      loadProducerData()
    }
  }, [isLoggedIn])

  const handleConnect = async () => {
    try {
      await login()
    } catch (err) {
      console.error('Failed to connect to SharePoint:', err)
    }
  }

  const handleProducerChange = (newProducerId: string) => {
    navigate(`/producer/${newProducerId}`)
  }

  if (!isLoggedIn) {
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
              title="Grid View - Navigate to Producer Table"
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
        
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>SharePoint Connection Required</h2>
            <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
              Please connect to SharePoint to view producer details from the USI database.
            </p>
            <button
              onClick={handleConnect}
              disabled={isLoading}
              style={{
                background: '#10b981',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '6px',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                fontSize: '1rem',
              }}
            >
              {isLoading ? 'Connecting...' : 'Connect to SharePoint'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || loadingProducer) {
    return (
      <div className="App">
        <div className="usi-header" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="usi-logo">USI</div>
            <h1 style={{ margin: '0 0 0 1rem', fontSize: '1.5rem' }}>Select Grad Success Predictor</h1>
          </div>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div>Loading producer data from SharePoint...</div>
        </div>
      </div>
    )
  }

  if (!selectedProducer) {
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
              title="Grid View - Navigate to Producer Table"
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
        
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', maxWidth: '500px', margin: '0 auto' }}>
            <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Producer Not Found</h2>
            <p style={{ marginBottom: '2rem', color: '#6b7280' }}>
              Producer with ID "{id}" was not found in the SharePoint database.
            </p>
            <button
              onClick={() => navigate('/predictor')}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Back to Producer Table
            </button>
          </div>
        </div>
      </div>
    )
  }

  const metrics = getDetailedMetrics(selectedProducer)
  const metricsByCategory = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = []
    }
    acc[metric.category].push(metric)
    return acc
  }, {} as Record<string, MetricRow[]>)

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
            title="Grid View - Navigate to Producer Table"
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
      
      <div className="producer-detail-redesign">
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '2rem',
          }}>
            <strong>SharePoint Error:</strong> {error}
          </div>
        )}

        <div className="producer-detail-header">
          <div className="producer-info-left">
            <div className="producer-dropdown">
              <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>Producer</label>
              <select 
                value={selectedProducer.id}
                onChange={(e) => handleProducerChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  backgroundColor: 'white'
                }}
              >
                {producers.map(producer => (
                  <option key={producer.id} value={producer.id}>
                    {producer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="producer-info-cards">
            <div className="info-card-row">
              <div className="info-card-small">
                <div className="info-value-small">Direct Manager</div>
                <div className="info-value">{selectedProducer.directManager}</div>
              </div>
              <div className="info-card-small">
                <div className="info-value-small">Vertical</div>
                <div className="info-value">{selectedProducer.vertical}</div>
              </div>
              <div className="info-card-small">
                <div className="info-value-small">Current Salary</div>
                <div className="info-value">{selectedProducer.currentSalary}</div>
              </div>
            </div>
            
            <div className="info-card-row">
              <div className="info-card-small">
                <div className="info-value-small">MM Book</div>
                <div className="info-value">{selectedProducer.mmBook}</div>
              </div>
              <div className="info-card-small">
                <div className="info-value-small">LTM MM NB</div>
                <div className="info-value">{selectedProducer.ltmMmNb}</div>
              </div>
              <div className="info-card-small">
                <div className="info-value-small">MM Tenure</div>
                <div className="info-value">{selectedProducer.mmTenure}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Source Info */}
        <div style={{ 
          background: '#f0f9ff', 
          padding: '0.75rem 1rem', 
          borderRadius: '6px', 
          marginBottom: '2rem',
          fontSize: '0.875rem',
          color: '#0369a1',
          border: '1px solid #bae6fd'
        }}>
          📊 Data loaded from SharePoint: {user?.name} • Site: USI PRSandA • List: SelectGradPredictorData • Updated: {new Date().toLocaleString()}
        </div>

        <table className="metrics-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Field</th>
              <th>Current Value</th>
              <th>Expected at Tenure</th>
              <th>Success Score</th>
              <th>Weighting</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(metricsByCategory).map(([category, categoryMetrics]) =>
              categoryMetrics.map((metric, index) => (
                <tr key={`${category}-${index}`}>
                  {index === 0 && (
                    <td 
                      rowSpan={categoryMetrics.length}
                      style={{ 
                        verticalAlign: 'top',
                        fontWeight: 'bold',
                        borderRight: '2px solid #e5e7eb',
                        backgroundColor: '#f8fafc',
                        color: '#000000'
                      }}
                    >
                      {category}
                    </td>
                  )}
                  <td>{metric.field}</td>
                  <td>{metric.currentValue}</td>
                  <td>{metric.expectedAtTenure}</td>
                  <td>
                    <span 
                      className="metric-score"
                      style={{ backgroundColor: getScoreColor(metric.successScore) }}
                    >
                      {metric.successScore}
                    </span>
                  </td>
                  <td>{metric.weighting}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProducerDetailWithSharePoint
