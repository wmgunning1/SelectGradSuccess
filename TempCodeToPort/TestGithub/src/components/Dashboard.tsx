import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  const handleNavigateToPredictor = () => {
    console.log('Button clicked - navigating to predictor')
    navigate('/predictor') // Navigate to the predictor table
  }

  const handleNavigateToTable = () => {
    console.log('Button clicked - navigating to producer table')
    navigate('/predictor') // Navigate to the producer table
  }

  const handleNavigateToSharePoint = () => {
    console.log('Button clicked - navigating to SharePoint')
    navigate('/sharepoint') // Navigate to SharePoint integration
  }

  return (
    <div className="usi-header">
      <div className="dashboard-container">
        <div className="usi-logo">USI</div>
        <h1 className="dashboard-title">Select Graduate Success Tools</h1>
        <p className="dashboard-subtitle">
          Empowering USI Account Managers & Leaders to explore role expectations, 
          assess competencies, and plan for career growth through a guided, interactive experience
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button 
            className="nav-button"
            onClick={handleNavigateToPredictor}
            type="button"
          >
            Select Grad Success Predictor
          </button>
          
          <button 
            className="nav-button"
            onClick={handleNavigateToTable}
            type="button"
          >
            Select vs MM Table
          </button>
          
          <button 
            className="nav-button"
            onClick={handleNavigateToSharePoint}
            type="button"
          >
            SharePoint Integration
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
