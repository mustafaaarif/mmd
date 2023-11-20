import React, { useState, useEffect, useRef, useContext } from "react";
import { Row, Col, Card, CardBody, CardTitle, Label, Button, Alert } from "reactstrap";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import { StateContext } from "../../utils/context";

import Select from "react-select";

import TrendsMap from "../../components/trendsMap";
import TrendsMultiSalesGraph from "../../components/trendsMultiSalesGraph";
import TrendsTable from "../../components/trendsTable";
import TrendsGenderGraph from "../../components/trendsGenderGraph";
import TrendsAgeGraph from "../../components/trendsAgeGraph";

import { useLoading, Audio } from '@agney/react-loading';

import './trends.css';

const Trends = () => {
  const token = getCookie("token");
  const { currentUser } = useContext(StateContext);
  const [forceUpdate, setForce] = useState(0);
  const didEff = useRef(false);
  const [isPandora, setPandoraActive] = useState(false);
  const [isSpotify, setSpotifyActive] = useState(false);
  const [isSoundcloud, setSoundcloudActive] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [mapData, setMapData] = useState({});
  const [multiSalesGraphData, setMultiSalesGraphData] = useState({});
  const [genderGraphData, setGenderGraphData] = useState({});
  const [ageGraphData, setAgeGraphData] = useState({});

  const [activeStoreTab, setActiveStoreTab] = useState({
    label: "All Stores",
    value: "0",
  });

  const [activeLabelTab, setActiveLabelTab] = useState({
    label: "All Labels",
    value: "0",
  });

  const [activeReleaseTab, setActiveReleaseTab] = useState({
    label: "All Releases",
    value: "0",
  });

  const [activeTrackTab, setActiveTrackTab] = useState({
    label: "All Tracks",
    value: "0",
  });

  const [activePeriodTab, setActivePeriodTab] = useState({
    label: "Last 7 Days",
    value: "1",
  });

  const [activeSubUserTab, setActiveSubUserTab] = useState({
    label: "Select Subuser",
    value: "0",
  });

  const [release_ops, setReleaseOps] = useState([]);
  const [label_ops, setLabelOps] = useState([]);
  const [track_ops, setTrackOps] = useState([]);
  const [store_ops, setStoreOps] = useState([]);
  const [subuser_ops, setSubUserOps] = useState([]);

  const period_filter_ops = [
    {
      label: "Last 7 Days",
      value: "1",
    },
    {
      label: "Last 14 Days",
      value: "2",
    },
    {
      label: "Last 30 Days",
      value: "3",
    },
    {
      label: "Last 45 Days",
      value: "4",
    },
    {
      label: "Last 60 Days",
      value: "5",
    },
    {
      label: "Last 75 Days",
      value: "6",
    },
    {
      label: "Last 90 Days",
      value: "7",
    },
  ];

  const [trends_data, error, isloading] = useFetch("GET",
    "trends/?store=" + activeStoreTab.value
    + "&label=" + activeLabelTab.value
    + "&release=" + activeReleaseTab.value
    + "&track=" + activeTrackTab.value
    + "&period=" + activePeriodTab.value
    + "&subuser=" + activeSubUserTab.value,
    token, false, forceUpdate);

  console.log(trends_data, isloading)

  const { containerProps, indicatorEl } = useLoading({
    loading: isloading,
    loaderProps: {
      style: { margin: '70px', color: 'white' },
      valueText: 'Fetching trends from database',
    },
    indicator: <Audio width="150" vertical-align="middle" />,
  });


  useEffect(() => {
    if (!didEff.current) {
      didEff.current = true;
      return;
    }
    setForce(prev => prev + 1);
  }, [activeStoreTab, activePeriodTab, activeReleaseTab, activeLabelTab, activeTrackTab, setActiveSubUserTab]);


  useEffect(() => {

    if (Object.keys(trends_data).length) {
      if (trends_data.top_10_tracks) {
        setTableData(trends_data.top_10_tracks);
      }

      if (trends_data.country_wise_sales) {
        setMapData(trends_data.country_wise_sales);
      }

      if (trends_data.multi_sales_graph_data) {
        setMultiSalesGraphData(trends_data.multi_sales_graph_data);
      }

      if (trends_data.gender_graph_data) {
        setGenderGraphData(trends_data.gender_graph_data);
      }

      if (trends_data.age_graph_data) {
        setAgeGraphData(trends_data.age_graph_data);
      }

      if (trends_data.stores) {
        let store_ops = [];

        let stream_stores = [];
        let download_stores = [];

        var store_object_as = {};
        store_object_as["label"] = "All Stores";
        store_object_as["value"] = "0";
        store_ops.push(store_object_as);

        var store_object_ds = {};
        store_object_ds["label"] = "Download Stores";
        store_object_ds["value"] = "ds";
        store_ops.push(store_object_ds);

        var store_object_ss = {};
        store_object_ss["label"] = "Streaming Stores";
        store_object_ss["value"] = "ss";
        store_ops.push(store_object_ss);

        trends_data.stores.map(store => {

          var store_object = {};
          store_object["label"] = store.name;
          store_object["value"] = store.id;

          if (['am', 'apm', 'dr', 'fb', 'ig', 'pd', 'sc', 'sp', 'tk', 'yt', 'yp'].includes(store.id)) {
            stream_stores.push(store_object);
          }

          if (['bp', 'it', 'tx'].includes(store.id)) {
            download_stores.push(store_object);
          }
        });

        var download_store_ops = {};

        download_store_ops["label"] = "Download Stores";
        download_store_ops["options"] = download_stores;

        var stream_store_ops = {};
        stream_store_ops["label"] = "Stream Stores";
        stream_store_ops["options"] = stream_stores;

        store_ops.push(download_store_ops);
        store_ops.push(stream_store_ops);

        setStoreOps(store_ops);
      }


      if (trends_data.labels) {
        let user_labels = [];

        var label_object = {};
        label_object["label"] = "All Labels";
        label_object["value"] = "0";
        user_labels.push(label_object);

        trends_data.labels.map(label => {

          var label_object = {};
          label_object["label"] = label.name;
          label_object["value"] = label.id;
          user_labels.push(label_object);

        });

        setLabelOps(user_labels);
      }

      if (trends_data.releases) {
        let user_releases = [];

        var release_object = {};
        release_object["label"] = "All Releases";
        release_object["value"] = "0";
        user_releases.push(release_object);

        trends_data.releases.map(release => {

          var release_object = {};
          release_object["label"] = release.name;
          release_object["value"] = release.id;
          user_releases.push(release_object);

        });

        setReleaseOps(user_releases);
      }


      if (trends_data.tracks) {
        let user_tracks = [];

        var track_object = {};
        track_object["label"] = "All Tracks";
        track_object["value"] = "0";
        user_tracks.push(track_object);

        trends_data.tracks.map(track => {

          var track_object = {};
          track_object["label"] = track.name;
          track_object["value"] = track.id;
          user_tracks.push(track_object);

        });

        setTrackOps(user_tracks);
      }

      if (trends_data.sub_users) {
        let sub_users = [];

        var subuser_object = {};
        subuser_object["label"] = "Select Subuser";
        subuser_object["value"] = "0";
        sub_users.push(subuser_object);

        trends_data.sub_users.map(sub_user => {

          var subuser_object = {};
          subuser_object["label"] = sub_user.name;
          subuser_object["value"] = sub_user.id;
          sub_users.push(subuser_object);

        });

        setSubUserOps(sub_users);
      }

    }

  }, [trends_data]);

  const handleFilterChange = (event, filter) => {

    switch (filter) {
      case "store":
        setActiveStoreTab(event);
        if (event.value === "pd") {
          setPandoraActive(true);
        }
        else if (event.value === "sc") {
          setSoundcloudActive(true);
        }
        else if (event.value === "sp") {
          setSpotifyActive(true);
        }
        else {
          setPandoraActive(false);
          setSpotifyActive(false);
          setSoundcloudActive(false);
        }
        break;
      case "label":
        setActiveLabelTab(event);

        // Resetting Releases And Tracks On Label Change

        setActiveReleaseTab(
          {
            label: "All Releases",
            value: "0",
          });

        setActiveTrackTab(
          {
            label: "All Tracks",
            value: "0",
          });

        break;
      case "release":
        setActiveReleaseTab(event)
        // Resetting Tracks On Release Change
        setActiveTrackTab(
          {
            label: "All Tracks",
            value: "0",
          });
        break;
      case "track":
        setActiveTrackTab(event)
        break;
      case "period":
        setActivePeriodTab(event)
        break;
      case "subuser":
        setActiveSubUserTab(event);

        // Resetting Period, Stores, Labels, Tracks And Releases On SubUser Change

        setActivePeriodTab(
          {
            label: "Last 7 Days",
            value: "1",
          });

        setActiveStoreTab(
          {
            label: "All Stores",
            value: "0",
          });

        setActiveLabelTab(
          {
            label: "All Labels",
            value: "0",
          });

        setActiveReleaseTab(
          {
            label: "All Releases",
            value: "0",
          });

        setActiveTrackTab(
          {
            label: "All Tracks",
            value: "0",
          });

        break;
      default:
      //do nothing
    }

  };

  const resetFilters = () => {
    setActiveStoreTab(
      {
        label: "All Stores",
        value: "0",
      });

    setActiveLabelTab(
      {
        label: "All Labels",
        value: "0",
      });

    setActiveReleaseTab(
      {
        label: "All Releases",
        value: "0",
      });

    setActiveTrackTab(
      {
        label: "All Tracks",
        value: "0",
      });

    setActivePeriodTab(
      {
        label: "Last 7 Days",
        value: "1",
      });

    setActiveSubUserTab(
      {
        label: "Select Subuser",
        value: "0",
      });

    setPandoraActive(false);
    setSpotifyActive(false);
    setSoundcloudActive(false);
  }

  return (
    <>
      {(!currentUser.trends) &&
        <Alert color="danger">
          You don't have access to this module, please contact the support team for further information.
        </Alert>
      }
      {(currentUser.trends) &&
        <>
          <Row>
            <Col className="col-12">
              <Alert color="warning">
                <b>Learn all about trends <a href="http://help.movemusic.io/en/articles/5182502-what-are-trends" target="_blank" rel="noreferrer noopener">here</a>. </b>
              </Alert>
            </Col>
          </Row>

          <Card className="">

            <h5 className="ms-4 mt-4">Filters</h5>

            <Row className="mb-4">

              <Col className="col-lg-2 col-md-2 col-sm-12 col-12">
                <div className="mx-4">
                  <Label>Period</Label>
                  <Select
                    components={{ IndicatorSeparator: () => null }}
                    name="period_filter"
                    options={period_filter_ops}
                    value={activePeriodTab}
                    onChange={(e) => handleFilterChange(e, "period")}
                  />
                </div>
              </Col>

              <Col className="col-lg-2 col-md-2 col-sm-12 col-12">

                <div className="mx-4">
                  <Label>Store</Label>
                  <Select
                    components={{ IndicatorSeparator: () => null }}
                    name="store_filter"
                    options={store_ops}
                    value={activeStoreTab}
                    onChange={(e) => handleFilterChange(e, "store")}
                  />
                </div>
              </Col>

              <Col className="col-lg-2 col-md-2 col-sm-12 col-12">
                <div className="mx-4">
                  <Label>Label</Label>
                  <Select
                    components={{ IndicatorSeparator: () => null }}
                    name="label_filter"
                    options={label_ops}
                    value={activeLabelTab}
                    onChange={(e) => handleFilterChange(e, "label")}
                  />
                </div>
              </Col>

              <Col className="col-lg-2 col-md-2 col-sm-12 col-12">
                <div className="mx-4">
                  <Label>Release</Label>
                  <Select
                    components={{ IndicatorSeparator: () => null }}
                    name="release_filter"
                    options={release_ops}
                    value={activeReleaseTab}
                    onChange={(e) => handleFilterChange(e, "release")}
                  />
                </div>
              </Col>


              <Col className="col-lg-2 col-md-2 col-sm-12 col-12">
                <div className="mx-4">
                  <Label>Track</Label>
                  <Select
                    components={{ IndicatorSeparator: () => null }}
                    name="track_filter"
                    options={track_ops}
                    value={activeTrackTab}
                    onChange={(e) => handleFilterChange(e, "track")}
                  />
                </div>
              </Col>

              {
                currentUser.is_premium_user &&
                <Col className="col-lg-2 col-md-2 col-sm-12 col-12">
                  <div className="mx-4">
                    <Label>Subuser</Label>
                    <Select
                      components={{ IndicatorSeparator: () => null }}
                      name="subuser_filter"
                      options={subuser_ops}
                      value={activeSubUserTab}
                      onChange={(e) => handleFilterChange(e, "subuser")}
                    />
                  </div>
                </Col>
              }
              {
                !currentUser.is_premium_user &&
                <Col className="col-lg-2 col-md-2 col-sm-12 col-12">
                  <div className="mx-4 mt-4">
                    <Button
                      color=""
                      className="btn btn-outline-info"
                      onClick={() => { resetFilters() }}>
                      Reset Filters
                    </Button>
                  </div>
                </Col>
              }
            </Row>

            {
              currentUser.is_premium_user &&
              <Row>
                <Col className="col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="mx-4 mb-4" style={{ float: "right" }}>
                    <Button
                      color=""
                      className="btn btn-outline-info"
                      style={{ width: "160px", height: "40px" }}
                      onClick={() => { resetFilters() }}>
                      Reset Filters
                    </Button>
                  </div>
                </Col>
              </Row>
            }
          </Card>

          <Row {...containerProps}>
            <Col className="col-12">
              <div className="bg-primary trends-loading">
                {indicatorEl}
              </div>
            </Col>
          </Row>

          {
            Object.keys(multiSalesGraphData).length && <div>
              <Row>
                <Col className="col-lg-12">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <h3>Store-wise Sales ({activePeriodTab.label})</h3>
                      </CardTitle>
                      <TrendsMultiSalesGraph salesGraphData={multiSalesGraphData} storeValue={activeStoreTab.value} />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col className="col-lg-12">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <h3>Sales By Territory</h3>
                      </CardTitle>
                      <TrendsMap mapData={mapData} />
                    </CardBody>
                  </Card>
                </Col>
              </Row>



              {(isPandora || isSpotify || isSoundcloud) &&
                <Row>
                  <Col className="col-lg-6">
                    <Card>
                      <CardBody>
                        <CardTitle>
                          <h3>Sales By Gender</h3>
                        </CardTitle>
                        <TrendsGenderGraph genderGraphData={genderGraphData} />
                      </CardBody>
                    </Card>
                  </Col>

                  <Col className="col-lg-6">
                    <Card>
                      <CardBody>
                        <CardTitle>
                          <h3>Sales By Age</h3>
                        </CardTitle>
                        <TrendsAgeGraph ageGraphData={ageGraphData} />
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              }

              <Row>
                <Col className="col-lg-12">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <h3>Top 10</h3>
                      </CardTitle>
                      <TrendsTable tableData={tableData} />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

            </div>
          }
        </>
      }
    </>
  );
};

export default Trends;
