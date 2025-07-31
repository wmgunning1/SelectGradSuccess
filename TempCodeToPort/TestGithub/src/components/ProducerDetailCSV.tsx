import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CSVParserService, SurrogateKeyService } from '../services/CSVParserService'
import { Producer } from '../types/Producer'
import './ProducerDetail.css'

const ProducerDetailCSV: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [producer, setProducer] = useState<Producer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allProducers, setAllProducers] = useState<Producer[]>([])
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    'bookNB': true,
    'activities': true,
    'poachingRisks': false,
    'otherFactors': false
  })

  useEffect(() => {
    loadProducerData()
  }, [id])

  const loadProducerData = async () => {
    if (!id) {
      setError('No producer ID provided')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      // Load CSV data
      const response = await fetch('/PredictGradDummyData.csv')
      if (!response.ok) {
        throw new Error('CSV file not found')
      }
      const csvContent = await response.text()
      const producers = CSVParserService.parseCSVToProducers(csvContent)
      setAllProducers(producers)

      // Get specific producer by surrogate key
      const producerData = CSVParserService.getProducerBySurrogateKey(id, producers)
      if (producerData) {
        setProducer(producerData)
        console.log('Selected producer:', producerData.fullName, 'Office:', producerData.office)
        console.log('Success Score:', producerData.successScore, 'Rounded:', Math.round(producerData.successScore))
        console.log('Same office producers:', producers.filter(p => p.office === producerData.office).map(p => p.fullName))
      } else {
        setError('Producer not found')
      }
    } catch (err) {
      console.error('Error loading producer data:', err)
      setError('Failed to load producer data')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: string): string => {
    if (!value || value === '0' || value === '$0') return '$0'
    
    // Remove any existing formatting and convert to number
    const numValue = parseFloat(value.replace(/[$,]/g, ''))
    if (isNaN(numValue)) return value
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue)
  }

  const formatPercentage = (value: string): string => {
    if (!value || value === '0') return '0%'
    
    // If already has %, return as is
    if (value.includes('%')) return value
    
    const numValue = parseFloat(value.replace(/[%]/g, ''))
    if (isNaN(numValue)) return value
    
    return `${Math.round(numValue * 100)}%`
  }

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#059669' // Green for 80-100
    if (score >= 50) return '#d97706' // Orange for 50-79  
    if (score >= 30) return '#dc2626' // Red for 30-49
    return '#6b7280' // Gray for very low scores below 30
  }

  const getScoreClass = (score: number): string => {
    if (score >= 80) return 'score-high'
    if (score >= 50) return 'score-medium'
    if (score >= 30) return 'score-low'
    return 'score-very-low'
  }

  const getOrdinalSuffix = (num: number): string => {
    const lastDigit = num % 10
    const lastTwoDigits = num % 100
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return `${num}th`
    }
    
    switch (lastDigit) {
      case 1:
        return `${num}st`
      case 2:
        return `${num}nd`
      case 3:
        return `${num}rd`
      default:
        return `${num}th`
    }
  }

  const handleProducerChange = (selectedName: string) => {
    // Find the producer with the selected name from the same office
    const selectedProducer = allProducers.find(p => p.fullName === selectedName && p.office === producer?.office)
    if (selectedProducer) {
      const surrogateKeyService = SurrogateKeyService.getInstance()
      const surrogateKey = surrogateKeyService.getSurrogateFromEmployeeId(selectedProducer.employeeId)
      if (surrogateKey) {
        navigate(`/producer/${surrogateKey}`)
      }
    }
  }

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  if (isLoading) {
    return (
      <div className="App">
        <div className="usi-header" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="usi-logo">USI</div>
            <h1 style={{ margin: '0 0 0 1rem', fontSize: '1.5rem' }}>Select Grad Success Predictor</h1>
          </div>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading producer details...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="App">
        <div className="usi-header" style={{ padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className="usi-logo">USI</div>
            <h1 style={{ margin: '0 0 0 1rem', fontSize: '1.5rem' }}>Select Grad Success Predictor</h1>
          </div>
          <button 
            onClick={() => navigate('/predictor')}
            className="home-button"
            title="Back to Producer List"
          >
            ← Back
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#dc2626' }}>
          <div>Error: {error}</div>
        </div>
      </div>
    )
  }

  if (!producer) {
    return (
      <div className="App">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Producer not found</div>
        </div>
      </div>
    )
  }

  // Calculate tenure in months from tenure hire
  const tenureMonths = Math.round(producer.tenureHire * 12)
  const tenureYears = producer.tenureHire
  const tenureText = tenureYears < 1 ? `${tenureMonths} Months` : 
                    tenureYears === 1 ? '1 Year' : 
                    `${tenureYears.toFixed(1)} Years`

  return (
    <div className="App">
      {/* Header */}
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
            title="Grid View"
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

      {/* Producer Header */}
      <div className="producer-header">
        <div className="producer-selector">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <label style={{ fontWeight: 500, color: '#374151', fontSize: '1.1rem', marginBottom: '0.3rem' }}>Producer</label>
            <select 
              value={producer.fullName} 
              onChange={(e) => handleProducerChange(e.target.value)}
              style={{ padding: '0.5rem', minWidth: '140px', maxWidth: '220px', width: '180px' }}
            >
              {allProducers
                .filter(p => p.office === producer.office)
                .sort((a, b) => a.fullName.localeCompare(b.fullName))
                .map(p => (
                  <option key={p.employeeId} value={p.fullName}>
                    {p.fullName}
                  </option>
                ))
              }
            </select>
          </div>
        </div>

        <div className="producer-success-score">
          <div 
            className="percentile-display"
            style={{
              background: `conic-gradient(
                from 0deg,
                ${getScoreColor(producer.successScore)} 0deg,
                ${getScoreColor(producer.successScore)} ${(producer.successScore / 100) * 360}deg,
                #e5e7eb ${(producer.successScore / 100) * 360}deg,
                #e5e7eb 360deg
              )`
            }}
          >
            <div 
              className="percentile-value" 
              style={{ color: getScoreColor(producer.successScore) }}
            >
              {Math.round(producer.successScore)}
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
            Success Score
          </div>
        </div>

        <div className="producer-info" style={{ marginLeft: '2.5rem', marginTop: '1.2rem' }}>
          <div className="producer-info-grid">
            <div>
              <strong>Direct Manager</strong> {producer.directManager}
            </div>
            <div>
              <strong>Vertical</strong> {producer.vertical}
            </div>
            <div>
              <strong>Office</strong> {producer.office}
            </div>
            <div>
              <strong>Region</strong> {producer.region}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-label">Current Salary</div>
          <div className="metric-value">{formatCurrency(producer.currentSalary)}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">MM Book</div>
          <div className="metric-value">{formatCurrency(producer.currentTotalBV)}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">LTM MM NB</div>
          <div className="metric-value">{formatCurrency(producer.ltmNB)}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">MM Tenure</div>
          <div className="metric-value">{tenureText}</div>
        </div>
        
        <div className="metric-card">
          <div className="metric-label">Percentile Rank</div>
          <div className="metric-value">{getOrdinalSuffix(Math.round(producer.percentile))}</div>
        </div>
        
        <div className="metric-card flags">
          <div className="metric-value flag-icon">🚩</div>
          <div className="metric-label">{producer.numberOfFlags} Flags</div>
        </div>
      </div>

      {/* Details Table */}
      <div className="details-container">
        <table className="details-table">
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
            {/* Book & NB Section */}
            <tr className="section-header">
              <td colSpan={6}>
                <div className="section-toggle" onClick={() => toggleSection('bookNB')}>
                  <span>{expandedSections.bookNB ? '▼' : '▶'} Book & NB</span>
                </div>
              </td>
            </tr>
            {expandedSections.bookNB && (
              <>
                <tr>
                  <td>Book / Starting MM Salary</td>
                  <td>{parseFloat(producer.sgCurrentBVRatio).toFixed(2)}</td>
                  <td>{parseFloat(producer.currentBookSizeExpected).toFixed(2)}</td>
                  <td>
                    <span className={getScoreClass(producer.currentBVScore)} style={{ color: getScoreColor(producer.currentBVScore) }}>
                      {Math.round(producer.currentBVScore)}
                    </span>
                  </td>
                  <td>10%</td>
                  <td></td>
                </tr>
                <tr>
                  <td>LTM MM NB/ Starting MM Salary</td>
                  <td>{parseFloat(producer.sgnbRatio).toFixed(2)}</td>
                  <td>{parseFloat(String(producer.ltmNBExpected)).toFixed(2)}</td>
                  <td>
                    <span className={getScoreClass(producer.ltmNBScore)} style={{ color: getScoreColor(producer.ltmNBScore) }}>
                      {Math.round(producer.ltmNBScore)}
                    </span>
                  </td>
                  <td>14%</td>
                  <td></td>
                </tr>
              </>
            )}

            {/* Activities Section */}
            <tr className="section-header">
              <td colSpan={6}>
                <div className="section-toggle" onClick={() => toggleSection('activities')}>
                  <span>{expandedSections.activities ? '▼' : '▶'} Activities</span>
                </div>
              </td>
            </tr>
            {expandedSections.activities && (
              <>
                <tr>
                  <td># Prospects (20-50K Revenue)</td>
                  <td>{producer.prospectInRange}</td>
                  <td>{producer.prospectsExpected}</td>
                  <td>
                    <span className={getScoreClass(producer.prospectsScore)} style={{ color: getScoreColor(producer.prospectsScore) }}>
                      {Math.round(producer.prospectsScore)}
                    </span>
                  </td>
                  <td>10%</td>
                  <td></td>
                </tr>
                <tr>
                  <td>First Appointments</td>
                  <td>{producer.firstAppointmentsPostGrad}</td>
                  <td>{producer.firstAppointmentsExpected}</td>
                  <td>
                    <span className={getScoreClass(producer.firstAppointmentsScore)} style={{ color: getScoreColor(producer.firstAppointmentsScore) }}>
                      {Math.round(producer.firstAppointmentsScore)}
                    </span>
                  </td>
                  <td>14%</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Second Appointments</td>
                  <td>{producer.secondAppointmentsPostGrad}</td>
                  <td>{producer.secondAppointmentsExpected}</td>
                  <td>
                    <span className={getScoreClass(producer.secondAppointmentsScore)} style={{ color: getScoreColor(producer.secondAppointmentsScore) }}>
                      {Math.round(producer.secondAppointmentsScore)}
                    </span>
                  </td>
                  <td>7%</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Ride-Alongs</td>
                  <td>{producer.rideAlongsPostGrad}</td>
                  <td>{producer.rideAlongsExpected}</td>
                  <td>
                    <span className={getScoreClass(producer.rideAlongsScore)} style={{ color: getScoreColor(producer.rideAlongsScore) }}>
                      {Math.round(producer.rideAlongsScore)}
                    </span>
                  </td>
                  <td>10%</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Advance Ratio</td>
                  <td>{producer.advanceRatio}</td>
                  <td>{producer.advanceRatioExpected}</td>
                  <td>
                    <span className={getScoreClass(producer.advanceRatioScore)} style={{ color: getScoreColor(producer.advanceRatioScore) }}>
                      {Math.round(producer.advanceRatioScore)}
                    </span>
                  </td>
                  <td>7%</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Closing Ratio</td>
                  <td>{producer.closingRatio}</td>
                  <td>{producer.closingRatioExpected}</td>
                  <td>
                    <span className={getScoreClass(producer.closingRatioScore)} style={{ color: getScoreColor(producer.closingRatioScore) }}>
                      {Math.round(producer.closingRatioScore)}
                    </span>
                  </td>
                  <td>14%</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Number of Wins</td>
                  <td>{producer.numberOfWinsSinceGraduation}</td>
                  <td>{producer.numberOfWinsExpected}</td>
                  <td>
                    <span className={getScoreClass(producer.numberOfWinsScore)} style={{ color: getScoreColor(producer.numberOfWinsScore) }}>
                      {Math.round(producer.numberOfWinsScore)}
                    </span>
                  </td>
                  <td>7%</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Median Win Size</td>
                  <td>{formatCurrency(producer.medianWinSize)}</td>
                  <td>{formatCurrency(producer.averageWinSizeExpected)}</td>
                  <td>
                    <span className={getScoreClass(producer.averageWinSizeScore)} style={{ color: getScoreColor(producer.averageWinSizeScore) }}>
                      {Math.round(producer.averageWinSizeScore)}
                    </span>
                  </td>
                  <td>7%</td>
                  <td></td>
                </tr>
              </>
            )}

            {/* Poaching Risks Section */}
            <tr className="section-header">
              <td colSpan={6}>
                <div className="section-toggle" onClick={() => toggleSection('poachingRisks')}>
                  <span>{expandedSections.poachingRisks ? '▼' : '▶'} Poaching Risks</span>
                </div>
              </td>
            </tr>
            {expandedSections.poachingRisks && (
              <>
                <tr>
                  <td>Split Wins 🛈</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{producer.partnersWhoPairUpFlag === 'Y' ? '🚩' : ''}</td>
                </tr>
                <tr>
                  <td>Base Salary Relative to NB</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{producer.baseSalaryTooLowRelativeToNBFlag === 'Y' ? '🚩' : ''}</td>
                </tr>
                <tr>
                  <td>Base Salary Relative to BV</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{producer.baseSalaryTooLowRelativeToBVFlag === 'Y' ? '🚩' : ''}</td>
                </tr>
                <tr>
                  <td style={{ color: '#9ca3af' }}>△ Leadership LTM 🛈</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ color: '#9ca3af' }}>Commuting Distance 🛈</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td style={{ color: '#9ca3af' }}>Move from Primary Office 🛈</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </>
            )}

            {/* Other Factors Section */}
            <tr className="section-header">
              <td colSpan={6}>
                <div className="section-toggle" onClick={() => toggleSection('otherFactors')}>
                  <span>{expandedSections.otherFactors ? '▼' : '▶'} Other Factors</span>
                </div>
              </td>
            </tr>
            {expandedSections.otherFactors && (
              <>
                <tr>
                  <td>PIP History 🛈</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{producer.pipFlag === 'Y' ? '🚩' : ''}</td>
                </tr>
                <tr>
                  <td>CCAT 🛈</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{producer.ccatFlag === 'Y' ? '🚩' : ''}</td>
                </tr>
                <tr>
                  <td>EPP 🛈</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{producer.eppFlag === 'Y' ? '🚩' : ''}</td>
                </tr>
                <tr>
                  <td>Illustrate 🛈</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>{producer.illustrateFlag === 'Y' ? '🚩' : ''}</td>
                </tr>
                <tr>
                  <td style={{ color: '#9ca3af' }}>Average Interview Scores</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProducerDetailCSV
