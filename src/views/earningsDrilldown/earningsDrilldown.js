import React, { useState, useEffect, useRef, useContext } from "react";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import { StateContext } from "../../utils/context";
import { Row, Col, Card, CardBody, CardTitle, Label, Button, Alert } from "reactstrap";

import Select from "react-select";
import Datetime from "react-datetime";
import CountriesJSON from "../../utils/countriesExtended.json"
import { useLoading, Audio } from '@agney/react-loading';

import EdSalesSummary from "../../components/edSalesSummary";
import EdDoughnutChart from "../../components/edDoughnutChart";
import EdBarChart from "../../components/edBarChart";
import EdSalesMap from "../../components/edSalesMap";
import EdTopReleasesTable from "../../components/edTopReleasesTable";
import EdTopTracksTable from "../../components/edTopTracksTable";

import 'react-datetime/css/react-datetime.css';
import './earningsDrilldown.css';
import { set } from "lodash";

// require('moment/locale/en-gb');
import 'moment/locale/ru';

const EarningsDrilldown = () => {
  const { currentUser } = useContext(StateContext);
  const token = getCookie("token");
  const [forceUpdate, setForce] = useState(0);
  const [forceUpdateFO, setForceFO] = useState(0);
  const didEff = useRef(false);
  const didEffFO = useRef(false);
  const [topTracksData, setTopTracksData] = useState([]);
  const [topReleasesData, setTopReleasesData] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [mapData, setMapData] = useState({});
  const [multiSalesGraphData, setMultiSalesGraphData] = useState({});

  const [startingMonth, setStartingMonth] = useState(Datetime.moment().subtract(15, 'month'));
  const [endingMonth, setEndingMonth] = useState(Datetime.moment().subtract(9, 'month'));

  let validRange = (selectedEndingMonth) => {
    let yearAfterStartingMonth = Datetime.moment(startingMonth).add(11, 'M');
    let isValidRange = selectedEndingMonth.isBetween(startingMonth, yearAfterStartingMonth);
    return isValidRange;
  };

  const [activePeriodTab, setActivePeriodTab] = useState({
    label: "Select Month Range",
    value: "0",
  });

  const [activeStoreTab, setActiveStoreTab] = useState({
    label: "All Stores",
    value: "0",
  });

  const [activeLabelTab, setActiveLabelTab] = useState({
    label: "Select Label",
    value: "0",
  });

  const [activeCountryTab, setActiveCountryTab] = useState({
    label: "All Countries",
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

  const [activeSubUserTab, setActiveSubUserTab] = useState({
    label: "Select Subuser",
    value: "0",
  });

  const [release_ops, setReleaseOps] = useState([]);
  const [label_ops, setLabelOps] = useState([]);
  const [country_ops, setCountryOps] = useState([]);
  const [track_ops, setTrackOps] = useState([]);
  const [store_ops, setStoreOps] = useState([]);
  const [period_ops, setPeriodOps] = useState([]);
  const [subuser_ops, setSubUserOps] = useState([]);

  const [showCustomPeriodFilter, setShowCustomPeriodFilter] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [showResultsDiv, setShowResultsDiv] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [queryParameters, setQueryParameters] = useState("");
  const [queryParametersFO, setQueryParametersFO] = useState("");

  const [earnings_data, error, isloading] = useFetch("GET", `earnings/${queryParameters}`, token, false, forceUpdate);
  const [filter_ops, filterOpsError, FilterOpsLoading] = useFetch("GET", `earnings/filter-options/${queryParametersFO}`, token, false, forceUpdateFO);

  const { containerProps, indicatorEl } = useLoading({
    loading: isloading,
    loaderProps: {
      style: { margin: '70px', color: 'white' },
      valueText: 'Fetching earning stats from database',
    },
    indicator: <Audio width="150" vertical-align="middle" />,
  });


  useEffect(() => {
    if (!didEff.current) {
      didEff.current = true;
      return;
    }
    setForce(prev => prev + 1);
  }, [queryParameters]);

  useEffect(() => {
    if (!didEffFO.current) {
      didEffFO.current = true;
      return;
    }
    setForceFO(prev => prev + 1);
  }, [queryParametersFO]);


  useEffect(() => {
    if (Object.keys(earnings_data).length) {
      if (earnings_data.top_5) {
        if (earnings_data.top_5.top_tracks) {
          setTopTracksData(earnings_data.top_5.top_tracks);
        }
        if (earnings_data.top_5.top_releases) {
          setTopReleasesData(earnings_data.top_5.top_releases);
        }
      }
      if (earnings_data.country_wise_sales) {
        setMapData(earnings_data.country_wise_sales);
      }
      if (earnings_data.storewise_revenue) {
        setStoreData(earnings_data.storewise_revenue);
      }
      if (earnings_data.multi_revenue_data) {
        setMultiSalesGraphData(earnings_data.multi_revenue_data);
      }
    }
  }, [earnings_data]);

  useEffect(() => {
    let new_po_one = {};
    new_po_one["label"] = "Last 3 Reports";
    new_po_one["value"] = "1";
    let new_po_two = {};
    new_po_two["label"] = "Last 6 Reports";
    new_po_two["value"] = "2";
    let new_po_three = {};
    new_po_three["label"] = "Last 12 Reports";
    new_po_three["value"] = "3";
    let new_po_four = {};
    new_po_four["label"] = "Custom";
    new_po_four["value"] = "4";
    let period_ops = [new_po_one, new_po_two, new_po_three, new_po_four];
    setPeriodOps(period_ops);

    let country_ops = [];
    let new_co = {};
    new_co["label"] = "All Countries";
    new_co["value"] = "0";
    country_ops.push(new_co);
    CountriesJSON.map(i => {
      country_ops.push({ label: i.label, value: i.value });
    });
    setCountryOps(country_ops);
  }, []);

  useEffect(() => {
    if (filter_ops.releases) {
      let user_releases = [];

      var release_object = {};
      release_object["label"] = "All Releases";
      release_object["value"] = "0";
      user_releases.push(release_object);

      let currentLabel = activeLabelTab.value;

      filter_ops.releases.map(release => {
        if (currentLabel === "0") {
          var release_object = {};
          release_object["label"] = release.name;
          release_object["value"] = release.id;
          user_releases.push(release_object);
        }
        else if (currentLabel !== "0" && currentLabel === release.label) {
          var _release_object = {};
          _release_object["label"] = release.name;
          _release_object["value"] = release.id;
          user_releases.push(_release_object);
        }
      });

      setReleaseOps(user_releases);
    }

    if (filter_ops.tracks) {
      let user_tracks = [];

      var track_object = {};
      track_object["label"] = "All Tracks";
      track_object["value"] = "0";
      user_tracks.push(track_object);

      let currentRelease = activeReleaseTab.value;

      filter_ops.tracks.map(track => {
        if (currentRelease === "0") {
          var track_object = {};
          track_object["label"] = track.name;
          track_object["value"] = track.id;
          user_tracks.push(track_object);
        }
        else if (currentRelease !== "0" && currentRelease === track.release) {
          var _track_object = {};
          _track_object["label"] = track.name;
          _track_object["value"] = track.id;
          user_tracks.push(_track_object);
        }
      });

      setTrackOps(user_tracks);
    }

    if (filter_ops.stores) {
      let store_ops = [];

      var store_object_as = {};
      store_object_as["label"] = "All Stores";
      store_object_as["value"] = "0";
      store_ops.push(store_object_as);

      filter_ops.stores.map(store => {

        var store_object = {};
        store_object["label"] = store.name;
        store_object["value"] = store.id;

        store_ops.push(store_object)
      });

      setStoreOps(store_ops);
    }


    if (filter_ops.labels) {
      let user_labels = [];

      var label_object = {};
      label_object["label"] = "Select Label";
      label_object["value"] = "0";
      user_labels.push(label_object);

      filter_ops.labels.map(label => {

        var label_object = {};
        label_object["label"] = label.name;
        label_object["value"] = label.id;
        user_labels.push(label_object);

      });

      setLabelOps(user_labels);
    }

    if (filter_ops.sub_users) {
      let sub_users = [];

      var subuser_object = {};
      subuser_object["label"] = "Select Subuser";
      subuser_object["value"] = "0";
      sub_users.push(subuser_object);

      filter_ops.sub_users.map(sub_user => {

        var subuser_object = {};
        subuser_object["label"] = sub_user.name;
        subuser_object["value"] = sub_user.id;
        sub_users.push(subuser_object);

      });

      setSubUserOps(sub_users);
    }

  }, [activeLabelTab, activeReleaseTab, activeSubUserTab, filter_ops]);



  const handleFilterChange = (event, filter) => {

    switch (filter) {
      case "country":
        setActiveCountryTab(event);
        break;
      case "store":
        if (event.value !== "0") {
          setShowErrorMsg(false);
        }
        setActiveStoreTab(event);
        break;
      case "label":
        if (event.value !== "0") {
          setShowErrorMsg(false);
        }
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
      case "subuser":
        setActiveSubUserTab(event)
        setQueryParametersFO(`?subuser=${event.value}`)

        // Resetting Month Range, Stores, Labels, Tracks, Releases And Country On SubUser Change

        setActivePeriodTab(
          {
            label: "Select Month Range",
            value: "0"
          }
        );
        setStartingMonth(Datetime.moment().subtract(15, 'month'));
        setEndingMonth(Datetime.moment().subtract(4, 'month'));

        setActiveStoreTab(
          {
            label: "All Stores",
            value: "0",
          });

        setActiveLabelTab(
          {
            label: "Select Label",
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

        setActiveCountryTab(
          {
            label: "All Countries",
            value: "0",
          });

        setShowResultsDiv(false);

        break;
      default:
      //do nothing
    }

  };

  const handlePeriodFilterChange = (event, period) => {
    setActivePeriodTab(event);
    (period !== 4 && setShowCustomPeriodFilter(false))
    switch (period) {
      case "1":
        setStartingMonth(Datetime.moment().subtract(6, 'month'));
        setEndingMonth(Datetime.moment().subtract(4, 'month'));
        break;
      case "2":
        setStartingMonth(Datetime.moment().subtract(9, 'month'));
        setEndingMonth(Datetime.moment().subtract(4, 'month'));
        break;
      case "3":
        setStartingMonth(Datetime.moment().subtract(15, 'month'));
        setEndingMonth(Datetime.moment().subtract(4, 'month'));
        break;
      case "4":
        setStartingMonth(Datetime.moment().subtract(15, 'month'));
        setEndingMonth(Datetime.moment().subtract(4, 'month'));
        setShowCustomPeriodFilter(true);
        break;
      default:
        setShowCustomPeriodFilter(false);
        break;
      //do nothing
    }

  };

  const resetFilters = () => {
    setShowResultsDiv(false);
    setActiveStoreTab(
      {
        label: "Select Store",
        value: "0",
      });

    setActiveLabelTab(
      {
        label: "Select Label",
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

    setActiveCountryTab(
      {
        label: "All Countries",
        value: "0",
      });

    setActiveSubUserTab(
      {
        label: "Select Subuser",
        value: "0",
      });

    setActivePeriodTab(
      {
        label: "Select Month Range",
        value: "0"
      });

    setQueryParameters("");
    setQueryParametersFO("");

    setStartingMonth(Datetime.moment().subtract(15, 'month'));
    setEndingMonth(Datetime.moment().subtract(4, 'month'));

  }

  const handleStartingMonthChange = (value) => {
    setStartingMonth(value);
    let yearAfterStartingMonth = Datetime.moment(value).add(11, 'M');
    setEndingMonth(yearAfterStartingMonth);
  }

  const handleEndingMonthChange = (value) => {
    setEndingMonth(value);
  }

  return (
    <>
      {!currentUser.earnings_drilldown
        ? <Alert color="danger">
          Currently this feature is only offered to few selected users but the good news is that you will also be able to use it really soon. Keep watching this space!
        </Alert>
        : <div>
          <Row>
            <Col className="col-12">
              <Alert color="warning">
                <b>Learn all about Earnings Drilldown tool <a href="http://help.movemusic.io/en/articles/5563330-how-to-use-the-earnings-drilldown-tool" target="_blank" rel="noreferrer noopener">here</a>. </b>
              </Alert>
            </Col>
          </Row>

          <Card className="">

            <h5 className="ms-4 mt-4">Filters</h5>
            <Row className="mb-4">

              <Col className="col-lg-2 col-md-3 col-sm-12 col-12">
                <div className="mx-4">
                  <Label>Month Range</Label>
                  <Select
                    components={{ IndicatorSeparator: () => null }}
                    name="period_filter"
                    options={period_ops}
                    value={activePeriodTab}
                    onChange={(e) => {
                      if (e.value !== "0") {
                        setShowErrorMsg(false);
                      }
                      handlePeriodFilterChange(e, e.value);
                    }}
                  />
                </div>
              </Col>

              {showCustomPeriodFilter &&
                <Col className="col-lg-2 col-md-3 col-sm-12 col-12">
                  <div className="mx-4">
                    <Label>Month Range</Label>
                    <div className="starting-month">
                      <Datetime locale="en-gb"
                        dateFormat="YYYY-MM"
                        timeFormat={false}
                        inputProps={{ placeholder: "Starting Month" }}
                        value={startingMonth}
                        onChange={handleStartingMonthChange}
                      />
                    </div>
                    <div className="ending-month">
                      <Datetime locale="en-gb"
                        dateFormat="YYYY-MM"
                        timeFormat={false}
                        inputProps={{ placeholder: "Ending Month" }}
                        value={endingMonth}
                        isValidDate={validRange}
                        onChange={handleEndingMonthChange}
                      />
                    </div>
                  </div>
                </Col>
              }

              <Col className="col-lg-2 col-md-3 col-sm-12 col-12">
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

              <Col className="col-lg-2 col-md-3 col-sm-12 col-12">
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


              <Col className="col-lg-2 col-md-3 col-sm-12 col-12">
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

              <Col className="col-lg-2 col-md-3 col-sm-12 col-12">
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

              <Col className="col-lg-2 col-md-3 col-sm-12 col-12">
                <div className="mx-4 mt-1">
                  <Label>Country</Label>
                  <Select
                    components={{ IndicatorSeparator: () => null }}
                    name="country_filter"
                    options={country_ops}
                    value={activeCountryTab}
                    onChange={(e) => handleFilterChange(e, "country")}
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
            </Row>
            <Row>
              <Col className="col-lg-12 col-md-12 col-sm-12 col-12">

                <div className="mx-4 mb-4" style={{ float: "right" }}>
                  <Button
                    className="me-4 btn btn-outline-info"
                    color=""
                    style={{ width: "160px", height: "40px" }}
                    disabled={isloading || FilterOpsLoading}
                    onClick={() => {
                      let errors = 0;
                      let errorMsg = "";
                      if (activePeriodTab.value === "0") {
                        errors += 1;
                        errorMsg += "* Month Range filter is required"
                      }
                      if (activeLabelTab.value === "0") {
                        errors += 1;
                        errorMsg += " * Label filter is required"
                      }
                      if (errors > 0) {
                        setErrorMsg(errorMsg);
                        setShowErrorMsg(true);
                        setShowResultsDiv(false);
                      }
                      else {
                        setShowResultsDiv(true);
                        setErrorMsg("");
                        setShowErrorMsg(false);
                        setQueryParameters(
                          `?store=${activeStoreTab.value}&label=${activeLabelTab.value}&release=${activeReleaseTab.value}&track=${activeTrackTab.value}&country=${activeCountryTab.value}&month_lower_bound=${startingMonth.format('MM-YYYY')}&month_upper_bound=${endingMonth.format('MM-YYYY')}&subuser=${activeSubUserTab.value}`
                        );
                      }
                    }}>
                    Generate Report
                  </Button>
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
            {
              showErrorMsg &&
              <Row>
                <Col className="col-lg-12 col-md-12 col-sm-12 col-12">
                  <Alert color="warning" className="m-3">{errorMsg}</Alert>
                </Col>
              </Row>
            }
          </Card>

          {
            showResultsDiv &&
            <Row {...containerProps}>
              <Col className="col-12">
                <div className="bg-primary trends-loading">
                  {indicatorEl}
                </div>
              </Col>
            </Row>
          }

          {
            (!isloading && !FilterOpsLoading && showResultsDiv && currentUser.earnings_drilldown) && <div>

              <Row>
                <Col className="col-lg-12">
                  <EdSalesSummary salesGraphData={multiSalesGraphData} topReleases={topReleasesData} monthRangeText={"Last 12 Statements"} />
                </Col>
              </Row>

              {
                activeStoreTab.value === '0' &&
                <Row>
                  <Col lg="6" md="6" sm="12" xm="12">
                    <Card>
                      <CardBody>
                        <CardTitle>
                          <h3>Store-wise Revenue Percentage</h3>
                        </CardTitle>
                        <EdDoughnutChart storeData={storeData} />
                      </CardBody>
                    </Card>
                  </Col>

                  <Col lg="6" md="6" sm="12" xm="12">
                    <Card>
                      <CardBody>
                        <CardTitle>
                          <h3>Store-wise Revenue Breakdown</h3>
                        </CardTitle>
                        <EdBarChart storeData={storeData} />
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
                        <h3>Revenue By Territory</h3>
                      </CardTitle>
                      <EdSalesMap mapData={mapData} />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col className="col-lg-6">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <h3>Top 5 Releases</h3>
                      </CardTitle>
                      <EdTopReleasesTable topReleasesData={topReleasesData} />
                    </CardBody>
                  </Card>
                </Col>

                <Col className="col-lg-6">
                  <Card>
                    <CardBody>
                      <CardTitle>
                        <h3>Top 5 Tracks</h3>
                      </CardTitle>
                      <EdTopTracksTable topTracksData={topTracksData} />
                    </CardBody>
                  </Card>
                </Col>
              </Row>

            </div>
          }
        </div>
      }
    </>
  );
};

export default EarningsDrilldown;