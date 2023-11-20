import React from "react";
import { Bar } from "react-chartjs-2";

const EarningsPredictionRangeBarChart = ({ rangeBarChartData }) => {

  const formatValue = (value) => {
    const roundedValue = Math.round(value * 100) / 100;
    return roundedValue.toLocaleString('de-DE', {
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    });
  };

  const barData = {
    labels: ['#1 Almost Guaranteed', '#2 Very Probable', '#3 Anticipated', '#4 Realistic Forecast', '#5 Achievable Potential'],
    datasets: [
      {
        label: '12 M',
        data: rangeBarChartData.data_yr,
        backgroundColor: ['#003300', '#006600', '#669966', '#99C299', '#CCFFCC'],
        hoverBackgroundColor: ['#003300', '#006600', '#669966', '#99C299', '#CCFFCC'],
      },
      {
        label: 'Long Term',
        data: rangeBarChartData.data_at,
        backgroundColor: ['#003300', '#006600', '#669966', '#99C299', '#CCFFCC'],
        hoverBackgroundColor: ['#003300', '#006600', '#669966', '#99C299', '#CCFFCC'],
      },
    ]
  };

  const options = {
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 0,
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
              var label = context.dataset.label || ''
              var values = context.raw;
              var value_start = formatValue(values[0]);
              var value_end = formatValue(values[1]);
              return label + ': ' + value_start + " - " +  value_end + ' €';
            }
          },
          mode: "nearest",
          intersect: false,
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
        },
        y: {
          grid: {
            display: true,
            drawTicks: false,
          },
          ticks: {
            stepSize: 10,
            padding: 10,
            font: {
              weight: 'bold',
            },
          },
        },
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

export default EarningsPredictionRangeBarChart;
