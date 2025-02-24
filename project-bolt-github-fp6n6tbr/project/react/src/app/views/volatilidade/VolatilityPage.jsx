// VolatilityPage.jsx
import React from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Divider
} from "@mui/material";
import VolatilityTable from "./VolatilityTable";

const VolatilityPage = () => {
  return (
    <Container maxWidth="xl">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Volatility Analysis
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Overview
          </Typography>
          <Typography variant="body1" paragraph>
            This page presents a comprehensive volatility analysis of stocks. 
            The table below shows various volatility metrics including EWMA (Exponentially Weighted Moving Average), 
            IV (Implied Volatility), their ratios, percentiles, and ranks. 
            Additional metrics such as GARCH, Beta, Correlation with IBOV, and Entropy are also provided.
          </Typography>
          <Typography variant="body1">
            Use the time frame selector to view data for different periods: Current, 6 Months, or 1 Year.
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Volatility Metrics Table
          </Typography>
          <VolatilityTable />
        </Paper>
      </Box>
    </Container>
  );
};

export default VolatilityPage;