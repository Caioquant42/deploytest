import React from 'react';
import { Card } from '@mui/material';
import SunburstStocks from './echarts/SunburstStocks';

const SBPage = () => {
  return (
    <Card>
      <h3> Visão de Mercado</h3>
      <SunburstStocks />
    </Card>
  );
};

export default SBPage;