import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Producer {
  id: string
  surrogateKey: string
  name: string
  mmTenure: string
  ltmMmNb: string
  bookSize: string
  numberOfWins: number
  successScore: number
  flags: number
}

const mockProducers: Producer[] = [
  {
    id: '1',
    surrogateKey: '1',
    name: 'Ramzy Sayegh',
    mmTenure: '3 Months',
    ltmMmNb: '$0',
    bookSize: '$0',
    numberOfWins: 0,
    successScore: 38,
    flags: 0
  },
  {
    id: '2',
    surrogateKey: '2',
    name: 'Romy Nunez',
    mmTenure: '7 Months',
    ltmMmNb: '$0',
    bookSize: '$0',
    numberOfWins: 0,
    successScore: 39,
    flags: 0
  },
  {
    id: '3',
    surrogateKey: '3',
    name: 'Chaz Gorman',
    mmTenure: '2 Months',
    ltmMmNb: '$0',
    bookSize: '$0',
    numberOfWins: 0,
    successScore: 41,
    flags: 0
  },
  {
    id: '4',
    surrogateKey: '4',
    name: 'Nicholas DiCamillo',
    mmTenure: '8 Months',
    ltmMmNb: '$10,000',
    bookSize: '$10,000',
    numberOfWins: 0,
    successScore: 42,
    flags: 0
  },
  {
    id: '5',
    surrogateKey: '5',
    name: 'Christian Culligan',
    mmTenure: '7 Months',
    ltmMmNb: '$0',
    bookSize: '$0',
    numberOfWins: 0,
    successScore: 47,
    flags: 1
  },
  {
    id: '6',
    surrogateKey: '6',
    name: 'Garrett Busic',
    mmTenure: '10 Months',
    ltmMmNb: '$26,688',
    bookSize: '$26,688',
    numberOfWins: 0,
    successScore: 48,
    flags: 1
  },
  {
    id: '7',
    surrogateKey: '7',
    name: 'Ryan Dumbach',
    mmTenure: '14 Months',
    ltmMmNb: '$40,071',
    bookSize: '$99,157',
    numberOfWins: 2,
    successScore: 52,
    flags: 0
  }
]

const ProducerTable = () => {
  const navigate = useNavigate()
  const [lineOfBusiness, setLineOfBusiness] = useState('Commercial Lines')
  const [region, setRegion] = useState('Midatlantic')

  const getSuccessScoreClass = (score: number) => {
    if (score < 40) return 'low'
    if (score < 50) return 'medium'
    return 'high'
  }

  const handleProducerClick = (surrogateKey: string) => {
    navigate(`/producer/${surrogateKey}`)
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
        <div className="filter-controls">
          <div>
            <label>Line of Business</label>
            <select 
              className="filter-select"
              value={lineOfBusiness}
              onChange={(e) => setLineOfBusiness(e.target.value)}
            >
              <option>Commercial Lines</option>
              <option>Personal Lines</option>
            </select>
          </div>
          
          <div>
            <label>Region</label>
            <select 
              className="filter-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option>Midatlantic</option>
              <option>West</option>
              <option>South</option>
            </select>
          </div>
          
          <button 
            style={{ 
              marginLeft: 'auto', 
              background: '#1e40af', 
              color: 'white', 
              border: 'none', 
              padding: '0.5rem 1rem', 
              borderRadius: '6px' 
            }}
          >
            Switch to Office View
          </button>
        </div>

        <p>Click on the producer that you'd like additional context on</p>

        <table className="producer-table">
          <thead>
            <tr>
              <th>Producer</th>
              <th>MM Tenure</th>
              <th>LTM MM NB</th>
              <th>Book Size</th>
              <th>Number of Wins</th>
              <th>Success Score</th>
              <th># of Flags</th>
            </tr>
          </thead>
          <tbody>
            {mockProducers.map((producer) => (
              <tr 
                key={producer.surrogateKey}
                onClick={() => handleProducerClick(producer.surrogateKey)}
              >
                <td>{producer.name}</td>
                <td>{producer.mmTenure}</td>
                <td>{producer.ltmMmNb}</td>
                <td>{producer.bookSize}</td>
                <td>{producer.numberOfWins}</td>
                <td>
                  <span className={`success-score ${getSuccessScoreClass(producer.successScore)}`}>
                    {producer.successScore}
                  </span>
                </td>
                <td>{producer.flags}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProducerTable
