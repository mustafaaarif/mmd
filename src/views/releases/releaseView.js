import React, {useState, useRef, useEffect} from "react";
import axios from "axios";
import Select from "react-select";

import {
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  CustomInput,
  Input,
  FormText,
  Button,
  Card,
  CardBody,
  CardTitle,
  Alert
} from "reactstrap";

import ArtistRow from "./ArtistRow";
import TrackRow from "./TrackRow";
import CountriesSelect from "../../components/countriesSelect";
import QCFeedback from "../../components/qcFeedback";
import "./releaseForm.css";

import { getCookie } from "../../jwt/_helpers/cookie";

import { checkTrackValidation, uploadS3 } from "./helperFunctions";

import "./releaseForm.css";

import Langs from "../../utils/languages.json";
import CountriesJSON from "../../utils/countriesExtended.json";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2)
      day = '0' + day;

  return [year, month, day].join('-');
}


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

let keyrandom = makeid(20);

const ReleaseForm = () => {
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

  const stateRef = useRef();
  const [listOfArtists, listOfArtistsSET] = useState([{ name: "", type: "", order: 1, key: keyrandom }]);
  const [listOfTracks, listOfTracksSET] = useState([{
    order: 1,
    track_name: "",
    track_mix_name: "",
    album_only: false,
    key: keyrandom
  }])
  const [initialData, initialDataSET] = useState({})
  const [listOfTracksDetails, listOfTracksDetailsSET] = useState([])
  const [selectedGenre] = useState(null);
  const [language] = useState('');
  const [genres, genresSET] = useState(null);
  const [labels, labelsSET] = useState(null);
  const [artists, artistsSET] = useState(null);
  const [selectedTerritories, selectedTerritoriesSET] = useState([]);
  const [successAddedNew] = useState(false);
  const [isNewRelease, isNewReleaseSET] = useState(null);
  const [originalOpenCalendar, originalOpenCalendarSET] = useState(false);
  const [officialOpenCalendar, officialOpenCalendarSET] = useState(false);
  const [backcatalog, backcatalogSET] = useState(false);
  const [subUserId, subUserIdSET] = useState(null);
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');

  const [qcFeedback, qcFeedbackSET] = useState({});
  const [hasQCFeedback, hasQCFeedbackSET] = useState(false);

  stateRef.current = listOfTracksDetails;


  const addNewArtist = (obj) => {
    listOfArtistsSET(obj)
  }

  const removeArtist = (index) => {
    if (listOfArtists.length === 1) return false;

    const newList = listOfArtists.filter((element, i) => {
      if (index === i) {
        return false;
      } else {
        if (i < index) {
          return element;
        } else {
          element.order = element.order - 1;
          return element;
        }
      }
    });
    listOfArtistsSET(newList)
  }

  const manageArtistData = (index, value, key) => {
    const val = key;
    const newList = listOfArtists.map((element, i) => {
      if (index === i) {
        element[value] = val;
      }
      return element;
    });
    listOfArtistsSET(newList)
  };

  const addNewTrack = (obj) => {
    listOfTracksSET(obj)
  }

  const removeTrack = (index) => {
    if (listOfTracks.length === 1) return false;

    const newList = listOfTracks.filter((element, i) => {
      if (index === i) {
        return false;
      } else {
        if (i < index) {
          return element;
        } else {
          element.order = element.order - 1;
          return element;
        }
      }
    });
    listOfTracksSET(newList)
  }

  const manageTrackData = (index, key, value) => {
    const newList = listOfTracks.map((element, i) => {
      if (index === i) {
        element[key] = value;
      }
      return element;
    });
    listOfTracksSET(newList)
  };

  const manageTrackDataFile = async (index, key, value, file_key) => {
    const validateRow = await checkTrackValidation(value);

    // show track error
    if (!validateRow.valid) {
      document.getElementById(`track_${file_key}`).value = "";
      document.getElementById(`err_track_file_${file_key}`).style.display = "block";
      document.getElementById(`err_track_file_${file_key}`).innerText =
        validateRow.message;
    } else {
      document.getElementById(`err_track_file_${file_key}`).style.display = "none";
      // add file to list
      const uploadResponse = await uploadS3(value,token, file_key);

      listOfTracksDetailsSET(stateRef.current.concat([{
        URL: uploadResponse,
        duration: validateRow.meta.duration,
        key: file_key
      }]));
    }
  };

  const manageDropboxTrackDataFile = async (url, file_key) => {
    listOfTracksDetailsSET(stateRef.current.concat([{
      URL: url,
      duration: 0,
      key: file_key
    }]));
  };


  const originalCalendarToggle = () => {
    originalOpenCalendarSET(!originalOpenCalendar);
  }

  const officialCalendarToggle = () => {
    officialOpenCalendarSET(!officialOpenCalendar);
  }

  const trackOrderChange = (type, key, index, order, statename, setStateName) => {
    // const list = this.state[statename];
    const current = { key: key, index: index, order: order };
    let sibling;

    if (type === "up") {
      if (index === 0) {
        return false
      } else {
        sibling = {
          key: statename[index - 1].key,
          index: index - 1,
          order: statename[index - 1].order
        };
      }
    } else if (type === "down") {
      if (index + 1 === statename.length) {
        return false
      } else {
        sibling = {
          key: statename[index + 1].key,
          index: index + 1,
          order: statename[index + 1].order
        };
      }
    }

    const newList = statename.map((element, i) => {
      if (element.key === current.key) {
        element.order = sibling.order;
      }
      if (element.key === sibling.key) {
        element.order = current.order;
      }
      return element;
    });

    // this.setState({ [statename]: newList.sort((a, b) => a.order - b.order) });
    setStateName(newList.sort((a, b) => a.order - b.order))
  }



  useEffect(() => {
    let currentID = window.location.pathname.split("/")[2];
    axios.get(`${API_URL}genres/`, options).then(res => {
      genresSET(res.data);
    });
    axios.get(`${API_URL}labels/`, options).then(res => {
      labelsSET(res.data);
    });
    axios.get(`${API_URL}artists/`, options).then(res => {
      artistsSET(res.data);
    });
    axios.get(`${API_URL}releases/${currentID}/`, options)
      .then(res => {
        const getDataCountry = (c) => {
          return c.map(i => {

            const item = CountriesJSON.filter(ii => ii.value === i);

            return item.length > 0 ? item[0] : [];
          });
        }

        selectedTerritoriesSET(getDataCountry(res.data.countries));
        initialDataSET(res.data);

        let resQCFeedback  = res.data.qc_feedback;
        let resQCPassed = res.data.qc_passed;
        let resHasQCFeedback = !resQCPassed && resQCFeedback.results && Object.keys(resQCFeedback.results).length !== 0;
        if (resHasQCFeedback) {
          qcFeedbackSET(resQCFeedback.results.release_level);
          hasQCFeedbackSET(resHasQCFeedback);
        }

        if(res.data.sub_user)
        {
          subUserIdSET(res.data.sub_user);
          setSubUserEndpoint(`sub-user/${res.data.sub_user}/`);
          setParentUserOnly('');
        }

      })
  }, [])

  const optionsLabels = labels
      ? labels.results.map(i => ({ value: i.id, label: i.name }))
      : [{ value: null, label: "Select..." }];

    const optionsArtists = artists
      ? artists.results.map(i => ({ value: i.id, label: i.name }))
      : [{ value: null, label: "Select..." }];

    const optionsGenres = genres
      ? genres.results
          .sort((a, b) => a.name.localeCompare(b.name, 'en'))
          .map(i => ({ value: i.id, label: i.name }))
      : [{ value: null, label: "Select..." }];

  
    const optionSubGenres = selectedGenre
      ? genres.results
          .filter(i => i.name === selectedGenre)[0]
          .subgenres
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(i => ({ value: i.id, label: i.name }))
      : [{ value: null, label: "Select..." }];

      
    const optionsTerritories = [
      { value: "worldwide", label: "Worldwide" },
      { value: "select", label: "Only selected countries" },
      { value: "deselect", label: "All except selected countries" }
    ];

    let selectedPlaceholder = optionsTerritories.filter( i => i.value === initialData.territory)[0] || [];


    const exclusiveStoreRelaseOptions = [
      { value: undefined, label: "No exclusive" },
      { value: 4, label: "Beatport 2 weeks" },
      { value: 3, label: "Beatport 4 weeks" },
      { value: 14, label: "Pre-order 1 weeks" },
      { value: 11, label: "Pre-order 2 weeks" },
      { value: 5, label: "Traxsource 2 weeks" }
    ];
    let selecetedExclusive = exclusiveStoreRelaseOptions.filter( i => i.value === initialData.exclusive_shop)[0] || [];

    const isNewReleaseOptions = [
      { value: 1, label: "Yes" },
      { value: 0, label: "No" },
    ];

    const artistProps = {
      listOfArtists,
      optionsArtists,
      setNewArtist: () => false,
      addNewArtist,
      removeArtist,
      manageArtistData,
      trackOrderChange,
      listOfArtistsSET,
      subUserId,
      subUserEndpoint,
      parentUserOnly
    };
    const trackProps = {
      listOfTracks,
      manageTrackData,
      removeTrack,
      addNewTrack,
      manageTrackDataFile,
      trackOrderChange,
      listOfTracksSET,
      manageDropboxTrackDataFile,
    };


  return (
    <>
      <Card>
        <CardBody className="errorCont">
          <Row>
            <Col>
              <CardTitle tag="h4">View Release</CardTitle>
            </Col>
          </Row>
          <Form id="releaseForm">
            <FormGroup>
              <Label>Release Name</Label>
              <Input type="text" name="releaseName" id="releaseName" defaultValue={initialData.name} disabled={true}/>
              { (hasQCFeedback && qcFeedback["name"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["name"]} /> }
              <FormText color="muted">
                Please do not use release name additions such as LP and EP.
              </FormText>
            </FormGroup>

            <FormGroup>
              <Label>Release Version</Label>
              <Input
                id="releaseVersion"
                name="releaseVersion"
                type="text"
                defaultValue={initialData.release_version}
                disabled={true}
                placeholder="Leave blank if you are not sure or if this is a regular release"
              />
              { (hasQCFeedback && qcFeedback["release_version"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["release_version"]} /> }
              <FormText color="muted">
                Some releases are released in more than one version, if so
                please enter the version name. If your release is
                original/standard release please ignore this field.
              </FormText>
            </FormGroup>

            <FormGroup>
              <Label>Release Name Language</Label>
              <Select
                components={{ IndicatorSeparator:() => null }}
                options={Langs}
                id="releaseLanguage"
                name="releaseLanguage"
                onChange={(e) => false}
                value={ initialData.language ? {value: initialData.language, label: Langs.map(function(i) {
                  if (i.value.toUpperCase() === initialData.language) {
                    return i.label;
                  } else return null;
                })}  : null}
                isDisabled={true}
              />
              { (hasQCFeedback && qcFeedback["language"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["language"]} /> }
              <input id="selectedLang" className="hiddenInput" type="text" value={language} onChange={() =>false} disabled={true}/>
              <FormText color="muted">
                In which language is the release name written? Please double
                check it if you are not sure. If this input is wrong, some
                stores like iTunes and Apple Music will reject the release.
              </FormText>
              <FormGroup check inline>
                <Label check>
                  <CustomInput
                    type="checkbox"
                    id="autoDetectLanguage"
                    name="autoDetectLanguage"
                    checked={initialData.auto_detect_language}
                    disabled={true}
                    onChange={(e) => false}
                  />{" "}
                  Auto Detect (Language)
                </Label>
              </FormGroup>
            </FormGroup>

            <FormGroup>
              <Label>Label</Label>
              <Select
                components={{ IndicatorSeparator:() => null }}
                options={optionsLabels}
                id="releaseLabel"
                name="releaseLabel"
                isDisabled={true}
                onChange={() => false}
                value={ initialData.label ? { value: initialData.label.id, label: initialData.label.name} : null}
              />
            </FormGroup>
              {
                initialData.artists && <>
                  <ArtistRow values={artistProps} disabled={true} dataView={initialData.artists}/>
                  { (hasQCFeedback && qcFeedback["artists"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["artists"]} /> }
                </> 
              }
            {successAddedNew && (
              <Alert color="success">New Artist has been added!</Alert>
            )}

            <Row>
              <Col>
                <FormGroup>
                  <Label>Copyright ©</Label>
                  <Input
                    type="text"
                    id="releaseCopyright"
                    name="releaseCopyright"
                    placeholder="Usually your label name"
                    defaultValue={initialData.copyright_holder}
                    disabled={true}
                  />
                  { (hasQCFeedback && qcFeedback["c_line_text"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["c_line_text"]} /> }
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Copyright © Year</Label>
                  <Input
                    type="number"
                    id="releaseCopyrightYear"
                    name="releaseCopyrightYear"
                    maxLength="4"
                    placeholder="YYYY"
                    defaultValue={initialData.copyright_holder_year}
                    disabled={true}
                  />
                  { (hasQCFeedback && qcFeedback["c_line_year"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["c_line_year"]} /> }
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Copyright ℗</Label>
                  <Input
                    type="text"
                    id="releaseCopyrightPublisher"
                    name="releaseCopyrightPublisher"
                    placeholder="Usually your label name"
                    defaultValue={initialData.publisher}
                    disabled={true}
                  />
                  { (hasQCFeedback && qcFeedback["p_line_text"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["p_line_text"]} /> }
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Copyright ℗ Year</Label>
                  <Input
                    type="number"
                    id="releaseCopyrightYearPublisher"
                    name="releaseCopyrightYearPublisher"
                    maxLength="4"
                    placeholder="YYYY"
                    defaultValue={initialData.publisher_year}
                    disabled={true}
                  />
                  { (hasQCFeedback && qcFeedback["p_line_year"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["p_line_year"]} /> }
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Genre</Label>
                  <Select
                    components={{ IndicatorSeparator:() => null }}
                    options={optionsGenres}
                    styles={{ menu: styles => ({ ...styles, zIndex: 10 }) }}
                    onChange={e => false}
                    isDisabled={true}
                    id="releaseGenre"
                    name="releaseGenre"
                    value={ initialData.genre ? {value: initialData.genre, label: genres.results.filter(i => i.id === initialData.genre)[0].name} : null}
                  />
                  { (hasQCFeedback && qcFeedback["main_genre"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["main_genre"]} /> }
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Sub-Genre</Label>
                  <Select
                    components={{ IndicatorSeparator:() => null }}
                    options={optionSubGenres}
                    styles={{ menu: styles => ({ ...styles, zIndex: 10 }) }}
                    id="releaseSubGenre"
                    name="releaseSubGenre"
                    isDisabled={true}
                    onChange={() => false}
                    value={ initialData.subgenre ? {value: initialData.subgenre, label: genres.results.filter(i => i.id === initialData.genre)[0].subgenres.filter(i => i.id === initialData.subgenre)[0].name} : null}
                  />
                  { (hasQCFeedback && qcFeedback["main_subgenre"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["main_subgenre"]} /> }
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label>Catalog Number</Label>
              <Input
                type="text"
                id="releaseCatalogNumber"
                name="releaseCatalogNumber"
                disabled={true}
                defaultValue={initialData.catalogue_number}
              />
              { (hasQCFeedback && qcFeedback["catalog_number"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["catalog_number"]} /> }
              <FormText color="muted">
                Insert your catalog number. Usually labels insert label name
                abbreviation and a number. I.e MMD001, MMD002...
              </FormText>
            </FormGroup>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Release Description</Label>
                  <Input
                    type="textarea"
                    id="releaseDescription"
                    name="releaseDescription"
                    disabled={true}
                    placeholder="A few words about your release. No links and e-email adresses please. 600 characters max"
                    defaultValue={initialData.notes}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Artwork</Label>
                  <CustomInput
                    type="file"
                    id="releaseArtwork"
                    name="releaseArtwork"
                    disabled={true}
                    onChange={(e) => false}
                    accept=".jpeg,.jpg"
                  />
                  {initialData && initialData.artwork &&
                    <img
                      src={initialData.artwork.thumb_medium}
                      style={{ width: "300px", padding: "10px 0" }}
                      alt={"Your artwork"}
                    />
                  }
                  { (hasQCFeedback && qcFeedback["cover_art"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["cover_art"]} /> }
                  <FormText color="muted">
                    Upload JPG formats, resolution only 3000x3000 px, @ 72
                    dpi
                  </FormText>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Is This A New Release?</Label>
                  <Select
                    components={{ IndicatorSeparator:() => null }}
                    id="isNewRelease"
                    name="isNewRelease"
                    value={initialData.is_new_release? {value: initialData.is_new_release, label: isNewReleaseOptions.find(i => i.value === initialData.is_new_release).label}: null}
                    options={isNewReleaseOptions}
                    isDisabled={true}
                  />
                </FormGroup>
              </Col>
            </Row>
            
            {
              initialData.is_new_release &&
              <Row>
                <Col>
                  <FormGroup>
                    <Label>Original release date</Label>
                    <Input
                      type="text"
                      id="originalReleaseDate"
                      name="originalReleaseDate"
                      placeholder="Select date..."
                      disabled={true}
                      value={
                        initialData.official_date
                          ? formatDate(initialData.official_date)
                          : ''
                      }
                      readOnly={true}
                      className="pseudoSelectCalendar"
                      onClick={originalCalendarToggle}
                      onChange={e => console.log('')}
                    />
                    { (hasQCFeedback && qcFeedback["original_release_date"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["original_release_date"]} /> }
                    <FormText color="muted">
                      Official release date for all shops worldwide.
                    </FormText>
                  </FormGroup>
                </Col>
              </Row>
            }

            <Row>
              <Col>
                <FormGroup>
                  <Label>Official release date</Label>
                  <Input
                    type="text"
                    id="officialReleaseDate"
                    name="officialReleaseDate"
                    placeholder="Select date..."
                    disabled={true}
                    value={
                      initialData.official_date
                        ? formatDate(initialData.official_date)
                        : ''
                    }
                    readOnly={true}
                    className="pseudoSelectCalendar"
                    onClick={officialCalendarToggle}
                    onChange={e => console.log('')}
                  />
                  { (hasQCFeedback && qcFeedback["consumer_release_date"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["consumer_release_date"]} /> }
                  <FormText color="muted">
                    Official release date for all shops worldwide.
                  </FormText>
                </FormGroup>
              </Col>
            </Row>

            <Row style={{ paddingBottom: 20 }}>
              <Col>
                <FormGroup check inline>
                  <Label check>
                    <CustomInput
                      type="checkbox"
                      id="backcatalog"
                      name="backcatalog"
                      checked={backcatalog}
                      onChange={(e) =>
                        backcatalogSET(!backcatalog)
                      }
                      disabled={true}
                    />{" "}
                    Backcatalog
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check>
                    <CustomInput
                      type="checkbox"
                      id="assistedDates"
                      checked={true}
                      disabled={true}
                      onChange={() => false}
                    />{" "}
                    Assisted Dates
                  </Label>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Exclusive store release date</Label>
                  {
                    selectedPlaceholder.length === 0 ?
                    <Select
                      components={{ IndicatorSeparator:() => null }}
                      options={optionsTerritories}
                      id="releaseExclusiveDate"
                      name="releaseExclusiveDate"
                      isDisabled={true}
                      onChange={() => false}
                    />
                  :
                    <Select
                      components={{ IndicatorSeparator:() => null }}
                      options={optionsTerritories}
                      id="releaseExclusiveDate"
                      name="releaseExclusiveDate"
                      isDisabled={true}
                      onChange={() => false}
                      value={ {label: selecetedExclusive.label, value: selecetedExclusive.value}}
                    />
                  }
                </FormGroup>
              </Col>
            </Row>


            <Row style={{ paddingBottom: "10px" }}>
              <Col>
                <FormGroup>
                  <Label>Territories</Label>

                  {
                    selectedPlaceholder.length === 0 ?
                    <Select
                      components={{ IndicatorSeparator:() => null }}
                      options={optionsTerritories}
                      id="releaseLabel"
                      name="releaseLabel"
                      isDisabled={true}
                      onChange={() => false}
                    />
                  :
                    <Select
                      components={{ IndicatorSeparator:() => null }}
                      options={optionsTerritories}
                      id="releaseLabel"
                      name="releaseLabel"
                      isDisabled={true}
                      onChange={() => false}
                      value={ {label: selectedPlaceholder.label, value: selectedPlaceholder.value}}
                    />
                  }
                  { (hasQCFeedback && qcFeedback["territories"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["territories"]} /> }
                </FormGroup>
              </Col>
            </Row>

            <Row style={{ paddingBottom: 20 }}>
              <Col>
                  <Label>Countries</Label>
                  <CountriesSelect selected={selectedTerritories} setSelected={selectedTerritoriesSET} disabled={false} readOnly={true}/>
                </Col>
            </Row>

            <FormGroup>
              <Label>EAN / UPC</Label>
              <Input
                type="text"
                id="releaseEAN_UPC"
                name="releaseEAN_UPC"
                placeholder="Leave blank if you are not sure!"
                className="input-reset"
                onChange={e => false}
                defaultValue={initialData.ean}
                disabled={true}
              />
              <FormText color="muted">
                The Universal Product Code or European Article Number for the
                release. Valid ​codes are 13 digits number. If you don' t have
                your own, we will generate one for you.
              </FormText>

              <FormGroup check inline>
                <Label check>
                  <CustomInput
                    type="checkbox"
                    id="autoEAN"
                    name="autoEAN"
                    checked={false}
                    disabled={true}
                    onChange={(e) => false}
                  />{" "}
                  Auto generate (ean)
                </Label>
              </FormGroup>
            </FormGroup>
            {
              initialData.tracks && <TrackRow
              values={trackProps}
              dataView={initialData.tracks}
              disabled={true}
              id="releaseTracks"
              name="releaseTracks"
            />
            }

            <Button id="releaseSubmitBTN" color="success" disabled={true}>
              Submit Form
            </Button>
          </Form>
        </CardBody>
      </Card>
    </>
  );


}
export default ReleaseForm;
