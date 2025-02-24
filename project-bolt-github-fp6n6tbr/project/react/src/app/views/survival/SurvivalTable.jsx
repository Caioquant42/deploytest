// SurvivalTable.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  Paper,
  Tooltip,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from "@mui/material";
import { fetchSurvivalAnalysis } from "/src/__api__/db/apiService";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const SurvivalTable = () => {
  const [survivalData, setSurvivalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedThreshold, setSelectedThreshold] = useState('-0.03');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSurvivalAnalysis();
        setSurvivalData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch survival data:", error);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center"><CircularProgress /></Box>;
  }

  if (error) {
    return <Box color="error.main">{error}</Box>;
  }

  const formatValue = (value, decimals = 2) => {
    if (value === undefined || isNaN(value)) return 'N/A';
    return Number(value).toFixed(decimals);
  };

  const handleThresholdChange = (event) => {
    setSelectedThreshold(event.target.value);
  };

  const sortedData = Object.entries(survivalData)
    .filter(([_, data]) => !isNaN(data[selectedThreshold]?.current_cumulative_hazard))
    .map(([ticker, data]) => ({ ticker, ...data[selectedThreshold] }))
    .sort((a, b) => b.current_cumulative_hazard - a.current_cumulative_hazard);

  return (
    <Box>
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Select Threshold</FormLabel>
        <RadioGroup
          row
          aria-label="threshold"
          name="threshold"
          value={selectedThreshold}
          onChange={handleThresholdChange}
        >
          <FormControlLabel value="-0.03" control={<Radio />} label="-3%" />
          <FormControlLabel value="-0.05" control={<Radio />} label="-5%" />
          <FormControlLabel value="-0.07" control={<Radio />} label="-7%" />
        </RadioGroup>
      </FormControl>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="survival analysis table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Ticker</StyledTableCell>
              <StyledTableCell align="right">Days Since Last Incident</StyledTableCell>
              <StyledTableCell align="right">
                <Tooltip title="Estimated tail index of the distribution">
                  <span>Tail Index</span>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="right">
                <Tooltip title="Probability of not experiencing a significant drop in the near future">
                  <span>Current Survival Probability</span>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="right">
                <Tooltip title="Current rate of experiencing a significant drop">
                  <span>Current Hazard Rate</span>
                </Tooltip>
              </StyledTableCell>
              <StyledTableCell align="right">
                <Tooltip title="Accumulated risk of experiencing a significant drop">
                  <span>Current Cumulative Hazard</span>
                </Tooltip>
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedData.map((data) => (
              <StyledTableRow key={data.ticker}>
                <TableCell component="th" scope="row">
                  {data.ticker}
                </TableCell>
                <TableCell align="right">{data.days_since_last_incident || 'N/A'}</TableCell>
                <TableCell align="right">{formatValue(data.tail_index, 4)}</TableCell>
                <TableCell align="right">
                  {formatValue(data.current_survival_probability * 100)}%
                </TableCell>
                <TableCell align="right">
                  {formatValue(data.current_hazard_rate * 100)}%
                </TableCell>
                <TableCell align="right">
                  {formatValue(data.current_cumulative_hazard, 4)}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SurvivalTable;