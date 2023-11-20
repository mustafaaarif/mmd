import React from "react";
import { Bar } from "react-chartjs-2";

const TrendsAgeGraph = ({ ageGraphData }) => {

  const barData = {
    labels: ageGraphData.labels,
    datasets: [
      {
        label: 'Male',
        data: ageGraphData.data.male,
        backgroundColor: 'rgba(94, 114, 228, 0.7)',
        hoverBackgroundColor: 'rgba(94, 114, 228, 0.8)',
      },
      {
        label: 'Female',
        data: ageGraphData.data.female,
        backgroundColor:  'rgba(79, 195, 247, 0.7)',
        hoverBackgroundColor: 'rgba(79, 195, 247, 0.8)',
      },
      {
        label: 'Non-binary',
        data: ageGraphData.data.gender_other,
        backgroundColor:  'rgba(50, 50, 93, 0.7)',
        hoverBackgroundColor: 'rgba(50, 50, 93, 0.8)',
      },
      {
        label: 'Unknown',
        data: ageGraphData.data.unknown,
        backgroundColor:  'rgba(232,244,251, 0.7)',
        hoverBackgroundColor: 'rgba(232,244,251, 0.8)',
      },
    ]
  };

  const options = {
    plugins: {
      title: {
        display: false,
        text: 'Age Wise Sales'
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        }
      },
      y: {
        stacked: true,
        grid: {
          display: false,
        }
      }
    }
  };

  return (
    <>
      <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 400 }}>
          <Bar data={barData} options={options} />
      </div>
    </>
  );
};

export default TrendsAgeGraph;
