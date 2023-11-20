import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Form, FormText, Badge } from "reactstrap";
import SelectSearch from "react-select-search";
import AsyncDropdownSpotify from "../../components/aysncDropdownSpotify";
import AsyncDropdownDeezer from "../../components/asyncDropdownDeezer";
import Select from "react-select";
import EarningsPredictionBarChart from "../../components/earningsPredictionBarChart";
import EarningsPredictionRangeBarChart from "../../components/earningsPredictionRangeBarChart";
import {
  Alert,
  Card,
  Row,
  CardBody,
  Col,
  FormGroup,
  Label,
  Button,
  CardTitle
} from "reactstrap";
import { getCookie } from "../../jwt/_helpers/cookie";
import { StateContext } from "../../utils/context";
import { useLoading, Audio } from '@agney/react-loading';
import ReactSpeedometer from "react-d3-speedometer";
import ProfileImg from "../../assets/images/users/1.jpg";
import EarningsPredictionPolarChart from "../../components/earningsPredictionPolarAreaChart";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const EarningsPrediction = () => {
  const token = getCookie("token");
  const { currentUser } = useContext(StateContext);
  const options = {
    method: "GET",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  };

  const [spotifyArtist, setSpotifyArtist] = useState(null);
  const [spotifyArtistID, setSpotifyArtistID] = useState(null);
  const [deezerArtist, setDeezerArtist] = useState(null);
  const [deezerArtistID, setDeezerArtistID] = useState(null);
  const [predictionData, setPredictionData] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [barChartData, setBarChartData] = useState({});
  const [polarAreaChartData, setPolarAreaChartData] = useState({});
  const [rangeBarChartData, setRangeBarChartData] = useState({});
  const [selectedModel, setSelectedModel] = useState({ label: "v3 (Latest Categorized)", value: "v3" });

  const modelOps = [
    {
      label: "v1 (Legacy)",
      value: "v1",
    },
    {
      label: "v2 (Latest Combined)",
      value: "v2",
    },
    {
      label: "v3 (Latest Categorized)",
      value: "v3",
    },
  ];

  const { containerProps, indicatorEl } = useLoading({
    loading: shouldFetch,
    loaderProps: {
      style: { margin: '70px', color: 'white' },
      valueText: 'Fetching trends from database',
    },
    indicator: <Audio width="150" vertical-align="middle" />,
  });

  useEffect(() => {
    if (spotifyArtistID !== null && deezerArtistID !== null) {
      axios.get(`${API_URL}artists/spotify-artist-prediction/?spotify_id=${spotifyArtistID}&deezer_id=${deezerArtistID}&model=${selectedModel.value}`, options)
        .then(response => {
          setPredictionData(response.data);
          setShouldFetch(false);
        })
        .catch(error => console.error(`There was an error retrieving the data: ${error}`));
    }
  }, [spotifyArtistID, deezerArtistID, selectedModel]);


  useEffect(() => {
    if (predictionData) {
      let pred_earnings_yr = predictionData.avg_total_earnings_yr;
      let real_earnings_yr = predictionData.actual_avg_artist_total_earnings_yr;
      let pred_earnings_at = predictionData.avg_total_earnings_at;
      let real_earnings_at = predictionData.actual_avg_artist_total_earnings_at;
      const brChartData = {
        data: [
          {
            predicted: pred_earnings_yr,
            realistic: real_earnings_yr
          },
          {
            predicted: pred_earnings_at,
            realistic: real_earnings_at
          }
        ],
        labels: [
          "Earnings Per Track (12 M)",
          "Earnings Per Track (Long Term)",
        ],
      };
      setBarChartData(brChartData);

      const paChartData = {
        data: [
          pred_earnings_yr,
          real_earnings_yr,
          pred_earnings_at,
          real_earnings_at
        ],
        labels: [
          "Predicted Earnings Per Track (12 M)",
          "Realistic Earnings Per Track (12 M)",
          "Predicted Earnings Per Track (Long Term)",
          "Realistic Earnings Per Track (Long Term)",
        ],
      };
      setPolarAreaChartData(paChartData);

      let a_yr_start = predictionData.actual_avg_artist_total_earnings_yr * 0.80
      let a_yr_end = predictionData.actual_avg_artist_total_earnings_yr * 0.85
      let b_yr_start = predictionData.actual_avg_artist_total_earnings_yr * 0.85
      let b_yr_end = predictionData.actual_avg_artist_total_earnings_yr
      let c_yr_start = predictionData.actual_avg_artist_total_earnings_yr
      let c_yr_end = predictionData.actual_avg_artist_total_earnings_yr * 1.05
      let d_yr_start = predictionData.actual_avg_artist_total_earnings_yr * 1.05
      let d_yr_end = predictionData.actual_avg_artist_total_earnings_yr * 1.15
      let e_yr_start = predictionData.avg_total_earnings_yr * 0.90
      let e_yr_end = predictionData.avg_total_earnings_yr * 1.10

      let a_at_start = predictionData.actual_avg_artist_total_earnings_at * 0.80
      let a_at_end = predictionData.actual_avg_artist_total_earnings_at * 0.85
      let b_at_start = predictionData.actual_avg_artist_total_earnings_at * 0.85
      let b_at_end = predictionData.actual_avg_artist_total_earnings_at
      let c_at_start = predictionData.actual_avg_artist_total_earnings_at
      let c_at_end = predictionData.actual_avg_artist_total_earnings_at * 1.05
      let d_at_start = predictionData.actual_avg_artist_total_earnings_at * 1.05
      let d_at_end = predictionData.actual_avg_artist_total_earnings_at * 1.15
      let e_at_start = predictionData.avg_total_earnings_at * 0.90
      let e_at_end = predictionData.avg_total_earnings_at * 1.10

      let rangeBarChartD = {
        data_at: [
          [a_at_start, a_at_end],
          [b_at_start, b_at_end],
          [c_at_start, c_at_end],
          [d_at_start, d_at_end],
          [e_at_start, e_at_end],
        ],
        data_yr: [
          [a_yr_start, a_yr_end],
          [b_yr_start, b_yr_end],
          [c_yr_start, c_yr_end],
          [d_yr_start, d_yr_end],
          [e_yr_start, e_yr_end],
        ],
      };
      setRangeBarChartData(rangeBarChartD);
    }
  }, [predictionData]);

  const renderOption = (props, option, snapshot, className) => (
    <button {...props} className={className} type="button">
      <img
        src={option.image_small ? option.image_small : ProfileImg}
        alt={option.name}
        style={{
          height: '40px',
          width: '40px',
          borderRadius: '30%',
          marginRight: "10px",
        }}
      /><b>{option.name}</b>
    </button>
  );


  const formatValue = (value) => {
    const roundedValue = Math.round(value * 100) / 100;
    return roundedValue.toLocaleString('de-DE', {
      minimumFractionDigits: value % 1 === 0 ? 0 : 2,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    });
  };

  return (
    <div>
      {
        (!currentUser.predictions) &&
        <Alert color="danger">
          You don't have access to this module, please contact the support team for further information.
        </Alert>
      }
      {
        (currentUser.predictions) &&
        <>
          <Row>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Artist Earnings Prediction</CardTitle>
                  <Form className="mt-3" id="spotifyArtistPredictionForm">
                    <FormGroup className="select-search-wrap" row>
                      <Label for="Spotify Artist" sm={2}>Artist Name (Spotify)</Label>
                      <Col>
                        {
                          spotifyArtist ?
                            <>
                              <Row>
                                <Col xl={10} lg={9} md={8} sm={7} xm={12}>
                                  <SelectSearch
                                    name="Spotify Artist"
                                    options={[{ ...spotifyArtist }]}
                                    value={spotifyArtist.value}
                                    renderOption={renderOption}
                                    style={{ maxWidth: '100%', fontWeight: "bold" }}
                                  />
                                  <FormText color="muted">
                                    Note: Search for the name of the Spotify Artist for whom you want to make the streams and earnings prediction.
                                  </FormText>
                                </Col>
                                <Col xl={2} lg={3} md={4} sm={5} xm={12}>
                                  <Button className="btn btn-outline-info"
                                    onClick={() => {
                                      setSpotifyArtist(null);
                                      setSpotifyArtistID(null);
                                      setDeezerArtist(null);
                                      setDeezerArtistID(null);
                                      setPredictionData(null);
                                      setShouldFetch(false);
                                    }}
                                    style={{
                                      width: '100%',
                                    }}
                                    color={''}
                                  >
                                    Reset
                                  </Button>
                                </Col>
                              </Row>
                            </>
                            :
                            <>
                              <AsyncDropdownSpotify
                                fetchOptions={options}
                                labelField="name"
                                onChange={e => {
                                  let artistId = e.value;
                                  let artistObj = e;
                                  artistObj.name = e.label;

                                  setSpotifyArtist(artistObj);
                                  setSpotifyArtistID(artistId);
                                  setPredictionData(null);
                                  setShouldFetch(false)
                                }}
                                placeholder="Enter Artist Name i.e. The Weekend"
                              />
                              <FormText color="muted">
                                Note: Search for the name of the artist for whom you want to make the streams and earnings prediction.
                              </FormText>
                            </>
                        }
                      </Col>
                    </FormGroup>

                    {
                      spotifyArtist &&
                      <FormGroup className="select-search-wrap" row>
                        <Label for="Deezer Artist" sm={2}>Artist Name (Deezer)</Label>
                        <Col>
                          {
                            deezerArtist ?
                              <>
                                <Row>
                                  <Col xl={10} lg={9} md={8} sm={7} xm={12}>
                                    <SelectSearch
                                      name="Deezer Artist"
                                      options={[{ ...deezerArtist }]}
                                      value={deezerArtist.value}
                                      renderOption={renderOption}
                                      style={{ maxWidth: '100%', fontWeight: "bold" }}
                                    />
                                    <FormText color="muted">
                                      Note: Search for the name of the Deezer Artist for whom you want to make the streams and earnings prediction.
                                    </FormText>
                                  </Col>
                                  <Col xl={2} lg={3} md={4} sm={5} xm={12}>
                                    <Button className="btn btn-outline-info"
                                      onClick={() => {
                                        setDeezerArtist(null);
                                        setDeezerArtistID(null);
                                        setPredictionData(null);
                                        setShouldFetch(false);
                                      }}
                                      style={{
                                        width: '100%',
                                      }}
                                      color={''}
                                    >
                                      Reset
                                    </Button>
                                  </Col>
                                </Row>
                              </>
                              :
                              <>
                                <AsyncDropdownDeezer
                                  fetchOptions={options}
                                  labelField="name"
                                  onChange={e => {
                                    let artistId = e.value;
                                    let artistObj = e;
                                    artistObj.name = e.label;

                                    setDeezerArtist(artistObj);
                                    setDeezerArtistID(artistId);
                                    setPredictionData(null);
                                    setShouldFetch(true);
                                  }}
                                  placeholder="Enter Artist Name i.e. The Weekend"
                                />
                                <FormText color="muted">
                                  Note: Search for the name of the artist for whom you want to make the streams and earnings prediction.
                                </FormText>
                              </>
                          }
                        </Col>
                      </FormGroup>
                    }

                    {
                      deezerArtist &&
                      <FormGroup className="select-search-wrap" row>
                        <Label for="Model" sm={2}>Prediction Model</Label>
                        <Col>
                          <Select
                            components={{ IndicatorSeparator: () => null }}
                            name="modelFilter"
                            options={modelOps}
                            value={selectedModel}
                            onChange={(e) => {
                              setSelectedModel(e)
                              setPredictionData(null);
                              setShouldFetch(true)
                            }}
                          />
                        </Col>
                      </FormGroup>
                    }
                  </Form>

                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              <Row {...containerProps}>
                <Col className="col-12">
                  <div className="bg-primary trends-loading">
                    {indicatorEl}
                  </div>
                </Col>
              </Row>

              {/* {console.log(predictionData)} */}
              {
                (!shouldFetch && predictionData !== null) &&
                <Card>
                  <CardBody>
                    <Row>
                      <Col xl={12}>
                        <center>
                          <img className="spotify-artist-avatar" src={predictionData.artist_images ? predictionData.artist_images[0].url : null} alt={predictionData.artist} />
                          <CardTitle style={{ fontSize: "20px", fontWeight: "bold" }} tag="h2">Earnings Prediction for {predictionData.artist}</CardTitle>
                        </center>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col xl={4} md={12}>
                        <center>
                          <h6>Earning Tier</h6>
                          <Badge style={{ fontSize: '18px', fontStyle: 'normal', fontWeight: 'bold', backgroundColor: "#000a60", color: "#ffffff" }}>
                            {predictionData && predictionData.earning_tier}
                          </Badge>
                          <p className="mt-2 text-grey">{predictionData && predictionData.earning_tier_msg}</p>
                        </center>
                      </Col>
                      <Col xl={4} md={12}>
                        <center>
                          <h6>Artist Potential</h6>
                          <Badge style={{ fontSize: '18px', fontStyle: 'normal', fontWeight: 'bold', backgroundColor: "#b40bbe", color: "#ffffff" }}>
                            {predictionData && predictionData.artist_potential}
                          </Badge>
                          <p className="mt-2 text-grey">{predictionData && predictionData.artist_potential_msg}</p>
                        </center>
                      </Col>
                      <Col xl={4} md={12}>
                        <center>
                          <h6>Artist Rating</h6>
                          <div style={{ display: "inline-block", width: "150px", height: "70px", color: "#000", border: "0.5px solid #fff", padding: "1px" }}>
                            <ReactSpeedometer
                              maxValue={100}
                              minValue={0}
                              customSegmentLabels={[
                                {
                                  text: "",
                                  position: "OUTSIDE",
                                  color: "#555",
                                  fontSize: "10px",
                                  fontWeight: "bold",
                                },
                                {
                                  text: "",
                                  position: "OUTSIDE",
                                  color: "#555",
                                  fontSize: "10px",
                                  fontWeight: "bold",
                                },
                                {
                                  text: "",
                                  position: "OUTSIDE",
                                  color: "#555",
                                  fontSize: "10px",
                                  fontWeight: "bold",
                                },
                                {
                                  text: "",
                                  position: "OUTSIDE",
                                  color: "#555",
                                  fontSize: "10px",
                                  fontWeight: "bold",
                                },
                                {
                                  text: "",
                                  position: "OUTSIDE",
                                  color: "#555",
                                  fontSize: "10px",
                                  fontWeight: "bold",
                                },
                              ]}
                              height={70}
                              width={150}
                              value={predictionData.earning_tier_rating}
                              currentValueText=" "
                              needleTransition="easeQuadIn"
                              needleTransitionDuration={1000}
                              needleColor="red"
                              startColor="green"
                              segments={5}
                              endColor="blue"
                            />
                          </div>
                        </center>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col xl={6}>
                        <div className="artist-prediction-results">
                          <h6>Predicted Streams Per Track (12 M)</h6>
                          <h6>{predictionData && predictionData.avg_streams_yr}</h6>
                          <br />
                          <h6>Predicted Earnings Per Track (12 M)</h6>
                          <h6>{predictionData && formatValue(predictionData.avg_earnings_yr)} €</h6>
                          <br />
                          <h6>Predicted All Store Earnings Per Track (12 M)</h6>
                          <h6>{predictionData && formatValue(predictionData.avg_total_earnings_yr)} €</h6>
                          <hr />
                          <h6>Realistic Streams Per Track (12 M)</h6>
                          <h6>{predictionData && predictionData.actual_avg_artist_streams_yr}</h6>
                          <br />
                          <h6>Realistic Earnings Per Track (12 M)</h6>
                          <h6>{predictionData && formatValue(predictionData.actual_avg_artist_earnings_yr)} €</h6>
                          <br />
                          <h6>Realistic All Store Earnings Per Track (12 M)</h6>
                          <h6>{predictionData && formatValue(predictionData.actual_avg_artist_total_earnings_yr)} €</h6>
                        </div>
                      </Col>
                      <Col xl={6}>
                        <div className="artist-prediction-results">
                          <h6>Predicted Streams Per Track (Long Term)</h6>
                          <h6>{predictionData && predictionData.avg_streams_at}</h6>
                          <br />
                          <h6>Predicted Earnings Per Track (Long Term)</h6>
                          <h6>{predictionData && formatValue(predictionData.avg_earnings_at)} €</h6>
                          <br />
                          <h6>Predicted All Store Earnings Per Track (Long Term)</h6>
                          <h6>{predictionData && formatValue(predictionData.avg_total_earnings_at)} €</h6>
                          <hr />
                          <h6>Realistic Streams Per Track (Long Term)</h6>
                          <h6>{predictionData && predictionData.actual_avg_artist_streams_at}</h6>
                          <br />
                          <h6>Realistic Earnings Per Track (Long Term)</h6>
                          <h6>{predictionData && formatValue(predictionData.actual_avg_artist_earnings_at)} €</h6>
                          <br />
                          <h6>Realistic All Store Earnings Per Track (Long Term)</h6>
                          <h6>{predictionData && formatValue(predictionData.actual_avg_artist_total_earnings_at)} €</h6>
                        </div>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      <Col xl={3}>
                        <Card className="text-white" style={{ background: "#000a60" }}>
                          <CardBody className="p-4">
                            <CardTitle>
                              <h2 style={{ fontSize: "20px" }}>
                                Predicted Earnings Per Track
                              </h2>
                            </CardTitle>
                            <Row>
                              <Col xl={3}>
                                <i className="mdi mdi-currency-eur" style={{ fontSize: "55px" }}></i>
                              </Col>
                              <Col xl={9}>
                                <div className="ms-auto align-items-center mt-2 pt-2">
                                  <h2 className="mb-0" style={{ fontSize: "30px" }}>
                                    {formatValue(predictionData.avg_total_earnings_yr)}
                                  </h2>
                                  <span style={{ fontSize: "15px" }}>12 M</span>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>

                      <Col xl={3}>
                        <Card className="text-white" style={{ background: "#b40bbe" }}>
                          <CardBody className="p-4">
                            <CardTitle>
                              <h2 style={{ fontSize: "20px" }}>
                                Realistic Earnings Per Track
                              </h2>
                            </CardTitle>
                            <Row>
                              <Col xl={3}>
                                <i className="mdi mdi-currency-eur" style={{ fontSize: "55px" }}></i>
                              </Col>
                              <Col xl={9}>
                                <div className="ms-auto align-items-center mt-2 pt-2">
                                  <h2 className="mb-0" style={{ fontSize: "30px" }}>
                                    {formatValue(predictionData.actual_avg_artist_total_earnings_yr)}
                                  </h2>
                                  <span style={{ fontSize: "15px" }}>12 M</span>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>

                      <Col xl={3}>
                        <Card className="text-white" style={{ background: "#000a60" }}>
                          <CardBody className="p-4">
                            <CardTitle>
                              <h2 style={{ fontSize: "20px" }}>
                                Predicted Earnings Per Track
                              </h2>
                            </CardTitle>
                            <Row>
                              <Col xl={3}>
                                <i className="mdi mdi-currency-eur" style={{ fontSize: "55px" }}></i>
                              </Col>
                              <Col xl={9}>
                                <div className="ms-auto align-items-center mt-2 pt-2">
                                  <h2 className="mb-0" style={{ fontSize: "30px" }}>
                                    {formatValue(predictionData.avg_total_earnings_at)}
                                  </h2>
                                  <span style={{ fontSize: "15px" }}>Long Term</span>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>

                      <Col xl={3}>
                        <Card className="text-white" style={{ background: "#b40bbe" }}>
                          <CardBody className="p-4">
                            <CardTitle>
                              <h2 style={{ fontSize: "20px" }}>
                                Realistic Earnings Per Track
                              </h2>
                            </CardTitle>
                            <Row>
                              <Col xl={3}>
                                <i className="mdi mdi-currency-eur" style={{ fontSize: "55px" }}></i>
                              </Col>
                              <Col xl={9}>
                                <div className="ms-auto align-items-center mt-2 pt-2">
                                  <h2 className="mb-0" style={{ fontSize: "30px" }}>
                                    {formatValue(predictionData.actual_avg_artist_total_earnings_at)}
                                  </h2>
                                  <span style={{ fontSize: "15px" }}>Long Term</span>
                                </div>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    </Row>

                    <hr />
                    {/* {console.log(barChartData)} */}
                    <Row className="p-2">
                      {Object.keys(barChartData).length &&
                        <Col xl={6}>
                          <EarningsPredictionBarChart chartData={barChartData} />
                        </Col>
                      }
                      {polarAreaChartData &&
                        <Col xl={6}>
                          <EarningsPredictionPolarChart polarAreaChartData={polarAreaChartData} />
                        </Col>
                      }
                    </Row>
                    <hr />
                    <Row>
                      <Col xl={6}>
                        <h3>#1 Almost Guaranteed</h3>
                        <div className="artist-prediction-results">
                          <h6>Avg Earnings Per Track (12 M)</h6>
                          <h6>{formatValue(predictionData.actual_avg_artist_total_earnings_yr * 0.80)} - {formatValue(predictionData.actual_avg_artist_total_earnings_yr * 0.85)} €</h6>
                          <br />
                          <h6>Avg Earnings Per Track (Long Term)</h6>
                          <h6>{formatValue(predictionData.actual_avg_artist_total_earnings_at * 0.80)} - {formatValue(predictionData.actual_avg_artist_total_earnings_at * 0.85)} €</h6>
                        </div>
                      </Col>
                      <Col xl={6}>
                        <h3>#2 Very Probable</h3>
                        <div className="artist-prediction-results">
                          <h6>Avg Earnings Per Track (12 M)</h6>
                          <h6>{formatValue(predictionData.actual_avg_artist_total_earnings_yr * 0.85)} - {formatValue(predictionData.actual_avg_artist_total_earnings_yr)} €</h6>
                          <br />
                          <h6>Avg Earnings Per Track (Long Term)</h6>
                          <h6>{formatValue(predictionData.actual_avg_artist_total_earnings_at * 0.85)} - {formatValue(predictionData.actual_avg_artist_total_earnings_at)} €</h6>
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col xl={6}>
                        <div className="artist-prediction-results">
                          <h3>#3 Anticipated</h3>
                          <div className="artist-prediction-results">
                            <h6>Avg Earnings Per Track (12 M)</h6>
                            <h6>{formatValue(predictionData.actual_avg_artist_total_earnings_yr)} - {formatValue(predictionData.actual_avg_artist_total_earnings_yr * 1.05)} €</h6>
                            <br />
                            <h6>Avg Earnings Per Track (Long Term)</h6>
                            <h6>{formatValue(predictionData.actual_avg_artist_total_earnings_at)} - {formatValue(predictionData.actual_avg_artist_total_earnings_at * 1.05)} €</h6>
                          </div>
                        </div>
                      </Col>
                      <Col xl={6}>
                        <div className="artist-prediction-results">
                          <h3>#4 Realistic Forecast</h3>
                          <div className="artist-prediction-results">
                            <h6>Avg Earnings Per Track (12 M)</h6>
                            <h6>{formatValue(predictionData.actual_avg_artist_total_earnings_yr * 1.05)} - {formatValue(predictionData.actual_avg_artist_total_earnings_yr * 1.15)} €</h6>
                            <br />
                            <h6>Avg Earnings Per Track (Long Term)</h6>
                            <h6>{formatValue(predictionData.actual_avg_artist_total_earnings_at * 1.05)} - {formatValue(predictionData.actual_avg_artist_total_earnings_at * 1.15)} €</h6>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <br />
                    <Row>
                      <Col xl={6}>
                        <div className="artist-prediction-results">
                          <h3>#5 Achievable Potential</h3>
                          <div className="artist-prediction-results">
                            <h6>Avg Earnings Per Track (12 M)</h6>
                            <h6>{formatValue(predictionData.avg_total_earnings_yr * 0.90)} - {formatValue(predictionData.avg_total_earnings_yr * 1.10)} €</h6>
                            <br />
                            <h6>Avg Earnings Per Track (Long Term)</h6>
                            <h6>{formatValue(predictionData.avg_total_earnings_at * 0.90)} - {formatValue(predictionData.avg_total_earnings_at * 1.10)} €</h6>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <hr />
                    <Row>
                      {rangeBarChartData &&
                        <Col xl={12}>
                          <EarningsPredictionRangeBarChart rangeBarChartData={rangeBarChartData} />
                        </Col>
                      }
                    </Row>
                  </CardBody>
                </Card>
              }
            </Col>
          </Row>
        </>
      }
    </div>
  );
};

export default EarningsPrediction;
