import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

import MainLayout from '@/layout/MainLayout';
import { CSVParserService } from '@/services/selectGradSuccess/CSVParserService';

import { ColumnFilters, Producer, ProducerSummary, SortConfig } from '../types';
import {
  errorContainer,
  filtersContainer,
  loadingContainer,
  successScoreHigh,
  successScoreLow,
  successScoreMedium,
  tableContainer,
  tableHeader,
  tableRow,
} from './styles';

const PredictorComponent = () => {
  const navigate = useNavigate();
  const [producers, setProducers] = useState<ProducerSummary[]>([]);
  const [allProducerData, setAllProducerData] = useState<Producer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lineOfBusiness, setLineOfBusiness] = useState('All');
  const [region, setRegion] = useState('All Regions');
  const [office, setOffice] = useState('All Offices');

  // Column sorting and filtering state
  const [sortConfig, setSortConfig] = useState<SortConfig | null>({ key: 'successScore', direction: 'asc' });
  const [columnFilters, setColumnFilters] = useState<ColumnFilters>({
    producer: '',
    tenure: '',
    ltmNB: '',
    bookSize: '',
    numberOfWins: '',
    successScore: '',
    flags: '',
  });

  // Get unique values for filters
  const uniqueRegions = useMemo(
    () => [
      'All Regions',
      ...Array.from(new Set(allProducerData.map((p) => p.region).filter((r) => r && r.trim() !== ''))),
    ],
    [allProducerData],
  );

  const uniqueOffices = useMemo(() => {
    // If a specific region is selected, only show offices from that region
    const filteredData =
      region === 'All Regions' ? allProducerData : allProducerData.filter((p) => p.region === region);

    return [
      'All Offices',
      ...Array.from(new Set(filteredData.map((p) => p.office).filter((o) => o && o.trim() !== ''))),
    ];
  }, [allProducerData, region]);

  const uniqueLOBs = useMemo(
    () => [
      'All',
      ...Array.from(
        new Set(
          allProducerData.map((p) => p.lob).filter((lob) => lob && lob.trim() !== '' && lob !== 'Small Commercial'),
        ),
      ),
    ],
    [allProducerData],
  );

  const loadCSVData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const producerData = await CSVParserService.loadCSVFromFile();
      const producerSummaries = CSVParserService.convertToProducerSummary(producerData);

      setAllProducerData(producerData);
      setProducers(producerSummaries);
    } catch (loadError) {
      setError('Failed to load producer data from CSV file');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load CSV data on component mount
  useEffect(() => {
    void loadCSVData();
  }, []);

  // Reset office selection when region changes
  useEffect(() => {
    // Reset office to "All Offices" when region changes
    setOffice('All Offices');
  }, [region]);

  // Filter and sort producers
  const filteredAndSortedProducers = useMemo(() => {
    const filtered = producers.filter((producer) => {
      // Apply LOB, Region, and Office filters
      const lobMatch = lineOfBusiness === 'All' || producer.lob === lineOfBusiness;
      const regionMatch = region === 'All Regions' || producer.region === region;
      const officeMatch = office === 'All Offices' || producer.office === office;

      // Apply column filters
      const columnMatch = Object.entries(columnFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const producerValue = String(producer[key as keyof ProducerSummary]).toLowerCase();
        return producerValue.includes(filterValue.toLowerCase());
      });

      return lobMatch && regionMatch && officeMatch && columnMatch;
    });

    // Apply sorting
    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof ProducerSummary];
        const bValue = b[sortConfig.key as keyof ProducerSummary];

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();

        if (sortConfig.direction === 'asc') {
          return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
        }
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      });
    }

    return filtered;
  }, [producers, lineOfBusiness, region, office, columnFilters, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (prevConfig?.key === key) {
        return { key, direction: prevConfig.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleColumnFilterChange = (column: string, value: string) => {
    setColumnFilters((prev) => ({ ...prev, [column]: value }));
  };

  const handleProducerClick = (producerId: string) => {
    // Find the index of the producer in the original allProducerData array
    const producerIndex = allProducerData.findIndex((p) => p.employeeId === producerId);
    if (producerIndex !== -1) {
      navigate(`/select-grad-success/producer/${producerIndex}`);
    }
  };

  const getSuccessScoreStyle = (score: number) => {
    if (score < 30) return successScoreLow;
    if (score < 60) return successScoreMedium;
    return successScoreHigh;
  };

  const renderSortIndicator = (column: string) => {
    if (sortConfig?.key === column) {
      return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  if (isLoading) {
    return (
      <Box sx={loadingContainer}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading producer data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={errorContainer}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => void loadCSVData()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={tableContainer}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Select Grad Success Predictor</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/select-grad-success')}>
            Back to Home
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Box sx={filtersContainer}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Line of Business</InputLabel>
          <Select
            value={lineOfBusiness}
            label="Line of Business"
            onChange={(e: SelectChangeEvent) => setLineOfBusiness(e.target.value)}
          >
            {uniqueLOBs.map((lob) => (
              <MenuItem key={lob} value={lob}>
                {lob}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Region</InputLabel>
          <Select value={region} label="Region" onChange={(e: SelectChangeEvent) => setRegion(e.target.value)}>
            {uniqueRegions.map((reg) => (
              <MenuItem key={reg} value={reg}>
                {reg}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Office</InputLabel>
          <Select value={office} label="Office" onChange={(e: SelectChangeEvent) => setOffice(e.target.value)}>
            {uniqueOffices.map((off) => (
              <MenuItem key={off} value={off}>
                {off}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Results Summary */}
      <Typography variant="body2" gutterBottom>
        Showing {filteredAndSortedProducers.length} of {producers.length} producers
      </Typography>

      {/* Data Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={tableHeader} onClick={() => handleSort('producer')}>
                Producer{renderSortIndicator('producer')}
              </TableCell>
              <TableCell sx={tableHeader} onClick={() => handleSort('tenure')}>
                Tenure{renderSortIndicator('tenure')}
              </TableCell>
              <TableCell sx={tableHeader} onClick={() => handleSort('ltmNB')}>
                LTM NB{renderSortIndicator('ltmNB')}
              </TableCell>
              <TableCell sx={tableHeader} onClick={() => handleSort('bookSize')}>
                Book Size{renderSortIndicator('bookSize')}
              </TableCell>
              <TableCell sx={tableHeader} onClick={() => handleSort('numberOfWins')}>
                # of Wins{renderSortIndicator('numberOfWins')}
              </TableCell>
              <TableCell sx={tableHeader} onClick={() => handleSort('successScore')}>
                Success Score{renderSortIndicator('successScore')}
              </TableCell>
              <TableCell sx={tableHeader} onClick={() => handleSort('flags')}>
                Flags{renderSortIndicator('flags')}
              </TableCell>
            </TableRow>
            <TableRow>
              {/* Filter Row */}
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filter producer..."
                  value={columnFilters.producer}
                  onChange={(e) => handleColumnFilterChange('producer', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filter tenure..."
                  value={columnFilters.tenure}
                  onChange={(e) => handleColumnFilterChange('tenure', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filter LTM NB..."
                  value={columnFilters.ltmNB}
                  onChange={(e) => handleColumnFilterChange('ltmNB', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filter book size..."
                  value={columnFilters.bookSize}
                  onChange={(e) => handleColumnFilterChange('bookSize', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filter wins..."
                  value={columnFilters.numberOfWins}
                  onChange={(e) => handleColumnFilterChange('numberOfWins', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filter score..."
                  value={columnFilters.successScore}
                  onChange={(e) => handleColumnFilterChange('successScore', e.target.value)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  size="small"
                  placeholder="Filter flags..."
                  value={columnFilters.flags}
                  onChange={(e) => handleColumnFilterChange('flags', e.target.value)}
                />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedProducers.map((producer) => (
              <TableRow
                key={producer.employeeId}
                sx={tableRow}
                onClick={() => handleProducerClick(producer.employeeId)}
              >
                <TableCell>{producer.producer}</TableCell>
                <TableCell>{producer.tenure.toFixed(2)}</TableCell>
                <TableCell>{producer.ltmNB}</TableCell>
                <TableCell>{producer.bookSize}</TableCell>
                <TableCell>{producer.numberOfWins}</TableCell>
                <TableCell sx={getSuccessScoreStyle(producer.successScore)}>
                  {producer.successScore.toFixed(1)}
                </TableCell>
                <TableCell>{producer.flags}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const Predictor = () => <MainLayout pageContent={<PredictorComponent />} />;

export default Predictor;
