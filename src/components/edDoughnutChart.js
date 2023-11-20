import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Row, Col, ListGroup, ListGroupItem } from "reactstrap";


const EdDoughnutChart = ({storeData}) => {

    let colors_dict = {
		'Amazon Music': '#4512ff',
		'Amazon Unlimited': '#4512ff',
		'Apple Music': '#FC3C44',
		'Beatport': '#01FF95',
		'Deezer': '#EF5466',
		'Facebook': '#4267B2',
        'iTunes ': '#EA4CC0',
		'Instagram': '#8A3AB9',
		'Napster': '#FDB813',
		'Pandora': '#00A0EE',
		'SoundCloud': '#FF8800',
		'Spotify': '#2dce89',
		'Tidal': '#0ff',
		'TikTok': '#25F4EE',
		'Traxsource': '#40A0FF',
		'Yandex': '#FFCC00',
		'YouTube': '#FF0000',
		'YouTube Music': '#FF0000',
        'Other Stores': '#3e5569'
	}

    let store_colors = [];

    storeData.store.forEach(store_name => {
        let color_code = colors_dict[store_name];
        store_colors.push(color_code);
    });

    let revenue_pcts = [];

    let revenue_sum = storeData.revenue.reduce(function(acc, val) { return acc + val; }, 0)

    for (let i = 0; i < storeData.revenue.length; i++) {
        let store_revenue_sum = (storeData.revenue[i]/revenue_sum*100).toFixed(2);
        revenue_pcts.push (store_revenue_sum);
    }

    //Doughnut Chart
    const doughnutData = {
        labels: storeData.store,

        datasets: [{
            data: revenue_pcts,
            backgroundColor: store_colors,
            hoverBackgroundColor: store_colors,
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
                        var revenue = context.raw || '';
                        return label + ': ' + revenue +' %';
                    }
                }
            }
        } 
    };

    return(

            <>
                <Row>
                    <Col lg="8" md="8">
                        <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 300 }}>
                        <Doughnut data={doughnutData} options={options} />
                    </div>
                    </Col>
                    <Col lg="4" md="4">
                        <ListGroup className="mt-4">
                            {storeData.store[0] && <ListGroupItem className="border-0 mt-3 p-0"><i className="fas fa-circle mr-1 font-12" style={{color: colors_dict[storeData.store[0]] }}></i> {storeData.store[0]} <span className="float-right">{revenue_pcts[0]} %</span></ListGroupItem>}
                            {storeData.store[1] && <ListGroupItem className="border-0 mt-3 p-0"><i className="fas fa-circle mr-1 font-12" style={{color: colors_dict[storeData.store[1]] }}></i> {storeData.store[1]} <span className="float-right">{revenue_pcts[1]} %</span></ListGroupItem>}
                            {storeData.store[2] && <ListGroupItem className="border-0 mt-3 p-0"><i className="fas fa-circle mr-1 font-12" style={{color: colors_dict[storeData.store[2]] }}></i> {storeData.store[2]} <span className="float-right">{revenue_pcts[2]} %</span></ListGroupItem>}
                            {storeData.store[3] && <ListGroupItem className="border-0 mt-3 p-0"><i className="fas fa-circle mr-1 font-12" style={{color: colors_dict[storeData.store[3]] }}></i> {storeData.store[3]} <span className="float-right">{revenue_pcts[3]} %</span></ListGroupItem>}
                            {storeData.store[4] && <ListGroupItem className="border-0 mt-3 p-0"><i className="fas fa-circle mr-1 font-12" style={{color: colors_dict[storeData.store[4]] }}></i> {storeData.store[4]} <span className="float-right">{revenue_pcts[4]} %</span></ListGroupItem>}
                            {storeData.store[5] && <ListGroupItem className="border-0 mt-3 p-0"><i className="fas fa-circle mr-1 font-12" style={{color: colors_dict[storeData.store[5]] }}></i> {storeData.store[5]} <span className="float-right">{revenue_pcts[5]} %</span></ListGroupItem>}
                        </ListGroup>
                    </Col>
                </Row>
            </>
        

    );
}

export default EdDoughnutChart;
