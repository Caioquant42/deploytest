import React from 'react';
import { Card, Container, Typography } from '@mui/material';
import FluxoEstrangeiro from './echarts/FluxoEstrangeiro';

const FluxoEstrangeiroPage = () => {
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Fluxo Estrangeiro
      </Typography>
      <Card>
        <FluxoEstrangeiro />
      </Card>
    </Container>
  );
};

export default FluxoEstrangeiroPage;