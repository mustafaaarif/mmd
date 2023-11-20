import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Card, CardBody, CardTitle, CardSubtitle, Badge } from "reactstrap";
import Select from "react-select";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import { useLoading, Audio } from '@agney/react-loading';
import { useLocation } from "react-router-dom";
import PerfectScrollbar from 'react-perfect-scrollbar';
import RelatedArtistsTable from "../../components/relatedArtistsTable";
import { spotifyMarketOps } from "./spotifyMarkets";
import ProfileImg from "../../assets/images/users/1.jpg";
import ArtistTopTracksTable from "../../components/artistTopTracksTable";

import './viewArtistDetails.css';

const ViewArtistDetails = () => {

  const location = useLocation();
  const artistID = location.pathname.split("/")[2];

  const token = getCookie("token");
  const didEff = useRef(false);
  const [forceUpdate, setForce] = useState(0);
  const [artistDetails, setArtistDetails] = useState({});
  const [relatedArtistsData, setRelatedArtistsData] = useState([]);
  const [topTracksData, setTopTracksData] = useState([]);
  const [artistImage, setArtistImage] = useState([]);
  const [artistName, setArtistName] = useState("");
  const [artistGenres, setArtistGenres] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    {
      label: "Germany",
      value: "DE",
    }
  );
  const [artistsData, error, isloading] = useFetch("GET", `artists/spotify-artist-details/?artist_id=${artistID}&market=${selectedCountry.value}`, token, false, forceUpdate);

  const { containerProps, indicatorEl } = useLoading({
    loading: isloading,
    loaderProps: {
      style: { margin: '70px', color: 'white' },
      valueText: 'Fetching trends from database',
    },
    indicator: <Audio width="150" vertical-align="middle" />,
  });

  useEffect(() => {

    if (Object.keys(artistsData).length) {
        if (artistsData.name)
        {
          setArtistName(artistsData.name);
        }
        if (artistsData.artist_details)
        {
          let images = artistsData.artist_details.images;
          let genres = artistsData.artist_details.genres;
          setArtistDetails(artistsData.artist_details);
          setArtistImage(images[0]);
          setArtistGenres(genres);
        }
        if (artistsData.similar_artists)
        {
          setRelatedArtistsData(artistsData.similar_artists);
        }
        if(artistsData.top_tracks)
        {
          setTopTracksData(artistsData.top_tracks);
        }
    }

  }, [artistsData]);

  useEffect(() => {
    if (!didEff.current) {
      didEff.current = true;
      return;
    }
    setForce(prev => prev + 1);
  }, [selectedCountry]);

  return (
    <>
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
          <Col xl="4" lg="4" md="12" sm="12" xm="12">
            <Card>
              <CardBody>
                  <PerfectScrollbar>
                    <div className="chart-wrapper" style={{ width: '100%', margin: '0 auto', height: 485 }}>
                      <center>
                        <img className="spotify-artist-avatar" src={artistImage ?  artistImage.url : ProfileImg} alt={artistDetails.name} />
                        <CardTitle style={{fontSize: "20px", fontWeight: "bold"}} tag="h2">{artistName}</CardTitle>
                        <hr />
                        <CardSubtitle>
                          <h6 className="mt-4 text-bold text-grey">FOLLOWERS</h6>
                          <h4 className="text-bold text-danger">{artistDetails.followers.total? Number(artistDetails.followers.total).toLocaleString({minimumFractionDigits: 0}): "N/A"}</h4>
                          <h6 className="mt-3 text-bold text-grey">POPULARITY</h6>
                          <h4 className="text-bold text-primary">{artistDetails.popularity} %</h4>
                          <h6 className="mt-3 text-bold text-grey">GENRES</h6>
                          <div>
                          { artistGenres.length ?
                              artistGenres.map(genre => {
                                return (
                                  <Badge className="m-1" disabled color="success">
                                    <span style={{fontSize: "13px", fontWeight: "800"}}>{genre.replace(/(^\w|\s\w)/g, m => m.toUpperCase())}</span>
                                  </Badge>
                                );
                              }) : <h4 className="text-bold text-success">Not Available</h4>
                          }
                          </div>
                        </CardSubtitle>
                      </center>
                    </div>
                  </PerfectScrollbar>
              </CardBody>
            </Card>
          </Col>

          <Col xl="8" lg="8" md="12" sm="12" xm="12">
            <Card>
              <CardBody>
                <CardTitle style={{fontSize: "20px"}} tag="h1">Similar Artists</CardTitle>
                <RelatedArtistsTable relatedArtistsData={relatedArtistsData} />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col xl="12" lg="12" md="12" sm="12" xm="12">
            <Card>
              <CardBody>
                <Row>
                  <Col xl="9" lg="8" md="12" sm="12" xm="12">
                    <CardTitle style={{fontSize: "20px"}} tag="h1">Top Tracks</CardTitle>
                  </Col>
                  <Col xl="3" lg="4" md="12" sm="12" xm="12">
                    <Select
                      components={{ IndicatorSeparator: () => null }}
                      name="country_filter"
                      options={spotifyMarketOps}
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e)}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col xl="12" lg="12" md="12" sm="12" xm="12">
                    <ArtistTopTracksTable topTracksData={topTracksData} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      }
    </>
  );
};

export default ViewArtistDetails;
