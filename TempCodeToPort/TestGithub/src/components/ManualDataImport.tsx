import React, { useState } from 'react';
import { ProducerData } from '../services/SimpleSharePointService';

interface ManualDataImportProps {
  onDataImported: (data: ProducerData[]) => void;
}

const ManualDataImport: React.FC<ManualDataImportProps> = ({ onDataImported }) => {
  const [jsonData, setJsonData] = useState('');
  const [csvData, setCsvData] = useState('');
  const [importMethod, setImportMethod] = useState<'json' | 'csv' | 'manual'>('manual');
  const [error, setError] = useState<string | null>(null);

  const handleJsonImport = () => {
    try {
      const data = JSON.parse(jsonData);
      if (Array.isArray(data)) {
        onDataImported(data);
        setError(null);
      } else {
        setError('JSON data must be an array');
      }
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const handleCsvImport = () => {
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const data: ProducerData[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const producer: ProducerData = {
          id: values[0] || i.toString(),
          name: values[1] || '',
          directManager: values[2] || '',
          vertical: values[3] || '',
          currentSalary: values[4] || '',
          mmBook: values[5] || '',
          ltmMmNb: values[6] || '',
          mmTenure: values[7] || '',
          percentileRank: values[8] || '',
          flags: parseInt(values[9]) || 0,
          successScore: parseInt(values[10]) || 0,
          bookSize: values[5] || '',
          numberOfWins: parseInt(values[11]) || 0,
          region: values[12] || '',
          lineOfBusiness: values[3] || '',
        };
        data.push(producer);
      }

      onDataImported(data);
      setError(null);
    } catch (err) {
      setError('Error parsing CSV data');
    }
  };

  const handleManualEntry = () => {
    // Sample data for demonstration
    const sampleData: ProducerData[] = [
      {
        id: '1',
        name: 'John Smith',
        directManager: 'Jane Doe',
        vertical: 'Commercial Lines',
        currentSalary: '$95,000',
        mmBook: '$150,000',
        ltmMmNb: '$45,000',
        mmTenure: '8 Months',
        percentileRank: '75th',
        flags: 1,
        successScore: 72,
        bookSize: '$150,000',
        numberOfWins: 3,
        region: 'Northeast',
        lineOfBusiness: 'Commercial Lines',
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        directManager: 'Mike Wilson',
        vertical: 'Personal Lines',
        currentSalary: '$85,000',
        mmBook: '$120,000',
        ltmMmNb: '$30,000',
        mmTenure: '12 Months',
        percentileRank: '60th',
        flags: 0,
        successScore: 65,
        bookSize: '$120,000',
        numberOfWins: 2,
        region: 'Southeast',
        lineOfBusiness: 'Personal Lines',
      },
    ];

    onDataImported(sampleData);
    setError(null);
  };

  const sharePointInstructions = `
To get data from SharePoint manually:

1. Go to: https://usii.sharepoint.com/sites/PRSandA/Lists/SelectGradPredictorData/
2. Click "Export to Excel" or "Export to CSV"
3. Copy the data and paste it below

CSV Format expected:
ID,Name,DirectManager,Vertical,CurrentSalary,MMBook,LTMNewBusiness,MMTenure,PercentileRank,Flags,SuccessScore,NumberOfWins,Region
`;

  return (
    <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', margin: '1rem 0' }}>
      <h3 style={{ color: '#1e3a8a', marginBottom: '1rem' }}>Import Producer Data</h3>
      
      {error && (
        <div style={{
          background: '#fee2e2',
          color: '#dc2626',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1rem',
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          <input
            type="radio"
            value="manual"
            checked={importMethod === 'manual'}
            onChange={(e) => setImportMethod(e.target.value as 'manual')}
          />
          Use Sample Data
        </label>
        <label style={{ marginRight: '1rem' }}>
          <input
            type="radio"
            value="csv"
            checked={importMethod === 'csv'}
            onChange={(e) => setImportMethod(e.target.value as 'csv')}
          />
          Import CSV
        </label>
        <label>
          <input
            type="radio"
            value="json"
            checked={importMethod === 'json'}
            onChange={(e) => setImportMethod(e.target.value as 'json')}
          />
          Import JSON
        </label>
      </div>

      {importMethod === 'manual' && (
        <div>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Use sample data to test the application functionality.
          </p>
          <button
            onClick={handleManualEntry}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Load Sample Data
          </button>
        </div>
      )}

      {importMethod === 'csv' && (
        <div>
          <pre style={{ 
            background: '#f8fafc', 
            padding: '1rem', 
            borderRadius: '4px', 
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
            marginBottom: '1rem'
          }}>
            {sharePointInstructions}
          </pre>
          <textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder="Paste CSV data here..."
            style={{
              width: '100%',
              height: '200px',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontFamily: 'monospace',
            }}
          />
          <button
            onClick={handleCsvImport}
            disabled={!csvData.trim()}
            style={{
              background: csvData.trim() ? '#3b82f6' : '#9ca3af',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: csvData.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Import CSV Data
          </button>
        </div>
      )}

      {importMethod === 'json' && (
        <div>
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="Paste JSON array here..."
            style={{
              width: '100%',
              height: '200px',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              marginBottom: '1rem',
              fontFamily: 'monospace',
            }}
          />
          <button
            onClick={handleJsonImport}
            disabled={!jsonData.trim()}
            style={{
              background: jsonData.trim() ? '#3b82f6' : '#9ca3af',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: jsonData.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Import JSON Data
          </button>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f9ff', borderRadius: '6px' }}>
        <h4 style={{ color: '#0369a1', marginBottom: '0.5rem' }}>Alternative: Open SharePoint in New Tab</h4>
        <p style={{ color: '#075985', marginBottom: '1rem' }}>
          You can access your SharePoint list directly and copy data manually.
        </p>
        <a
          href="https://usii.sharepoint.com/sites/PRSandA/Lists/SelectGradPredictorData/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: '#0ea5e9',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            textDecoration: 'none',
            display: 'inline-block',
          }}
        >
          Open SharePoint List →
        </a>
      </div>
    </div>
  );
};

export default ManualDataImport;
