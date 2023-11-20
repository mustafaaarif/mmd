import React from "react";
import { Line } from "react-chartjs-2";

const LinkLandingPageViews = ({ viewsGraphData }) => {

    const options = {
        type: 'line',
        plugins: {
            legend: {
              display: false,
              labels: {
                filter: function (item, chart) {
                    const dataset = chart.datasets[item.datasetIndex];
                    return dataset.displayInLegend;
                },
              },
            },
            tooltip: {
                filter: function (chart) {
                    const dataset = chart.dataset;
                    return dataset.displayInTooltip;
                },
            }
        },
        responsive: true,
        interaction: {
            mode: 'index',
            intersect: false
        },
        maintainAspectRatio: false,
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
      <div className="multiSalesChart">
        <Line
          width={100}
          height={500}
          data={{
            labels: viewsGraphData.labels,
            datasets: [
              {
                data: viewsGraphData.data,
                label: "Views",
                displayInLegend: false,
                displayInTooltip: true,
                fill: false,
                pointBorderWidth: 3,
                borderwidth: 1,
                tension: 0.5,
                pointBackgroundColor: "#b40bbe",
                borderColor: "#b40bbe",
                backgroundColor: "rgba(232,244,251, .5)"
              },
              {
                data: viewsGraphData.data,
                label: "Views",
                displayInLegend: true,
                displayInTooltip: false,
                pointBackgroundColor: "#000a60",
                borderColor: "#000a60",
                backgroundColor: "#000a60",
                hoverBackgroundColor: "#000a60",
                type: 'bar',
                fill: true
              }
            ]
          }}
          options={options}
        />
      </div>
    </>
  );
};

export default LinkLandingPageViews;
