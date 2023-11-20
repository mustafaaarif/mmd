import React from 'react';
import { Doughnut } from 'react-chartjs-2';


const LinkLandingPageTooDeviceTypes = ({topDeviceCategoriesData}) => {

    //Doughnut Chart
    const doughnutData = {
        labels: topDeviceCategoriesData.labels,
        datasets: [{
            data: topDeviceCategoriesData.data,
            backgroundColor: topDeviceCategoriesData.colors,
            hoverBackgroundColor: topDeviceCategoriesData.colors,
        }]
    };

    const options = {
        maintainAspectRatio: false,
        type: 'doughnut',
        align: 'start',
        position: 'top',
        plugins: {
            legend: {
              display: false,
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        var label = context.label || '';
                        var usage = context.raw || '';
                        return label + ': ' + usage +' %';
                    }
                }
            }
        } 
    };

    return(
        <>
            <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 300 }}>
                <Doughnut data={doughnutData} options={options} />
            </div>
        </>  
    );
}

export default LinkLandingPageTooDeviceTypes;
