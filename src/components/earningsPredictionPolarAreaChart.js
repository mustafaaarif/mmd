import React from 'react';
import { PolarArea } from 'react-chartjs-2';


const EarningsPredictionPolarChart = ({ polarAreaChartData }) => {

  const formatValue = (value) => {
    const roundedValue = Math.round(value * 100) / 100;
    return roundedValue.toLocaleString('de-DE', {
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    });
  };

  const data = {
    labels: polarAreaChartData.labels,
    datasets: [
      {
        label: 'Earnings',
        data: polarAreaChartData.data,
        backgroundColor: [
          'rgba(0, 10, 96, 0.3)',
          'rgba(180, 11, 190, 0.8)',
          'rgba(0, 10, 96, 0.8)',
          'rgba(180, 11, 190, 0.3)',
        ],
        borderColor: [
          'rgba(0, 10, 96, 1)',
          'rgba(180, 11, 190, 1)',
          'rgba(0, 10, 96, 1)',
          'rgba(180, 11, 190, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scale: {
      ticks: { beginAtZero: true },
    },
    
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            var label = context.label || ''
            var value = formatValue(context.raw);
            return label + ': ' + value + ' €';
          }
        },
        mode: "nearest",
        intersect: false,
      }
    },
  };

  return (
    <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 450}}>
      <PolarArea data={data} options={options} /> 
    </div>
  );

}

export default EarningsPredictionPolarChart;
