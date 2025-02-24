import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { fetchIBOVendpoint } from "/src/__api__/db/apiService";
import sectorsData from './sectors.json';

const SunburstStocks = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchIBOVendpoint();
      if (response && !response.error) {
        const processedData = processStockData(response);
        setData(processedData);
      }
    };
    fetchData();
  }, []);

  const getSector = (symbol) => {
    const shortSymbol = symbol.substring(0, 4);
    return sectorsData[shortSymbol] || "Unknown Sector";
  };

  const formatSectorName = (sector) => {
    return sector.split(' ').join('\n');
  };

  const processStockData = (stocks) => {
    const sectors = {};

    stocks.forEach(stock => {
      const stockSector = getSector(stock.symbol);
      const formattedSector = formatSectorName(stockSector);
      
      if (!sectors[formattedSector]) {
        sectors[formattedSector] = [];
      }
      
      sectors[formattedSector].push({
        name: stock.symbol,
        value: Math.abs(stock.variation), // Use absolute value for size
        itemStyle: {
          color: getColorByVariation(stock.variation)
        }
      });
    });

    return Object.keys(sectors).map(sector => ({
      name: sector,
      children: sectors[sector]
    }));
  };

  const getColorByVariation = (variation) => {
    const absVariation = Math.abs(variation);
    if (variation > 0) {
      return `rgb(0, ${Math.min(255, Math.round(absVariation * 25))}, 0)`;
    } else {
      return `rgb(${Math.min(255, Math.round(absVariation * 25))}, 0, 0)`;
    }
  };

  const option = {
    title: {
      text: 'Variação IBOVESPA',
      textStyle: {
        fontSize: 14,
        align: 'center'
      },
      subtextStyle: {
        align: 'center'
      },
    },
    tooltip: {
      formatter: function (params) {
        const value = params.data.value.toFixed(2);
        const sign = params.data.itemStyle.color.includes('rgb(0,') ? '+' : '-';
        return `${params.name.replace(/\n/g, ' ')}: ${sign}${value}%`;
      }
    },
    series: {
      type: 'sunburst',
      data: data,
      radius: [0, '95%'],
      sort: null,
      emphasis: {
        focus: 'ancestor'
      },
      levels: [
        {},
        {
          r0: '15%',
          r: '45%',
          itemStyle: {
            borderWidth: 2
          },
          label: {
            rotate: 'tangential',
            fontSize: 10,
            align: 'center'
          }
        },
        {
          r0: '45%',
          r: '75%',
          label: {
            align: 'right'
          }
        },
        {
          r0: '70%',
          r: '72%',
          label: {
            position: 'outside',
            padding: 3,
            silent: false
          },
          itemStyle: {
            borderWidth: 3
          }
        }
      ]
    }
  };

  return <ReactECharts option={option} style={{ height: '600px' }} />;
};

export default SunburstStocks;