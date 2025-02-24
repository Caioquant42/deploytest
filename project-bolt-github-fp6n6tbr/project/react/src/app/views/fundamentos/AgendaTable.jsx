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
  CircularProgress,
  Typography
} from "@mui/material";
import { fetchDividendAgenda } from "/src/__api__/db/apiService";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  textAlign: 'center',
  cursor: 'pointer', // Indicate the headers are clickable
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AgendaTable = () => {
  const [agendaData, setAgendaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDividendAgenda();

        // Initial sort by 'Ex' date from newest to oldest
        const sortedData = data.sort((a, b) => new Date(b.Ex) - new Date(a.Ex));

        setAgendaData(sortedData);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch dividend agenda data:", error);
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    const sortedData = [...agendaData].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setAgendaData(sortedData);
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box my={4}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 400 }} aria-label="Dividend agenda table">
          <TableHead>
            <TableRow>
              <StyledTableCell onClick={() => sortData('Codigo')}>Código</StyledTableCell>
              <StyledTableCell onClick={() => sortData('Tipo')}>Tipo</StyledTableCell>
              <StyledTableCell align="center" onClick={() => sortData('Valor (R$)')}>Valor (R$)</StyledTableCell>
              <StyledTableCell onClick={() => sortData('Registro')}>Registro</StyledTableCell>
              <StyledTableCell onClick={() => sortData('Ex')}>Ex</StyledTableCell>
              <StyledTableCell onClick={() => sortData('Pagamento')}>Pagamento</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {agendaData.map((item, index) => (
              <StyledTableRow key={index}>
                <TableCell align="center">{item.Codigo}</TableCell>
                <TableCell align="center">{item.Tipo}</TableCell>
                <TableCell align="center">{item["Valor (R$)"]}</TableCell>
                <TableCell align="center">{item.Registro}</TableCell>
                <TableCell align="center">{item.Ex}</TableCell>
                <TableCell align="center">{item.Pagamento}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AgendaTable;