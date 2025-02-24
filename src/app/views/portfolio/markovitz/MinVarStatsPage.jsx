import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import MinVarStats from './table/MinVarStats';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '90%',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
});

const TableContainer = styled(Box)({
  flexGrow: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  maxHeight: '400px',
});

const MinVarStatsPage = ({ data }) => {
  return (
    <StyledCard>
      <StyledCardContent>
        <Typography variant="h6" gutterBottom>
          Estatísticas Min. Variância
        </Typography>
        <TableContainer>
          {data ? (
            <MinVarStats data={data} />
          ) : (
            <Typography>No data available</Typography>
          )}
        </TableContainer>
      </StyledCardContent>
    </StyledCard>
  );
};

export default MinVarStatsPage;