import React, { useState, useContext, useRef, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import AsyncDropdownFeedback from "../../components/asyncDropdownFeedback";
import { Redirect } from "react-router-dom";

import {
  Badge,
  Col,
  Row,
  Form,
  FormGroup,
  Label,
  Collapse,
  CustomInput,
  Input,
  FormText,
  Button,
  Card,
  CardBody,
  CardTitle,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

import ReleaseCalendar from "./ReleaseCalendar";
import TransferArtistRow from "./transferArtistRow";
import TransferTrackRow from "./transferTrackRow";
import CountriesSelect from "../../components/countriesSelect";

import formValidation from "../../validations/es6/core/Core";
import { getCookie } from "../../jwt/_helpers/cookie";
import { opt } from "./transferReleaseValidationOpt";
import { StateContext } from "../../utils/context";
import { getUser } from "../../utils/getUser";

import LoaderInner from "../../components/LoaderInner"
import DropboxChooser from "../../components/dropboxChooser";

import { checkTrackValidation, checkDropboxTrackFileValidation, checkDropboxReleaseArtworkFileValidation, uploadS3, releaseArtworkUpload, getElByKey, checkTrackURL, checkCatalogNumber, checkCatalogNumberReturn } from "./helperFunctions";

import "./releaseForm.css";

import Langs from "../../utils/languages.json";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

let mmdDeezerGenresDict = {
  'African Music': 'World',
  'Afro Pop': 'World',
  'Arabic Music': 'World',
  'Asian Music': 'World',
  'Chinese Pop': 'Pop',
  'Indonesian Pop': 'Pop',
  'J-Pop': 'Pop',
  'K-Pop': 'Pop',
  'Malaysian Pop': 'Pop',
  'Thai Country': 'Country',
  'Thai Pop': 'Pop',
  'Flamenco': 'Latin',
  'Schlager & Volksmusik': 'Pop',
  'Turkish Folk Music': 'Country',
  'French Chanson': 'Pop',
  'Folklore Latino-américain': 'Country',
  'Traditional Mexicano': 'Country',
  'Salsa': 'SALSA',
  'Cumbia': 'Pop',
  'Tango': 'Latin',
  'Brazilian Music': 'World',
  'Samba/Pagode': 'Latin',
  'Sertanejo': 'Latin',
  'Indian Music': 'World',
  'Country': 'Country',
  'Alternative': 'Alternative',
  'Indie Pop': 'Alternative',
  'Indie Rock': 'Alternative',
  'Thai Indie': 'Alternative',
  'Indé Finlandaise': 'Alternative',
  'Estonian Indie': 'Alternative',
  'Latin Alternative': 'Latin',
  'Alternative Brazil': 'Alternative',
  'Classical': 'Classical',
  'Baroque': 'Classical',
  'Classical Period': 'Classical',
  'Early Music': 'Classical',
  'Modern': 'Classical',
  'Opera': 'Opera',
  'Renaissance': 'Classical',
  'Romantic': 'Classical',
  'Electro': 'Dance',
  'Chill Out/Trip-Hop/Lounge': 'Dance',
  'Dubstep': 'Dance',
  'Electro Hip Hop': 'Hip Hop/Rap',
  'Electro Pop/Electro Rock': 'Dance',
  'Techno/House': 'Dance',
  'South African House': 'Dance',
  'Dance': 'Dance',
  'Dancefloor': 'Dance',
  'Trance': 'Dance',
  'Rap/Hip Hop': 'Hip Hop/Rap',
  'German Rap': 'Hip Hop/Rap',
  'Reggaeton': 'Hip Hop/Rap',
  'Russian Rap': 'Hip Hop/Rap',
  'Finnish Rap': 'Hip Hop/Rap',
  'French Rap': 'Hip Hop/Rap',
  'Jazz': 'Jazz',
  'Instrumental Jazz': 'Jazz',
  'Vocal Jazz': 'Jazz',
  'Pop': 'Pop',
  'Indie Pop/Folk': 'Alternative',
  'International Pop': 'Pop',
  'Russian Pop': 'Pop',
  'Pop finlandaise': 'Pop',
  'Turkish Pop': 'Pop',
  'Latin Pop': 'Pop',
  'Hungarian Pop-Rock': 'Pop',
  'Pop française': 'Pop',
  'Reggae': 'Reggae',
  'Dancehall/Ragga': 'Alternative',
  'Dub': 'Alternative',
  'Ska': 'Alternative',
  'Finnish Reggae': 'Reggae',
  'Mauritian Reggae': 'Reggae',
  'Rock': 'Rock',
  'Blues': 'Blues',
  'Indie Rock/Rock Pop': 'Alternative',
  'Hard Rock': 'Rock',
  'Rock & Roll/Rockabilly': 'Rock',
  'Finnish Metal': 'Rock',
  'Russian Rock': 'Rock',
  'Turkish Rock': 'Rock',
  'Latin Rock': 'Rock',
  'Brazil Rock': 'Rock',
  'Finnish Rock': 'Rock',
  'Rock français': 'Rock',
  'R&B': 'R&B/Soul',
  'Contemporary R&B': 'R&B/Soul',
  'Contemporary Soul': 'R&B/Soul',
  'Disco': 'R&B/Soul',
  'Soul & Funk': 'R&B/Soul',
  'Oldschool R&B': 'R&B/Soul',
  'Old school soul': 'R&B/Soul',
  'Bollywood': 'World',
  'Acoustic Blues': 'Blues',
  'Chicago Blues': 'Blues',
  'Classic Blues': 'Blues',
  'Country Blues': 'Blues',
  'Delta Blues': 'Blues',
  'Electric Blues': 'Blues',
  'Gospel': 'Blues',
  'Christian Pop': 'Pop',
  'Christian Rap': 'Hip Hop/Rap',
  'Christian Rock': 'Rock',
  'Alternative Country': 'Country',
  'Bluegrass': 'Country',
  'Honky Tonk': 'Country',
  'Traditional Country': 'Country',
  'Urban Cowboy': 'Country',
  'Latin Music': 'Latin',
  'East Coast': 'Hip Hop/Rap',
  'West Coast': 'Hip Hop/Rap',
  'Old School': 'Hip Hop/Rap',
  'Jazz Hip Hop': 'Hip Hop/Rap',
  'German Music': 'Pop',
  'Metal': 'Rock',
  'Folk': 'Country',
  'Brazilian Rap/Funk': 'Hip Hop/Rap',
  'World': 'World',
  'Salsa Choke': 'Latin',
  'Flamenco Pop': 'Latin',
  'Singer & Songwriter': 'Pop',
  'Tropical': 'Latin',
  'Soul': 'R&B/Soul',
};

function formatDate(date) {
  let d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  let year = d.getFullYear();

  if (month.length < 2)
    month = '0' + month;
  if (day.length < 2)
    day = '0' + day;

  return [year, month, day].join('-');
}

function getReleaseYear(date) {
  let d = new Date(date);
  return d.getFullYear();
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

const toHHmmSS = (SECONDS) => new Date(SECONDS * 1000).toISOString().substr(11, 8);

const excludedFields = [
  "releaseName",
  "releaseVersion",
  "releaseArtwork",
  "releaseCatalogNumber",
  "releaseCopyrightPublisher",
  "releaseCopyrightYearPublisher",
  "releaseCopyright",
  "releaseCopyrightYear",
]

const mixNameReg = /^[^\{\}\[\]\(\)]*$/;

const trackNameValidators = {
  validators: {
    notEmpty: {
      message: "Please type track name"
    },
  }
};

const trackMixNameValidators = {
  validators: {
    notEmpty: {
      message: "Please type mix name"
    },
    regexp: {
      regexp: mixNameReg,
      message: "The mix name can only consist of alphabetical, number, space and underscore",
    },
  }
};


const artistTypeValidators = {
  validators: {
    notEmpty: {
      message: "Please select artist type"
    },
  }
}

const TransferReleaseForm = ({releaseData}) => {
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
  const tracksDetailsREF = useRef();
  const tracksListREF = useRef();
  const formErrRef = useRef();
  const artworkFileRef = useRef();
  const fvRef = useRef();
  const validationFieldsAddedRef = useRef(false);
  const {currentUser, setCurrentUser} = useContext(StateContext);
  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');
  const [subUser, setSubUser] = useState('');
  const [subUserId, setSubUserId] = useState(null);
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  const [listOfArtists, listOfArtistsSET] = useState(releaseData.artists);
  const [listOfTracks, listOfTracksSET] = useState(releaseData.tracks);
  const [listOfTracksDetails, listOfTracksDetailsSET] = useState([])
  const [loadingGenres, loadingGenresSET] = useState(true);
  const [selectedGenre, selectedGenreSET] = useState(null);
  const [selectedSubGenre, selectedSubGenreSET] = useState(null);
  const [language, languageSET] = useState('');
  const [autoDetectLanguage, autoDetectLanguageSET] = useState(true);
  const [genres, genresSET] = useState(null);
  const [selectedTerritory, selectedTerritorySET] = useState({value:"worldwide", label:"Worldwide"});
  const [selectedTerritories, selectedTerritoriesSET] = useState([]);
  const [artwork, artworkSET] = useState(null);
  const [artworkURL, artworkURLSET] = useState(null);
  const [successAddedNew, successAddedNewSET] = useState(false);
  const [eanNumber, eanNumberSET] = useState([{ valid: true }]);

  const [isNewRelease, isNewReleaseSET] = useState({ value: 0, label: "No" });
  const [exclusiveStoreReleaseDate, exclusiveStoreReleaseDateSET] = useState({ value: undefined, label: "No exclusive" });
  const [officialReleaseDate, officialReleaseDateSET] = useState(releaseData.releaseDate);
  const [originalReleaseDate, originalReleaseDateSET] = useState(releaseData.releaseDate);
  const [originalOpenCalendar, originalOpenCalendarSET] = useState(false);
  const [officialOpenCalendar, officialOpenCalendarSET] = useState(false);
  const [originalOpenCalendarError, originalOpenCalendarErrorSET] = useState(false);
  const [officialOpenCalendarError, officialOpenCalendarErrorSET] = useState(false);

  const [backcatalog, backcatalogSET] = useState(true);
  const [asisstedDates, asisstedDatesSET] = useState(true);
  const [modalAssistedDays, modalAssistedDaysSET] = useState(false);
  const [isWorldWide, isWorldWideSET] = useState(true);

  const [labelSelected, labelSelectedSET] = useState('');
  const [atleastOneCountrySelected, atleastOneCountrySelectedSET] = useState('');

  const [limitText, setLimitText] = useState(false);
  const [duplicatedCatNumber, setDuplicatedNumber] = useState(null);
  const [duplicatedCatNumberError, setDuplicateError] = useState(null);
  const [formError, setFormError] = useState(false);
  const [artworkFileError, setArtworkFileError] = useState(false);
  const [trackFileError, setTrackFileError] = useState(false);

  const [addedReleaseModal, addedReleaseModalSET] = useState(false);
  const [declarationModal, declarationModalSET] = useState(false);
  const [redirectTracks, redirectTracksSET] = useState(false);
  const [newReleaseID, setNewReleaseId] = useState(0);
  const [releaseDataObject, releaseDataObjectSET] = useState(null);
  const [metdataCollapsed, setMetadataCollapsed] = useState(false);

  const [isFVReady, setFVReady] = useState(false);

  const [isGenreValid, isGenreValidSET] = useState(true);
  const [isSubGenreValid, isSubGenreValidSET] = useState(true);
  const [isLabelValid, isLabelValidSET] = useState(false);
  const [isTerritoriesValid, isTerritoriesValidSET] = useState(false);
  
  const [labelFieldTouched, labelFieldTouchedSET] = useState(false);
  const [subuserFieldTouched, subuserFieldTouchedSET] = useState(false);
  const [genreFieldTouched, genreFieldTouchedSET] = useState(false);
  const [subGenreFieldTouched, subGenreFieldTouchedSET] = useState(false);
  const [newReleaseFieldTouched, newReleaseFieldTouchedSET] = useState(false);
  const [esrdFieldTouched, esrdFieldTouchedSET] = useState(false);
  const [territoriesFieldTouched, territoriesFieldTouchedSET] = useState(false);
  const [submitInProgress, submitInProgressSET] = useState(false);

  const [artistsCreatedInMMD, artistsCreatedInMMDSET] = useState(false);
  const [mmdArtistsList, mmdArtistsListSET] = useState([]);

  const releaseYear = getReleaseYear(officialReleaseDate);
  const deezerReleaseGenre = releaseData.genre;
  const allArtists = [...new Map(releaseData.allArtists.map(artist =>[artist["name"], artist])).values()];

  tracksDetailsREF.current = listOfTracksDetails;
  tracksListREF.current = listOfTracks;
  formErrRef.current = formError;

  const releaseVersionMissingOneValidator = function() {
    return {
      validate: function(input) {
        const tracks = listOfTracks;
        const validCondition = !(tracks.length === 1 && tracks[0].track_mix_name.length >= 1 && tracks[0].track_mix_name !== input.value);
        return {
          valid: validCondition
        };
      }
    };
  };

  const releaseVersionInvalidValidator = function() {
    return {
      validate: function(input) {
        const tracks = listOfTracks;
        const validCondition = !(tracks.length === 1 && input.value.length >= 1 && tracks[0].track_mix_name.length <= 0);
        return {
          valid: validCondition
        };
      }
    };
  };

  const releaseVersionMissingTwoValidator = function() {
    return {
      validate: function(input) {
        const remixTracks = listOfTracks.filter(i => i.track_mix_name.length >= 1).length;
        const allTracksRemix = remixTracks > 0 && remixTracks === listOfTracks.length;
        const validCondition = !(allTracksRemix && input.value.length <= 0);
        return {
          valid: validCondition
        };
      }
    };
  };

  const addMixNameValidator = (fieldName) => {
    if(fvRef.current) {
      let fv = fvRef.current;
      fv.addField(fieldName, trackMixNameValidators).revalidateField(fieldName);
    }
  }

  const removeMixNameValidator = (fieldName) => {
    if(fvRef.current) {
      let fv = fvRef.current;
      fv.removeField(fieldName);
    }
  }

  const enableValidator = (fieldName, validatorToEnable) => {
    if(fvRef.current) {
      let fv = fvRef.current;
      fv.enableValidator(fieldName, validatorToEnable);
      fv.revalidateField(fieldName);
    }
  }

  const disableValidator = (fieldName, validatorToDisable) => {
    if(fvRef.current) {
      let fv = fvRef.current;
      fv.disableValidator(fieldName, validatorToDisable);
      fv.revalidateField(fieldName);
    }
  }

  const select = (event) => {
    if(selectedGenre && selectedGenre.label === event.label){
      return;
    }
    selectedGenreSET(event)
    selectedSubGenreSET(null);
  }

  const handleAutoDetectLanguage = (e) => {
    autoDetectLanguageSET(!autoDetectLanguage)
  }

  const clearArtworkFile = () => {
    disableValidator("releaseArtwork", "notEmpty");
    if(artworkFileRef.current) {
      artworkFileRef.current.value = "";
    }
  }

  const artworkChange = (event) => {
    setArtworkFileError(false);
    enableValidator("releaseArtwork", "notEmpty");
    if(document.getElementById("err_release_artwork_rawt").style.display === "block") {
      document.getElementById("err_release_artwork_rawt").style.display = "none";
    }
    document.getElementById(`uploadProgress_rawt`).style.width = '0%';
    document.getElementById(`uploadProgress_text_rawt`).innerHTML = '';
    if(event.target.files[0]) {
      artworkSET(URL.createObjectURL(event.target.files[0]));
    } else {
      artworkSET(null);
    }
  }

  const setNewArtist = () => {
    setSuccessArtist();
  }

  const setSuccessArtist = () => {
    successAddedNewSET(true)
    setTimeout(() => {
      successAddedNewSET(false)
    }, 5000);
  }

  const addNewArtist = (obj) => {
    listOfArtistsSET(obj);
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
    listOfArtistsSET(newList);
    if(fvRef.current) {
      let fv = fvRef.current;
      let indexToRemove = newList.length;
      fv.removeField('artist[' + indexToRemove + '].name').removeField('artist[' + indexToRemove + '].type');
    }
    revalidateField("atleastOneMainArtist");
  }


  const manageArtistData = (index, value, key) => {

    if (key) {
      const newList = listOfArtists.map((element, i) => {
        if (index === i) {
          element[value] = key
        }
        return element;
      });
      listOfArtistsSET(newList);
    } else {

      const newList = listOfArtists.map((element, i) => {
        if (index === i) {
          element[value] = '';
        }
        return element;
      });
      listOfArtistsSET(newList)
    }
  };

  const addNewTrack = (obj) => {
    listOfTracksSET(obj)
  }

  const removeTrack = (index) => {
    if (listOfTracks.length === 1) return false;
    setLimitText(null);

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

    const newDetailsList = listOfTracksDetails.filter((el, i) => {
      if (index === i) {
        return false;
      } else {
        return el;
      }
    })

    listOfTracksDetailsSET(newDetailsList);
    listOfTracksSET(newList);
    setTrackFileError(false);
  }

  const manageTrackData = (index, key, value) => {
    if(key === "track_mix_name" && fvRef.current) {
      let fv = fvRef.current;
      clearValidationErrors("releaseForm", "releaseVersion");
      fv.revalidateField("releaseVersion");
    }
    const newList = listOfTracks.map((element, i) => {
      if (index === i) {
        element[key] = value;
      }
      return element;
    });
    listOfTracksSET(newList);
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
      console.log('uploadResponse', uploadResponse)

      listOfTracksDetailsSET(tracksDetailsREF.current.concat([{
        URL: uploadResponse,
        duration: validateRow.meta.duration,
        key: file_key
      }]));
    }
  };

  const manageDropboxTrackDataFile = async (url, fileKey, fileLink, fileMetadata) => {
    setTrackFileError(false)
    const validateDropboxFile = checkDropboxTrackFileValidation(fileMetadata);

    if(!validateDropboxFile.valid)
    {
      setTrackFileError(true)
      document.getElementById(`track_${fileKey}`).value = "";
      document.getElementById(`err_track_file_${fileKey}`).style.display = "block";
      document.getElementById(`err_track_file_${fileKey}`).innerText = validateDropboxFile.message;
    } else {
      document.getElementById(`err_track_file_${fileKey}`).style.display = "none";

      listOfTracksDetailsSET(tracksDetailsREF.current.concat([{
        URL: url,
        duration: fileMetadata.duration,
        key: fileKey
      }]));
    }
  };

  const manageDropboxReleaseArtworkFileMetadataError = (metadataError, fileKey) => {
    if (metadataError) {
      setArtworkFileError(true)

      document.getElementById(`err_release_artwork_${fileKey}`).style.display = "block";
      document.getElementById(`err_release_artwork_${fileKey}`).innerText = "This file is invalid, please make sure to that image has .jpg extension, RGB Colours, 3000 X 3000 dimensions and upto 4MB.";
    } else {
      setArtworkFileError(false)
      document.getElementById(`err_release_artwork_${fileKey}`).style.display = "none";
    }
  }

  const manageDropboxTrackFileMetdataError = (metadataError, fileKey) => {
    if (metadataError) {
      setTrackFileError(true)
      document.getElementById(`track_${fileKey}`).value = "";
      document.getElementById(`err_track_file_${fileKey}`).style.display = "block";
      document.getElementById(`err_track_file_${fileKey}`).innerText = "This file is invalid, please make sure to properly encode your file in 16 bit, 44.1 Khz.";
    } else {
      setTrackFileError(false)
      document.getElementById(`err_track_file_${fileKey}`).style.display = "none";
    }
  }

  const manageDropboxReleaseArtworkFile = async (url, fileKey, fileLink, fileMetadata) => {
    artworkSET(null);
    artworkURLSET(null);
    setArtworkFileError(false);

    const validateDropboxReleaseArtworkFile = checkDropboxReleaseArtworkFileValidation(fileMetadata);

    if(!validateDropboxReleaseArtworkFile.valid)
    {
      setArtworkFileError(true);
      document.getElementById(`err_release_artwork_${fileKey}`).style.display = "block";
      document.getElementById(`err_release_artwork_${fileKey}`).innerText = validateDropboxReleaseArtworkFile.message;
    } else {
      document.getElementById(`err_release_artwork_${fileKey}`).style.display = "none";

      artworkURLSET(url);
      artworkSET(fileLink);
    }
  };

  const revalidateField = (name) => {
    if(fvRef.current) {
      let fv = fvRef.current;
      clearValidationErrors("releaseForm", name);
      fv.revalidateField(name);
    }
  }

  const clearValidationErrors = (formName, validatorName) => {
    let formID = document.getElementById(formName);
    if(formID) {
      const messages = [].slice.call(formID.querySelectorAll('[data-field="' + validatorName + '"][data-validator]'));
      messages.forEach((messageEle) => {
        messageEle.style.display = 'none';
      });
    }
  }

  const originalCalendarToggle = () => {
    originalOpenCalendarSET(!originalOpenCalendar);
  }
  const originalCalendarErrorToggle = (type) => {
    originalOpenCalendarErrorSET(type)
  }

  const officialCalendarToggle = () => {
    officialOpenCalendarSET(!officialOpenCalendar);
  }
  const officialCalendarErrorToggle = (type) => {
    officialOpenCalendarErrorSET(type)
  }

  const trackOrderChange = (type, key, index, order, statename, setStateName) => {
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

  const originalHandleDayClick = (day) => {
    originalCalendarErrorToggle(false);
    originalReleaseDateSET(day);
    revalidateField("originalReleaseDate");
  }

  const officialHandleDayClick = (day) => {
    officialCalendarErrorToggle(false);
    officialReleaseDateSET(day);
    revalidateField("officialReleaseDate");
  }

  const validateAuthorType = () => {
    let authorError = 0;
    const count = listOfArtists.filter(i => i.type !== '' && i.type.value === 'main').length;

    if (count === 0) {
      document.getElementById(`err_author_type`).style.display = 'block'
      return authorError += 1;
    } else {
      document.getElementById(`err_author_type`).style.display = 'none';
      return 0;
    }
  };

  const duplicatesState =  e => {
    setDuplicatedNumber(e)
    setDuplicateError(e ? true : false);
  }

  const matchArtists = (artistsList, mmdArtists) => {
    let matchedArtists = [];
    artistsList.map(artist => {
      let artistName = artist.name;
      let artistOrder = artist.order - 1;
      let artistKind = artist.type.value;
      let matchedMmdArtist = mmdArtists.filter(i => i.name === artistName)[0];
      matchedArtists.push({
        "order": artistOrder,
        "artist": matchedMmdArtist.id,
        "kind": artistKind,
      })
    });
    return matchedArtists;
  }

  useEffect(() => {
    if(!artistsCreatedInMMD)
    {
      const getOrCreateArtist = (artistData) => {
        return new Promise((resolve, reject) => {
          axios({
            method: "post",
            mode: 'cors',
            url: `${API_URL}artists/get-or-create-artist/`,
            data: artistData,
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key": X_API_KEY,
              "Content-Type": "application/json"
            }
          })
            .then(function(response) {
              if (response.status === 200) {
                resolve(response);
              } else {
                reject(new Error("Request failed"));
              }
            })
            .catch(error => {
              reject(error);
            });
        });
      };

      const getOrCreateArtists = async (artistsList) => {
        let results = [];
        for (const artist of artistsList) {
          let artistName = artist.name;
          let artistSpotifyID = artist.spotify_id;
          let artistDeezerID = artist.deezer_id;
          let artistData = {
            "name": artistName,
            ...(artistDeezerID!==null) && {"deezer_id": artistDeezerID},
            ...(artistSpotifyID!==null) && {"spotify_id": artistSpotifyID},
          };
          try {
            const response = await getOrCreateArtist(artistData)
            let artistRes = response.data;
            let artistID = artistRes.id;
            let formattedArtist = {
              "id": artistID,
              "name": artistName,
              "deezer_id": artistDeezerID,
              "spotify_id": artistSpotifyID,
            };
            results.push(formattedArtist);
          } catch (error) {
            continue;
          }
        }
        return results;
      };
      getOrCreateArtists(allArtists).then(mmdArtists => {
        mmdArtistsListSET(mmdArtists);
        artistsCreatedInMMDSET(true);
      });
    }
  }, [allArtists, artistsCreatedInMMD]);


  useEffect(() => {
    if (!isFVReady) return;
    
    if (fvRef.current && !validationFieldsAddedRef.current) {
      let fv = fvRef.current;
      listOfArtists.forEach((artist, indexToAdd) => {
        if (indexToAdd > 0) {
          fv.addField('artist[' + indexToAdd + '].type', artistTypeValidators)
            .revalidateField("atleastOneMainArtist");
        }
      });

      listOfTracks.forEach((track, indexToAdd) => {
        if (indexToAdd > 0) {
          fv.addField('track[' + indexToAdd + '].name', trackNameValidators);
        }
        if(track.track_mix_select === 1)
        {
          addMixNameValidator(`track[${indexToAdd}].mix_name`);
        }
      });

      validationFieldsAddedRef.current = true;
    }
}, [releaseData, listOfArtists, listOfTracks, isFVReady]);

  

  useEffect(() => {
    try {
      axios.post(`${API_URL}dropbox-upload/`, {"request_type": "warm-up"}, options);
    } catch (error) {
        console.error("Error during warm up:", error);
    }
  
    axios.get(`${API_URL}genres/`, options).then(res => {
      let genres = res.data;
      genresSET(res.data);
      if (genres && deezerReleaseGenre!==null) {
        let matchingMMDGenre = null;
        try {
          matchingMMDGenre = mmdDeezerGenresDict[deezerReleaseGenre];
        }
        catch {
          matchingMMDGenre = null;
        }
  
        if(matchingMMDGenre!==null)
        {
          let filteredGenre = genres.results.filter(i => i.name === matchingMMDGenre)[0];
          if(filteredGenre)
          {
            selectedGenreSET({label: filteredGenre.name, value: filteredGenre.id, subgenres: filteredGenre.subgenres});
          }
        }
      }
      loadingGenresSET(false)
    });
  }, []);

  useEffect(() => {
    if(!isWorldWide && selectedTerritories.length>0) {
      atleastOneCountrySelectedSET('yes');
    } else {
      atleastOneCountrySelectedSET('');
    }
    revalidateField("atleastOneCountrySelected")
  }, [isWorldWide, selectedTerritories])
  

  useEffect(() => {
    if(releaseDataObject!==null)
    {
      declarationModalSET(true);
    }
  }, [releaseDataObject]);

  useEffect(() => {
    if ( loadingGenres ) return undefined;

    let formID = document.getElementById("releaseForm");
    let fv = formValidation(formID, opt)
    fvRef.current = fv;
    setFVReady(true);
      
      fv.on("core.form.validating", function(e) {
        if(!subuserFieldTouched) {
          subuserFieldTouchedSET(true)
        }
        if(!genreFieldTouched) {
          genreFieldTouchedSET(true)
        }
        if(!subGenreFieldTouched) {
          subGenreFieldTouchedSET(true)
        }
        if(!newReleaseFieldTouched) {
          newReleaseFieldTouchedSET(true)
        }
        if(!labelFieldTouched) {
          labelFieldTouchedSET(true)
        }
        if(!esrdFieldTouched) {
          esrdFieldTouchedSET(true)
        }
        if(!newReleaseFieldTouched) {
          newReleaseFieldTouchedSET(true)
        }
        if(!territoriesFieldTouched) {
          territoriesFieldTouchedSET(true)
        }
        checkTrackURL(tracksListREF.current, tracksDetailsREF.current)
      })
      .on("core.element.validated", function(e) {
        const item = e.field;

        if(item === 'releaseGenre') {
          if(!e.valid) {
            isGenreValidSET(false)
          } else {
            isGenreValidSET(true)
          }
        }

        if(item === 'releaseLabel') {
          if(!e.valid) {
            isLabelValidSET(false)
          } else {
            isLabelValidSET(true)
          }
        }

        if(item === 'releaseSubGenre') {
          if(!e.valid) {
            isSubGenreValidSET(false)
          } else {
            isSubGenreValidSET(true)
          }
        }

        if(item === 'releaseTerritories') {
          if(!e.valid) {
            isTerritoriesValidSET(false)
          } else {
            isTerritoriesValidSET(true)
          }
        }

        if (item === 'releaseArtwork' && e.valid) {
          const file = e.element.files[0];
          if (file) {
            releaseArtworkUpload(file, token, currentUser.id).then(r => artworkURLSET(r))
          }
        }

        if (e.valid) {
          if (formErrRef.current){
            setFormError(false);
            const messages = [].slice.call(formID.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
            messages.forEach((messageEle) => {
              messageEle.style.display = 'none';
            });
            return;
          }
        } else {
          setFormError(true);
          submitInProgressSET(false);
          return;
        }
      })
      .on("core.field.invalid", function(e) {
        if (e) {
          setFormError(true);
          submitInProgressSET(false);
          return;
        }
      })
      .on("core.validator.validated",  e => {
        let isExcludedField = excludedFields.includes(e.field);
        if(!isExcludedField) {
          let offset = e.result.valid? 0: 1;
          const messages = [].slice.call(formID.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
          for(let i = 0; i < messages.length - offset; i++) {
            const messageEle = messages[i];
            messageEle.style.display = 'none';
          }
        }
      })
      .on("core.form.valid", async e => {

        if (!currentUser.unlimited_track_amount &&  (currentUser.total_allowed_track_amount < tracksListREF.current.length) ) {
          setLimitText(`Your current track limit is ${currentUser.total_allowed_track_amount} ${currentUser.total_allowed_track_amount > 1 ? "tracks.": "track."}  In order to upload more tracks please upgrade your account or contact our support team.`);
          submitInProgressSET(false);
          return false;
        }

        if(!mmdArtistsList) {
          if(submitInProgress) {
            submitInProgressSET(false);
          }
          return;
        }

        const matchedReleaseArtists = matchArtists(listOfArtists, mmdArtistsList);
       
        const validDetails = checkTrackURL(tracksListREF.current, tracksDetailsREF.current);

        const notValidCatNo = await checkCatalogNumberReturn(document.querySelector('[name="releaseCatalogNumber"]').value, token, (val) => duplicatesState(val)).then(r => r);

        if (validDetails !== 0 || duplicatedCatNumberError || notValidCatNo) {
          setFormError(true);
          submitInProgressSET(false);
          return false;
        }

        const formatedTracks = await tracksListREF.current.map(i => {
          const el = getElByKey(tracksDetailsREF.current, i.key)[0];
          const deezerID = i.deezer_id;
          const spotifyID = i.spotify_id;
          const trackArtists = i.artists;
          const matchedTrackArtists = matchArtists(trackArtists, mmdArtistsList);
          
          return ({
            "order": i.order - 1,
            ...(spotifyID!==null && {"spotify_id": spotifyID}),
            ...(deezerID!==null && {"deezer_id": deezerID}),
            "artists": matchedTrackArtists,
            "genre": formID.querySelector('[name="releaseGenre"]').value,
            "subgenre": formID.querySelector('[name="releaseSubGenre"]').value,
            "name": i.track_name,
            "mix_name": i.track_mix_name,
            "generate_isrc": i.generate_isrc,
            "ISRC": i.isrc,
            "resource": el.URL,
            "album_only": i.album_only,
            "track_lenght": toHHmmSS(el.duration)
          })
        });

        let kind;
        const trackCount = tracksListREF.current.length;
        const tracksDuration = await tracksDetailsREF.current.map(
          i => i.duration
        );
        const tracksLongerThan600 = tracksDuration.filter(i => i > 600).length;
        const tracksTotalTime = tracksDuration.reduce((a, b) => a + b);
        const variousArtists = listOfArtists.filter(
          i => i.name.label === "Various Artists"
        );

        if (
          trackCount <= 3 &&
          tracksLongerThan600 === 0 &&
          tracksTotalTime < 1800
        ) {
          kind = "single";
        } else if (
          trackCount <= 3 &&
          tracksLongerThan600 > 0 &&
          tracksTotalTime < 1800
        ) {
          kind = "EP";
        } else if (
          trackCount >= 4 &&
          trackCount <= 6 &&
          tracksLongerThan600 === 0 &&
          tracksTotalTime < 1800
        ) {
          kind = "EP";
        } else if (tracksTotalTime > 1800) {
          if (variousArtists.length > 0) {
            const isMain =
              variousArtists.filter(i => i.type.value === "main").length > 0
                ? true
                : false;
            if (isMain) {
              kind = "compilation";
            } else {
              kind = "album";
            }
          } else {
            kind = "album";
          }
        }

        const auto_detect_language = formID.querySelector('#autoDetectLanguage').checked;

        const dataObject = {
          "created_by": currentUser.id,
          "transferred": true,
          ...(releaseData.spotifyID!==null && {"spotify_id": releaseData.spotifyID}),
          ...(releaseData.deezerID!==null && {"deezer_id": releaseData.deezerID}),
          "name": formID.querySelector('[name="releaseName"]').value,
          "release_version": formID.querySelector('[name="releaseVersion"]').value,
          "auto_detect_language": auto_detect_language,
          ...(!auto_detect_language && { "language": formID.querySelector("#selectedLang").value || ''}),
          "label": labelSelected.value,
          "publisher": formID.querySelector('[name="releaseCopyrightPublisher"]').value,
          "publisher_year": formID.querySelector('[name="releaseCopyrightYearPublisher"]').value,
          "copyright_holder": formID.querySelector('[name="releaseCopyright"]').value,
          "copyright_holder_year": formID.querySelector('[name="releaseCopyrightYear"]').value,
          "genre": formID.querySelector('[name="releaseGenre"]').value,
          "subgenre": formID.querySelector('[name="releaseSubGenre"]').value,
          "kind": kind,
          "catalogue_number": formID.querySelector('[name="releaseCatalogNumber"]').value,
          "notes": formID.querySelector('[name="releaseDescription"]').value,
          "official_date": formID.querySelector('#officialReleaseDate').value,
          "is_new_release": formID.querySelector('[name="isNewRelease"]').value,
          "original_date": formID.querySelector('#originalReleaseDate').value,
          "exclusive_shop": formID.querySelector('[name="releaseExclusiveDate"]').value,
          "territory": formID.querySelector('[name="releaseTerritories"]').value,
          "countries": formID.querySelector('#selectedTerry').value.split('--'),
          "backcatalog":  formID.querySelector('#backcatalog').checked,
          "generate_ean": false,
          "ean": formID.querySelector('[name="releaseEAN_UPC"]').value,
          "artwork": formID.querySelector('#artworkURL').value,
          "artists": matchedReleaseArtists,
          "tracks": formatedTracks,
          ...(subUserId && { "sub_user_id": subUserId || null}),
        };

        releaseDataObjectSET(dataObject);
      })
      .on('core.form.invalid', function(event) {
        setFormError(true);
        submitInProgressSET(false);
      });

      fv.registerValidator('releaseVersionMissingOne', releaseVersionMissingOneValidator);
      fv.registerValidator('releaseVersionInvalid', releaseVersionInvalidValidator);
      fv.registerValidator('releaseVersionMissingTwo', releaseVersionMissingTwoValidator);
  }, [loadingGenres, originalReleaseDate, officialReleaseDate, isNewRelease, artworkURL, listOfArtists, listOfTracks, selectedTerritories, labelSelected, duplicatedCatNumber, duplicatedCatNumberError, formErrRef, artworkFileError, trackFileError, subUserId, submitInProgress])


    const optionsGenres = genres
      ? genres.results
        .sort((a, b) => a.name.localeCompare(b.name, 'en'))
        .map(i => ({ value: i.id, label: i.name }))
      : [{ value: null, label: "Select..." }];

    const optionSubGenres = selectedGenre
    ? genres.results
        .filter(i => i.name === selectedGenre.label)[0]
        .subgenres
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(i => ({ value: i.id, label: i.name }))
    : [{ value: null, label: "Select..." }];

    const optionsTerritories = [
      { value: "worldwide", label: "Worldwide" },
      { value: "select", label: "Only selected countries" },
      { value: "deselect", label: "All except selected countries" }
    ];

    const exclusiveStoreRelaseOptions = [
      { value: undefined, label: "No exclusive" },
      { value: 4, label: "Beatport 2 weeks" },
      { value: 3, label: "Beatport 4 weeks" },
      { value: 14, label: "Pre-order 1 weeks" },
      { value: 11, label: "Pre-order 2 weeks" },
      { value: 5, label: "Traxsource 2 weeks" }
    ];

    const isNewReleaseOptions = [
      { value: 1, label: "Yes", isDisabled: true },
      { value: 0, label: "No" },
    ];

    const artistProps = {
      listOfArtists,
      // optionsArtists,
      setNewArtist,
      addNewArtist,
      removeArtist,
      manageArtistData,
      trackOrderChange,
      listOfArtistsSET,
      subUserId,
      subUserEndpoint,
      parentUserOnly,
      revalidateField,
    };

    const trackProps = {
      listOfTracks,
      manageTrackData,
      removeTrack,
      addNewTrack,
      manageTrackDataFile,
      trackOrderChange,
      listOfTracksSET,
      setFormError,
      manageDropboxTrackDataFile,
      manageDropboxTrackFileMetdataError,
      addMixNameValidator,
      removeMixNameValidator,
      revalidateField,
    };


  return (
    <>
      <Card>
        <LoaderInner show={submitInProgress? true : false} />
        <CardBody className="errorCont">
          <Row>
            <Col>
              <CardTitle tag="h4">Transfer Release</CardTitle>
            </Col>
          </Row>
          <Form id="releaseForm">
            <FormGroup>
              <Label>Release Name</Label>
              <Input type="text" name="releaseName" id="releaseName" defaultValue={releaseData.name} disabled={true} />
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
                onFocus={() => {revalidateField("releaseVersion")}}
                placeholder="Leave blank if you are not sure or if this is a regular release"
              />
              <FormText color="muted">
                Some releases are released in more than one version, if so
                please enter the version name. If your release is
                original/standard release please ignore this field.
              </FormText>
            </FormGroup>

            {currentUser.is_premium_user &&
              <FormGroup className="select-search-wrap">
                <Label>Sub-User</Label>
                  {
                      subUser ?

                      <div className="releaseFileRow">
                          <p className="releaseFileRowName"> {subUser}</p>
                          <Button className="btn btn-outline-info" 
                            onClick={() => {
                              setSubUser('');
                              setSubUserId(null);
                              setSubUserEndpoint('');
                              setParentUserOnly('&parent_user_only=true');
                              labelSelectedSET('');
                            }
                            }>
                            Reset
                          </Button>
                      </div>
                      :
                      <AsyncDropdownFeedback
                        fetchOptions={options}
                        endpoint={`sub-users`}
                        subUserEndpoint={subUserEndpoint}
                        parentUserOnly={parentUserOnly}
                        labelField="username"
                        fieldTouched={subuserFieldTouched}
                        setFieldTouched={subuserFieldTouchedSET}
                        onChange={e => {
                          let subUserId = e.value;
                          let username = e.label;
                          if(subUserId !== '') {
                            setSubUser(username);
                            setSubUserId(subUserId);
                            setSubUserEndpoint(`sub-user/${subUserId}/`);
                            setParentUserOnly('');
                            labelSelectedSET('');
                          } else {
                            setSubUser('');
                            setSubUserId(null);
                            setSubUserEndpoint('');
                            setParentUserOnly('&parent_user_only=true');
                          }
                        }}
                        placeholder="Select Sub-user..."
                      />
                  }
                <FormText color="muted">
                  Note: Only use this dropdown if you want to Add Release for any of your Sub-users otherwise leave un-selected.
                </FormText>
              </FormGroup>
            }

            <FormGroup className="select-search-wrap">
              <Label>Label</Label> <Badge color="primary">Required</Badge>
              <AsyncDropdownFeedback
                fetchOptions={options}
                endpoint={`labels`}
                subUserEndpoint={subUserEndpoint}
                parentUserOnly={parentUserOnly}
                labelField={"name"}
                value={labelSelected}
                isFieldValid={isLabelValid}
                fieldTouched={labelFieldTouched}
                setFieldTouched={labelFieldTouchedSET}
                revalidateField={revalidateField}
                fieldName="releaseLabel"
                onChange={e => { 
                  labelSelectedSET(e)
                  revalidateField("releaseLabel")
                }}
                placeholder="Select Label..."
              />

              <input className="hiddenInput" type="text" id="releaseLabel" name="releaseLabel" value={labelSelected} readOnly/>

              <FormText color="info">
                Note: Please select your Label <b>{releaseData.label}</b> from the dropdown if it already exists in system, otherwise create your Label <b>{releaseData.label}</b> by clicking <a style={{fontWeight: "bold", color: "#b40bbe"}} href="/labels/add">here</a>, once it is created you can then select it from dropdown.
              </FormText>

            </FormGroup>

            <TransferArtistRow values={artistProps} />
            {successAddedNew && (
              <Alert color="success">New Artist has been added!</Alert>
            )}

            <Row>
              <Col>
                <FormGroup>
                  <Label>Copyright ©</Label> <Badge color="primary">Required</Badge>
                  <Input
                    type="text"
                    id="releaseCopyright"
                    name="releaseCopyright"
                    defaultValue={releaseData.copyrights.C? releaseData.copyrights.C.copyrightName: releaseData.label}
                    onFocus={()=>{revalidateField("releaseCopyright")}}
                    placeholder="Usually your label name"
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Copyright © Year</Label> <Badge color="primary">Required</Badge>
                  <Input
                    type="number"
                    id="releaseCopyrightYear"
                    name="releaseCopyrightYear"
                    defaultValue={releaseData.copyrights.C? releaseData.copyrights.C.year: releaseYear}
                    onFocus={()=>{revalidateField("releaseCopyrightYear")}}
                    maxLength="4"
                    placeholder="YYYY"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Copyright ℗</Label> <Badge color="primary">Required</Badge>
                  <Input
                    type="text"
                    id="releaseCopyrightPublisher"
                    name="releaseCopyrightPublisher"
                    defaultValue={releaseData.copyrights.P? releaseData.copyrights.P.copyrightName: releaseData.label}
                    onFocus={()=>{revalidateField("releaseCopyrightPublisher")}}
                    placeholder="Usually your label name"
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Copyright ℗ Year</Label> <Badge color="primary">Required</Badge>
                  <Input
                    type="number"
                    id="releaseCopyrightYearPublisher"
                    name="releaseCopyrightYearPublisher"
                    defaultValue={releaseData.copyrights.P? releaseData.copyrights.P.year: releaseYear}
                    onFocus={()=>{revalidateField("releaseCopyrightYearPublisher")}}
                    maxLength="4"
                    placeholder="YYYY"
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Genre</Label> <Badge color="primary">Required</Badge>
                  <Select
                    id="releaseGenre"
                    name="releaseGenre"
                    components={{ IndicatorSeparator:() => null }}
                    options={optionsGenres}
                    defaultValue={selectedGenre}
                    value={selectedGenre? selectedGenre: null}
                    styles={{
                      menu: styles => ({ ...styles, zIndex: 10 }),
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: genreFieldTouched ? (isGenreValid ? "#2dce89": "#f62d51"): baseStyles.borderColor,
                        boxShadow: state.isFocused || state.isHovered 
                          ? (isGenreValid ? "0 0 0 0.2rem rgba(45, 206, 137, 0.25)" : "0 0 0 0.2rem rgba(246, 45, 81, 0.25)") 
                          : "0 0 0 1px #e9ecef",
                        borderRadius: "2px",
                      }),
                    }}
                    onFocus={e => {
                      genreFieldTouchedSET(true)
                      revalidateField("releaseGenre");                      
                    }}
                    onChange={e => {
                      select(e);
                      revalidateField("releaseGenre");
                    }}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Sub-Genre</Label> <Badge color="primary">Required</Badge>
                  <Select
                    id="releaseSubGenre"
                    name="releaseSubGenre"
                    value={selectedSubGenre}
                    disabled={selectedGenre ? false : true}
                    components={{ IndicatorSeparator:() => null }}
                    options={optionSubGenres}
                    styles={{
                      menu: styles => ({ ...styles, zIndex: 10 }),
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: subGenreFieldTouched ? (isSubGenreValid ? "#2dce89": "#f62d51"): baseStyles.borderColor,
                        boxShadow: state.isFocused || state.isHovered 
                          ? (isSubGenreValid ? "0 0 0 0.2rem rgba(45, 206, 137, 0.25)" : "0 0 0 0.2rem rgba(246, 45, 81, 0.25)") 
                          : "0 0 0 1px #e9ecef",
                        borderRadius: "2px",
                      }),
                    }}
                    onFocus={e => {
                      subGenreFieldTouchedSET(true)
                      revalidateField("releaseSubGenre");                      
                    }}
                    onChange={(e) => {
                      selectedSubGenreSET(e);
                      revalidateField("releaseSubGenre")
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label>Catalog Number</Label> <Badge color="primary">Required</Badge>
              <Input
                type="text"
                id="releaseCatalogNumber"
                name="releaseCatalogNumber"
                data-token={token}
                onFocus={()=> {
                  duplicatesState(null)
                  revalidateField("releaseCatalogNumber")
                }}
                onBlur={(e) => checkCatalogNumber(e.target.value, token, (val) => duplicatesState(val))}
              />
              <FormText color="muted">
                Insert your catalog number. Usually labels insert label name
                abbreviation and a number. I.e MMD001, MMD002...
              </FormText>
              {
                duplicatedCatNumber && <div className="fv-help-block">Catalog number '{duplicatedCatNumber}' was used. Please insert another one.</div>
              }
            </FormGroup>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Artwork</Label> <Badge color="primary">Required</Badge>
                  <CustomInput
                    type="file"
                    id="releaseArtwork"
                    name="releaseArtwork"
                    innerRef={artworkFileRef}
                    onChange={(e) => artworkChange(e)}
                    onFocus={()=>{revalidateField("releaseArtwork")}}
                    accept=".jpeg,.jpg"
                  />
                  <div className="artworkUploadContainer">
                    <div className="artworkUpload" id={`uploadProgress_rawt`}></div>
                    <div className="artworkUploadProgresDiv">
                      <span id={`uploadProgress_text_rawt`}></span>
                    </div>
                  </div>
                  <DropboxChooser 
                    keyUploading={"rawt"}
                    handleFileMetadataError={manageDropboxReleaseArtworkFileMetadataError}
                    handleDropboxUploadComplete={manageDropboxReleaseArtworkFile}
                    fileType={"image"}
                    acceptedExtensions={[".jpg"]}
                    s3Path={"direct/release_artwork"}
                    clearArtworkFile={clearArtworkFile}
                  />
                  {artwork && (
                    <img
                      src={artwork}
                      style={{ width: "300px", padding: "10px 0" }}
                      alt={"Your artwork"}
                    />
                  )}
                  <input className="hiddenInput" id="artworkURL" type="text" value={artworkURL || ''} onChange={(e) => e}/>
                  <FormText color="muted">
                    Upload JPG formats, resolution only 3000x3000 px, @ 72
                    dpi
                  </FormText>
                  <div className="fv-help-block" style={{ display: 'none'}}  id={`err_release_artwork_rawt`}></div>
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
                    value={isNewRelease}
                    disabled={true}
                    options={isNewReleaseOptions}
                    styles={{
                      menu: styles => ({ ...styles, zIndex: 10 }),
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: newReleaseFieldTouched ? "#2dce89": baseStyles.borderColor,
                        boxShadow: state.isFocused || state.isHovered ? "0 0 0 0.2rem rgba(45, 206, 137, 0.25)" : "0 0 0 1px #e9ecef",
                        borderRadius: "2px",
                      }),
                    }}
                    onFocus={e => {
                      newReleaseFieldTouchedSET(true)
                    }}
                    onChange={(e) => {
                      if(e.value) {
                        backcatalogSET(false)
                      }
                      isNewReleaseSET(e)
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>

            {!isNewRelease.value &&
              <Row>
                <Col>
                  <FormGroup>
                    <Label>Original release date</Label> <Badge color="primary">Required</Badge>
                    <Input
                      type="text"
                      id="originalReleaseDate"
                      name="originalReleaseDate"
                      placeholder="Select date..."
                      value={
                        originalReleaseDate
                          ? formatDate(originalReleaseDate)
                          : ''
                      }
                      readOnly={true}
                      className="pseudoSelectCalendar"
                      onClick={originalCalendarToggle}
                      onChange={e => null}
                      onFocus={e => {
                        revalidateField("originalReleaseDate")
                      }}
                    />
                    {originalOpenCalendar && (
                      <ReleaseCalendar
                        values={{
                          backlog: true,
                          assisted: asisstedDates
                        }}
                        onDayClick={e => {
                          originalHandleDayClick(e);
                          originalCalendarToggle();
                        }}
                        selectedDay={originalReleaseDate}
                        id="originalReleaseDate"
                        name="originalReleaseDate"
                      />
                    )}
                    {originalOpenCalendarError && (
                      <p className="fv-help-block">Please select a day.</p>
                    )}
                    <FormText color="muted">
                      Original release date for all shops worldwide.
                    </FormText>
                  </FormGroup>
                </Col>
              </Row>
            }

            <Row>
              <Col>
                <FormGroup>
                  <Label>Official release date</Label> <Badge color="primary">Required</Badge>
                  <Input
                    type="text"
                    id="officialReleaseDate"
                    name="officialReleaseDate"
                    placeholder="Select date..."
                    value={
                      officialReleaseDate
                        ? formatDate(officialReleaseDate)
                        : ''
                    }
                    readOnly={true}
                    className="pseudoSelectCalendar"
                    onClick={officialCalendarToggle}
                    onChange={e => null}
                    onFocus={e => {
                      revalidateField("officialReleaseDate")
                    }}
                  />
                  {officialOpenCalendar && (
                    <ReleaseCalendar
                      values={{
                        backlog: backcatalog,
                        assisted: asisstedDates
                      }}
                      onDayClick={e => {
                        officialHandleDayClick(e);
                        officialCalendarToggle();
                      }}
                      selectedDay={officialReleaseDate}
                      id="officialReleaseDate"
                      name="officialReleaseDate"
                    />
                  )}
                  {officialOpenCalendarError && (
                    <p className="fv-help-block">Please select a day.</p>
                  )}
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
                    />{" "}
                    Backcatalog
                  </Label>
                </FormGroup>
                <FormGroup check inline>
                  <Label check>
                    <CustomInput
                      type="checkbox"
                      id="assistedDates"
                      checked={asisstedDates}
                      onChange={() => {
                        if (asisstedDates) {
                          modalAssistedDaysSET(true)
                        } else {
                          modalAssistedDaysSET(false);
                          asisstedDatesSET(true);
                        }
                      }}
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
                  <Select
                    id="releaseExclusiveDate"
                    name="releaseExclusiveDate"
                    value={exclusiveStoreReleaseDate}
                    components={{ IndicatorSeparator:() => null }}
                    options={exclusiveStoreRelaseOptions}
                    styles={{
                      menu: styles => ({ ...styles, zIndex: 10 }),
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: esrdFieldTouched ? "#2dce89": baseStyles.borderColor,
                        boxShadow: state.isFocused || state.isHovered? "0 0 0 0.2rem rgba(45, 206, 137, 0.25)" : "0 0 0 1px #e9ecef",
                        borderRadius: "2px",
                      }),
                    }}
                    onFocus={e => {
                      esrdFieldTouchedSET(true);
                    }}
                    onChange={(e) => {
                      exclusiveStoreReleaseDateSET(e);
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>

            <div className="mb-2">
              <i className={metdataCollapsed?"collapse-icon fa fa-angle-double-up": "collapse-icon fa fa-angle-double-down"} onClick={e => {setMetadataCollapsed(!metdataCollapsed)}}>
              &nbsp;<span className="collapse-text">Additional Metadata</span>
              </i>
            </div>

            <Collapse isOpen={metdataCollapsed}>
              <Row>
                <Col>
                  <FormGroup>
                    <Label>Release Description</Label>
                    <Input
                      type="textarea"
                      id="releaseDescription"
                      name="releaseDescription"
                      placeholder="A few words about your release. No links and e-email adresses please. 600 characters max"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <Label>Release Name Language</Label> <Badge color="primary">Required</Badge>
                    <Select
                      id="releaseLanguage"
                      name="releaseLanguage"
                      isDisabled={autoDetectLanguage}
                      components={{ IndicatorSeparator:() => null }}
                      options={Langs}
                      onChange={(e) => {
                        languageSET(e.value.toUpperCase())
                        revalidateField("releaseLanguage");
                      }}
                    />

                    <input id="selectedLang" className="hiddenInput" type="text" value={language} onChange={() =>false}/>
                    <FormText color="muted">
                      In which language is the release name written? Please double
                      check it if you are not sure. If this input is wrong, some
                      stores like iTunes and Apple Music will reject the release.
                    </FormText>

                    <FormGroup check inline className="mt-2">
                      <Label check>
                        <CustomInput
                          type="checkbox"
                          id="autoDetectLanguage"
                          name="autoDetectLanguage"
                          checked={autoDetectLanguage}
                          value={autoDetectLanguage}
                          onChange={(e) => handleAutoDetectLanguage(e)}
                        />{" "}
                        Auto Detect (Language)
                      </Label>
                    </FormGroup>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>
                  <FormGroup>
                    <Label>EAN / UPC</Label>
                    <Input
                      type="text"
                      id="releaseEAN_UPC"
                      name="releaseEAN_UPC"
                      placeholder="Leave blank if you are not sure!"
                      className="input-reset"
                      defaultValue={releaseData.upc}
                      disabled={true}
                    />
                    <FormText color="muted">
                      The Universal Product Code or European Article Number for the
                      release. Valid ​codes are 13 digits number.
                    </FormText>
                    {eanNumber.map((i, index) => {
                      if (i.valid) return false;
                      return (
                        <div className="fv-help-block" key={i.message}>
                          {i.message}
                        </div>
                      );
                    })}

                  </FormGroup>
                </Col>
              </Row>
            </Collapse>


            <Row style={{ paddingBottom: "10px" }}>
              <Col>
                <FormGroup>
                  <Label>Territories</Label> <Badge color="primary">Required</Badge>

                  <Select
                    id="releaseTerritories"
                    name="releaseTerritories"
                    value={selectedTerritory}
                    components={{ IndicatorSeparator:() => null }}
                    options={optionsTerritories}
                    styles={{
                      menu: styles => ({ ...styles, zIndex: 10 }),
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: territoriesFieldTouched ? (isTerritoriesValid ? "#2dce89": "#f62d51"): baseStyles.borderColor,
                        boxShadow: state.isFocused || state.isHovered 
                          ? (isTerritoriesValid ? "0 0 0 0.2rem rgba(45, 206, 137, 0.25)" : "0 0 0 0.2rem rgba(246, 45, 81, 0.25)") 
                          : "0 0 0 1px #e9ecef",
                        borderRadius: "2px",
                      }),
                    }}
                    onFocus={e => {
                      territoriesFieldTouchedSET(true)
                      revalidateField("releaseTerritories");                      
                    }}
                    onChange={e => {
                      if (e.value === "worldwide") {
                        isWorldWideSET(true)
                        disableValidator("atleastOneCountrySelected")
                      } else {
                        isWorldWideSET(false)
                        enableValidator("atleastOneCountrySelected")
                      }
                      selectedTerritorySET(e)
                      revalidateField("releaseTerritories");
                    }}
                  />
                </FormGroup>
              </Col>
            </Row>

            {
            !isWorldWide &&
              <Row style={{ paddingBottom: 20 }}>
                <Col>
                  <Label>Countries</Label>
                  <CountriesSelect selected={selectedTerritories} setSelected={selectedTerritoriesSET} disabled={isWorldWide}/>
                </Col>
              </Row>
            }
            <input id="selectedTerry" type="text" className="hiddenInput" value={selectedTerritories.map(i => i.value).join('--')} onChange={() => false }/>

            <FormGroup>
              <input className="hiddenInput" type="text" id="atleastOneCountrySelected" name="atleastOneCountrySelected" value={atleastOneCountrySelected} readOnly/>
            </FormGroup>

            <TransferTrackRow
              values={trackProps}
              id="releaseTracks"
              name="releaseTracks"
            />
            <Button
              type="submit"
              id="releaseSaveOnly"
              color="success"
              disabled={(listOfTracks.length !== listOfTracksDetails.length) || formErrRef.current || artworkFileError || trackFileError}
            >
              Save and continue
            </Button>

            {
              (formErrRef.current || artworkFileError || trackFileError) &&  <p className="fv-help-block"  style={{marginTop: 15}}>Form cannot be submited! Please fill all fields and check errors!</p>
            }
          </Form>
        </CardBody>
      </Card>
      {
        limitText && <Alert color="danger">{limitText}</Alert>
      }

      <Modal isOpen={modalAssistedDays} centered={true}>
        <ModalHeader>
          Are you sure you want to ignore release date best practices?
        </ModalHeader>
        <ModalBody>
          Please note by selecting this option, your release date might not be
          accepted by stores or ingested and published on the selected date.
          Additionally, you are strongly reducing the marketing opportunities.{" "}
        </ModalBody>
        <ModalFooter>
          <Button
            color="secondary"
            onClick={() => modalAssistedDaysSET(false)}
          >
            Cancel
          </Button>
          <Button
            color="success"
            onClick={() => {
              asisstedDatesSET(false)
              modalAssistedDaysSET(false)
            }}
          >
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
      <Modal isOpen={addedReleaseModal} centered={true}>
        <ModalHeader>Release created!</ModalHeader>
        <ModalBody>Your release was successfully created!</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => {
            addedReleaseModalSET(false);
            redirectTracksSET(true);
            }}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      <Modal isOpen={declarationModal} centered={true}>
        <ModalHeader>Transfer Release Declaration</ModalHeader>
        <ModalBody>I have checked and completed all of the needed information for this release and it is now ready for UPLOAD.</ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => {
            declarationModalSET(false);
            submitInProgressSET(true);
            axios({
              method: "post",
              mode: 'cors',
              url: `${API_URL}releases/`,
              data: releaseDataObject,
              headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": X_API_KEY,
                "Content-Type": "application/json"
              }
            }).then(function(response) {
              submitInProgressSET(false);
              if (response.status === 201) {
                getUser(token, currentUser, setCurrentUser)
                setNewReleaseId(response.data.id)
                addedReleaseModalSET(true);
              }
            });
            }}>
            Confirm
          </Button>
          <Button color="secondary" onClick={() => {
            declarationModalSET(false);
            }}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      {redirectTracks ? <Redirect to={`/releases/${newReleaseID}/tracks`} /> : null}
    </>
  );


}
export default TransferReleaseForm;
