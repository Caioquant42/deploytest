// VolatilityTable.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableSortLabel,
  TablePagination,
  Paper,
  Tooltip,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel
} from "@mui/material";
import { fetchVolatilityAnalysis } from "/src/__api__/db/apiService";

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

const VolatilityTable = () => {
  const [volatilityData, setVolatilityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState('current');
  const [orderBy, setOrderBy] = useState('symbol');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const loadVolatilityData = async () => {
      try {
        const data = await fetchVolatilityAnalysis();
        setVolatilityData(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load volatility data');
        setLoading(false);
      }
    };

    loadVolatilityData();
  }, []);

  const handleTimeFrameChange = (event) => {
    setTimeFrame(event.target.value);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const columns = useMemo(() => {
    const baseColumns = [
      { id: 'symbol', label: 'Symbol', tooltip: 'Stock Symbol' },
    ];

    if (timeFrame === 'current') {
      baseColumns.push(
        { id: `ewma_${timeFrame}`, label: 'EWMA', tooltip: 'Exponentially Weighted Moving Average' },
        { id: `iv_${timeFrame}`, label: 'IV', tooltip: 'Implied Volatility' },
      );
    }

    baseColumns.push(
      { id: `iv_to_ewma_ratio_${timeFrame}`, label: 'IV/EWMA Ratio', tooltip: 'Ratio of IV to EWMA' },
    );

    if (timeFrame !== 'current') {
      baseColumns.push(
        { id: `ewma_${timeFrame}_percentile`, label: 'EWMA Percentile', tooltip: 'EWMA Percentile' },
        { id: `ewma_${timeFrame}_rank`, label: 'EWMA Rank', tooltip: 'EWMA Rank' },
        { id: `iv_${timeFrame}_percentile`, label: 'IV Percentile', tooltip: 'IV Percentile' },
        { id: `iv_${timeFrame}_rank`, label: 'IV Rank', tooltip: 'IV Rank' }
      );
    }

    baseColumns.push(
      { id: 'garch11_1y', label: 'GARCH(1,1)', tooltip: 'GARCH(1,1) 1 Year' },
      { id: 'beta_ibov', label: 'Beta IBOV', tooltip: 'Beta relative to IBOV' },
      { id: 'correl_ibov', label: 'Correl IBOV', tooltip: 'Correlation with IBOV' },
      { id: 'entropy', label: 'Entropy', tooltip: 'Entropy measure' }
    );

    return baseColumns;
  }, [timeFrame]);

  const sortedData = useMemo(() => {
    const comparator = (a, b) => {
      if (b[orderBy] < a[orderBy]) {
        return order === 'asc' ? 1 : -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return order === 'asc' ? -1 : 1;
      }
      return 0;
    };

    return [...volatilityData].sort(comparator);
  }, [volatilityData, order, orderBy]);

  const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) return <CircularProgress />;
  if (error) return <div>{error}</div>;

  const formatCellValue = (value, columnId) => {
    if (columnId === 'symbol') return value; // Always return the symbol
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }
    if (columnId.includes('ratio') || columnId === 'beta_ibov' || columnId === 'correl_ibov' || columnId === 'entropy') {
      return parseFloat(value).toFixed(4);
    }
    if (columnId.includes('percentile') || columnId.includes('rank')) {
      return parseFloat(value).toFixed(2);
    }
    return value;
  };

  return (
    <Box>
      <FormControl component="fieldset">
        <FormLabel component="legend">Time Frame</FormLabel>
        <RadioGroup row value={timeFrame} onChange={handleTimeFrameChange}>
          <FormControlLabel value="current" control={<Radio />} label="Current" />
          <FormControlLabel value="6m" control={<Radio />} label="6 Months" />
          <FormControlLabel value="1y" control={<Radio />} label="1 Year" />
        </RadioGroup>
      </FormControl>
      <TableContainer component={Paper}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.id}>
                  <Tooltip title={column.tooltip} placement="top">
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </Tooltip>
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <StyledTableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    {formatCellValue(row[column.id], column.id)}
                  </TableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50, 100]}
        component="div"
        count={sortedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default VolatilityTable;