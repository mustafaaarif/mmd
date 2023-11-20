import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, CardTitle, Alert, CardSubtitle, Button } from "reactstrap";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import { useLoading, Audio } from '@agney/react-loading';
import { useLocation } from "react-router-dom";

import LinkLandingPageViews from "../../components/linkLandingPageViews";
import LinkLandingPageTopTerritories from "../../components/linkLandingPageTopTerritories";
import LinkLandingPageTooDeviceTypes from "../../components/linkLandingPageTopDeviceTypes";
import LinkLandingPageTopOS from "../../components/linkLandingPageTopOs";
import LinkLandingPageTopBrowsers from "../../components/linkLandingPageTopBrowsers";
import LinkLandingPageTopSocialLinks from "../../components/linkLandingPageTopSocialLinks";
import LinkLandingPageTopFeaturedLinks from "../../components/linkLandingPageTopFeaturedLinks";

import './linkLandingPageAnalytics.css';

const LinkLandingPageAnalytics = () => {

  const location = useLocation();
  const linkLandingPageID = location.pathname.split("/")[2];

  const token = getCookie("token");
  const didEff = useRef(false);
  const [forceUpdate, setForce] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const [topTerritoriesData, setTopTerritoriesData] = useState([]);
  const [topOsData, setTopOsData] = useState({});
  const [topDeviceCategoriesData, setTopDeviceCategoriesData] = useState({});
  const [topBrowsersData, setTopBrowsersData] = useState([]);
  const [viewsGraphData, setViewsGraphData] = useState([]);
  const [topSocialLinksData, setTopSocialLinksData] = useState([]);
  const [topFeaturedLinksData, setTopFeaturedLinksData] = useState([]);

  const [stats_data, error, isloading] = useFetch("GET", `link-landingpages/stats/?link_landing_page_id=${linkLandingPageID}&period=${selectedPeriod}`, token, false , forceUpdate);

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
      if(stats_data.date_wise_page_views)
      {
        setViewsGraphData(stats_data.date_wise_page_views)
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

      if (stats_data.social_link_stats) {
        setTopSocialLinksData(stats_data.social_link_stats);
      }

      if (stats_data.featured_link_stats) {
        setTopFeaturedLinksData(stats_data.featured_link_stats);
      }
    }

  }, [stats_data]);

  useEffect(() => {
    if (!didEff.current) {
      didEff.current = true;
      return;
    }
    setForce(prev => prev + 1);
  }, [selectedPeriod]);

  return (
    <>
      <Row>
        <Col className="col-12">
          <Alert color="warning">
              <b>Learn all about link landing page stats <a href="/link-landing-page" target="_blank" rel="noreferrer noopener">here</a>. </b>
          </Alert>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row>
                <Col xl="4" lg="4" md="4" sm="12" xm="12">
                  <Button
                    className={selectedPeriod === 1? "btn btn-lg btn-primary-custom": "btn btn-lg btn-outline-primary"}
                    style={{width: "100%", margin: "5px"}}
                    onClick={() => { setSelectedPeriod(1) }}>
                    Last 7 Days
                  </Button>
                </Col>
                <Col xl="4" lg="4" md="4" sm="12" xm="12">
                  <Button
                    className={selectedPeriod === 2? "btn btn-lg btn-primary-custom": "btn btn-lg btn-outline-primary"}
                    style={{width: "100%", margin: "5px"}}
                    onClick={() => { setSelectedPeriod(2) }}>
                    Last 14 Days
                  </Button>
                </Col>
                <Col xl="4" lg="4" md="4" sm="12" xm="12">
                  <Button
                    className={selectedPeriod === 3? "btn btn-lg btn-primary-custom": "btn btn-lg btn-outline-primary"}
                    style={{width: "100%", margin: "5px"}}
                    onClick={() => { setSelectedPeriod(3) }}>
                    Last 30 Days
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
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
                <Row>
                  <Col xl="8" lg="8" md="8" sm="8" xm="6">
                    <CardTitle>
                      <h3>Link Landing Page Views</h3>
                    </CardTitle>
                  </Col>
                  <Col xl="4" lg="4" md="4" sm="4" xm="6">
                    <CardSubtitle>
                      <div className="float-right text-center">
                        <h6>Total Views</h6>
                        <h6 className="text-bold text-primary">{stats_data.total_page_views}</h6>
                      </div>
                    </CardSubtitle>                        
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col xl="12">
                    <LinkLandingPageViews viewsGraphData={viewsGraphData} />
                  </Col>
                </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl="6" lg="6" md="12" sm="12" xm="12">
              <Card>
                <CardBody>
                <Row>
                  <Col xl="8" lg="8" md="8" sm="8" xm="6">
                    <CardTitle>
                      <h3>Social Link Clicks</h3>
                    </CardTitle>
                  </Col>
                  <Col xl="4" lg="4" md="4" sm="4" xm="6">
                    <CardSubtitle>
                      <div className="float-right text-center">
                        <h6>Total Clicks</h6>
                        <h6 className="text-bold text-primary">{stats_data.total_social_link_clicks}</h6>
                      </div>
                    </CardSubtitle>                        
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col xl="12">
                    <LinkLandingPageTopSocialLinks topSocialLinksData={topSocialLinksData} />
                  </Col>
                </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl="6" lg="6" md="12" sm="12" xm="12">
              <Card>
                <CardBody>
                <Row>
                <Col xl="8" lg="8" md="8" sm="8" xm="6">
                    <CardTitle>
                      <h3>Featured Link Clicks</h3>
                    </CardTitle>
                  </Col>
                  <Col xl="4" lg="4" md="4" sm="4" xm="6">
                    <CardSubtitle>
                      <div className="float-right text-center">
                        <h6>Total Clicks</h6>
                        <h6 className="text-bold text-primary">{stats_data.total_featured_link_clicks}</h6>
                      </div>
                    </CardSubtitle>                        
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col xl="12">
                    <LinkLandingPageTopFeaturedLinks topFeaturedLinksData={topFeaturedLinksData} />
                  </Col>
                </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl="6" lg="6" md="12" sm="12" xm="12">
              <Card>
                <CardBody>
                <Row>
                  <Col xl="8" lg="8" md="8" sm="8" xm="6">
                    <CardTitle>
                      <h3>Top Territories</h3>
                    </CardTitle>
                  </Col>
                  <Col xl="4" lg="4" md="4" sm="4" xm="6">
                    <CardSubtitle>
                      <div className="float-right text-center">
                        <h6>Total Views</h6>
                        <h6 className="text-bold text-primary">{stats_data.total_page_views}</h6>
                      </div>
                    </CardSubtitle>                        
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col xl="12">
                    <LinkLandingPageTopTerritories topTerritoriesData={topTerritoriesData} />
                  </Col>
                </Row>
                </CardBody>
              </Card>
            </Col>

            <Col xl="6" lg="6" md="12" sm="12" xm="12">
              <Card>
                <CardBody>
                <Row>
                  <Col xl="8" lg="8" md="8" sm="8" xm="6">
                    <CardTitle>
                      <h3>Top Browsers</h3>
                    </CardTitle>
                  </Col>
                  <Col xl="4" lg="4" md="4" sm="4" xm="6">
                    <CardSubtitle>
                      <div className="float-right text-center">
                        <h6>Total Views</h6>
                        <h6 className="text-bold text-primary">{stats_data.total_page_views}</h6>
                      </div>
                    </CardSubtitle>                        
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col xl="12">
                    <LinkLandingPageTopBrowsers topBrowsersData={topBrowsersData} />                  
                  </Col>
                </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
          
          <Row>
            <Col xl="6" lg="6" md="12" sm="12" xm="12">
              <Card>
                <CardBody>
                  <CardTitle>
                      <h3>Top Device Types</h3>
                  </CardTitle>
                  <LinkLandingPageTooDeviceTypes topDeviceCategoriesData={topDeviceCategoriesData} />                  
                </CardBody>
              </Card>
            </Col>

            <Col xl="6" lg="6" md="12" sm="12" xm="12">
              <Card>
                <CardBody>
                  <CardTitle>
                      <h3>Top Operating Systems</h3>
                  </CardTitle>
                  <LinkLandingPageTopOS topOsData={topOsData} />                  
                </CardBody>
              </Card>
            </Col>

          </Row>
        </div>
      }
    </>
  );
};

export default LinkLandingPageAnalytics;
