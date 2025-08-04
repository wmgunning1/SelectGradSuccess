import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ExpandLess, ExpandMore, Flag, Info } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
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
  Typography,
} from '@mui/material';

import { ResponsivePie } from '@nivo/pie';

import MainLayout from '@/layout/MainLayout';
import { CSVParserService } from '@/services/selectGradSuccess/CSVParserService';

import { Producer } from '../types';
import {
  categoryRow,
  comparisonTable,
  comparisonTableContainer,
  detailContainer,
  dropdownHeader,
  errorContainer,
  loadingContainer,
  metricRow,
  navigationButtons,
  producerSelectorContainer,
  riskFactorCell,
  successScoreCell,
  successScoreHigh,
  successScoreLow,
  successScoreMedium,
  weightingCell,
} from './styles';

const ProducerDetailComponent = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producer, setProducer] = useState<Producer | null>(null);
  const [allProducers, setAllProducers] = useState<Producer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducerIndex, setSelectedProducerIndex] = useState<number>(-1);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    bookNB: true,
    activities: true,
    poachingRisks: true,
    otherFactors: true,
  });

  const loadProducerData = async () => {
    try {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      const producers = await CSVParserService.loadCSVFromFile();
      setAllProducers(producers);

      // Use the current selectedProducerIndex or parse id from params
      const targetIndex = selectedProducerIndex !== -1 ? selectedProducerIndex : id ? parseInt(id, 10) : -1;

      if (targetIndex >= 0 && targetIndex < producers.length) {
        const producerData = producers[targetIndex];
        setProducer(producerData);

        // Debug logging for flag values
        if (producerData.fullName === 'Matt Jaggard') {
          console.log('Matt Jaggard flag values:', {
            numberOfFlags: producerData.numberOfFlags,
            partnersWhoPairUpFlag: producerData.partnersWhoPairUpFlag,
            baseSalaryTooLowRelativeToNBFlag: producerData.baseSalaryTooLowRelativeToNBFlag,
            baseSalaryTooLowRelativeToBVFlag: producerData.baseSalaryTooLowRelativeToBVFlag,
            pipFlag: producerData.pipFlag,
            ccatFlag: producerData.ccatFlag,
            eppFlag: producerData.eppFlag,
            illustrateFlag: producerData.illustrateFlag,
          });
        }

        if (producerData.fullName === 'Nate Eshlemen') {
          console.log('Nate Eshlemen flag values:', {
            numberOfFlags: producerData.numberOfFlags,
            splitWinsFlag: producerData.splitWinsFlag,
            partnersWhoPairUpFlag: producerData.partnersWhoPairUpFlag,
            baseSalaryTooLowRelativeToNBFlag: producerData.baseSalaryTooLowRelativeToNBFlag,
            baseSalaryTooLowRelativeToBVFlag: producerData.baseSalaryTooLowRelativeToBVFlag,
            deltaLeadershipLTMFlag: producerData.deltaLeadershipLTMFlag,
            commutingDistanceFlag: producerData.commutingDistanceFlag,
            moveFromPrimaryOfficeFlag: producerData.moveFromPrimaryOfficeFlag,
            pipFlag: producerData.pipFlag,
            ccatFlag: producerData.ccatFlag,
            eppFlag: producerData.eppFlag,
            illustrateFlag: producerData.illustrateFlag,
          });
        }

        // Debug logging for BV flag specifically
        console.log(
          `Producer ${producerData.fullName} - baseSalaryTooLowRelativeToBVFlag:`,
          producerData.baseSalaryTooLowRelativeToBVFlag,
        );

        // Debug logging for the entire producer record
        console.log(`Complete producer record for ${producerData.fullName}:`, producerData);

        // Ensure selectedProducerIndex is set to the found producer's index
        if (selectedProducerIndex !== targetIndex) {
          setSelectedProducerIndex(targetIndex);
        }
      } else if (producers.length > 0) {
        // If no specific producer found, use the first one
        setProducer(producers[0]);
        setSelectedProducerIndex(0);
      } else {
        setError('No producer data found');
      }
    } catch (loadError) {
      setError('Failed to load producer data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProducerData();
  }, [selectedProducerIndex, id]); // Depend on both selectedProducerIndex and id from params

  // Sync selectedProducerIndex with URL parameter changes
  useEffect(() => {
    if (id) {
      const indexFromUrl = parseInt(id, 10);
      if (!isNaN(indexFromUrl) && indexFromUrl !== selectedProducerIndex) {
        setSelectedProducerIndex(indexFromUrl);
      }
    }
  }, [id, selectedProducerIndex]);

  const handleProducerChange = (event: SelectChangeEvent<string>) => {
    const newProducerIndex = parseInt(event.target.value, 10);

    // Update state first
    setSelectedProducerIndex(newProducerIndex);

    // Navigate to the new URL without replacing current history entry
    navigate(`/select-grad-success/producer/${newProducerIndex}`, { replace: false });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatCurrency = (value: string | number): string => {
    if (!value || value === '0' || value === '$0') return '$0';

    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[$,]/g, '')) : value;
    if (isNaN(numValue)) return String(value);

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numValue);
  };

  const formatPercentage = (value: string | number): string => {
    if (!value || value === '0') return '0%';

    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[%]/g, '')) : value;
    if (isNaN(numValue)) return String(value);

    // If the value is already a percentage (0-1), multiply by 100
    const percentValue = numValue < 1 ? numValue * 100 : numValue;
    return `${Math.round(percentValue)}%`;
  };

  const convertPercentageToRatio = (value: string | number): string => {
    if (!value || value === '0') return '0.00';

    const numValue = typeof value === 'string' ? parseFloat(value.replace(/[%]/g, '')) : value;
    if (isNaN(numValue)) return '0.00';

    // Convert percentage to ratio (divide by 100)
    const ratioValue = numValue / 100;
    return ratioValue.toFixed(2);
  };

  const getSuccessScoreStyle = (score: number) => {
    if (score > 7) return successScoreHigh;
    if (score >= 4) return successScoreMedium;
    return successScoreLow;
  };

  const calculateLtmNBRatio = (ltmNB: string, graduationSalary: string): string => {
    if (!ltmNB || !graduationSalary || ltmNB === '0' || graduationSalary === '0') return '0.00';

    // Remove $ and commas from values and convert to numbers
    const ltmNBValue = parseFloat(ltmNB.replace(/[\$,]/g, ''));
    const salaryValue = parseFloat(graduationSalary.replace(/[\$,]/g, ''));

    if (isNaN(ltmNBValue) || isNaN(salaryValue) || salaryValue === 0) return '0.00';

    const ratio = ltmNBValue / salaryValue;
    return ratio.toFixed(2);
  };

  const calculateBookRatio = (currentTotalBV: string, graduationSalary: string): string => {
    if (!currentTotalBV || !graduationSalary || currentTotalBV === '0' || graduationSalary === '0') return '0.00';

    // Remove $ and commas from values and convert to numbers
    const bookValue = parseFloat(currentTotalBV.replace(/[\$,]/g, ''));
    const salaryValue = parseFloat(graduationSalary.replace(/[\$,]/g, ''));

    if (isNaN(bookValue) || isNaN(salaryValue) || salaryValue === 0) return '0.00';

    const ratio = bookValue / salaryValue;
    return ratio.toFixed(2);
  };

  // Calculate percentile rank based on success score
  const calculatePercentile = (currentScore: number, allScores: number[]): number => {
    const scoresBelow = allScores.filter((score) => score < currentScore).length;
    const percentile = Math.round((scoresBelow / allScores.length) * 100);
    return Math.max(1, percentile); // Ensure minimum of 1st percentile
  };

  // Format percentile for display
  const formatPercentile = (percentile: number): string => {
    const suffix = percentile === 1 ? 'st' : percentile === 2 ? 'nd' : percentile === 3 ? 'rd' : 'th';
    return `${percentile}${suffix}`;
  };

  // Render flag icon based on flag value - always show flag, red for Y, grey for N or empty
  const renderFlagCell = (flagValue: string) => {
    const isRed = flagValue === 'Y';
    // Debug logging to see actual flag values
    if (
      producer?.fullName === 'Dan Olsen' ||
      producer?.fullName?.includes('Dan') ||
      producer?.fullName === 'Nate Eshlemen' ||
      producer?.fullName?.includes('Nate')
    ) {
      console.log(`Flag value for ${producer.fullName}:`, flagValue, 'isRed:', isRed);
    }

    // Specific debug for Base Salary Relative to BV flag
    if (flagValue === producer?.baseSalaryTooLowRelativeToBVFlag) {
      console.log(`Base Salary Relative to BV flag for ${producer.fullName}:`, flagValue, 'should be red:', isRed);
    }

    return (
      <Flag
        sx={{
          color: isRed ? '#d32f2f' : '#ccc',
          fontSize: '1.2rem',
        }}
      />
    );
  };

  // Helper function to get row style based on flag value
  const getFlagRowStyle = (flagValue: string) => {
    return flagValue === 'Y' ? { ...metricRow, color: '#d32f2f' } : metricRow;
  };

  if (isLoading) {
    return (
      <Box sx={loadingContainer}>
        <Typography>Loading producer data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={errorContainer}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate('/select-grad-success/predictor')} sx={{ mt: 2 }}>
          Back to Predictor
        </Button>
      </Box>
    );
  }

  if (!producer) {
    return (
      <Box sx={errorContainer}>
        <Typography color="error">Producer not found</Typography>
        <Button onClick={() => navigate('/select-grad-success/predictor')} sx={{ mt: 2 }}>
          Back to Predictor
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={detailContainer}>
      {/* Navigation Buttons - Top Right */}
      <Box sx={navigationButtons}>
        <Button variant="outlined" size="small" onClick={() => navigate('/select-grad-success')}>
          Home
        </Button>
        <Button variant="outlined" size="small" onClick={() => navigate('/select-grad-success/predictor')}>
          Back to Dashboard
        </Button>
      </Box>

      {/* Header with producer selector */}
      <Box sx={producerSelectorContainer}>
        <Typography variant="h5" gutterBottom>
          Select Grad Success Predictor
        </Typography>

        <Grid container spacing={0} alignItems="flex-start" sx={{ textAlign: 'left' }}>
          {/* Producer Information */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', pr: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Producer
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={selectedProducerIndex >= 0 ? selectedProducerIndex.toString() : ''}
                onChange={handleProducerChange}
                displayEmpty
              >
                {allProducers
                  .filter((p) => producer && p.office === producer.office)
                  .map((p) => {
                    const originalIndex = allProducers.findIndex((ap) => ap.employeeId === p.employeeId);
                    return (
                      <MenuItem key={p.employeeId} value={originalIndex.toString()}>
                        {p.fullName}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              <strong>Manager:</strong> {producer.directManager}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Office:</strong> {producer.office}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Region:</strong> {producer.region}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Vertical:</strong> Employee Benefits
            </Typography>
          </Grid>

          {/* Financial Information - Aligned with Current Value column */}
          <Grid
            item
            md={1.5}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}
          >
            <Typography variant="subtitle2" gutterBottom align="center">
              Current Salary
            </Typography>
            <Typography variant="h5" align="center">
              {formatCurrency(producer.currentSalary)}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              <strong>Book:</strong> {formatCurrency(producer.currentTotalBV)}
            </Typography>
            <Typography variant="body2" color="textSecondary" align="center">
              <strong>LTM NB:</strong> {formatCurrency(producer.ltmNB)}
            </Typography>
          </Grid>

          {/* Tenure Information - Aligned with Expected at Tenure column */}
          <Grid
            item
            md={1.75}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '140px' }}
          >
            <Typography variant="subtitle2" gutterBottom align="center">
              Tenure
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, justifyContent: 'center' }}>
              <Typography variant="h4">{producer.tenureHire.toFixed(1)}</Typography>
              <Typography variant="subtitle2">years</Typography>
            </Box>
            <Typography variant="body2" color="textSecondary" align="center">
              ({Math.round(producer.tenureHire * 12)} Months)
            </Typography>
          </Grid>

          {/* Success Score Donut Chart - Aligned with Success Score column */}
          <Grid
            item
            md={1.5}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px', pl: 3 }}
          >
            <Typography variant="subtitle2" gutterBottom align="center">
              Success Score
            </Typography>
            <Box sx={{ position: 'relative', height: 120, width: 120, margin: '0 auto' }}>
              <ResponsivePie
                data={[
                  {
                    id: 'score',
                    value: Math.round(producer.successScore),
                    color: producer.successScore > 60 ? '#4caf50' : producer.successScore >= 40 ? '#ff9800' : '#f44336',
                  },
                  {
                    id: 'remaining',
                    value: 100 - Math.round(producer.successScore),
                    color: '#e0e0e0',
                  },
                ]}
                innerRadius={0.7}
                padAngle={0.7}
                cornerRadius={3}
                colors={(d) => d.data.color}
                enableArcLinkLabels={false}
                enableArcLabels={false}
                isInteractive={false}
                margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              />
              {/* Center text overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  {Math.round(producer.successScore)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  /100
                </Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 1 }}>
              {formatPercentile(
                calculatePercentile(
                  producer.successScore,
                  allProducers.map((p) => p.successScore),
                ),
              )}{' '}
              percentile
            </Typography>
          </Grid>

          {/* Risk Factors - Aligned with Risk Factors column */}
          <Grid
            item
            md={1.5}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px', pl: 5 }}
          >
            <Typography variant="subtitle2" gutterBottom align="center">
              Risk Factors
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Flag sx={{ color: '#d32f2f', fontSize: '2rem' }} />
              <Typography variant="h4" sx={{ ml: 1 }}>
                {producer.numberOfFlags}
              </Typography>
            </Box>
          </Grid>

          {/* Spacer for Weighting column */}
          <Grid item md={1.75} sx={{ minWidth: '120px' }}>
            {/* Empty space to align with Weighting column */}
          </Grid>
        </Grid>
      </Box>

      {/* Comparison Table */}
      <Box sx={comparisonTableContainer}>
        <TableContainer component={Paper}>
          <Table sx={comparisonTable} size="small" style={{ tableLayout: 'fixed', width: '100%' }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '300px' }}>Field/Category</TableCell>
                <TableCell align="center" sx={{ width: '120px' }}>
                  Current Value
                </TableCell>
                <TableCell align="center" sx={{ width: '140px' }}>
                  Expected at Tenure
                </TableCell>
                <TableCell align="center" sx={{ width: '120px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    Success Score
                    <Info sx={{ fontSize: '1rem', color: '#666' }} />
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ width: '120px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    Risk Factors
                    <Info sx={{ fontSize: '1rem', color: '#666' }} />
                  </Box>
                </TableCell>
                <TableCell align="center" sx={{ width: '120px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    Weighting %
                    <Info sx={{ fontSize: '1rem', color: '#666' }} />
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Book & NB Section */}
              <TableRow sx={categoryRow}>
                <TableCell sx={{ width: '300px' }}>
                  <Box sx={dropdownHeader} onClick={() => toggleSection('bookNB')}>
                    {expandedSections.bookNB ? <ExpandLess /> : <ExpandMore />}
                    Book & NB
                  </Box>
                </TableCell>
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '140px' }} />
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '120px' }} />
              </TableRow>

              {expandedSections.bookNB && (
                <>
                  <TableRow sx={metricRow}>
                    <TableCell sx={{ pl: 4 }}>Book / Starting MM Salary</TableCell>
                    <TableCell align="center">
                      {calculateBookRatio(producer.currentTotalBV, producer.graduationSalary)}
                    </TableCell>
                    <TableCell align="center">{producer.expectedBookStartingSalaryRatio.toFixed(2)}</TableCell>
                    <TableCell align="center" sx={successScoreCell}>
                      <Typography sx={getSuccessScoreStyle(producer.currentBVScore)}>
                        {Math.round(producer.currentBVScore)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={riskFactorCell}></TableCell>
                    <TableCell align="center" sx={weightingCell}>
                      {producer.bookWeighting}%
                    </TableCell>
                  </TableRow>

                  <TableRow sx={metricRow}>
                    <TableCell sx={{ pl: 4 }}>LTM MM NB / Starting MM Salary</TableCell>
                    <TableCell align="center">
                      {calculateLtmNBRatio(producer.ltmNB, producer.graduationSalary)}
                    </TableCell>
                    <TableCell align="center">{producer.expectedLtmNBStartingSalaryRatio.toFixed(2)}</TableCell>
                    <TableCell align="center" sx={successScoreCell}>
                      <Typography sx={getSuccessScoreStyle(producer.ltmNBScore)}>
                        {Math.round(producer.ltmNBScore)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={riskFactorCell}></TableCell>
                    <TableCell align="center" sx={weightingCell}>
                      {producer.ltmNBWeighting}%
                    </TableCell>
                  </TableRow>
                </>
              )}

              {/* Activities Section */}
              <TableRow sx={categoryRow}>
                <TableCell sx={{ width: '300px' }}>
                  <Box sx={dropdownHeader} onClick={() => toggleSection('activities')}>
                    {expandedSections.activities ? <ExpandLess /> : <ExpandMore />}
                    Activities <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                  </Box>
                </TableCell>
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '140px' }} />
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '120px' }} />
              </TableRow>

              {expandedSections.activities && (
                <>
                  <TableRow sx={metricRow}>
                    <TableCell sx={{ pl: 4 }}># Prospects (20-50K Revenue)</TableCell>
                    <TableCell align="center">{producer.prospectInRange}</TableCell>
                    <TableCell align="center">{producer.expectedProspects}</TableCell>
                    <TableCell align="center" sx={successScoreCell}>
                      <Typography sx={getSuccessScoreStyle(producer.prospectsScore)}>
                        {Math.round(producer.prospectsScore)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={riskFactorCell}></TableCell>
                    <TableCell align="center" sx={weightingCell}>
                      {producer.prospectsWeighting}%
                    </TableCell>
                  </TableRow>

                  <TableRow sx={metricRow}>
                    <TableCell sx={{ pl: 4 }}>First Appointments</TableCell>
                    <TableCell align="center">{producer.firstAppointmentsPostGrad}</TableCell>
                    <TableCell align="center">{producer.expectedFirstAppointments}</TableCell>
                    <TableCell align="center" sx={successScoreCell}>
                      <Typography sx={getSuccessScoreStyle(producer.firstAppointmentsScore)}>
                        {Math.round(producer.firstAppointmentsScore)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={riskFactorCell}></TableCell>
                    <TableCell align="center" sx={weightingCell}>
                      {producer.firstAppointmentsWeighting}%
                    </TableCell>
                  </TableRow>

                  <TableRow sx={metricRow}>
                    <TableCell sx={{ pl: 4 }}>Second Appointments</TableCell>
                    <TableCell align="center">{producer.secondAppointmentsPostGrad}</TableCell>
                    <TableCell align="center">{producer.expectedSecondAppointments}</TableCell>
                    <TableCell align="center" sx={successScoreCell}>
                      <Typography sx={getSuccessScoreStyle(producer.secondAppointmentsScore)}>
                        {Math.round(producer.secondAppointmentsScore)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={riskFactorCell}></TableCell>
                    <TableCell align="center" sx={weightingCell}>
                      {producer.secondAppointmentsWeighting}%
                    </TableCell>
                  </TableRow>

                  <TableRow sx={metricRow}>
                    <TableCell sx={{ pl: 4 }}>Ride - Alongs</TableCell>
                    <TableCell align="center">{producer.rideAlongsPostGrad}</TableCell>
                    <TableCell align="center">{producer.expectedRideAlongs}</TableCell>
                    <TableCell align="center" sx={successScoreCell}>
                      <Typography sx={getSuccessScoreStyle(producer.rideAlongsScore)}>
                        {Math.round(producer.rideAlongsScore)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={riskFactorCell}></TableCell>
                    <TableCell align="center" sx={weightingCell}>
                      {producer.rideAlongsWeighting}%
                    </TableCell>
                  </TableRow>

                  <TableRow sx={metricRow}>
                    <TableCell sx={{ pl: 4 }}>Advance Ratio</TableCell>
                    <TableCell align="center">{formatPercentage(producer.advanceRatio)}</TableCell>
                    <TableCell align="center">{formatPercentage(producer.expectedAdvanceRatio)}</TableCell>
                    <TableCell align="center" sx={successScoreCell}>
                      <Typography sx={getSuccessScoreStyle(producer.advanceRatioScore)}>
                        {Math.round(producer.advanceRatioScore)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={riskFactorCell}></TableCell>
                    <TableCell align="center" sx={weightingCell}>
                      {producer.advanceRatioWeighting}%
                    </TableCell>
                  </TableRow>

                  <TableRow sx={metricRow}>
                    <TableCell sx={{ pl: 4 }}>Closing Ratio</TableCell>
                    <TableCell align="center">{formatPercentage(producer.closingRatio)}</TableCell>
                    <TableCell align="center">{formatPercentage(producer.expectedClosingRatio)}</TableCell>
                    <TableCell align="center" sx={successScoreCell}>
                      <Typography sx={getSuccessScoreStyle(producer.closingRatioScore)}>
                        {Math.round(producer.closingRatioScore)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={riskFactorCell}></TableCell>
                    <TableCell align="center" sx={weightingCell}>
                      {producer.closingRatioWeighting}%
                    </TableCell>
                  </TableRow>

                  <TableRow sx={metricRow}>
                    <TableCell sx={{ pl: 4 }}>Number of Wins</TableCell>
                    <TableCell align="center">{producer.numberOfWinsSinceGraduation}</TableCell>
                    <TableCell align="center">{producer.expectedNumberOfWins}</TableCell>
                    <TableCell align="center" sx={successScoreCell}>
                      <Typography sx={getSuccessScoreStyle(producer.numberOfWinsScore)}>
                        {Math.round(producer.numberOfWinsScore)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={riskFactorCell}></TableCell>
                    <TableCell align="center" sx={weightingCell}>
                      {producer.numberOfWinsWeighting}%
                    </TableCell>
                  </TableRow>

                  <TableRow sx={metricRow}>
                    <TableCell sx={{ pl: 4 }}>Median Win Size</TableCell>
                    <TableCell align="center">{formatCurrency(producer.medianWinSize)}</TableCell>
                    <TableCell align="center">{producer.expectedMedianWinSize}</TableCell>
                    <TableCell align="center" sx={successScoreCell}>
                      <Typography sx={getSuccessScoreStyle(producer.averageWinSizeScore)}>
                        {Math.round(producer.averageWinSizeScore)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={riskFactorCell}></TableCell>
                    <TableCell align="center" sx={weightingCell}>
                      {producer.medianWinSizeWeighting}%
                    </TableCell>
                  </TableRow>
                </>
              )}

              {/* Poaching Risks Section */}
              <TableRow sx={categoryRow}>
                <TableCell sx={{ width: '300px' }}>
                  <Box sx={dropdownHeader} onClick={() => toggleSection('poachingRisks')}>
                    {expandedSections.poachingRisks ? <ExpandLess /> : <ExpandMore />}
                    Poaching Risks
                  </Box>
                </TableCell>
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '140px' }} />
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '120px' }} />
              </TableRow>

              {expandedSections.poachingRisks && (
                <>
                  <TableRow sx={getFlagRowStyle(producer.splitWinsFlag)}>
                    <TableCell sx={{ pl: 4 }}>
                      Split Wins <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={successScoreCell}></TableCell>
                    <TableCell align="center" sx={riskFactorCell}>
                      {renderFlagCell(producer.splitWinsFlag)}
                    </TableCell>
                    <TableCell align="center" sx={weightingCell}></TableCell>
                  </TableRow>

                  <TableRow sx={getFlagRowStyle(producer.partnersWhoPairUpFlag)}>
                    <TableCell sx={{ pl: 4 }}>
                      Partners Who Pair Up <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={successScoreCell}></TableCell>
                    <TableCell align="center" sx={riskFactorCell}>
                      {renderFlagCell(producer.partnersWhoPairUpFlag)}
                    </TableCell>
                    <TableCell align="center" sx={weightingCell}></TableCell>
                  </TableRow>

                  <TableRow sx={getFlagRowStyle(producer.baseSalaryTooLowRelativeToNBFlag)}>
                    <TableCell sx={{ pl: 4 }}>
                      Current Base Salary Relative to NB <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={successScoreCell}></TableCell>
                    <TableCell align="center" sx={riskFactorCell}>
                      {renderFlagCell(producer.baseSalaryTooLowRelativeToNBFlag)}
                    </TableCell>
                    <TableCell align="center" sx={weightingCell}></TableCell>
                  </TableRow>

                  <TableRow sx={getFlagRowStyle(producer.baseSalaryTooLowRelativeToBVFlag)}>
                    <TableCell sx={{ pl: 4 }}>
                      Current Base Salary Relative to BV <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={successScoreCell}></TableCell>
                    <TableCell align="center" sx={riskFactorCell}>
                      {renderFlagCell(producer.baseSalaryTooLowRelativeToBVFlag)}
                    </TableCell>
                    <TableCell align="center" sx={weightingCell}></TableCell>
                  </TableRow>

                  <TableRow sx={getFlagRowStyle(producer.deltaLeadershipLTMFlag)}>
                    <TableCell sx={{ pl: 4 }}>
                      Δ Leadership LTM <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={successScoreCell}></TableCell>
                    <TableCell align="center" sx={riskFactorCell}>
                      {renderFlagCell(producer.deltaLeadershipLTMFlag)}
                    </TableCell>
                    <TableCell align="center" sx={weightingCell}></TableCell>
                  </TableRow>

                  <TableRow sx={getFlagRowStyle(producer.commutingDistanceFlag)}>
                    <TableCell sx={{ pl: 4 }}>
                      Commuting Distance <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={successScoreCell}></TableCell>
                    <TableCell align="center" sx={riskFactorCell}>
                      {renderFlagCell(producer.commutingDistanceFlag)}
                    </TableCell>
                    <TableCell align="center" sx={weightingCell}></TableCell>
                  </TableRow>

                  <TableRow sx={getFlagRowStyle(producer.moveFromPrimaryOfficeFlag)}>
                    <TableCell sx={{ pl: 4 }}>
                      Move from Primary Office <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={successScoreCell}></TableCell>
                    <TableCell align="center" sx={riskFactorCell}>
                      {renderFlagCell(producer.moveFromPrimaryOfficeFlag)}
                    </TableCell>
                    <TableCell align="center" sx={weightingCell}></TableCell>
                  </TableRow>
                </>
              )}

              {/* Other Factors Section */}
              <TableRow sx={categoryRow}>
                <TableCell sx={{ width: '300px' }}>
                  <Box sx={dropdownHeader} onClick={() => toggleSection('otherFactors')}>
                    {expandedSections.otherFactors ? <ExpandLess /> : <ExpandMore />}
                    Other Factors
                  </Box>
                </TableCell>
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '140px' }} />
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '120px' }} />
                <TableCell sx={{ width: '120px' }} />
              </TableRow>

              {expandedSections.otherFactors && (
                <>
                  <TableRow sx={getFlagRowStyle(producer.pipFlag)}>
                    <TableCell sx={{ pl: 4 }}>
                      PIP History <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={successScoreCell}></TableCell>
                    <TableCell align="center" sx={riskFactorCell}>
                      {renderFlagCell(producer.pipFlag)}
                    </TableCell>
                    <TableCell align="center" sx={weightingCell}></TableCell>
                  </TableRow>

                  <TableRow sx={getFlagRowStyle(producer.ccatFlag)}>
                    <TableCell sx={{ pl: 4 }}>
                      CCAT <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={successScoreCell}></TableCell>
                    <TableCell align="center" sx={riskFactorCell}>
                      {renderFlagCell(producer.ccatFlag)}
                    </TableCell>
                    <TableCell align="center" sx={weightingCell}></TableCell>
                  </TableRow>

                  <TableRow sx={getFlagRowStyle(producer.eppFlag)}>
                    <TableCell sx={{ pl: 4 }}>
                      EPP <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={successScoreCell}></TableCell>
                    <TableCell align="center" sx={riskFactorCell}>
                      {renderFlagCell(producer.eppFlag)}
                    </TableCell>
                    <TableCell align="center" sx={weightingCell}></TableCell>
                  </TableRow>

                  <TableRow sx={getFlagRowStyle(producer.illustrateFlag)}>
                    <TableCell sx={{ pl: 4 }}>
                      Illustrate <Info sx={{ fontSize: '1rem', color: '#666', ml: 1 }} />
                    </TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center" sx={successScoreCell}></TableCell>
                    <TableCell align="center" sx={riskFactorCell}>
                      {renderFlagCell(producer.illustrateFlag)}
                    </TableCell>
                    <TableCell align="center" sx={weightingCell}></TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

const ProducerDetail = () => <MainLayout pageContent={<ProducerDetailComponent />} />;

export default ProducerDetail;
