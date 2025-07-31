import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { CSVParserService } from '../services/CSVParserService'
import { Producer } from '../types/Producer'

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

      <div className="producer-detail">
        <div className="producer-info" style={{ padding: '2rem', backgroundColor: '#f8fafc', margin: '1rem', borderRadius: '8px' }}>
          <h2 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>{producer.fullName}</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            <div className="info-section">
              <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>Basic Information</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Employee ID:</span>
                  <span>{producer.employeeId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Manager:</span>
                  <span>{producer.directManager}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Region:</span>
                  <span>{producer.region}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Office:</span>
                  <span>{producer.office}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Vertical:</span>
                  <span>{producer.vertical}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>LOB:</span>
                  <span>{producer.lob}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>Financial Metrics</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Current Salary:</span>
                  <span>{producer.currentSalary}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Graduation Salary:</span>
                  <span>{producer.graduationSalary}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Current Total BV:</span>
                  <span>{producer.currentTotalBV}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>BV at Graduation:</span>
                  <span>{producer.bvAtGraduation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>LTM NB:</span>
                  <span>{producer.ltmNB}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>Performance Metrics</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Success Score:</span>
                  <span style={{ 
                    color: producer.successScore >= 70 ? '#059669' : producer.successScore >= 50 ? '#d97706' : '#dc2626',
                    fontWeight: 'bold'
                  }}>
                    {producer.successScore}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Percentile:</span>
                  <span>{producer.percentile.toFixed(1)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Number of Wins:</span>
                  <span>{producer.numberOfWins}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Wins Since Graduation:</span>
                  <span>{producer.numberOfWinsSinceGraduation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Number of Flags:</span>
                  <span>{producer.numberOfFlags}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>Tenure Information</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Tenure Hire:</span>
                  <span>{producer.tenureHire.toFixed(2)} years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Tenure Graduation:</span>
                  <span>{producer.tenureGraduation.toFixed(2)} years</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>Activity Metrics</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>First Appointments (Post Grad):</span>
                  <span>{producer.firstAppointmentsPostGrad}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Second Appointments (Post Grad):</span>
                  <span>{producer.secondAppointmentsPostGrad}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Ride-Alongs (Post Grad):</span>
                  <span>{producer.rideAlongsPostGrad}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Advance Ratio:</span>
                  <span>{producer.advanceRatio}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Closing Ratio:</span>
                  <span>{producer.closingRatio}</span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h3 style={{ color: '#059669', marginBottom: '0.5rem' }}>Assessment Scores</h3>
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>CCAT:</span>
                  <span>{producer.ccat}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>EPP:</span>
                  <span>{producer.epp}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>Illustrate:</span>
                  <span>{producer.illustrate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 'bold' }}>PIP History:</span>
                  <span>{producer.pipHistory}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProducerDetail
