import React, { useState, useEffect } from "react";
import ReactECharts from 'echarts-for-react';
import { Box, CircularProgress, useTheme, useMediaQuery } from "@mui/material";
import { fetchVolatilityAnalysis } from "/src/__api__/db/apiService";

const ScatterChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchVolatilityAnalysis();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getChartOptions = () => {
    const scatterData = data.map(item => [
      item.beta_ibov,
      item.correl_ibov,
      item.financial_volume,
      item.iv_to_ewma_ratio_current,
      item.symbol
    ]);

    const minVolume = Math.min(...data.map(item => item.financial_volume));
    const maxVolume = Math.max(...data.map(item => item.financial_volume));
    const minIVRatio = Math.min(...data.map(item => item.iv_to_ewma_ratio_current));
    const maxIVRatio = Math.max(...data.map(item => item.iv_to_ewma_ratio_current));

    return {
      grid: {
        top: isMobile ? '15%' : '10%',
        right: isMobile ? '15%' : '10%',
        bottom: isMobile ? '15%' : '10%',
        left: isMobile ? '15%' : '10%',
        containLabel: true
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return `Symbol: ${params.data[4]}<br/>
                  Beta IBOV: ${params.data[0].toFixed(2)}<br/>
                  Correl IBOV: ${params.data[1].toFixed(2)}<br/>
                  Volume: ${params.data[2].toLocaleString()}<br/>
                  IV/EWMA Ratio: ${params.data[3].toFixed(2)}`;
        }
      },
      xAxis: {
        name: 'Beta IBOV',
        nameLocation: 'middle',
        nameGap: 30,
        type: 'value',
        axisLabel: {
          fontSize: isMobile ? 10 : 12
        }
      },
      yAxis: {
        name: 'Correlation IBOV',
        nameLocation: 'middle',
        nameGap: 30,
        type: 'value',
        axisLabel: {
          fontSize: isMobile ? 10 : 12
        }
      },
      visualMap: [{
        type: 'continuous',
        min: minIVRatio,
        max: maxIVRatio,
        dimension: 3,
        inRange: {
          color: ['blue', 'yellow', 'red']
        },
        textStyle: {
          color: theme.palette.text.primary,
          fontSize: isMobile ? 10 : 12
        }
      }],
      series: [{
        type: 'scatter',
        symbolSize: function (data) {
          const baseSize = isMobile ? 3 : 5;
          return (data[2] - minVolume) / (maxVolume - minVolume) * 50 + baseSize;
        },
        data: scatterData
      }]
    };
  };

  return (
    <Box sx={{ width: '100%', height: '100%' }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : (
        <ReactECharts 
          option={getChartOptions()} 
          style={{ 
            height: isMobile ? '300px' : '600px',
            width: '100%' 
          }}
          opts={{ renderer: 'canvas' }}
        />
      )}
    </Box>
  );
};

export default ScatterChart;
