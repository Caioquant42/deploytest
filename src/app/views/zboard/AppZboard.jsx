import React from 'react';
import { Box, styled, useTheme, useMediaQuery } from "@mui/material";
import SunburstStocks from "./shared/SBPage";
import ScatterPage from "./shared/ScatterPage";
import FluxoEstrangeiroPage from './shared/FluxoEstrangeiroPage';
import CurvaJurosPage from './shared/CurvaJurosPage';
import PerformancePage from './shared/PerformancePage';
import PearsonPage from './shared/PearsonPage';

const Container = styled("div")(({ theme }) => ({
  margin: theme.spacing(2),
  [theme.breakpoints.down("sm")]: { 
    margin: theme.spacing(1),
    padding: 0
  },
  "& .breadcrumb": {
    marginBottom: theme.spacing(2),
    [theme.breakpoints.down("sm")]: { 
      marginBottom: theme.spacing(1) 
    }
  }
}));

const GridBox = styled(Box)(({ theme }) => ({
  display: 'grid',
  gap: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    gap: theme.spacing(1)
  },
  '& > *': {
    minWidth: 0, // Prevent overflow on small screens
    width: '100%'
  }
}));

const ChartCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
  height: '100%',
  overflow: 'hidden',
  '& h3': {
    fontSize: '1.25rem',
    [theme.breakpoints.down("sm")]: {
      fontSize: '1rem',
      marginBottom: theme.spacing(1)
    }
  }
}));

export default function AppZboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container>
      <GridBox>
        <ChartCard>
          <SunburstStocks />
        </ChartCard>
        
        <ChartCard>
          <ScatterPage />
        </ChartCard>

        <ChartCard>
          <FluxoEstrangeiroPage />
        </ChartCard>

        <ChartCard>
          <CurvaJurosPage />
        </ChartCard>

        <ChartCard>
          <PerformancePage />
        </ChartCard>

        <ChartCard>
          <PearsonPage />
        </ChartCard>
      </GridBox>
    </Container>
  );
}
