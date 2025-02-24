import React from 'react';
import { Box, Grid, styled } from "@mui/material";
import StrongBuyTable from "./StrongBuyTable";
import BuyTable from "./BuyTable";
import AllTable from "./AllTable";
import PieChart from "./PieChart";
import IBOVPieChart from "./IBOVPieChart"; // Import the new component
import { SimpleCard } from "app/components";

// STYLED COMPONENTS
const Container = styled(Box)(({ theme }) => ({
  margin: "20px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const StyledCard = styled(SimpleCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

export default function AppBrasil() {
  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StyledCard title="Recomendações Ativos Listados">
            <PieChart 
              height="300px" 
              color={["#28a745", "#007bff", "#ffc107", "#dc3545"]}
            />
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StyledCard title="Recomendações IBOV">
            <IBOVPieChart 
              height="300px" 
              color={["#28a745", "#007bff", "#ffc107", "#dc3545"]}
            />
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StyledCard title="Compra Forte">
            <StrongBuyTable />
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StyledCard title="Compra">
            <BuyTable />
          </StyledCard>
        </Grid>

        <Grid item xs={12}>
          <StyledCard title="Todas Recomendações">
            <AllTable />
          </StyledCard>
        </Grid>
      </Grid>
    </Container>

  );
}