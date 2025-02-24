import React, { useState, useEffect } from "react";
import {
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  Paper,
  Tooltip
} from "@mui/material";
import { fetchNASDAQBuyAnalysis } from "/src/__api__/db/apiService"; // Ensure this path is correct

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
  padding: '6px 6px',
  whiteSpace: 'nowrap',
});

const TableCellStyled = styled(TableCell)(({ theme }) => ({
  padding: "4px 8px",
  fontSize: "0.75rem",
  whiteSpace: 'nowrap',
}));

export default function NASDAQBuyTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchNASDAQBuyAnalysis();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching Buy analysis:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <StyledTableContainer component={Paper}>
      <StyledTable stickyHeader size="small" aria-label="buy analysis table">
        <TableHead>
          <TableRow>
            <TableCellHeader>Ticker</TableCellHeader>
            <TableCellHeader align="right">Analysts</TableCellHeader>
            <TableCellHeader align="right">Price</TableCellHeader>
            <Tooltip title="Minimum Return">
              <TableCellHeader align="right">Min Return</TableCellHeader>
            </Tooltip>
            <Tooltip title="Median Return">
              <TableCellHeader align="right">Median Return</TableCellHeader>
            </Tooltip>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              <TableCellStyled>{item.ticker}</TableCellStyled>
              <TableCellStyled align="right">{item.numberOfAnalystOpinions}</TableCellStyled>
              <TableCellStyled align="right">R${parseFloat(item.currentPrice).toFixed(2)}</TableCellStyled>
              <TableCellStyled align="right">{item['% Distance to Low'].toFixed(2)}%</TableCellStyled>
              <TableCellStyled align="right">{item['% Distance to Median'].toFixed(2)}%</TableCellStyled>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
}