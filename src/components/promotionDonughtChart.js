import React from 'react';
import { Doughnut } from 'react-chartjs-2';


const PromotionDoughnutChart = ({promotionData, chartTitle}) => {


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

    //Doughnut Chart
    const doughnutData = {
        labels: promotionData.map(i => i.name),
        datasets: [
          {
            data: promotionData.map(i => i.count),
            backgroundColor: graphColors,
            borderwidth: 1
          }
        ]
    };

    const options = {
        maintainAspectRatio: false,
        type: 'doughnut',
        align: 'start',
        position: 'top',
        options: {
            plugins: {
                title: {
                    display: true,
                    text: chartTitle,
                    fontSize: 16
                },
                legend: {
                    display: true,
                },
            }
        }
        // plugins: {
        //     legend: {
        //       display: false,
        //     },
        //     tooltip: {
        //         callbacks: {
        //             label: function(context) {
        //                 var label = context.label || '';
        //                 var revenue = context.raw || '';
        //                 return label + ': ' + revenue +' %';
        //             }
        //         }
        //     }
        // } 
    };

    // options={{
    //     responsive: true,
    //     position: "bottom",
    //     legend: {
    //       position: "bottom"
    //     },
    //     title: {
    //       text: "Downloaded Tracks",
    //       display: true,
    //       fontSize: 16
    //     },
    //     tooltips: {
    //       callbacks: doughnutTooltip
    //     }
    //   }}

    return(
        <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 300 }}>
            <Doughnut data={doughnutData} options={options} />
        </div>    
    );
}

export default PromotionDoughnutChart;
