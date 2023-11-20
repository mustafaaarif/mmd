import React from "react";
import { Bar } from "react-chartjs-2";

const PromotionBarChart = ({promotionData, chartTitle}) => {

    const graphColors = [
        "#10BD9D",
        "#1ECE6C",
        "#2B98DD",
        "#9C56B9",
        "#F1C501)",
        "#E97E04",
        "#E84C36",
        "#95A4A7",
        "#33495F",
        "#F69E00",
        "#D65301",
        "#C33825",
        "#BCC4C7",
        "#227FBC",
        "#1AAF5D",
        "#8E3FB0",
        "#0CA185",
        "#2B3D51",
        "#5987ba",
        "#2227b3"
    ];

  const barData = {
    labels: ["Average Promotion Rating"],
    datasets: [
      {
        label: 'Average Promotion Rating',
        data: [promotionData.count],
        backgroundColor: graphColors,
        borderwidth: 1
      }
    ]
  };

  const options = {
      indexAxis: 'x',
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
          position: 'top',
          display: true
        },
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

export default PromotionBarChart;
