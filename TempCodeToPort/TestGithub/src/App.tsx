import { Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import ProducerTable from './components/ProducerTable'
import ProducerDetailNew from './components/ProducerDetailNew'
import ProducerDetailCSV from './components/ProducerDetailCSV'
import ProducerDetailRedirect from './components/ProducerDetailRedirect'
import ProducerTableWithSharePoint from './components/ProducerTableWithSharePoint'
import ProducerDetailWithSharePoint from './components/ProducerDetailWithSharePoint'
import ProducerTableAlternative from './components/ProducerTableAlternative'
import SharePointIntegration from './components/SharePointIntegration'
import './App.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/predictor" element={<ProducerTableAlternative />} />
        <Route path="/producer/:id" element={<ProducerDetailCSV />} />
        <Route path="/producer-new/:id" element={<ProducerDetailNew />} />
        <Route path="/predictor-auth" element={<ProducerTableWithSharePoint />} />
        <Route path="/predictor-mock" element={<ProducerTable />} />
        <Route path="/sharepoint" element={<SharePointIntegration />} />
      </Routes>
    </div>
  )
}

export default App
