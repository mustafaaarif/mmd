import React from "react";
import { Bar } from "react-chartjs-2";

const EdBarChart = ({storeData}) => {

  const revenue_rounded = [];
  
  storeData.revenue.forEach(value => {
    revenue_rounded.push(value.toFixed(2));
  });

  const barData = {
    labels: storeData.store,
    datasets: [
      {
        label: 'Revenue: ',
        data: revenue_rounded,
        backgroundColor: '#000a60',
        hoverBackgroundColor: '#000a60',
      }
    ]
  };

  const options = {
      indexAxis: 'y',
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
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
          display: false
        },
        tooltip: {
          callbacks: {
              label: function(context) {
                  var revenue = context.raw || '';
                  return 'Revenue : ' + revenue + ' €';
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
      <div className="chart-wrapper" style={{ width: '100%', margin: '5 auto', height: 300 }}>
          <Bar data={barData} options={options} />
      </div>
    </>
  );
};

export default EdBarChart;
