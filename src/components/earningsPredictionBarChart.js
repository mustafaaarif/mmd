import React from "react";
import { Bar } from "react-chartjs-2";

const EarningsPredictionBarChart = ({ chartData }) => {

  const formatValue = (value) => {
    const roundedValue = Math.round(value * 100) / 100;
    return roundedValue.toLocaleString('de-DE', {
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    });
  };

  const barData = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Predicted',
        data: chartData.data.map((value) => value.predicted),
        backgroundColor: '#000a60',
        hoverBackgroundColor: '#000a60',
      },
      {
        label: 'Realistic',
        data: chartData.data.map((value) => value.realistic),
        backgroundColor: '#b40bbe',
        hoverBackgroundColor: '#b40bbe',
      }
    ]
  };

  const options = {
      indexAxis: 'x',
      elements: {
        bar: {
          borderWidth: 2,
        }
      },
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              var label = context.dataset.label || '';
              var value = formatValue(context.raw);
              return label + ': ' + value + ' €';
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
          }
        },
        y: {
          grid: {
            display: false,
          }
        }
      }
    };

  return (
    <>
      <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 450 }}>
          <Bar data={barData} options={options} />
      </div>
    </>
  );
};

export default EarningsPredictionBarChart;
