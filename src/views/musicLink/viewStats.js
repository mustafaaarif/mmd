import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, CardTitle, Alert } from "reactstrap";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import { useLoading, Audio } from '@agney/react-loading';
import { useLocation } from "react-router-dom";
import MusicLinkTopServicesTable from "../../components/musicLinkTopServicesTable";
import MusicLinkTopTracksTable from "../../components/musicLinkTopTracksTable";
import MusicLinkTopTerritoriesTable from "../../components/musicLinkTopTerritoriesTable";
import MusicLinkDoughnutChart from "../../components/musicLinkDonughtChart";
import MusicLinkBarChart from "../../components/musicLinkBarChart";
import MusicLinkBrowserStats from "../../components/musicLinkBrowserStats";
import './viewStats.css';

const ViewStats = () => {

  const location = useLocation();
  const musicLinkID = location.pathname.split("/")[2];

  const token = getCookie("token");
  const [forceUpdate, setForce] = useState(0);
  const [topServicesData, setTopServicesData] = useState([]);
  const [topTracksData, setTopTracksData] = useState([]);
  const [topTerritoriesData, setTopTerritoriesData] = useState([]);
  const [topOsData, setTopOsData] = useState({});
  const [topDeviceCategoriesData, setTopDeviceCategoriesData] = useState({});
  const [topBrowsersData, setTopBrowsersData] = useState([]);

  const [stats_data, error, isloading] = useFetch("GET",
                        "musiclinks/stats/?music_link_id=" + musicLinkID,
                        token, false , forceUpdate);

  const { containerProps, indicatorEl } = useLoading({
    loading: isloading,
    loaderProps: {
      style: { margin: '70px', color: 'white' },
      valueText: 'Fetching trends from database',
    },
    indicator: <Audio width="150" vertical-align="middle" />,
  });

  useEffect(() => {

    if (Object.keys(stats_data).length) {
      if (stats_data.top_stores) {
        setTopServicesData(stats_data.top_stores);
      }

      if (stats_data.top_tracks) {
        setTopTracksData(stats_data.top_tracks);
      }

      if (stats_data.top_territories) {
        setTopTerritoriesData(stats_data.top_territories);
      }

      if (stats_data.top_os) {
        setTopOsData(stats_data.top_os);
      }

      if (stats_data.top_browsers) {
        setTopBrowsersData(stats_data.top_browsers);
      }

      if (stats_data.top_device_categories) {
        setTopDeviceCategoriesData(stats_data.top_device_categories);
      }
    }

  }, [stats_data]);

  return (
    <>
      <Row>
        <Col className="col-12">
          <Alert color="warning">
              <b>Learn all about music link stats <a href="/music-link/view-stats" target="_blank" rel="noreferrer noopener">here</a>. </b>
          </Alert>
        </Col>
      </Row>

      <Row {...containerProps}>
        <Col className="col-12">
          <div className="bg-primary trends-loading">
            {indicatorEl}
          </div>
        </Col>
      </Row>

      {
        !isloading && <div>
          <Row>
            <Col xl="12" lg="12" md="12" sm="12" xm="12">
              <Card>
                <CardBody>
                  <CardTitle>
                    <h3>Top Services</h3>
                    <h6 className="text-gray">CLICK THROUGH BY SERVICE</h6>
                  </CardTitle>
                  <MusicLinkTopServicesTable topServicesData={topServicesData} />
                </CardBody>
              </Card>
            </Col>

            <Col xl="12" lg="12" md="12" sm="12" xm="12">
              <Card>
                <CardBody>
                  <CardTitle>
                    <h3>Top Tracks</h3>
                    <h6 className="text-gray">CLICK THROUGH BY TRACK</h6>
                  </CardTitle>
                  <MusicLinkTopTracksTable topTracksData={topTracksData}/>
                </CardBody>
              </Card>
            </Col>

            <Col xl="12" lg="12" md="12" sm="12" xm="12">
              <Card>
                <CardBody>
                  <CardTitle>
                    <h3>Top Territories</h3>
                    <h6 className="text-gray">CLICK THROUGH BY TERRITORY</h6>
                  </CardTitle>
                  <MusicLinkTopTerritoriesTable topTerritoriesData={topTerritoriesData}/>
                </CardBody>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col xl="4" lg="4" md="4" sm="12" xm="12">
              <Card>
                <CardBody>
                  <CardTitle>
                      <h3>Top Device Types</h3>
                      <h6 className="text-gray">CLICK THROUGH BY DEVICE TYPE</h6>
                  </CardTitle>
                  <MusicLinkDoughnutChart topDeviceCategoriesData={topDeviceCategoriesData} />                  
                </CardBody>
              </Card>
            </Col>

            <Col xl="4" lg="4" md="4" sm="12" xm="12">
              <Card>
                <CardBody>
                  <CardTitle>
                      <h3>Top Operating Systems</h3>
                      <h6 className="text-gray">CLICK THROUGH BY OS</h6>
                  </CardTitle>
                  <MusicLinkBarChart topOsData={topOsData} />                  
                </CardBody>
              </Card>
            </Col>

            <Col xl="4" lg="4" md="4" sm="12" xm="12">
              <Card>
                <CardBody>
                  <CardTitle>
                      <h3>Top Browsers</h3>
                      <h6 className="text-gray">CLICK THROUGH BY BROWSER</h6>
                  </CardTitle>
                  <MusicLinkBrowserStats topBrowsersData={topBrowsersData} />                  
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      }
    </>
  );
};

export default ViewStats;
