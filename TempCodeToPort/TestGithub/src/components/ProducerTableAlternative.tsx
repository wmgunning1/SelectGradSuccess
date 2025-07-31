import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SimpleSharePointService, { ProducerData } from '../services/SimpleSharePointService'
import ManualDataImport from './ManualDataImport'
import { CSVParserService, SurrogateKeyService } from '../services/CSVParserService'
import { Producer, ProducerSummary } from '../types/Producer'

const ProducerTableAlternative: React.FC = () => {
  const navigate = useNavigate()
  const [producers, setProducers] = useState<ProducerSummary[]>([])
  const [allProducerData, setAllProducerData] = useState<Producer[]>([]) // Store full producer data
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionMethod, setConnectionMethod] = useState<'none' | 'sharepoint' | 'manual' | 'csv'>('none')
  const [lineOfBusiness, setLineOfBusiness] = useState('All')
  const [region, setRegion] = useState('All Regions')

  // Column sorting and filtering state
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>({ key: 'successScore', direction: 'asc' })
  const [columnFilters, setColumnFilters] = useState<{[key: string]: string}>({
    producer: '',
    tenure: '',
    ltmNB: '',
    bookSize: '',
    numberOfWins: '',
    successScore: '',
    flags: ''
  })

  // Get unique values for filters
  const uniqueRegions = ['All Regions', ...Array.from(new Set(allProducerData.map(p => p.region).filter(r => r && r.trim() !== '')))]
  const uniqueLOBs = ['All', ...Array.from(new Set(allProducerData.map(p => p.lob).filter(lob => lob && lob.trim() !== '' && lob !== 'Small Commercial')))]

  const sharePointService = SimpleSharePointService.getInstance()

  // Auto-load CSV data on component mount
  useEffect(() => {
    loadCSVData()
  }, [])

  const loadCSVData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Loading producer data from CSV file...')
      // For now, let's load the CSV content manually since the file is in the workspace
      const csvContent = await loadCSVFromWorkspace()
      const producerData = CSVParserService.parseCSVToProducers(csvContent)
      const producerSummaries = CSVParserService.convertToProducerSummary(producerData)
      
      setAllProducerData(producerData) // Store full producer data for filtering
      setProducers(producerSummaries)
      setConnectionMethod('csv')
      console.log(`Successfully loaded ${producerSummaries.length} producers from CSV`)
    } catch (err) {
      console.error('CSV loading failed:', err)
      setError('Could not load CSV data. You can try manual import instead.')
      setConnectionMethod('none')
    } finally {
      setIsLoading(false)
    }
  }

  const loadCSVFromWorkspace = async (): Promise<string> => {
    // For now, we'll need to either:
    // 1. Copy the CSV to the public folder and fetch it from there
    // 2. Or provide a manual upload feature
    
    // Let's try to read the CSV content that should be copied to public folder
    try {
      const response = await fetch('/PredictGradDummyData.csv')
      if (!response.ok) {
        throw new Error('CSV file not found in public folder')
      }
      return await response.text()
    } catch (error) {
      // If that fails, throw error to trigger fallback to manual import
      throw new Error('CSV file not accessible. Please use manual import.')
    }
  }

  // Sorting function
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Column filter function
  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }))
  }

  // Get sort icon
  const getSortIcon = (column: string) => {
    if (!sortConfig || sortConfig.key !== column) {
      return '↕️'
    }
    return sortConfig.direction === 'asc' ? '↑' : '↓'
  }

  const filteredProducers = producers.filter(producer => {
    // Find the full producer data to access LOB field and other fields
    const fullProducerData = allProducerData.find(p => p.employeeId === producer.employeeId)
    const tenureText = fullProducerData ? `${fullProducerData.tenureGraduation}` : '0'
    
    // Apply main filters (LOB and Region)
    const lineMatch = lineOfBusiness === 'All' || 
                     (fullProducerData && fullProducerData.lob === lineOfBusiness)
    const regionMatch = region === 'All Regions' || producer.region === region
    
    // Apply column filters
    const producerMatch = producer.name.toLowerCase().includes(columnFilters.producer.toLowerCase())
    const tenureMatch = tenureText.includes(columnFilters.tenure)
    const ltmNBMatch = producer.ltmNB.toLowerCase().includes(columnFilters.ltmNB.toLowerCase())
    const bookSizeMatch = producer.currentBV.toLowerCase().includes(columnFilters.bookSize.toLowerCase())
    const winsMatch = fullProducerData ? fullProducerData.numberOfWins.toString().includes(columnFilters.numberOfWins) : true
    const scoreMatch = producer.successScore.toString().includes(columnFilters.successScore)
    const flagsMatch = fullProducerData ? fullProducerData.numberOfFlags.toString().includes(columnFilters.flags) : true
    
    return lineMatch && regionMatch && producerMatch && tenureMatch && ltmNBMatch && 
           bookSizeMatch && winsMatch && scoreMatch && flagsMatch
  }).sort((a, b) => {
    if (!sortConfig) return 0
    
    const fullProducerDataA = allProducerData.find(p => p.employeeId === a.employeeId)
    const fullProducerDataB = allProducerData.find(p => p.employeeId === b.employeeId)
    
    let aValue: any, bValue: any
    
    switch (sortConfig.key) {
      case 'producer':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'tenure':
        aValue = fullProducerDataA ? fullProducerDataA.tenureGraduation : 0
        bValue = fullProducerDataB ? fullProducerDataB.tenureGraduation : 0
        break
      case 'ltmNB':
        aValue = parseFloat(a.ltmNB.replace(/[$,]/g, '')) || 0
        bValue = parseFloat(b.ltmNB.replace(/[$,]/g, '')) || 0
        break
      case 'bookSize':
        aValue = parseFloat(a.currentBV.replace(/[$,]/g, '')) || 0
        bValue = parseFloat(b.currentBV.replace(/[$,]/g, '')) || 0
        break
      case 'numberOfWins':
        aValue = fullProducerDataA ? fullProducerDataA.numberOfWins : 0
        bValue = fullProducerDataB ? fullProducerDataB.numberOfWins : 0
        break
      case 'successScore':
        aValue = a.successScore
        bValue = b.successScore
        break
      case 'flags':
        aValue = fullProducerDataA ? fullProducerDataA.numberOfFlags : 0
        bValue = fullProducerDataB ? fullProducerDataB.numberOfFlags : 0
        break
      default:
        aValue = a.successScore
        bValue = b.successScore
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const getSuccessScoreClass = (score: number) => {
    if (score >= 70) return 'success-score high'
    if (score >= 50) return 'success-score medium'
    return 'success-score low'
  }

  const handleRowClick = (surrogateKey: string) => {
    navigate(`/producer/${surrogateKey}`)
  }

  const handleSharePointConnect = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Attempting to connect to SharePoint without authentication...')
      const data = await sharePointService.getProducerData()
      // Convert SharePoint data to ProducerSummary format
      const surrogateService = SurrogateKeyService.getInstance()
      surrogateService.reset()
      const convertedData: ProducerSummary[] = data.map(item => ({
        employeeId: item.id,
        surrogateKey: surrogateService.generateSurrogateKey(item.id),
        name: item.name,
        region: item.region || '',
        office: item.vertical || '', // Using vertical as office since office isn't in ProducerData
        vertical: item.vertical,
        manager: item.directManager,
        successScore: item.successScore,
        currentBV: item.bookSize,
        ltmNB: item.ltmMmNb,
        percentile: parseFloat(item.percentileRank) || 0
      }))
      setProducers(convertedData)
      setConnectionMethod('sharepoint')
      console.log(`Successfully loaded ${convertedData.length} producers from SharePoint`)
    } catch (err) {
      console.error('SharePoint connection failed:', err)
      setError(`SharePoint connection failed: ${err}. Try the manual data import instead.`)
      setConnectionMethod('manual')
    } finally {
      setIsLoading(false)
    }
  }

  const handleManualDataImport = (data: ProducerData[]) => {
    // Convert manual import data to ProducerSummary format
    const surrogateService = SurrogateKeyService.getInstance()
    surrogateService.reset()
    const convertedData: ProducerSummary[] = data.map(item => ({
      employeeId: item.id,
      surrogateKey: surrogateService.generateSurrogateKey(item.id),
      name: item.name,
      region: item.region || '',
      office: item.vertical || '', // Using vertical as office since office isn't in ProducerData
      vertical: item.vertical,
      manager: item.directManager,
      successScore: item.successScore,
      currentBV: item.bookSize,
      ltmNB: item.ltmMmNb,
      percentile: parseFloat(item.percentileRank) || 0
    }))
    setProducers(convertedData)
    setConnectionMethod('manual')
    setError(null)
    console.log(`Manually imported ${convertedData.length} producers`)
  }

  const handleOpenSharePoint = () => {
    const sharePointUrl = sharePointService.getSharePointListUrl()
    window.open(sharePointUrl, '_blank')
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
      
      <div className="table-container">
        {/* CSV Data Loaded Successfully */}
        {connectionMethod === 'csv' && (
          <div style={{ marginBottom: '2rem', padding: '1rem 2rem', backgroundColor: '#d1fae5', borderRadius: '8px', border: '1px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#059669', fontSize: '1.2rem' }}>✓</span>
                <span style={{ color: '#059669', fontWeight: '600' }}>
                  Successfully loaded {producers.length} producers from CSV data
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setConnectionMethod('manual')}
                  style={{
                    background: '#8b5cf6',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  Import Different Data
                </button>
                <button
                  onClick={() => setConnectionMethod('sharepoint')}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  Try SharePoint
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Connection Options */}
        {connectionMethod === 'none' && (
          <div style={{ marginBottom: '2rem', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
            <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>Connect to Your Data</h3>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              Choose how you want to load producer data. No app registration required!
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleSharePointConnect}
                disabled={isLoading}
                style={{
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 1.5rem',
                  borderRadius: '6px',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1,
                  fontSize: '1rem',
                }}
              >
                {isLoading ? 'Connecting...' : 'Try SharePoint Connection'}
              </button>

              <button
                onClick={handleOpenSharePoint}
                style={{
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Open SharePoint List
              </button>

              <button
                onClick={() => setConnectionMethod('manual')}
                style={{
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 1.5rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                Manual Data Import
              </button>
            </div>
          </div>
        )}

        {/* Manual Data Import */}
        {connectionMethod === 'manual' && (
          <div style={{ marginBottom: '2rem' }}>
            <ManualDataImport onDataImported={handleManualDataImport} />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button
                onClick={() => setConnectionMethod('none')}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Back to Connection Options
              </button>
            </div>
          </div>
        )}

        {/* Connection Status */}
        {connectionMethod !== 'none' && producers.length > 0 && (
          <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#0369a1', fontWeight: 'bold' }}>
                  ✅ Data Connection Active
                </div>
                <div style={{ fontSize: '0.875rem', color: '#075985' }}>
                  Method: {connectionMethod === 'sharepoint' ? 'SharePoint Direct' : 'Manual Import'} • 
                  Producers: {producers.length}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {connectionMethod === 'sharepoint' && (
                  <button
                    onClick={handleSharePointConnect}
                    disabled={isLoading}
                    style={{
                      background: '#0ea5e9',
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
                )}
                <button
                  onClick={() => {
                    setConnectionMethod('none')
                    setProducers([])
                    setError(null)
                  }}
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
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div style={{
            background: '#fef3c7',
            color: '#92400e',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1rem',
          }}>
            <strong>Connection Issue:</strong> {error}
          </div>
        )}

        {/* Filters */}
        {producers.length > 0 && (
          <div className="filter-controls">
            <div>
              <label>Line of Business</label>
              <select 
                className="filter-select"
                value={lineOfBusiness}
                onChange={(e) => setLineOfBusiness(e.target.value)}
              >
                {uniqueLOBs.map(lob => (
                  <option key={lob} value={lob}>{lob}</option>
                ))}
              </select>
            </div>
            <div>
              <label>Region</label>
              <select 
                className="filter-select"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              >
                {uniqueRegions.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div>Loading producer data...</div>
          </div>
        )}

        {/* Producer Table */}
        {!isLoading && producers.length > 0 && (
          <table className="producer-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('producer')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Producer {getSortIcon('producer')}
                </th>
                <th onClick={() => handleSort('tenure')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  MM Tenure {getSortIcon('tenure')}
                </th>
                <th onClick={() => handleSort('ltmNB')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  LTM MM NB {getSortIcon('ltmNB')}
                </th>
                <th onClick={() => handleSort('bookSize')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Book Size {getSortIcon('bookSize')}
                </th>
                <th onClick={() => handleSort('numberOfWins')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Number of Wins {getSortIcon('numberOfWins')}
                </th>
                <th onClick={() => handleSort('successScore')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  Success Score {getSortIcon('successScore')}
                </th>
                <th onClick={() => handleSort('flags')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  # of Flags {getSortIcon('flags')}
                </th>
              </tr>
              <tr>
                <th style={{ padding: '5px' }}>
                  <input
                    type="text"
                    placeholder="Filter producer..."
                    value={columnFilters.producer}
                    onChange={(e) => handleColumnFilterChange('producer', e.target.value)}
                    style={{ width: '100%', padding: '4px', fontSize: '12px' }}
                  />
                </th>
                <th style={{ padding: '5px' }}>
                  <input
                    type="text"
                    placeholder="Filter tenure..."
                    value={columnFilters.tenure}
                    onChange={(e) => handleColumnFilterChange('tenure', e.target.value)}
                    style={{ width: '100%', padding: '4px', fontSize: '12px' }}
                  />
                </th>
                <th style={{ padding: '5px' }}>
                  <input
                    type="text"
                    placeholder="Filter LTM NB..."
                    value={columnFilters.ltmNB}
                    onChange={(e) => handleColumnFilterChange('ltmNB', e.target.value)}
                    style={{ width: '100%', padding: '4px', fontSize: '12px' }}
                  />
                </th>
                <th style={{ padding: '5px' }}>
                  <input
                    type="text"
                    placeholder="Filter book size..."
                    value={columnFilters.bookSize}
                    onChange={(e) => handleColumnFilterChange('bookSize', e.target.value)}
                    style={{ width: '100%', padding: '4px', fontSize: '12px' }}
                  />
                </th>
                <th style={{ padding: '5px' }}>
                  <input
                    type="text"
                    placeholder="Filter wins..."
                    value={columnFilters.numberOfWins}
                    onChange={(e) => handleColumnFilterChange('numberOfWins', e.target.value)}
                    style={{ width: '100%', padding: '4px', fontSize: '12px' }}
                  />
                </th>
                <th style={{ padding: '5px' }}>
                  <input
                    type="text"
                    placeholder="Filter score..."
                    value={columnFilters.successScore}
                    onChange={(e) => handleColumnFilterChange('successScore', e.target.value)}
                    style={{ width: '100%', padding: '4px', fontSize: '12px' }}
                  />
                </th>
                <th style={{ padding: '5px' }}>
                  <input
                    type="text"
                    placeholder="Filter flags..."
                    value={columnFilters.flags}
                    onChange={(e) => handleColumnFilterChange('flags', e.target.value)}
                    style={{ width: '100%', padding: '4px', fontSize: '12px' }}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducers.map((producer) => {
                // Find the full producer data to access tenureGraduation field
                const fullProducerData = allProducerData.find(p => p.employeeId === producer.employeeId)
                const tenureYears = fullProducerData ? fullProducerData.tenureGraduation : 0
                const tenureText = fullProducerData ? 
                  (tenureYears < 1 ? `${Math.round(tenureYears * 12)} Months` : 
                   tenureYears === 1 ? '1 Year' : 
                   `${tenureYears.toFixed(1)} Years`) : ''
                
                return (
                <tr 
                  key={producer.surrogateKey} 
                  onClick={() => handleRowClick(producer.surrogateKey)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div>{producer.name}</div>
                    {tenureText && <div style={{ fontSize: '0.85em', color: '#666', marginTop: '2px' }}>{tenureText}</div>}
                  </td>
                  <td>{tenureText}</td>
                  <td>{producer.ltmNB}</td>
                  <td>{producer.currentBV}</td>
                  <td>{fullProducerData ? fullProducerData.numberOfWins : 0}</td>
                  <td>
                    <span className={getSuccessScoreClass(producer.successScore)}>
                      {producer.successScore}
                    </span>
                  </td>
                  <td>{fullProducerData ? fullProducerData.numberOfFlags : 0}</td>
                </tr>
                )
              })}
            </tbody>
          </table>
        )}

        {/* No Data State */}
        {!isLoading && connectionMethod !== 'none' && producers.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <div>No producer data loaded yet.</div>
            <div>Use one of the import methods above to load your data.</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProducerTableAlternative
