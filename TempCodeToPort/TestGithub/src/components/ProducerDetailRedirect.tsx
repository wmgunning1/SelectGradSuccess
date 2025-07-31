import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const ProducerDetailRedirect = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to the new producer detail component
    navigate(`/producer-new/${id}`, { replace: true })
  }, [id, navigate])

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

export default ProducerDetailRedirect
