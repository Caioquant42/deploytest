import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { fetchFLUXOendpoint } from "/src/__api__/db/apiService"; // Ensure the path is correct

const FluxoEstrangeiro = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFLUXOendpoint();
        const formattedData = data.map(item => ({
          date: item.Data,
          Estrangeiro: parseFloat(item.Estrangeiro.replace(' mi', '').replace(',', '.')),
          Institucional: parseFloat(item.Institucional.replace(' mi', '').replace(',', '.')),
          PessoaFisica: parseFloat(item['Pessoa física'].replace(' mi', '').replace(',', '.')),
          InstFinanceira: parseFloat(item['Inst. Financeira'].replace(' mi', '').replace(',', '.')),
          Outros: parseFloat(item.Outros.replace(' mi', '').replace(',', '.'))
        }));
        // Reverse to get the newest first, then slice to get only the newest half
        setChartData(formattedData.reverse().slice(0, Math.ceil(formattedData.length / 2)));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
    if (chartRef.current && chartData.length) {
      const chart = echarts.init(chartRef.current);

      const option = {
        title: {
          text: 'Fluxo de Capitais',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          formatter: function (params) {
            return params.map(param => `${param.seriesName}: ${param.data.value} mi`).join('<br/>');
          }
        },
        legend: {
          data: ['Estrangeiro', 'Institucional', 'Pessoa Física', 'Inst. Financeira', 'Outros'],
          bottom: 0
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar', 'stack'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            axisTick: { show: false },
            data: chartData.map(item => item.date),
            axisLabel: {
              rotate: 45
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Milhões'
          }
        ],
        series: [
          {
            name: 'Estrangeiro',
            type: 'bar',
            data: chartData.map(item => ({
              value: item.Estrangeiro,
              itemStyle: {
                color: item.Estrangeiro >= 0 ? '#4CAF50' : '#F44336'
              }
            })),
            barWidth: 15,
            emphasis: {
              focus: 'series'
            }
          },
          {
            name: 'Institucional',
            type: 'bar',
            data: chartData.map(item => ({
              value: item.Institucional,
              itemStyle: {
                color: item.Institucional >= 0 ? '#2196F3' : '#03A9F4'
              }
            })),
            barWidth: 15,
            emphasis: {
              focus: 'series'
            }
          },
          {
            name: 'Pessoa Física',
            type: 'bar',
            data: chartData.map(item => ({
              value: item.PessoaFisica,
              itemStyle: {
                color: item.PessoaFisica >= 0 ? '#FFEB3B' : '#FFC107'
              }
            })),
            barWidth: 15,
            emphasis: {
              focus: 'series'
            }
          },
          {
            name: 'Inst. Financeira',
            type: 'bar',
            data: chartData.map(item => ({
              value: item.InstFinanceira,
              itemStyle: {
                color: item.InstFinanceira >= 0 ? '#E91E63' : '#F06292'
              }
            })),
            barWidth: 15,
            emphasis: {
              focus: 'series'
            }
          },
          {
            name: 'Outros',
            type: 'bar',
            data: chartData.map(item => ({
              value: item.Outros,
              itemStyle: {
                color: item.Outros >= 0 ? '#9C27B0' : '#BA68C8'
              }
            })),
            barWidth: 15,
            emphasis: {
              focus: 'series'
            }
          }
        ]
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    }
  }, [chartData]); 

  return <div ref={chartRef} style={{ width: '100%', height: '600px' }} />;
};

export default FluxoEstrangeiro;