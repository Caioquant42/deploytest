// StatmentsPage.jsx
import React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import StatmentsTable from './StatmentsTable';

const ContentBox = styled(Box)(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: { margin: '16px' },
}));

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: '500',
  marginBottom: '20px',
  color: theme.palette.primary.main,
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  marginBottom: '16px',
  color: theme.palette.text.secondary,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StatmentsPage = () => {
  return (
    <ContentBox>
      <Grid container spacing={0.5}>
        <Grid item xs={12}>
          <Title>Tabela de Demonstrativos</Title>
          <SubTitle>
            Dados financeiros essenciais para análise de ações
          </SubTitle>
        </Grid>
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <StatmentsTable />
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={12}>
        </Grid>
      </Grid>
    </ContentBox>
  );
};

export default StatmentsPage;