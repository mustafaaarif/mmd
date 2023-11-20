import React from "react";
import { Bar } from "react-chartjs-2";

const LinkLandingPageTopOS = ({ topOsData }) => {

  const barData = {
    labels: topOsData.labels,
    datasets: [
      {
        label: 'Operating System: ',
        data: topOsData.data,
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
                  var usage = context.raw || '';
                  return 'Views : ' + usage + '%';
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
      <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 300 }}>
          <Bar data={barData} options={options} />
      </div>
    </>
  );
};

export default LinkLandingPageTopOS;