import { useState, useEffect } from "react";
import { fetchNYSERecommendations } from "/src/__api__/db/apiService";

import {
  Box,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  Paper,
  Tooltip,
  TextField
} from "@mui/material";

// STYLED COMPONENTS
const StyledTableContainer = styled(TableContainer)({
  maxHeight: 400,
  '& ::-webkit-scrollbar': {
    width: '0.4em',
    height: '0.4em',
  },
  '& ::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
  },
  '& ::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,.1)',
    outline: '1px solid slategrey'
  }
});

const StyledTable = styled(Table)({
  whiteSpace: "nowrap",
  "& .MuiTableCell-root": {
    borderBottom: "1px solid rgba(224, 224, 224, 1)",
    padding: "6px 8px",
  },
});

const TableCellHeader = styled(TableCell)({
  fontWeight: 'bold',
  backgroundColor: '#f5f5f5',
  fontSize: '0.70rem',
  padding: '8px 8px',
  whiteSpace: 'nowrap',
});

const TableCellStyled = styled(TableCell)(({ theme }) => ({
  padding: "4px 8px",
  fontSize: "0.75rem",
  whiteSpace: 'nowrap',
}));

export default function NYSEAllTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [subscribers, setSubscribers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const loadRecommendations = async () => {
      const data = await fetchNYSERecommendations();
      const filteredData = data.filter(subscriber => subscriber.recommendationKey && subscriber.recommendationKey.toLowerCase() !== 'none');
      setSubscribers(filteredData || []);
      setFiltered(filteredData || []);
    };
    loadRecommendations();
  }, []);

  useEffect(() => {
    const filteredData = subscribers
      .filter(subscriber => subscriber.ticker.toLowerCase().includes(filterValue.toLowerCase()));
    setFiltered(filteredData);
    setPage(0);
  }, [filterValue, subscribers]);

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box width="100%">
      <TextField
        fullWidth
        variant="outlined"
        label="Buscar Ativo"
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        margin="normal"
      />
      <StyledTableContainer component={Paper}>
        <StyledTable stickyHeader size="small" aria-label="all recommendations table">
          <TableHead>
            <TableRow>
              <TableCellHeader>Ticker</TableCellHeader>
              <TableCellHeader align="right">Analysts</TableCellHeader>
              <TableCellHeader align="right">Price</TableCellHeader>
              <TableCellHeader align="right">Recommendation</TableCellHeader>
              <Tooltip title="Minimum Target"><TableCellHeader align="right">Target Min</TableCellHeader></Tooltip>
              <Tooltip title="Minimum Return"><TableCellHeader align="right">Return Min</TableCellHeader></Tooltip>
              <Tooltip title="Median Target"><TableCellHeader align="right">Target Med</TableCellHeader></Tooltip>
              <Tooltip title="Median Return"><TableCellHeader align="right">Return Med</TableCellHeader></Tooltip>
              <Tooltip title="Maximum Target"><TableCellHeader align="right">Target Max</TableCellHeader></Tooltip>
              <Tooltip title="Maximum Return"><TableCellHeader align="right">Return Max</TableCellHeader></Tooltip>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((subscriber, index) => (
                <TableRow key={index}>
                  <TableCellStyled>{subscriber.ticker}</TableCellStyled>
                  <TableCellStyled align="right">{subscriber.numberOfAnalystOpinions}</TableCellStyled>
                  <TableCellStyled align="right">R${parseFloat(subscriber.currentPrice).toFixed(2)}</TableCellStyled>
                  <TableCellStyled align="right">{subscriber.recommendationKey}</TableCellStyled>
                  <TableCellStyled align="right">R${parseFloat(subscriber.targetLowPrice).toFixed(2)}</TableCellStyled>
                  <TableCellStyled align="right">{subscriber['% Distance to Low'].toFixed(2)}%</TableCellStyled>
                  <TableCellStyled align="right">R${parseFloat(subscriber.targetMedianPrice).toFixed(2)}</TableCellStyled>
                  <TableCellStyled align="right">{subscriber['% Distance to Median'].toFixed(2)}%</TableCellStyled>
                  <TableCellStyled align="right">R${parseFloat(subscriber.targetHighPrice).toFixed(2)}</TableCellStyled>
                  <TableCellStyled align="right">{subscriber['% Distance to High'].toFixed(2)}%</TableCellStyled>
                </TableRow>
              ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>

      <TablePagination
        sx={{ px: 2 }}
        page={page}
        component="div"
        rowsPerPage={rowsPerPage}
        count={filtered.length}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 25]}
        onRowsPerPageChange={handleChangeRowsPerPage}
        nextIconButtonProps={{ "aria-label": "Next Page" }}
        backIconButtonProps={{ "aria-label": "Previous Page" }}
      />
    </Box>
  );
}