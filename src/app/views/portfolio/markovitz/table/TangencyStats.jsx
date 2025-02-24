import React from 'react';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  Paper
} from "@mui/material";
import { styled } from '@mui/material/styles';

const StyledTable = styled(Table)(({ theme }) => ({
  whiteSpace: "pre",
  "& tbody": {
    "& tr": {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
      "& td": {
        padding: '4px 6px',
        fontSize: '0.75rem',
        lineHeight: 1.2,
        "&:first-of-type": {
          fontWeight: 'bold',
        },
      }
    }
  }
}));

const formatValue = (key, value) => {
  if (typeof value === 'number') {
    if (key.toLowerCase().includes('return') || key.toLowerCase().includes('drawdown') || key === 'Daily value at risk') {
      return `${(value * 100).toFixed(2)}%`;
    }
    return value.toFixed(2);
  }
  return value;
};

export default function TangencyStats({ data }) {
  console.log('TangencyStats received data:', data);
  console.log('Data in TangencyStats:', data);
  const stats = data?.stats || {};
  console.log('Processed stats:', stats);
  if (!stats) {
    return <Typography>No statistics available</Typography>;
  }
  const subscribarList = [
    { name: "Retorno Anual", value: formatValue("Annual return", stats["Annual return"]) },
    { name: "Retorno Acum.", value: formatValue("Cumulative returns", stats["Cumulative returns"]) },
    { name: "Vol. Anual", value: formatValue("Annual volatility", stats["Annual volatility"]) },
    { name: "Sharpe Ratio", value: formatValue("Sharpe ratio", stats["Sharpe ratio"]) },
    { name: "Calmar Ratio", value: formatValue("Calmar ratio", stats["Calmar ratio"]) },
    { name: "Estabilidade", value: formatValue("Stability", stats["Stability"]) },
    { name: "Máx Drawdown", value: formatValue("Max drawdown", stats["Max drawdown"]) },
    { name: "Omega Ratio", value: formatValue("Omega ratio", stats["Omega ratio"]) },
    { name: "Sortino Ratio", value: formatValue("Sortino ratio", stats["Sortino ratio"]) },
    { name: "Assimetria", value: formatValue("Skew", stats["Skew"]) },
    { name: "Curtose", value: formatValue("Kurtosis", stats["Kurtosis"]) },
    { name: "Tail Ratio", value: formatValue("Tail ratio", stats["Tail ratio"]) },
    { name: "VaR 1d", value: formatValue("Daily value at risk", stats["Daily value at risk"]) },
  ];

  return (
    <TableContainer component={Paper} sx={{ maxWidth: 200, mx: 'auto' }}>
      <StyledTable size="small">
        <TableBody>
          {subscribarList.map((stat, index) => (
            <TableRow key={index}>
              <TableCell sx={{ maxWidth: '60%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {stat.name}
              </TableCell>
              <TableCell align="right" sx={{ maxWidth: '40%' }}>
                {stat.value !== undefined ? stat.value : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}