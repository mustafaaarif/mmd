import React, { useState, useEffect } from "react";
import axios from "axios";
import AsyncSelect from 'react-select/async';

import {
  Col,
  Row,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  FormText,
  Button,
  Input,
  CustomInput,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Alert,
} from "reactstrap";
import { useLoading, Audio } from '@agney/react-loading';
import ean from "../../validations/es6/validators/ean";
import { getCookie } from "../../jwt/_helpers/cookie";
import TransferReleaseForm from "./transferReleaseForm";


const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const validateEanUpc = (eanUpc) => {
  let validEanUpc = ean().validate({value: eanUpc});
  return validEanUpc.valid;
}

const validateAlbumURL = (url) => {
  if (typeof url !== 'string') {
    return false;
  }
  if(url.includes("?"))
  {
    url = url.split("?")[0];
  }
  let deezerPattern = /^(?:https?:\/\/)?(?:www\.)?deezer\.com\/(?:\w{2}\/)?album\/\d+\/?$/i;
  let spotifyPattern = /^(?:https?:\/\/)?(?:open\.)?spotify\.com\/album\/[a-zA-Z0-9]+\/?$/i;
  return deezerPattern.test(url) || spotifyPattern.test(url);
}

const formatSpotifyReleaseDate = (releaseDate, precision) => {
  let dateComponents = releaseDate.split('-');
  let formattedDate;

  switch (precision) {
    case 'day':
      if (dateComponents.length === 3) {
        let [year, month, day] = dateComponents;
        formattedDate = `${year}-${month}-${day}`;
      }
      break;
    case 'month':
      if (dateComponents.length === 2) {
        let [year, month] = dateComponents;
        formattedDate = `${year}-${month}-01`;
      }
      break;
    case 'year':
      if (dateComponents.length === 1) {
        let year = dateComponents[0];
        formattedDate = `${year}-01-01`;
      }
      break;
    default:
      formattedDate = null;
  }

  return formattedDate;
}


const extractMixName = (trackName, storeName) => {
  let mixResult = { isRemix: false, mixName: "", trackName: "" };
  let validBracketsPosition = false;
  let isRemix = false;
  let openingAndClosingBracketExists = trackName.includes('(') && trackName.includes(')');

  if(openingAndClosingBracketExists)
  {
    let openingBracketIndex = trackName.indexOf('(');
    let closingBracketIndex = trackName.indexOf(')');
    validBracketsPosition = openingBracketIndex !== -1 && closingBracketIndex !== -1 && (openingBracketIndex < closingBracketIndex);
  }

  if(storeName === "spotify"){
    isRemix = trackName.includes('-') || trackName.includes('--') || trackName.includes('mix');
  }

  if(storeName === "deezer") {
    isRemix = validBracketsPosition || trackName.includes('mix');
  }

  if(isRemix)
  {
    let mixName = "";
    let trackNameFormatted = "";
    let isSpotifyRemix = isRemix && trackName.includes('-') && (storeName === "spotify");
    let isDeezerRemix = isRemix && validBracketsPosition && (storeName === "deezer");
  
    if(isSpotifyRemix)
    {
      let mixIndicatorIndex = trackName.indexOf('-');
      trackNameFormatted = trackName.substring(0, mixIndicatorIndex).trim();
      mixName = trackName.substring(mixIndicatorIndex+1).trim();
    }
  
    if(isDeezerRemix)
    {
      let mixIndicatorIndexStart = trackName.indexOf('(');
      let mixIndicatorIndexEnd = trackName.indexOf(')');
      trackNameFormatted = trackName.substring(0, mixIndicatorIndexStart).trim();
      mixName = trackName.substring(mixIndicatorIndexStart+1, mixIndicatorIndexEnd).trim();
    }
    mixResult = { isRemix: true, mixName: mixName, trackName: trackNameFormatted };
  }
  return mixResult;
}

let mainArtistRole = { value: 'main', label: 'Main Artist' };
let featuringArtistRole = { value: 'featuring', label: 'Featuring Artist' };

const TransferRelease = () => {
  const token = getCookie().token;
  const options = {
    method: "GET",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  };

  const [releaseDetails, setReleaseDetails] = useState(null);
  const [spotifyReleaseDetails, setSpotifyReleaseDetails] = useState(null);
  const [deezerReleaseDetails, setDeezerReleaseDetails] = useState(null);
  const [releaseTransferData, setReleaseTransferData] = useState(null);
  const [isloading, isloadingSET] = useState(false);
  const [selectedSearchOption, setSelectedSearchOption] = useState('upc');
  const [storePriority, storePrioritySET] = useState(null);
  const [openModal, setToggleModal] = useState(false);
  const [releaseExists, setReleaseExists] = useState(false);
  const [checkboxes, setCheckboxes] = useState({
    ownershipWarranty: false,
    nonInfringementWarranty: false,
    exclusivityDeclaration: false,
    legalConsequencesAwareness: false,
  });

  const handleCheckboxChange = (checkboxName, checked) => {
    setCheckboxes({
      ...checkboxes,
      [checkboxName]: checked,
    });
  };

  const allCheckboxesChecked =
    checkboxes.ownershipWarranty &&
    checkboxes.nonInfringementWarranty &&
    checkboxes.exclusivityDeclaration &&
    checkboxes.legalConsequencesAwareness;

      
  useEffect(() => {
    if(releaseDetails) {
      let upc = releaseDetails.upc;
      let store_id = releaseDetails.value;
      let store = releaseDetails.store;
      let upcParam = upc!==null? `&upc=${upc}`: '';
      isloadingSET(true)
      axios.get(`${API_URL}releases/get-release-details/?${store}_id=${store_id}${upcParam}`, options).then(response => {
        let data = response.data;
        setReleaseExists(data.release_exists);
        setDeezerReleaseDetails(data.deezer);
        setSpotifyReleaseDetails(data.spotify);
        isloadingSET(false)
      });
      storePrioritySET(releaseDetails.store);
    }
  }, [releaseDetails])


  const { containerProps, indicatorEl } = useLoading({
    loading: isloading,
    loaderProps: {
      style: { margin: '70px', color: 'white' },
      valueText: 'Fetching Release Details...',
    },
    indicator: <div style={{ textAlign: 'center', fontFamily: 'Nunito Sans' }}><Audio width="150" vertical-align="middle" className="mb-4" /><br/><h3>Fetching Release Details...</h3><br/></div>,
  })


  const extractSpotifyReleaseCopyrightDetails = (copyrights) => {
    let extractedData = { P: null, C: null };
  
    copyrights.forEach(copyrightObj => {
      let type = copyrightObj.type;
      let text = copyrightObj.text;
  
      let match = text.match(/(\d{4})\s(.+)/);
  
      if (match && extractedData.hasOwnProperty(type)) {
        let year = match[1];
        let copyrightName = match[2];
        extractedData[type] = {
          year: year,
          copyrightName: copyrightName
        };
      }
    });
  
    return extractedData;
  }


  const prepareTransferData = () => {
    setToggleModal(false);
    let transferData = null;
    let releaseUPC = "";
    let releaseName = "";
    let releaseLabel = "";
    let releaseDate = undefined;
    let releaseArtistsFormatted = [];
    let releaseTracksFormatted = [];
    let releaseCopyrights = { P: null, C: null };
    let releaseGenre = null;
    let releaseSpotifyID = null;
    let releaseDeezerID = null;
    let releaseAllArtists = [];

    if(!deezerReleaseDetails && spotifyReleaseDetails)
    {
      releaseSpotifyID = spotifyReleaseDetails.id;
      releaseUPC = spotifyReleaseDetails["external_ids"]["upc"];
      releaseName = spotifyReleaseDetails.name;
      releaseLabel = spotifyReleaseDetails.label;
      releaseDate = formatSpotifyReleaseDate(spotifyReleaseDetails.release_date, spotifyReleaseDetails.release_date_precision);

      let releaseArtists = spotifyReleaseDetails.artists;
      let artistOrder = 0;
      releaseArtists.map(artist => {
        artistOrder = artistOrder + 1;
        releaseArtistsFormatted.push(
          {
            key: makeid(20),
            order: artistOrder,
            name: artist.name,
            spotify_id: artist.id,
            deezer_id: null,
            type:  mainArtistRole,
          }
        )
        releaseAllArtists.push(
          {
            name: artist.name,
            spotify_id: artist.id,
            deezer_id: null,
          }
        )
      });
    
      let releaseTracks = spotifyReleaseDetails.tracks;
      releaseTracks.map(track => {
        let mixDetails = extractMixName(track.name, "spotify");
        let isrc = track["external_ids"]["isrc"];
        let trackArtistOrder = 0;
        let trackArtists = track.artists.map(artist => {
          trackArtistOrder = trackArtistOrder + 1;
          releaseAllArtists.push(
            {
              name: artist.name,
              spotify_id: artist.id,
              deezer_id: null,
            }
          )
          return {
            order: trackArtistOrder,
            name: artist.name,
            type: mainArtistRole,
          };
        });
        releaseTracksFormatted.push(
          {
            key: makeid(20),
            deezer_id: null,
            spotify_id: track.id,
            order: track.track_number,
            track_name: mixDetails.isRemix? mixDetails.trackName: track.name,
            track_mix_name: mixDetails.isRemix? mixDetails.mixName: "",
            album_only: false,
            isrc: isrc,
            generate_isrc: false,
            explicit_content: track.explicit,
            track_mix_select: mixDetails.isRemix? 1: 2,
            artists: trackArtists,
          }
        )
      });

      releaseCopyrights = extractSpotifyReleaseCopyrightDetails(spotifyReleaseDetails.copyrights);
      transferData = {
        deezerID: null,
        spotifyID: releaseSpotifyID,
        upc: releaseUPC,
        name: releaseName,
        label: releaseLabel,
        genre: releaseGenre,
        releaseDate: releaseDate,
        artists: releaseArtistsFormatted,
        allArtists: releaseAllArtists,
        tracks: releaseTracksFormatted,
        copyrights: releaseCopyrights,
      };
      setReleaseTransferData(transferData);
    }

    if(deezerReleaseDetails && !spotifyReleaseDetails)
    {
      releaseDeezerID = deezerReleaseDetails.id;
      releaseUPC = deezerReleaseDetails.upc;
      releaseName = deezerReleaseDetails.title;
      releaseLabel = deezerReleaseDetails.label;
      releaseDate = deezerReleaseDetails.release_date;
      releaseGenre = deezerReleaseDetails.genres?.data.length? deezerReleaseDetails.genres.data[0].name: null;

      let releaseArtists = deezerReleaseDetails.contributors;
      let artistOrder = 0;
      releaseArtists.map(artist => {
        artistOrder = artistOrder + 1;
        let isFeaturingArtist = (artist.role === "Featured")
        releaseArtistsFormatted.push(
          {
            key: makeid(20),
            order: artistOrder,
            name: artist.name,
            spotify_id: null,
            deezer_id: `${artist.id}`,
            type:  isFeaturingArtist? featuringArtistRole: mainArtistRole,
          }
        )
        releaseAllArtists.push(
          {
            name: artist.name,
            spotify_id: null,
            deezer_id: `${artist.id}`,
          }
        )
      });
    
      let releaseTracks = deezerReleaseDetails.tracks;
      releaseTracks.map(track => {
        let mixDetails = extractMixName(track.title, "deezer");
        let isrc = track.isrc;
        let trackArtistOrder = 0;
        let trackArtists = track.contributors.map(artist => {
          trackArtistOrder = trackArtistOrder + 1;
          releaseAllArtists.push(
            {
              name: artist.name,
              spotify_id: null,
              deezer_id: `${artist.id}`,
            }
          )
          return {
            order: trackArtistOrder,
            name: artist.name,
            type: mainArtistRole,
          };
        });
        releaseTracksFormatted.push(
          {
            deezer_id: `${track.id}`,
            spotify_id: null,
            key: makeid(20),
            order: track.track_position,
            track_name: mixDetails.isRemix? mixDetails.trackName: track.title,
            track_mix_name: mixDetails.isRemix? mixDetails.mixName: "",
            album_only: false,
            isrc: isrc,
            generate_isrc: false,
            explicit_content: track.explicit_lyrics,
            track_mix_select: mixDetails.isRemix? 1: 2,
            artists: trackArtists,
          }
        )
      });

      transferData = {
        deezerID: `${releaseDeezerID}`,
        spotifyID: null,
        upc: releaseUPC,
        name: releaseName,
        label: releaseLabel,
        genre: releaseGenre,
        releaseDate: releaseDate,
        artists: releaseArtistsFormatted,
        allArtists: releaseAllArtists,
        tracks: releaseTracksFormatted,
        copyrights: releaseCopyrights,
      };
      setReleaseTransferData(transferData);
    }

    if(deezerReleaseDetails && spotifyReleaseDetails)
    {
      releaseDeezerID = deezerReleaseDetails.id;
      releaseSpotifyID = spotifyReleaseDetails.id;
      releaseGenre = deezerReleaseDetails.genres?.data.length? deezerReleaseDetails.genres.data[0].name: null;
      releaseCopyrights = extractSpotifyReleaseCopyrightDetails(spotifyReleaseDetails.copyrights);

      if(storePriority === "spotify") {
        releaseUPC = spotifyReleaseDetails["external_ids"]["upc"];
        releaseName = spotifyReleaseDetails.name;
        releaseLabel = spotifyReleaseDetails.label;
        releaseDate = formatSpotifyReleaseDate(spotifyReleaseDetails.release_date, spotifyReleaseDetails.release_date_precision);

        let releaseArtists = spotifyReleaseDetails.artists;
        let artistOrder = 0;
        releaseArtists.map(artist => {
          artistOrder = artistOrder + 1;
          releaseArtistsFormatted.push(
            {
              key: makeid(20),
              order: artistOrder,
              name: artist.name,
              spotify_id: artist.id,
              deezer_id: null,
              type:  mainArtistRole,
            }
          )
          releaseAllArtists.push(
            {
              name: artist.name,
              spotify_id: artist.id,
              deezer_id: null,
            }
          )
        });
  
        let releaseTracks = spotifyReleaseDetails.tracks;
        releaseTracks.map(track => {
          let mixDetails = extractMixName(track.name, "spotify");
          let isrc = track["external_ids"]["isrc"];
          let trackArtistOrder = 0;
          let trackArtists = track.artists.map(artist => {
            trackArtistOrder = trackArtistOrder + 1;
            releaseAllArtists.push(
              {
                name: artist.name,
                spotify_id: artist.id,
                deezer_id: null,
              }
            )
            return {
              order: trackArtistOrder,
              name: artist.name,
              type: mainArtistRole,
            };
          });
          releaseTracksFormatted.push(
            {
              deezer_id: null,
              spotify_id: track.id,
              key: makeid(20),
              order: track.track_number,
              track_name: mixDetails.isRemix? mixDetails.trackName: track.name,
              track_mix_name: mixDetails.isRemix? mixDetails.mixName: "",
              album_only: false,
              isrc: isrc,
              generate_isrc: false,
              explicit_content: track.explicit,
              track_mix_select: mixDetails.isRemix? 1: 2,
              artists: trackArtists,
            }
          )
        });
      }

      if(storePriority === "deezer")
      {
        releaseUPC = deezerReleaseDetails.upc;
        releaseName = deezerReleaseDetails.title;
        releaseLabel = deezerReleaseDetails.label;
        releaseDate = deezerReleaseDetails.release_date;

        let releaseArtists = deezerReleaseDetails.contributors;
        let artistOrder = 0;
        releaseArtists.map(artist => {
          artistOrder = artistOrder + 1;
          let isFeaturingArtist = (artist.role === "Featured")
          releaseArtistsFormatted.push(
            {
              key: makeid(20),
              order: artistOrder,
              name: artist.name,
              spotify_id: null,
              deezer_id: `${artist.id}`,
              type:  isFeaturingArtist? featuringArtistRole: mainArtistRole,
            }
          )
          releaseAllArtists.push(
            {
              name: artist.name,
              spotify_id: null,
              deezer_id: `${artist.id}`,
            }
          )
        });

        let releaseTracks = deezerReleaseDetails.tracks;
        releaseTracks.map(track => {
          let mixDetails = extractMixName(track.title, "deezer");
          let isrc = track.isrc;
          let trackArtistOrder = 0;
          let trackArtists = track.contributors.map(artist => {
            trackArtistOrder = trackArtistOrder + 1;
            let isFeaturingArtist = (artist.role === "Featured")
            releaseAllArtists.push(
              {
                name: artist.name,
                spotify_id: null,
                deezer_id: `${artist.id}`,
              }
            )
            return {
              order: trackArtistOrder,
              name: artist.name,
              type:  isFeaturingArtist? featuringArtistRole: mainArtistRole,
            };
          });
          releaseTracksFormatted.push(
            {
              deezer_id: `${track.id}`,
              spotify_id: null,
              key: makeid(20),
              order: track.track_position,
              track_name: mixDetails.isRemix? mixDetails.trackName: track.title,
              track_mix_name: mixDetails.isRemix? mixDetails.mixName: "",
              album_only: false,
              isrc: isrc,
              generate_isrc: false,
              explicit_content: track.explicit_lyrics,
              track_mix_select: mixDetails.isRemix? 1: 2,
              artists: trackArtists,
            }
          )
        });

      }

      transferData = {
        deezerID: `${releaseDeezerID}`,
        spotifyID: releaseSpotifyID,
        upc: releaseUPC,
        name: releaseName,
        label: releaseLabel,
        genre: releaseGenre,
        releaseDate: releaseDate,
        artists: releaseArtistsFormatted,
        allArtists: releaseAllArtists,
        tracks: releaseTracksFormatted,
        copyrights: releaseCopyrights,
      };
      setReleaseTransferData(transferData);
    }
  };

  return (
    <>
      {
        (!releaseTransferData) &&
        <Card>
          <CardBody>
            <Row>
              <Col>
                <CardTitle tag="h4">Transfer Release</CardTitle>
                <Form className="mt-3" id="transferReleaseForm">
                  <FormGroup row>
                    <Label for="Spotify By" sm={2}>
                      <b>Search By</b>
                    </Label>
                    <Col>
                      <div style={{ display: "flex", justifyContent: "normal" }} >
                        <FormGroup check className="mr-4">
                          <Label check>
                            <Input type="radio" name="search-by-upc" value="upc" disabled={releaseDetails!==null} checked={selectedSearchOption === "upc"} onChange={() => {setSelectedSearchOption("upc")}} />{" "}
                            <span className="mt-1">UPC Number</span>
                          </Label>
                        </FormGroup>
                        <FormGroup check className="mr-4">
                          <Label check>
                            <Input type="radio" name="search-by-url" value="url" disabled={releaseDetails!==null} checked={selectedSearchOption === "url"} onChange={() => {setSelectedSearchOption("url")}} />{" "}
                            <span className="mt-1">Store Release URL</span>
                          </Label>
                        </FormGroup>
                        <FormGroup check className="mr-4">
                          <Label check>
                            <Input type="radio" name="search-by-name" value="name" disabled={releaseDetails!==null} checked={selectedSearchOption === "name"} onChange={() => {setSelectedSearchOption("name")}} />{" "}
                            <span className="mt-1">Release Name</span>
                          </Label>
                        </FormGroup>
                        {
                          releaseDetails &&
                          <FormGroup>
                            <Button className="btn btn-outline-info"
                              onClick={() => { 
                                setReleaseDetails(null)
                                setReleaseExists(false)
                              }}
                            >Reset</Button>
                          </FormGroup>
                        }
                      </div>
                    </Col>
                  </FormGroup>

                  {
                    (selectedSearchOption === "upc" && !releaseDetails)  &&
                    <FormGroup className="select-search-wrap" row>
                      <Col>
                        <AsyncSelect
                          cacheOptions
                          defaultOptions
                          defaultValue={releaseDetails? releaseDetails.value: null}
                          loadOptions={(inputValue, callback) => {
                            let isUpcValid = validateEanUpc(inputValue);
                            if (!inputValue || inputValue.trim() === '' || !isUpcValid) {
                              callback([]);
                              return;
                            }
                            fetch(`${API_URL}releases/search-release/?upc=${inputValue}`, options)
                            .then(response => {
                              if (!response.ok) {
                                return false;
                              } else {
                                return response.json();
                              }
                            })
                            .then(searchRes => {
                              if (searchRes) {
                                let store = searchRes.store;
                                let albums = searchRes.data;
                                if(store === "spotify") {
                                  callback(albums.map(({ name, id, images }) => ({ value: id, label: name, image: images[0].url, upc: inputValue, store: store })));
                                }
                                else if(store === "deezer") {
                                  callback(albums.map(({ title, id, cover_medium, upc }) => ({ value: id, label: title, image: cover_medium, upc: inputValue, store: store })));
                                }
                                else {
                                  callback([]);
                                  return;
                                }
                              }
                              else {
                                callback([]);
                                return;
                              }
                            });
                          }}
                          formatOptionLabel={album => (
                            <div>
                              <img
                                src={album.image? album.image: ""}
                                alt={album.label}
                                style={{
                                    height: '40px',
                                    width: '40px',
                                    borderRadius: '30%',
                                    marginRight: "10px",
                                }}
                              />
                              <b>{album.label}</b>
                            </div>
                          )}
                          onChange={(selectedOption) => {
                            setReleaseDetails(selectedOption);
                          }}
                          placeholder="Enter Release UPC/EAN Number i.e. 5055964352523"
                          style={{maxWidth: '100%'}}
                        />
                        <FormText color="muted">
                          Note: Only use this dropdown if you want to add an Release that is already on Spotify or Deezer.
                        </FormText>
                      </Col>
                    </FormGroup>
                  }

                  {
                    (selectedSearchOption === "url" && !releaseDetails) &&
                    <FormGroup className="select-search-wrap" row>
                      <Col>
                        <AsyncSelect
                          id="transfer-by-url"
                          cacheOptions
                          defaultOptions
                          defaultValue={releaseDetails? releaseDetails.value: null}
                          loadOptions={(inputValue, callback) => {
                            let validAlbumUrl = validateAlbumURL(inputValue);
                            if (!inputValue || inputValue.trim() === '' || !validAlbumUrl) {
                              callback([]);
                              return;
                            }
                            let store = inputValue.includes("deezer.com")? "deezer": "spotify";
                            if(inputValue.includes("?"))
                            {
                              inputValue = inputValue.split("?")[0];
                            }
                            fetch(`${API_URL}releases/search-release/?store=${store}&url=${inputValue}`, options)
                            .then(response => {
                              if (!response.ok) {
                                return false;
                              } else {
                                return response.json();
                              }
                            })
                            .then(searchRes => {
                              if (searchRes) {
                                let albums = [searchRes];
                                if(store==="spotify") {
                                  callback(albums.map(({ name, id, images, external_ids }) => ({ value: id, label: name, image: images[0].url, upc: external_ids.hasOwnProperty("upc") ? external_ids["upc"] : external_ids.hasOwnProperty("ean") ? external_ids["ean"] : null, store: store })));
                                }
                                else if(store==="deezer") {
                                  callback(albums.map(({ title, id, cover_medium, upc }) => ({ value: id, label: title, image: cover_medium, upc: upc, store: store })));
                                }
                                else {
                                  callback([]);
                                  return;
                                }
                              }
                            });
                          }}
                          formatOptionLabel={album => (
                            <div>
                              <img
                                src={album.image? album.image: ""}
                                alt={album.label}
                                style={{
                                  height: '40px',
                                  width: '40px',
                                  borderRadius: '30%',
                                  marginRight: "10px",
                                }}
                              />
                              <b>{album.label}</b>
                            </div>
                          )}
                          onChange={(selectedOption) => {
                            setReleaseDetails(selectedOption);
                          }}
                          placeholder="Enter Release Store Url i.e. open.spotify.com/album/4pAD0l5icphM5TC1A4q8Yn or www.deezer.com/en/album/413370367"
                          style={{maxWidth: '100%'}}
                        />
                        <FormText color="muted">
                          Note: Only use this dropdown if you want to add an Release that is already on Spotify or Deezer.
                        </FormText>
                      </Col>
                    </FormGroup>
                  }

                  {
                    (selectedSearchOption === "name" && !releaseDetails) &&
                    <>
                      <FormGroup className="select-search-wrap" row>
                        <Label for="Spotify By" sm={2}>
                          <b>Spotify</b>
                        </Label>
                        <Col>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            defaultValue={releaseDetails? releaseDetails.value: null}
                            loadOptions={(inputValue, callback) => {
                              if (!inputValue || inputValue.trim() === '') {
                                callback([]);
                                return;
                              }
                              fetch(`${API_URL}releases/search-release/?store=spotify&release_name=${inputValue}`, options)
                              .then(response => {
                                if (!response.ok) {
                                  return false;
                                } else {
                                  return response.json();
                                }
                              })
                              .then(data => {
                                if (data) {
                                  let albums = data["albums"]["items"];
                                  callback(albums.filter(({ name }) => (name.includes(inputValue))).map(({ name, id, images }) => ({ value: id, label: name, image: images[0].url, upc: null, store: "spotify" })));
                                }
                                else {
                                  callback([]);
                                }
                              });
                            }}
                            formatOptionLabel={album => (
                              <div>
                                <img
                                  src={album.image? album.image: ""}
                                  alt={album.label}
                                  style={{
                                      height: '40px',
                                      width: '40px',
                                      borderRadius: '30%',
                                      marginRight: "10px",
                                  }}
                                />
                                <b>{album.label}</b>
                              </div>
                            )}
                            onChange={(selectedOption) => {
                              setReleaseDetails(selectedOption);
                            }}
                            placeholder="Enter Release Name i.e. Warrior"
                            style={{maxWidth: '100%'}}
                        />
                        <FormText color="muted">
                          Note: Only use this dropdown if you want to add an Release that is already on Spotify.
                        </FormText>
                        </Col>
                      </FormGroup>
                      <FormGroup className="select-search-wrap" row>
                        <Label for="Deezer Search" sm={2}>
                          <b>Deezer</b>
                        </Label>
                        <Col>
                          <AsyncSelect
                            cacheOptions
                            defaultOptions
                            defaultValue={releaseDetails? releaseDetails.value: null}
                            loadOptions={(inputValue, callback) => {
                              if (!inputValue || inputValue.trim() === '') {
                                callback([]);
                                return;
                              }
                              fetch(`${API_URL}releases/search-release/?store=deezer&release_name=${inputValue}`, options)
                              .then(response => {
                                if (!response.ok) {
                                  return false;
                                } else {
                                  return response.json();
                                }
                              })
                              .then(searchRes => {
                                if(searchRes) {
                                  let albums = searchRes.data;
                                  callback(albums.filter(({ title }) => (title.includes(inputValue))).map(({ title, id, cover_medium, upc }) => ({ value: id, label: title, image: cover_medium, upc: upc, store: "deezer" })));
                                }
                                else {
                                  callback([]);
                                }
                              });
                            }}
                            formatOptionLabel={album => (
                              <div>
                                  <img
                                    src={album.image? album.image: ""}
                                    alt={album.label}
                                    style={{
                                      height: '40px',
                                      width: '40px',
                                      borderRadius: '30%',
                                      marginRight: "10px",
                                    }}
                                  />
                                  <b>{album.label}</b>
                              </div>
                            )}
                            onChange={(selectedOption) => {
                              setReleaseDetails(selectedOption);
                            }}
                            placeholder="Enter Release Name i.e. Midnights"
                            style={{maxWidth: '100%'}}
                        />
                        <FormText color="muted">
                          Note: Only use this dropdown if you want to add an Release that is already on Deezer.
                        </FormText>
                        </Col>
                      </FormGroup>
                    </>
                  }

                  <Row {...containerProps}>
                    <Col className="col-12">
                      <div className="bg-primary trends-loading">
                        {indicatorEl}
                      </div>
                    </Col>
                  </Row>

                  {
                    (!isloading && releaseDetails) &&
                    <>
                      <FormGroup row>
                          <Col>
                            <p className="releaseFileRowName"><b>Release: </b> {releaseDetails.label}</p>
                            <img
                              src={releaseDetails.image ? releaseDetails.image: null}
                              style={{ width: "300px", padding: "10px 0" }}
                              alt={"Release Artwork"}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                        <Col>
                          <Button color="success" className="float-right" disabled={(!isloading && !spotifyReleaseDetails && !deezerReleaseDetails) || releaseExists} onClick={() => {setToggleModal(true)}}>Transfer</Button>
                        </Col>
                      </FormGroup>
                    </>
                  }
                  { releaseExists &&
                    <Alert color="danger">
                      A release with this UPC number already belongs to another user within a Move Music platform. Please import only releases which entirely belong to your company and label. If you believe that someone took your release without permission, please get in touch with our support team.
                    </Alert>
                  }
              </Form>
            </Col>
          </Row>
        </CardBody>
      </Card>
      }
      {releaseTransferData && <TransferReleaseForm releaseData={releaseTransferData} />}
      <Modal isOpen={openModal} centered={true} size="lg" style={{ maxWidth: '700px', width: '100%' }}>
      <ModalHeader>Release Transfer Terms</ModalHeader>
      <ModalBody>
        <Label check>
          <CustomInput
            type="checkbox"
            id="ownershipWarranty"
            name="ownershipWarranty"
            checked={checkboxes.ownershipWarranty}
            onChange={(e) => handleCheckboxChange('ownershipWarranty', e.target.checked)}
          />{" "}
          <h6 className="mt-2">Ownership Warranty</h6>
        </Label>

        <ul>
          <li>
            By accepting these terms, you acknowledge and guarantee that you have the lawful ownership or represent the rightful owner of all content, including the release and associated songs, provided herein.
          </li>
          <li>
            You affirm that no copyrighted material or intellectual property belonging to a third party is incorporated in this release.
          </li>
        </ul>

        <Label check>
          <CustomInput
            type="checkbox"
            id="nonInfringementWarranty"
            name="nonInfringementWarranty"
            checked={checkboxes.nonInfringementWarranty}
            onChange={(e) => handleCheckboxChange('nonInfringementWarranty', e.target.checked)}
          />{" "}
          <h6 className="mt-2">Non-Infringement Warranty</h6>
        </Label>

        <ul>
          <li>
            By proceeding, you expressly confirm that the content submitted in this release does not infringe upon any third-party rights, including but not limited to copyright, trademark, or any other proprietary rights.
          </li>
          <li>
            You agree not to include any material from external sources without proper authorization.
          </li>
        </ul>

        <Label check>
          <CustomInput
            type="checkbox"
            id="exclusivityDeclaration"
            name="exclusivityDeclaration"
            checked={checkboxes.exclusivityDeclaration}
            onChange={(e) => handleCheckboxChange('exclusivityDeclaration', e.target.checked)}
          />{" "}
          <h6 className="mt-2">Exclusivity Declaration</h6>
        </Label>

        <ul>
          <li>
            By consenting to these terms, you pledge that the content presented in this release is exclusive to your ownership or authorized representation, and it has not been offered or released to any other entity or platform.
          </li>
          <li>
            You take full responsibility for any breach of exclusivity and understand that any such violation may lead to legal consequences.
          </li>
        </ul>

        <Label check>
          <CustomInput
            type="checkbox"
            id="legalConsequencesAwareness"
            name="legalConsequencesAwareness"
            checked={checkboxes.legalConsequencesAwareness}
            onChange={(e) => handleCheckboxChange('legalConsequencesAwareness', e.target.checked)}
          />{" "}
          <h6 className="mt-2">Legal Consequences Awareness</h6>
        </Label>

        <ul>
          <li>
            It is crucial to comprehend that any breach of the terms and warranties outlined in this modal or terms may lead to severe legal ramifications.
          </li>
          <li>
            These penalties could include but are not limited to, substantial financial liabilities, legal injunctions, and damage to reputation.
          </li>
          <li>
            By accepting these terms, you acknowledge the seriousness of upholding the stated obligations and recognize that non-compliance may result in legal actions being pursued against you or your organization.
          </li>
        </ul>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setToggleModal(false)}>
          Cancel
        </Button>
        <Button color="success" disabled={!allCheckboxesChecked} onClick={prepareTransferData}>
          I Agree
        </Button>
      </ModalFooter>
    </Modal>
    </>
  );
}
export default TransferRelease;
