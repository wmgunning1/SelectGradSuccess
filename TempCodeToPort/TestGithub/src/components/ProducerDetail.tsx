import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CSVParserService } from '../services/CSVParserService'
import { Producer } from '../types/Producer'

interface MetricRow {
  category: string
  field: string
  currentValue: string | number
  expectedAtTenure: string | number
  successScore: number
  weighting: string
  riskFactors?: string
}

const mockProducerData = {
  '1': { 
    name: 'Ramzy Sayegh', 
    directManager: 'John Dempsey', 
    vertical: 'Commercial Lines', 
    currentSalary: '$90,000', 
    mmBook: '$0', 
    ltmMmNb: '$0', 
    mmTenure: '3 Months', 
    percentileRank: '25th', 
    flags: 0, 
    metrics: [
      {
        category: 'Book & NB',
        field: 'Book / Starting MM Salary',
        currentValue: 0.0,
        expectedAtTenure: 0.3,
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
      }
    ]
  },
  '2': { 
    name: 'Romy Nunez', 
    directManager: 'John Dempsey', 
    vertical: 'Commercial Lines', 
    currentSalary: '$95,000', 
    mmBook: '$0', 
    ltmMmNb: '$0', 
    mmTenure: '7 Months', 
    percentileRank: '30th', 
    flags: 0, 
    metrics: [
      {
        category: 'Book & NB',
        field: 'Book / Starting MM Salary',
        currentValue: 0.0,
        expectedAtTenure: 0.4,
        successScore: 3,
        weighting: '10%'
      }
    ]
  },
  '3': { 
    name: 'Chaz Gorman', 
    directManager: 'John Dempsey', 
    vertical: 'Commercial Lines', 
    currentSalary: '$88,000', 
    mmBook: '$0', 
    ltmMmNb: '$0', 
    mmTenure: '2 Months', 
    percentileRank: '35th', 
    flags: 0, 
    metrics: [
      {
        category: 'Book & NB',
        field: 'Book / Starting MM Salary',
        currentValue: 0.0,
        expectedAtTenure: 0.2,
        successScore: 4,
        weighting: '10%'
      }
    ]
  },
  '7': {
    name: 'Ryan Dumbach',
    directManager: 'John Dempsey',
    vertical: 'Construction',
    currentSalary: '$130,000',
    mmBook: '$99,157',
    ltmMmNb: '$40,071',
    mmTenure: '14 Months',
    percentileRank: '53rd',
    flags: 0,
    metrics: [
      {
        category: 'Book & NB',
        field: 'Book / Starting MM Salary',
        currentValue: 0.76,
        expectedAtTenure: 0.61,
        successScore: 10,
        weighting: '10%'
      },
      {
        category: 'Book & NB',
        field: 'LTM MM NB / Starting MM Salary',
        currentValue: 0.31,
        expectedAtTenure: 0.53,
        successScore: 2,
        weighting: '14%'
      },
      {
        category: 'Activities',
        field: '# Prospects (20-50K Revenue)',
        currentValue: 217,
        expectedAtTenure: 100,
        successScore: 10,
        weighting: '10%'
      },
      {
        category: 'Activities',
        field: 'First Appointments',
        currentValue: 54,
        expectedAtTenure: 85,
        successScore: 3,
        weighting: '14%'
      },
      {
        category: 'Activities',
        field: 'Second Appointments',
        currentValue: 26,
        expectedAtTenure: 28,
        successScore: 8,
        weighting: '7%'
      },
      {
        category: 'Activities',
        field: 'Ride - Alongs',
        currentValue: 33,
        expectedAtTenure: 42,
        successScore: 5,
        weighting: '10%'
      },
      {
        category: 'Activities',
        field: 'Advance Ratio',
        currentValue: '48%',
        expectedAtTenure: '33%',
        successScore: 0,
        weighting: '7%'
      },
      {
        category: 'Activities',
        field: 'Closing Ratio',
        currentValue: '4%',
        expectedAtTenure: '4%',
        successScore: 3,
        weighting: '14%'
      },
      {
        category: 'Activities',
        field: 'Number of Wins',
        currentValue: 2,
        expectedAtTenure: 4,
        successScore: 2,
        weighting: '7%'
      },
      {
        category: 'Activities',
        field: 'Median Win Size',
        currentValue: '$29,000',
        expectedAtTenure: '$40,400',
        successScore: 2,
        weighting: '7%'
      },
      {
        category: 'Poaching Risks',
        field: 'Poaching Risk Indicator',
        currentValue: 'Low',
        expectedAtTenure: 'Low',
        successScore: 8,
        weighting: '5%'
      }
    ]
  }
}

const ProducerDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [producer, setProducer] = useState<Producer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadProducerData()
  }, [id])

  const loadProducerData = async () => {
    try {
      // Load CSV data and find the specific producer
      const response = await fetch('/PredictGradDummyData.csv')
      if (!response.ok) {
        throw new Error('CSV file not found')
      }
      
      const csvContent = await response.text()
      const producers = CSVParserService.parseCSVToProducers(csvContent)
      const foundProducer = producers.find(p => p.employeeId === id)
      
      if (!foundProducer) {
        throw new Error('Producer not found')
      }
      
      setProducer(foundProducer)
    } catch (err) {
      console.error('Error loading producer data:', err)
      setError('Could not load producer data')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="App">
        <div className="usi-header" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="usi-logo">USI</div>
            <h1 style={{ margin: '0 0 0 1rem', fontSize: '1.5rem' }}>Producer Detail</h1>
          </div>
          <button 
            onClick={() => navigate('/predictor')}
            className="home-button"
            title="Back to Table"
          >
            ← Back
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading producer data...
        </div>
      </div>
    )
  }

  if (error || !producer) {
    return (
      <div className="App">
        <div className="usi-header" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="usi-logo">USI</div>
            <h1 style={{ margin: '0 0 0 1rem', fontSize: '1.5rem' }}>Producer Detail</h1>
          </div>
          <button 
            onClick={() => navigate('/predictor')}
            className="home-button"
            title="Back to Table"
          >
            ← Back
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'red' }}>{error || 'Producer not found'}</p>
        </div>
      </div>
    )
  }
  
  // Use the producer from CSV data that was loaded
  if (!producer) {
    return <div>Producer not found</div>
  }

  const getScoreColor = (score: number) => {
    if (score <= 3) return '#dc2626'
    if (score <= 7) return '#d97706'
    return '#059669'
  }

  const groupedMetrics = producer.metrics.reduce((acc, metric) => {
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
        <div className="producer-detail-header">
          <div className="producer-info-left">
            <div className="producer-dropdown">
              <label style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem', display: 'block' }}>Producer</label>
              <select 
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: 'white',
                  minWidth: '200px',
                  fontSize: '1rem'
                }}
                value={producer.name}
                onChange={(e) => {
                  // Find producer by name and navigate
                  const selectedProducer = Object.entries(mockProducerData).find(([_, data]) => data.name === e.target.value);
                  if (selectedProducer) {
                    navigate(`/producer/${selectedProducer[0]}`);
                  }
                }}
              >
                {Object.entries(mockProducerData).map(([id, data]) => (
                  <option key={id} value={data.name}>{data.name}</option>
                ))}
              </select>
            </div>
            <div style={{ marginTop: '1rem', color: '#666' }}>
              <div><strong>Direct Manager:</strong> {producer.directManager}</div>
              <div><strong>Vertical:</strong> {producer.vertical}</div>
            </div>
          </div>
          
          <div className="producer-info-cards">
            <div className="info-card-row">
              <div className="info-card-small">
                <div className="info-label">Current Salary</div>
                <div className="info-value">{producer.currentSalary}</div>
              </div>
              <div className="info-card-small">
                <div className="info-label">MM Book</div>
                <div className="info-value">{producer.mmBook}</div>
              </div>
              <div className="info-card-small">
                <div className="info-label">LTM MM NB</div>
                <div className="info-value">{producer.ltmMmNb}</div>
              </div>
            </div>
            <div className="info-card-row">
              <div className="info-card-small">
                <div className="info-label">MM Tenure</div>
                <div className="info-value">{producer.mmTenure}</div>
              </div>
              <div className="info-card-small">
                <div className="info-label">Percentile Rank</div>
                <div className="info-value">{producer.percentileRank}</div>
              </div>
              <div className="info-card-small">
                <div className="info-label">Flags</div>
                <div className="info-value">{producer.flags}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
          <button 
            onClick={() => navigate('/predictor')}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ← Back
          </button>
        </div>

        <table className="metrics-table">
          <thead>
            <tr>
              <th>Field/Category</th>
              <th>Current Value</th>
              <th>Expected at Tenure</th>
              <th>Success Score</th>
              <th>Weighting %</th>
              <th>Risk Factors</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedMetrics).map(([category, metrics]) => (
              <>
                <tr key={category} style={{ backgroundColor: '#f3f4f6' }}>
                  <td colSpan={6} style={{ fontWeight: 'bold', padding: '0.5rem', color: '#000000' }}>
                    {category}
                  </td>
                </tr>
                {metrics.map((metric, index) => (
                  <tr key={`${category}-${index}`}>
                    <td style={{ paddingLeft: '2rem' }}>{metric.field}</td>
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
                    <td>{metric.riskFactors || ''}</td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProducerDetail
