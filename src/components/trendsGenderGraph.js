import React from "react";
import { Doughnut } from "react-chartjs-2";

const TrendsGenderGraph = ({ genderGraphData }) => {

  const doughnutData = {
      labels: genderGraphData.labels,
      datasets: [{
          data: genderGraphData.data,
          backgroundColor: [
            'rgba(94, 114, 228, 0.7)',
            'rgba(79, 195, 247, 0.7)',
            'rgba(50, 50, 93, 0.7)',
            'rgba(232,244,251, 0.7)'
          ],
          hoverBackgroundColor: [
            'rgba(94, 114, 228, 0.8)',
            'rgba(79, 195, 247, 0.8)',
            'rgba(50, 50, 93, 0.8)',
            'rgba(232,244,251, 0.8'
          ]
      }]
  };

  const options = { 
    maintainAspectRatio: false, 
    legend: { 
      display: true, 
      labels: { 
        fontFamily: "sans-serif" 
      }, 
      align: 'start',
      position: 'top' 
    } 
  }

  return (
    <>
      <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 400 }}>
        <Doughnut data={doughnutData}  options={options} />
      </div>
    </>
  );
};

export default TrendsGenderGraph;
