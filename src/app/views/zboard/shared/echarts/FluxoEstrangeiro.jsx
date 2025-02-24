import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { fetchFLUXOendpoint } from "/src/__api__/db/apiService"; // Ensure the path is correct

const FluxoEstrangeiro = () => {
  const chartRef1 = useRef(null);
  const chartRef2 = useRef(null);
  const chartRef3 = useRef(null);
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
        // Calculate total and add it to each item
        const dataWithTotal = formattedData.map(item => ({
          ...item,
          Total: item.Estrangeiro + item.Institucional + item.PessoaFisica + item.InstFinanceira + item.Outros
        }));
        // Reverse to get the newest first, then slice to get only the newest half
        setChartData(dataWithTotal.reverse().slice(0, Math.ceil(dataWithTotal.length / 2)));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); 

  useEffect(() => {
    if (chartData.length) {
      const createChart = (chartRef, title, series) => {
        const chart = echarts.init(chartRef.current);
        const option = {
          title: { text: title, left: 'center' },
          tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: (params) => params.map(param => `${param.seriesName}: ${param.data.value.toFixed(2)} mi`).join('<br/>')
          },
          legend: { data: series.map(s => s.name), bottom: 0 },
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
          xAxis: [{
            type: 'category',
            axisTick: { show: false },
            data: chartData.map(item => item.date),
            axisLabel: { rotate: 45 }
          }],
          yAxis: [{ type: 'value', name: 'Milhões' }],
          series: series.map(s => ({
            name: s.name,
            type: 'bar',
            data: chartData.map(item => ({
              value: item[s.key],
              itemStyle: { color: item[s.key] >= 0 ? s.positiveColor : s.negativeColor }
            })),
            barWidth: 15,
            emphasis: { focus: 'series' }
          }))
        };
        chart.setOption(option);
        return chart;
      };

      const chart1 = createChart(chartRef1, 'Fluxo Estrangeiro e Pessoa Física', [
        { name: 'Estrangeiro', key: 'Estrangeiro', positiveColor: '#4CAF50', negativeColor: '#F44336' },
        { name: 'Pessoa Física', key: 'PessoaFisica', positiveColor: '#FFEB3B', negativeColor: '#FFC107' }
      ]);

      const chart2 = createChart(chartRef2, 'Institucional e Instituição Financeira', [
        { name: 'Institucional', key: 'Institucional', positiveColor: '#2196F3', negativeColor: '#03A9F4' },
        { name: 'Inst. Financeira', key: 'InstFinanceira', positiveColor: '#E91E63', negativeColor: '#F06292' }
      ]);

      const chart3 = createChart(chartRef3, 'Fluxo Total', [
        { name: 'Total', key: 'Total', positiveColor: '#9C27B0', negativeColor: '#BA68C8' }
      ]);

      return () => {
        chart1.dispose();
        chart2.dispose();
        chart3.dispose();
      };
    }
  }, [chartData]);

  return (
    <div>
      <div ref={chartRef1} style={{ width: '100%', height: '400px' }} />
      <div ref={chartRef2} style={{ width: '100%', height: '400px' }} />
      <div ref={chartRef3} style={{ width: '100%', height: '400px' }} />
    </div>
  );
};

export default FluxoEstrangeiro;