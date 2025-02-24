import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TangencyStats from './table/TangencyStats';
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

const TangencyStatsPage = ({ data }) => {
  console.log("TangencyStatsPage received data:", data);
  console.log("TangencyStatsPage data type:", typeof data);
  console.log("TangencyStatsPage data keys:", data ? Object.keys(data) : 'No keys (data is falsy)');

  if (!data || !data.stats) {
    return <Typography>Loading statistics... (Data not available)</Typography>;
  }

  return (
    <StyledCard>
      <StyledCardContent>
        <Typography variant="h6" gutterBottom>
          Estatisticas
        </Typography>
        <TableContainer>
          <TangencyStats data={data} />
        </TableContainer>
      </StyledCardContent>
    </StyledCard>
  );
};
export default TangencyStatsPage;