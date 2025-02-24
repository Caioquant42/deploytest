import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import TangencyWeights from './table/TangencyWeights';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
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

const TITLE = "Otimização Tangencial";

const TangencyWeightsPage = ({ data }) => {
  const decodedData = data ? JSON.parse(JSON.stringify(data)) : null;

  return (
    <StyledCard>
      <StyledCardContent>
        <Typography variant="h6" gutterBottom>
          {TITLE}
        </Typography>
        <TableContainer>
          {decodedData ? (
            <TangencyWeights weights={decodedData} />
          ) : (
            <Typography>No data available</Typography>
          )}
        </TableContainer>
      </StyledCardContent>
    </StyledCard>
  );
};

export default TangencyWeightsPage;