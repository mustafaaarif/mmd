import React from "react";
import {
	Card,
	CardBody,
	CardTitle,
	CardSubtitle,
	Col,
	Row,
} from 'reactstrap';
import EdStatistics from './edStatistics';
import { Line } from 'react-chartjs-2';



const EdSalesSummary = ({ salesGraphData, topReleases, monthRangeText }) => {

	let colors_dict = {
		'Amazon': '#4512ff',
		'Amazon Music': '#4512ff',
		'Amazon Unlimited': '#4512ff',
		'Apple Music': '#FC3C44',
		'Beatport': '#01FF95',
		'Deezer': '#EF5466',
		'Facebook': '#4267B2',
		'iTunes': '#EA4CC0',
		'Instagram': '#8A3AB9',
		'Napster': '#FDB813',
		'Pandora': '#00A0EE',
		'SoundCloud': '#FF8800',
		'Spotify': '#2dce89',
		'Tidal': '#0ff',
		'TikTok': '#25F4EE',
		'TikTok Inc.': '#25F4EE',
		'Traxsource': '#40A0FF',
		'Yandex': '#FFCC00',
		'YouTube': '#FF0000',
		'YouTube Music': '#FF0000',
		'Other Stores': '#8898aa'
	};

	const getGraphDatasets = (graphData) => {

	var stores_revenue_data = graphData.stores_revenue;

	var datasets = [];
	var order_index = 2;

	var combinedSalesDataset = {
		order: 1,
		data: graphData.combined_revenue,
		label: "Combined Revenue (€)",
		pointBackgroundColor: "#3e5569",
		borderColor: "#3e5569",
		backgroundColor: "#3e5569",
		hoverBackgroundColor: "#3e5569",
		fill: false,
		tension: 0.5,
		borderWidth: 1.5
	};

	datasets.push(combinedSalesDataset);

	for (let store_name  of Object.keys(stores_revenue_data)) {
		order_index = order_index + 1;

		var store_dataset = {
			order: order_index,
			label: store_name + " Revenue (€)",
			data: stores_revenue_data[store_name],
			backgroundColor: colors_dict[store_name],
			hoverBackgroundColor: colors_dict[store_name],
			fill: false,
			type: 'bar'
		};

		datasets.push(store_dataset);  
	}

	return datasets;
	};
	
	const options = {
		type: 'line',
		plugins: {
			legend: {
			display: false,
			},
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
		<Card>
			<CardBody>
				<div className="d-md-flex align-items-center">
					<div>
						<CardTitle>Royalties Summary</CardTitle>
						<CardSubtitle>Overview of selected Month Range</CardSubtitle>
					</div>
				</div>
				<Row>
					<Col lg="4">
						<div>
							<h1 className="mb-0 mt-4">{salesGraphData.revenue_sum} €</h1>
							{/* <a className="btn btn-info my-3 p-3 px-4" href="#">{monthRangeText}</a> */}
						</div>
					</Col>
					<Col lg="8">
						<div className="ml-auto no-block align-items-center">
							<ul className="list-inline font-12 dl mr-0 mb-3">
								
								{Object.keys(salesGraphData.stores_revenue).map((store_name)=>(
									<li className="border-0 p-0 list-inline-item" style={{ color: colors_dict[store_name]}} key={store_name} >
										<i className="fa fa-circle"></i> {store_name}
									</li>
								))}

								<li className="border-0 p-0 list-inline-item" style={{ color: '#FFFFF'}}>
									<i className="fa fa-circle"></i> Combined Revenue
								</li>
								
							</ul>
						</div>
						
						<div className="campaign ct-charts">
							<div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 300 }}>
							<Line
								width={100}
								height={500}
								data={{
									labels: salesGraphData.months,
									datasets: getGraphDatasets(salesGraphData)
								}}
								options={options}
								/>
							</div>
						</div>
					</Col>
				</Row>
			</CardBody>
			{topReleases.length>0 &&
				<CardBody className="border-top">
					<Row className="mb-0">
						{topReleases[0]&&
							<Col lg="4" md="6">
								<EdStatistics
									textColor="orange"
									icon={topReleases[0].release_artwork}
									title={topReleases[0].release_name}
									subtitle={topReleases[0].release_revenue}
								/>
							</Col>
						}
						{topReleases[1]&&
							<Col lg="4" md="6">
								<EdStatistics
									textColor="orange"
									icon={topReleases[1].release_artwork}
									title={topReleases[1].release_name}
									subtitle={topReleases[1].release_revenue}
								/>
							</Col>
						}
						{topReleases[2]&&
							<Col lg="4" md="6">
								<EdStatistics
									textColor="orange"
									icon={topReleases[2].release_artwork}
									title={topReleases[2].release_name}
									subtitle={topReleases[2].release_revenue}
								/>
							</Col>
						}
					</Row>
				</CardBody>
			}
		</Card>
	);
}

export default EdSalesSummary;
