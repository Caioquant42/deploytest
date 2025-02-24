import React from 'react';
import { Box, styled } from "@mui/material";
import { Breadcrumb, SimpleCard } from "app/components";
import SunburstStocks from "./shared/SBPage";
import TreeMapPage from "./shared/TreeMapPage";
import FluxoEstrangeiroPage from './shared/FluxoEstrangeiroPage';
import CurvaJurosPage from './shared/CurvaJurosPage';
import PerformancePage from './shared/PerformancePage';
import PearsonPage from './shared/PearsonPage';
import ScatterPage from './shared/ScatterPage'; // Import the new ScatterPage

// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function AppZboard() {
  return (
    <Container>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">        
        <Box sx={{ flex: 1, minWidth: "49%", marginRight: 1, marginBottom: 2 }}>
          <SunburstStocks /> 
        </Box>
        <Box sx={{ flex: 1, minWidth: "49%", marginLeft: 1, marginBottom: 2 }}>
          <ScatterPage /> {/* Add the ScatterPage here, next to SunburstStocks */}
        </Box>
        <Box sx={{ flex: 1, minWidth: "90%", marginRight: 1, marginBottom: 2 }}>
          <FluxoEstrangeiroPage />
        </Box>
        <Box sx={{ flex: 1, minWidth: "49%", marginLeft: 1, marginBottom: 2 }}>
          <CurvaJurosPage />
        </Box>
        <Box sx={{ flex: 1, minWidth: "100%", marginBottom: 2 }}>
          <PerformancePage />
        </Box>
        <Box sx={{ flex: 1, minWidth: "100%", marginBottom: 2 }}>
          <PearsonPage />
        </Box>
      </Box>
    </Container>
  );
}