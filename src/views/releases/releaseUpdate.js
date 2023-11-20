import React, { useState, useContext, useRef, useEffect } from "react";
import AsyncDropdownFeedback from "../../components/asyncDropdownFeedback";
import axios from "axios";
import Select from "react-select";
import { Redirect } from "react-router-dom";
import CountriesSelect from "../../components/countriesSelect";
import QCFeedback from "../../components/qcFeedback";
import { Badge, Collapse, Col, Row, Form, FormGroup, Label, CustomInput, Input, FormText, Button, Card, CardBody, CardTitle, Alert, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import ReleaseCalendar from "./ReleaseCalendar";
import ArtistRow from "./ArtistRow";
import TrackRow from "./TrackRow";
import LoaderInner from "../../components/LoaderInner";
import formValidation from "../../validations/es6/core/Core";
import ean from "../../validations/es6/validators/ean";
import stringLength from "../../validations/es6/validators/stringLength";
import { getCookie } from "../../jwt/_helpers/cookie";
import { opt } from "./validationUpdate";
import {StateContext} from "../../utils/context";

import DropboxChooser from "../../components/dropboxChooser";

import { checkTrackValidation, checkDropboxTrackFileValidation, checkDropboxReleaseArtworkFileValidation, uploadS3, releaseArtworkUpload, getElByKey, checkTrackURL, checkCatalogNumber, checkCatalogNumberReturn } from "./helperFunctions";

import "./releaseForm.css";

import Langs from "../../utils/languages.json";
import CountriesJSON from "../../utils/countriesExtended.json"

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

var toHHmmSS = (SECONDS) => Number(SECONDS) ? new Date(SECONDS * 1000).toISOString().substr(11, 8) : SECONDS;

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
let keyrandom2= makeid(20);

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

const artistNameValidators = {
  validators: {
    notEmpty: {
      message: "Please select artist"
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

  let currentID = window.location.pathname.split("/")[2];
  const stateRef = useRef();
  const selectRefs = useRef();
  const formErrRef = useRef();
  const artworkFileRef = useRef();
  const fvRef = useRef();
  const {currentUser} = useContext(StateContext);
  const [listOfArtists, listOfArtistsSET] = useState([{ name: "", type: "", order: 1, key: keyrandom }]);
  const [listOfTracks, listOfTracksSET] = useState([{
    order: 1,
    created_id: '',
    track_name: "",
    track_mix_name: "",
    album_only: false,
    key: keyrandom2
  }])
  const [initialData, initialDataSET] = useState({})
  const [listOfTracksDetails, listOfTracksDetailsSET] = useState([])
  const [loadingGenres, loadingGenresSET] = useState(true);
  const [selectedGenre, selectedGenreSET] = useState(null);
  const [selectedSubGenre, selectedSubGenreSET] = useState(null);
  const [language, languageSET] = useState('');
  const [autoDetectLanguage, autoDetectLanguageSET] = useState(true);
  const [genres, genresSET] = useState(null);
  const [labelSelected, labelSelectedSET] = useState('');
  const [selectedTerritories, selectedTerritoriesSET] = useState([]);
  const [releaseTerritories, releaseTerritoriesSET] = useState(null);
  const [artwork, artworkSET] = useState(null);
  const [artworkURL, artworkURLSET] = useState(null);
  const [successAddedNew, successAddedNewSET] = useState(false);
  const [eanUnlocked, eanUnlockedSET] = useState(false);
  const [eanNumber, eanNumberSET] = useState([{ valid: true }]);
  const [isNewRelease, isNewReleaseSET] = useState({ value: 1, label: "Yes" });
  const [officialReleaseDate, officialReleaseDateSET] = useState(undefined);
  const [originalReleaseDate, originalReleaseDateSET] = useState(undefined);
  const [originalOpenCalendar, originalOpenCalendarSET] = useState(false);
  const [officialOpenCalendar, officialOpenCalendarSET] = useState(false);
  const [originalOpenCalendarError, originalOpenCalendarErrorSET] = useState(false);
  const [officialOpenCalendarError, officialOpenCalendarErrorSET] = useState(false);
  const [backcatalog, backcatalogSET] = useState(false);
  const [asisstedDates, asisstedDatesSET] = useState(true);
  const [modalAssistedDays, modalAssistedDaysSET] = useState(false);
  const [isWorldWide, isWorldWideSET] = useState(false);
  const [releaseExclusiveDate, releaseExclusiveDateSET] = useState(false);
  const [subUserId, subUserIdSET] = useState(null);
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');

  const [atleastOneCountrySelected, atleastOneCountrySelectedSET] = useState('');

  const [submitType, setSumbitType] = useState(0);
  const [blockedSubmit, setBlockedSubmit] = useState(true);

  const [limitText, setLimitText] = useState(false);
  const [duplicatedCatNumber, setDuplicatedNumber] = useState(null);
  const [duplicatedCatNumberError, setDuplicateError] = useState(null);
  const [formError, setFormError] = useState(false);
  const [artworkFileError, setArtworkFileError] = useState(false);
  const [trackFileError, setTrackFileError] = useState(false);

  const [addedReleaseModal, addedReleaseModalSET] = useState(false);
  const [redirect, redirectSET] = useState(false);
  const [redirectTracks, redirectTracksSET] = useState(false);
  const [newReleaseID, setNewReleaseId] = useState(0);
  const [metdataCollapsed, setMetadataCollapsed] = useState(false);

  const [isGenreValid, isGenreValidSET] = useState(true);
  const [isSubGenreValid, isSubGenreValidSET] = useState(true);
  const [isLabelValid, isLabelValidSET] = useState(false);
  const [isTerritoriesValid, isTerritoriesValidSET] = useState(false);
  
  const [labelFieldTouched, labelFieldTouchedSET] = useState(false);
  const [genreFieldTouched, genreFieldTouchedSET] = useState(false);
  const [subGenreFieldTouched, subGenreFieldTouchedSET] = useState(false);
  const [newReleaseFieldTouched, newReleaseFieldTouchedSET] = useState(false);
  const [esrdFieldTouched, esrdFieldTouchedSET] = useState(false);
  const [territoriesFieldTouched, territoriesFieldTouchedSET] = useState(false);

  const [qcFeedback, qcFeedbackSET] = useState({});
  const [hasQCFeedback, hasQCFeedbackSET] = useState(false);

  stateRef.current = listOfTracksDetails;

  formErrRef.current = formError;

  selectRefs.current = {
    labelSelected,
    language,
    selectedGenre,
    selectedSubGenre,
    isNewRelease,
  }

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

  const handleEanUnlock = (e) => eanUnlockedSET(!eanUnlocked);

  const handleAutoDetectLanguage = (e) => autoDetectLanguageSET(!autoDetectLanguage);

  const clearArtworkFile = () => {
    if(artworkFileRef.current) {
      artworkFileRef.current.value = "";
    }
    if(formError) {
      setFormError(false);
      let formID = document.getElementById("releaseForm");
      if(formID) {
        const messages = [].slice.call(formID.querySelectorAll('[data-field="releaseArtwork"][data-validator]'));
        messages.forEach((messageEle) => {
          messageEle.style.display = 'none';
        });
      }
    }
  }

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
      fv.enableValidator(fieldName, validatorToEnable).revalidateField(fieldName);
    }
  }

  const disableValidator = (fieldName, validatorToDisable) => {
    if(fvRef.current) {
      let fv = fvRef.current;
      fv.disableValidator(fieldName, validatorToDisable).revalidateField(fieldName);
    }
  }

  const artworkChange = (event) => {
    setArtworkFileError(false);
    enableValidator("releaseArtwork", "notEmpty");
    if(document.getElementById("err_release_artwork_rawu").style.display === "block") {
      document.getElementById("err_release_artwork_rawu").style.display = "none";
    }
    document.getElementById(`uploadProgress_rawu`).style.width = '0%';
    document.getElementById(`uploadProgress_text_rawu`).innerHTML = '';
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

  const addNewArtist = (obj) => {
    listOfArtistsSET(obj);
    if(fvRef.current) {
      let fv = fvRef.current;
      let indexToAdd = obj.length-1;
      fv.addField('artist[' + indexToAdd + '].name', artistNameValidators).addField('artist[' + indexToAdd + '].type', artistTypeValidators);
      fv.revalidateField("atleastOneMainArtist");
      fv.revalidateField("duplicateArtists");
    }
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
    if(fvRef.current) {
      let fv = fvRef.current;
      let indexToRemove = newList.length;
      fv.removeField('artist[' + indexToRemove + '].name').removeField('artist[' + indexToRemove + '].type');
      fv.revalidateField("atleastOneMainArtist");
      fv.revalidateField("duplicateArtists");
    }
  }

  const manageArtistData = (index, value, key) => {
    if (key) {
      const newList = listOfArtists.map((element, i) => {
        if (index === i) {
          element[value] = key;
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
    listOfTracksSET(obj);
    if(fvRef.current)
    {
      let fv = fvRef.current;
      let indexToAdd = obj.length-1;
      fv.addField('track[' + indexToAdd + '].name', trackNameValidators);
    }
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

    const newDetailsList = listOfTracksDetails.filter((el, i) => {
      if (index === i) {
        return false;
      } else {
        return el;
      }
    })

    listOfTracksSET(newList)
    listOfTracksDetailsSET(newDetailsList);
    setTrackFileError(false);

    if(fvRef.current)
    {
      let fv = fvRef.current;
      let indexToRemove = newList.length;
      fv.removeField('track[' + indexToRemove + '].name');
    }
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
    listOfTracksSET(newList)
  };

  const manageTrackDataDetails = (index, key, value) => {
    const newList = listOfTracksDetails.map((element, i) => {
      if (index === i) {
        element[key] = value;
      }
      return element;
    });
    listOfTracksDetailsSET(newList)
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

      const ifExist = stateRef.current.filter(i => i.key === file_key);

      if (ifExist.length > 0) {
        listOfTracksDetailsSET(
          stateRef.current.map( i => {
            if(i.key === file_key) {
                return {
                    URL: uploadResponse,
                    track_lenght: validateRow.meta.duration,
                    key: file_key,
                }
            } else {
                return i;
            }
        })
        )
      } else {
        listOfTracksDetailsSET(stateRef.current.concat([{
          URL: uploadResponse,
          track_lenght: validateRow.meta.duration,
          key: file_key
        }]));
      }

    }
  };


  const manageDropboxTrackDataFile = async (url, fileKey, fileLink, fileMetadata) => {
    setTrackFileError(false)
    const validateDropboxTrackFile = checkDropboxTrackFileValidation(fileMetadata);

    if(!validateDropboxTrackFile.valid)
    {
      setTrackFileError(true)
      document.getElementById(`track_${fileKey}`).value = "";
      document.getElementById(`err_track_file_${fileKey}`).style.display = "block";
      document.getElementById(`err_track_file_${fileKey}`).innerText = validateDropboxTrackFile.message;
    } else {
      document.getElementById(`err_track_file_${fileKey}`).style.display = "none";

      listOfTracksDetailsSET(stateRef.current.concat([{
        URL: url,
        duration: fileMetadata.duration,
        track_lenght: toHHmmSS(fileMetadata.duration),
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
    artworkSET(null)
    artworkURLSET(null)
    setArtworkFileError(false)

    const validateDropboxReleaseArtworkFile = checkDropboxReleaseArtworkFileValidation(fileMetadata);

    if(!validateDropboxReleaseArtworkFile.valid)
    {
      setArtworkFileError(true)      
      document.getElementById(`err_release_artwork_${fileKey}`).style.display = "block";
      document.getElementById(`err_release_artwork_${fileKey}`).innerText = validateDropboxReleaseArtworkFile.message;
    } else {
      document.getElementById(`err_release_artwork_${fileKey}`).style.display = "none";

      artworkURLSET(url);
      artworkSET(fileLink);
      if(blockedSubmit){
        setBlockedSubmit(false);
      }
    }
  };

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

  const validateEAN = (e) => {
    const validEAN = ean().validate({
      value: e
    });

    validEAN.message =
      "The value is not valid EAN. If you are inserting a new release, leave this field blank and we will generate EAN for you. If you are uploading a back catalog and EAN is not valid, please contact us.";

    const length = stringLength().validate({
      value: e,
      options: {
        min: 13,
        max: 13,
        message: "The EAN number must be equal to 13 characters"
      }
    });
    eanNumberSET([validEAN, length])
  }

  const handleSelectedTerritories = (e) => {
    selectedTerritoriesSET(e);
    if(blockedSubmit){
      setBlockedSubmit(false);
    }
  }

  const duplicatesState =  e => {
    setDuplicatedNumber(e)
    setDuplicateError(e ? true : false);
  }

  useEffect(() => {
    if(!isWorldWide && selectedTerritories.length>0) {
      atleastOneCountrySelectedSET('yes');
    } else {
      atleastOneCountrySelectedSET('');
    }
    revalidateField("atleastOneCountrySelected")
  }, [isWorldWide, selectedTerritories, territoriesFieldTouched])  


  useEffect(() => {
    try {
      axios.post(`${API_URL}dropbox-upload/`, {"request_type": "warm-up"}, options);
    } catch (error) {
        console.error("Error during warm up:", error);
    }

    
    axios.get(`${API_URL}genres/`, options).then(res => {
      genresSET(res.data);
      loadingGenresSET(false)
    }).then((artists) => {

      axios.get(`${API_URL}releases/${currentID}/`, options)
      .then(res => {
        const r_s = res.data.status;

        // Cant edit
        //locked
        //approval
        //re_delivery-delivery
        //takedown_request
        //taken_down

        if (r_s === "locked" || r_s === "approval" || r_s === "re_delivery-delivery" || r_s === "takedown_request" || r_s === "taken_down") {
          redirectSET(true);
          return false;
        }
        const artistsRelease = res.data.artists;
        const tracksRelease = res.data.tracks;
        const formArtistData = artistsRelease.map((i, idx) => {
          let type;
          if (i.kind === 'main') {
            type = {label: 'Main Artist', value: 'main'};
          } else if (i.kind === 'featuring') {
            type = {label: 'Featuring Artist', value: 'featuring'};
          } else {
            type = {label: i.kind, value: i.kind};
          }
          let artistKey = makeid(20);
          if(fvRef.current)
          {
            let fv = fvRef.current;
            let indexToAdd = idx;
            if(indexToAdd>=1)
            {
              fv.addField('artist[' + indexToAdd + '].name', artistNameValidators).addField('artist[' + indexToAdd + '].type', artistTypeValidators).revalidateField("atleastOneMainArtist");
            }
          }
          return { name: {label: i.artist.name, value: i.artist.id}, type: type, order: i.order, key: artistKey }
        });

        const trackFunc = () => {
          const doubleArray = tracksRelease.map((i, idx) => {
            let randomKey = makeid(20);
            if(fvRef.current)
            {
              let fv = fvRef.current;
              let indexToAdd = idx;
              if(indexToAdd>=1)
              {
                fv.addField('track[' + indexToAdd + '].name', trackNameValidators);
              }
            }
            return [
              {
                order: i.order,
                track_name: i.name,
                track_mix_name: i.mix_name,
                track_mix_select: i.mix_name.length > 0 ? 1 : 2,
                album_only: i.album_only,
                key: randomKey,
                track_res: i.resource,
                created_id: i.id
              },
              {
                URL: i.resource,
                track_lenght: i.track_lenght,
                key: randomKey
              }
            ]
          });

          const formTracksData = doubleArray.map(i => i.filter((ii, index) => index === 0)[0]);
          const formTracksDataDetails = doubleArray.map(i => i.filter((ii, index) => index === 1)[0]);

          return {formTracksData, formTracksDataDetails}
        }

        const track_data = trackFunc();

        const getDataCountry = (c) => {
          return c.reduce((acc, countryCode) => {
            if (countryCode) {
              const item = CountriesJSON.find(ii => ii.value === countryCode);
              if (item) {
                acc.push(item);
              }
            }
            return acc;
          }, []);
        };        

        initialDataSET(res.data);

        let resQCFeedback  = res.data.qc_feedback;
        let resQCPassed = res.data.qc_passed;
        let resHasQCFeedback = !resQCPassed && resQCFeedback.results && Object.keys(resQCFeedback.results).length !== 0;
        if (resHasQCFeedback) {
          qcFeedbackSET(resQCFeedback.results.release_level);
          hasQCFeedbackSET(resHasQCFeedback);
        }

        let releaseLabel = res.data.label;
        if(releaseLabel) {
          labelSelectedSET({
            label: releaseLabel.name,
            value: releaseLabel.id
          })
          isLabelValidSET(true)
        }

        let resIsNewRelease = res.data.is_new_release;
        if(!resIsNewRelease) {
          isNewReleaseSET({ value: 0, label: "No" })
        }

        selectedTerritoriesSET(getDataCountry(res.data.countries));
        listOfArtistsSET(formArtistData);
        listOfTracksSET(track_data.formTracksData);
        listOfTracksDetailsSET(track_data.formTracksDataDetails);
        eanUnlockedSET(res.data.generate_ean);
        autoDetectLanguageSET(res.data.auto_detect_language);
        backcatalogSET(res.data.backcatalog);
        releaseTerritoriesSET(optionsTerritories.filter(i => i.value === res.data.territory)[0]);
        languageSET(res.data.language ? {value: res.data.language, label: Langs.map(function(i) {
          if (i.value.toUpperCase() === res.data.language) {
            return i.label;
          } else return '';
        })}  : '');

        releaseExclusiveDateSET(res.data.exclusive_shop ? exclusiveStoreRelaseOptions.filter(i => i.value === res.data.exclusive_shop)[0] : false);
        if (res.data.territory === 'worldwide') {
          isWorldWideSET(true)
          disableValidator("atleastOneCountrySelected", "notEmpty")
        }
      })
    })
  }, [])

  useEffect(() => {
    if (genres && initialData.genre) {
      selectedGenreSET(initialData.genre ? {value: initialData.genre, label: genres.results.filter(i => i.id === initialData.genre)[0].name} : false);

      selectedSubGenreSET(initialData.subgenre ? {value: initialData.subgenre, label: genres.results.filter(i => i.id === initialData.genre)[0].subgenres.filter(i => i.id === initialData.subgenre)[0].name} : false)

    }

    if(initialData.sub_user)
    {
      subUserIdSET(initialData.sub_user);
      setSubUserEndpoint(`sub-user/${initialData.sub_user}/`);
      setParentUserOnly('');
    }
  }, [genres, initialData])


  useEffect(() => {

    if ( loadingGenres ) return undefined;


    let formID = document.getElementById("releaseForm");
    let fv = formValidation(formID, opt)
    fvRef.current = fv;
    
      fv.on("core.form.validating", function(e) {
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
        checkTrackURL(listOfTracks, stateRef.current)
      })
      .on("core.element.validated", function(e) {
        const item = e.field;

        if(item === 'releaseGenre') {
          if(!e.valid) {
            isGenreValidSET(false);
          } else {
            isGenreValidSET(true);
          }
        }

        if(item === 'releaseLabel') {
          if(!e.valid) {
            isLabelValidSET(false);
          } else {
            isLabelValidSET(true);
          }
        }

        if(item === 'releaseSubGenre') {
          if(!e.valid) {
            isSubGenreValidSET(false);
          } else {
            isSubGenreValidSET(true);
          }
        }

        if(item === 'releaseTerritories') {
          if(!e.valid) {
            isTerritoriesValidSET(false);
          } else {
            isTerritoriesValidSET(true);
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
          return;
        }
      })
      .on("core.field.invalid", function(e) {
        if (e) {
          setFormError(true);
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
        if (initialData.tracks.length !== listOfTracks.length && (!currentUser.unlimited_track_amount && (currentUser.total_allowed_track_amount < listOfTracks.length ))) {
          setLimitText(`Your current track limit is ${currentUser.total_allowed_track_amount} ${currentUser.total_allowed_track_amount > 1 ? "tracks.": "track."}  In order to upload more tracks please upgrade your account or contact our support team.`);
          return false;
        }

        const validDetails = checkTrackURL(listOfTracks, stateRef.current);
        const notValidCatNo = await checkCatalogNumberReturn(document.querySelector('[name="releaseCatalogNumber"]').value, token, (val) => duplicatesState(val), initialData.catalogue_number).then(r => r);

        if (validDetails !== 0 || duplicatedCatNumberError || notValidCatNo) {
          setFormError(true);
          return false;
        }

        const formatedTracks = await listOfTracks.map((i, index) => {
          const el = getElByKey(stateRef.current, i.key)[0];
          const fixForUrl = el.URL.includes('amazonaws.com') ? el.URL.split('media/')[1] : el.URL;
          const fixForUrl2 = fixForUrl.split("?AWSAccessKeyId")[0];
          let obj = {
            "order": index,
            "name": i.track_name,
            "mix_name": i.track_mix_name,
            "resource": fixForUrl2,
            "album_only": i.album_only,
            "track_lenght": toHHmmSS(el.track_lenght),
          }
          if (i.created_id) {
            obj["id"] = i.created_id;
          }

          return obj
        });

        const formatedArtists = listOfArtists.reduce((unique, i, index) => {
          if (!unique.some(u => u.artist === i.name.value)) {
            unique.push({
              "order": index,
              "artist": i.name.value,
              "kind": i.type.value
            });
          }
          return unique;
        }, []);

        let kind;
        const trackCount = listOfTracks.length;
        const tracksDuration = await stateRef.current.map(i => {
          const isNumber = !isNaN(i.track_lenght);
          if (isNumber) {
            return i.track_lenght
          } else {
            const a = i.track_lenght.split(':');
            return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
          }

        });
        const tracksLongerThan600 = tracksDuration.filter(i => i > 600).length;
        const tracksTotalTime = tracksDuration.reduce((a, b) => a + b);
        const variousArtists = listOfArtists.filter(
          i => i.name.name === "Various Artists"
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
        } else {
          kind = "album";
        }

        const ean_checkbox = formID.querySelector('#autoEAN').checked;
        const auto_detect_language = formID.querySelector('#autoDetectLanguage').checked;

        const dataObject = {
          "name": formID.querySelector('[name="releaseName"]').value,
          "release_version": formID.querySelector('[name="releaseVersion"]').value,
          "auto_detect_language": auto_detect_language,
          ...(!auto_detect_language && { "language": selectRefs.current.language.value?.toUpperCase() | ''}),
          "label": Number(selectRefs.current.labelSelected.value),
          "publisher": formID.querySelector('[name="releaseCopyrightPublisher"]').value,
          "publisher_year": formID.querySelector('[name="releaseCopyrightYearPublisher"]').value,
          "copyright_holder": formID.querySelector('[name="releaseCopyright"]').value,
          "copyright_holder_year": formID.querySelector('[name="releaseCopyrightYear"]').value,
          "genre": Number(selectRefs.current.selectedGenre.value),
          "subgenre": Number(selectRefs.current.selectedSubGenre.value),
          "kind": kind,
          "catalogue_number": formID.querySelector('[name="releaseCatalogNumber"]').value,
          "notes": formID.querySelector('[name="releaseDescription"]').value,
          "is_new_release": Number(selectRefs.current.isNewRelease.value),
          "original_date": selectRefs.current.isNewRelease.value? formID.querySelector('#officialReleaseDate').value: formID.querySelector('#originalReleaseDate').value,
          "official_date": formID.querySelector('#officialReleaseDate').value,
          "exclusive_shop": formID.querySelector('[name="releaseExclusiveDate"]').value,
          "territory": formID.querySelector('[name="releaseTerritories"]').value,
          "countries": formID.querySelector('#selectedTerry').value.split('--'),
          "backcatalog":  formID.querySelector('#backcatalog').checked,
          "generate_ean": ean_checkbox,
          ...(!ean_checkbox && { "ean": formID.querySelector('[name="releaseEAN_UPC"]').value || ''}),
          "tracks": formatedTracks,
          "artists": formatedArtists,
          ...(artwork && {"artwork": formID.querySelector('#artworkURL').value}),
          "edited_after_qc": true,
          ...((initialData.status === "distributed") && {"status": "re_delivery-editing"}),
        }

        axios({
          method: "PATCH",
          mode: 'cors',
          url: `${API_URL}releases/${currentID}/`,
          data: dataObject,
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": X_API_KEY,
            "Content-Type": "application/json"
          }
        }).then(function(response) {
          if (response.status === 200) {
            setNewReleaseId(response.data.id)
            if(initialData.tracks.length !== response.data.tracks.length){
              axios({
                mode: 'cors',
                method: "patch",
                url: `${API_URL}releases/${response.data.id}/`,
                data:{
                  "status": 'offline'
                },
                headers: {
                  Authorization: `Bearer ${token}`,
                  "x-api-key": X_API_KEY,
                  "Content-Type": "application/json"
                }
              }).then(function(response) {
                if (response.status === 200) {
                  addedReleaseModalSET(true);
                }
              });
            } else {
              addedReleaseModalSET(true);
            }
          }
        });
      })
      .on('core.form.invalid', function(event) {
        setFormError(true);
      });

      fv.registerValidator('releaseVersionMissingOne', releaseVersionMissingOneValidator);
      fv.registerValidator('releaseVersionInvalid', releaseVersionInvalidValidator);
      fv.registerValidator('releaseVersionMissingTwo', releaseVersionMissingTwoValidator);
  }, [ loadingGenres, originalReleaseDate, officialReleaseDate, artworkURL, listOfArtists, listOfTracks, selectedTerritories, duplicatedCatNumber, duplicatedCatNumberError, artworkFileError, trackFileError, labelSelected, isNewRelease])


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
      { value: 1, label: "Yes" },
      { value: 0, label: "No" },
    ];

    const artistProps = {
      listOfArtists,
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
      manageTrackDataDetails,
      removeTrack,
      addNewTrack,
      manageTrackDataFile,
      trackOrderChange,
      listOfTracksSET,
      manageDropboxTrackDataFile,
      manageDropboxTrackFileMetdataError,
      addMixNameValidator,
      removeMixNameValidator,
      revalidateField,
    };

  return (
    <>
      <Card>
        <LoaderInner show={initialData.id ? false : true}/>
        <CardBody className="errorCont">
          <Row>
            <Col>
              <CardTitle tag="h4">Update Release</CardTitle>
            </Col>
          </Row>
          <Form id="releaseForm">
            <FormGroup>
              <Label>Release Name</Label> <Badge color="primary">Required</Badge>
              <Input 
                id="releaseName"
                name="releaseName"
                type="text"
                defaultValue={initialData.name}
                onFocus={() => {revalidateField("releaseName")}}
                onChange={() => {
                  if(blockedSubmit) {
                    setBlockedSubmit(false);
                  }
                }}
              />
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
                onFocus={() => {
                  revalidateField(`releaseVersion`)
                }}
                onBlur={() => {
                  revalidateField(`releaseVersion`)
                }}
                onChange={() => {
                  if(blockedSubmit){
                    setBlockedSubmit(false);
                  }
                }}
                placeholder="Leave blank if you are not sure or if this is a regular release"
              />
              { (hasQCFeedback && qcFeedback["release_version"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["release_version"]} /> }
              <FormText color="muted">
                Some releases are released in more than one version, if so
                please enter the version name. If your release is
                original/standard release please ignore this field.
              </FormText>
            </FormGroup>

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
                  if(labelSelected.label !== e.label) {
                    if(blockedSubmit){
                      setBlockedSubmit(false);
                    }
                    labelSelectedSET(e);
                  }
                  revalidateField("releaseLabel")
                }}
                placeholder="Select Label..."
              />

              <input className="hiddenInput" type="text" id="releaseLabel" name="releaseLabel" value={labelSelected} readOnly/>

            </FormGroup>

            <ArtistRow values={artistProps}  blockedValeues={{blockedSubmit, setBlockedSubmit}}/>
            { (hasQCFeedback && qcFeedback["artists"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["artists"]} /> }
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
                    placeholder="Usually your label name"
                    defaultValue={initialData.copyright_holder}
                    onFocus={() => {revalidateField("releaseCopyright")}}
                    onChange={() => {
                      if(blockedSubmit) {
                        setBlockedSubmit(false);
                      }
                    }}
                  />
                  { (hasQCFeedback && qcFeedback["c_line_text"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["c_line_text"]} /> }
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Copyright © Year</Label> <Badge color="primary">Required</Badge>
                  <Input
                    type="number"
                    id="releaseCopyrightYear"
                    name="releaseCopyrightYear"
                    maxLength="4"
                    placeholder="YYYY"
                    defaultValue={initialData.copyright_holder_year}
                    onFocus={() => {revalidateField("releaseCopyrightYear")}}
                    onChange={() => {
                      if(blockedSubmit){
                        setBlockedSubmit(false);
                      }
                    }}
                  />
                  { (hasQCFeedback && qcFeedback["c_line_year"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["c_line_year"]} /> }
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
                    placeholder="Usually your label name"
                    defaultValue={initialData.publisher}
                    onFocus={() => {revalidateField("releaseCopyrightPublisher")}}
                    onChange={() => {
                      if(blockedSubmit){
                        setBlockedSubmit(false);
                      }
                    }}
                  />
                  { (hasQCFeedback && qcFeedback["p_line_text"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["p_line_text"]} /> }
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Copyright ℗ Year</Label> <Badge color="primary">Required</Badge>
                  <Input
                    type="number"
                    id="releaseCopyrightYearPublisher"
                    name="releaseCopyrightYearPublisher"
                    maxLength="4"
                    placeholder="YYYY"
                    defaultValue={initialData.publisher_year}
                    onFocus={() => {revalidateField("releaseCopyrightYearPublisher")}}
                    onChange={() => {
                      if(blockedSubmit){
                        setBlockedSubmit(false);
                      }
                    }}
                  />
                  { (hasQCFeedback && qcFeedback["p_line_year"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["p_line_year"]} /> }
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
                    value={selectedGenre}
                    components={{ IndicatorSeparator:() => null }}
                    options={optionsGenres}
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
                      if(blockedSubmit) {
                        setBlockedSubmit(false);
                      }
                      if(selectedGenre.label !== e.label) {
                        selectedGenreSET(e)
                        selectedSubGenreSET(null)
                      }
                      revalidateField("releaseGenre");
                    }}
                  />
                  { (hasQCFeedback && qcFeedback["main_genre"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["main_genre"]} /> }
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
                    onFocus={(e) => {
                      subGenreFieldTouchedSET(true)
                      revalidateField("releaseSubGenre")
                    }}
                    onChange={(e) => {
                      if(blockedSubmit) {
                        setBlockedSubmit(false);
                      }
                      selectedSubGenreSET(e)
                      revalidateField("releaseSubGenre")
                    }}
                  />
                  { (hasQCFeedback && qcFeedback["main_subgenre"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["main_subgenre"]} /> }
                </FormGroup>
              </Col>
            </Row>

            <FormGroup>
              <Label>Catalog Number</Label> <Badge color="primary">Required</Badge>
              <Input
                type="text"
                id="releaseCatalogNumber"
                name="releaseCatalogNumber"
                defaultValue={initialData.catalogue_number}
                onFocus={() => {
                  revalidateField("releaseCatalogNumber");
                  duplicatesState(null)
                }}
                onBlur={(e) => checkCatalogNumber(e.target.value, token, (val) => duplicatesState(val), initialData.catalogue_number)}
                onChange={(e) => {
                  if(blockedSubmit) {
                    setBlockedSubmit(false);
                  }
                  revalidateField("releaseCatalogNumber");
                }}
              />
              { (hasQCFeedback && qcFeedback["catalog_number"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["catalog_number"]} /> }
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
                    onChange={(e) => {
                      artworkChange(e);
                      if(blockedSubmit){
                        setBlockedSubmit(false);
                      }
                    }}
                    onFocus={() => {
                      revalidateField("releaseArtwork");
                    }}
                    accept=".jpeg,.jpg"
                  />
                  <div className="artworkUploadContainer">
                    <div className="artworkUpload" id={`uploadProgress_rawu`}></div>
                    <div className="artworkUploadProgresDiv">
                      <span id={`uploadProgress_text_rawu`}></span>
                    </div>
                  </div>
                  <DropboxChooser 
                    keyUploading={"rawu"}
                    handleFileMetadataError={manageDropboxReleaseArtworkFileMetadataError}
                    handleDropboxUploadComplete={manageDropboxReleaseArtworkFile}
                    fileType={"image"}
                    acceptedExtensions={[".jpg"]}
                    s3Path={"direct/release_artwork"}
                    clearArtworkFile={clearArtworkFile}
                  />
                  {artwork ? (
                    <img
                      src={artwork}
                      style={{ width: "300px", padding: "10px 0" }}
                      alt={"Your artwork"}
                    />
                  ) : initialData.artwork ?
                    <img
                      src={initialData.artwork.thumb_medium}
                      style={{ width: "300px", padding: "10px 0" }}
                      alt={"Your artwork"}
                    />
                    : null
                  }
                  <input className="hiddenInput" id="artworkURL" type="text" value={artworkURL || ''} onChange={(e) => e}/>
                  { (hasQCFeedback && qcFeedback["cover_art"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["cover_art"]} /> }
                  <FormText color="muted">
                    Upload JPG formats, resolution only 3000x3000 px, @ 72
                    dpi
                  </FormText>
                  <div className="fv-help-block" style={{ display: 'none'}}  id={`err_release_artwork_rawu`}></div>
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
                      if(blockedSubmit) {
                        setBlockedSubmit(false);
                      }
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
                      value={originalReleaseDate ? formatDate(originalReleaseDate) : initialData.original_date}
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
                          if(blockedSubmit){
                            setBlockedSubmit(false);
                          }
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
                    { (hasQCFeedback && qcFeedback["original_release_date"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["original_release_date"]} /> }
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
                    value={officialReleaseDate ? formatDate(officialReleaseDate) : initialData.official_date}
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
                        if(blockedSubmit){
                          setBlockedSubmit(false);
                        }
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
                      disabled={isNewRelease.value}
                      checked={backcatalog}
                      onChange={(e) =>{
                        if(blockedSubmit){
                          setBlockedSubmit(false);
                        }
                        backcatalogSET(!backcatalog)
                      }}
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
                          modalAssistedDaysSET(!modalAssistedDays)
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
                    components={{ IndicatorSeparator:() => null }}
                    id="releaseExclusiveDate"
                    name="releaseExclusiveDate"
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
                      if(blockedSubmit){
                        setBlockedSubmit(false);
                      }
                      releaseExclusiveDateSET(e);
                    }}
                    value={releaseExclusiveDate}
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
                      defaultValue={initialData.notes}
                      onFocus={() => {revalidateField("releaseDescription")}}
                      onChange={(e) => {
                        if(blockedSubmit){
                          setBlockedSubmit(false);
                        }
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col>                    
                  <FormGroup>
                    <Label>Release Name Language</Label> <Badge color="primary">Required</Badge>
                    <Select
                      components={{ IndicatorSeparator:() => null }}
                      options={Langs}
                      id="releaseLanguage"
                      name="releaseLanguage"
                      isDisabled={autoDetectLanguage}
                      onChange={(e) => {
                        if(blockedSubmit){
                          setBlockedSubmit(false);
                        }
                        languageSET(e);
                      }}
                      value={language}
                    />

                    { (hasQCFeedback && qcFeedback["language"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["language"]} /> }

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
                    <Label>EAN / UPC</Label> <Badge color="primary">Required</Badge>
                    <Input
                      type="text"
                      id="releaseEAN_UPC"
                      name="releaseEAN_UPC"
                      placeholder="Leave blank if you are not sure!"
                      className="input-reset"
                      disabled={eanUnlocked}
                      onChange={e => {
                        if(blockedSubmit){
                          setBlockedSubmit(false);
                        }
                        validateEAN(e.target.value);
                      }}
                      defaultValue={initialData.ean}
                    />
                    <FormText color="muted">
                      The Universal Product Code or European Article Number for the
                      release. Valid ​codes are 13 digits number. If you don' t have
                      your own, we will generate one for you.
                    </FormText>
                    {eanNumber.map((i, index) => {
                      if (i.valid) return false;
                      return (
                        <div className="fv-help-block" key={i.message}>
                          {i.message}
                        </div>
                      );
                    })}

                    <FormGroup check inline>
                      <Label check>
                        <CustomInput
                          type="checkbox"
                          id="autoEAN"
                          name="autoEAN"
                          checked={eanUnlocked}
                          value={eanUnlocked}
                          onChange={(e) => {
                            if(blockedSubmit){
                              setBlockedSubmit(false);
                            }
                            handleEanUnlock(e);
                          }}
                        />{" "}
                        Auto generate (ean)
                      </Label>
                    </FormGroup>
                  </FormGroup>
                </Col>
              </Row>
            </Collapse>

            <Row style={{ paddingBottom: "10px" }}>
              <Col>
                <FormGroup>
                  <Label>Territories</Label> <Badge color="primary">Required</Badge>
                  <Select
                    components={{ IndicatorSeparator:() => null }}
                    options={optionsTerritories}
                    id="releaseTerritories"
                    name="releaseTerritories"
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
                      if(blockedSubmit){
                        setBlockedSubmit(false);
                      }
                      releaseTerritoriesSET(optionsTerritories.filter(i => i.value === e.value.value)[0]);
                      revalidateField("releaseTerritories");
                    }}
                    value={releaseTerritories}
                  />
                  { (hasQCFeedback && qcFeedback["territories"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["territories"]} /> }
                </FormGroup>
              </Col>
            </Row>

            {
            !isWorldWide &&
              <Row style={{ paddingBottom: 20 }}>
                <Col>
                  <Label>Countries</Label>
                  <CountriesSelect  blockedValeues={{blockedSubmit, setBlockedSubmit}} selected={selectedTerritories ? selectedTerritories : []} setSelected={handleSelectedTerritories} disabled={isWorldWide}/>
                </Col>
              </Row>
            }
            <input id="selectedTerry" type="text" className="hiddenInput" value={selectedTerritories ? selectedTerritories.map(i => i.value).join('--') : ''} onChange={() => false }/>

            <FormGroup>
              <input className="hiddenInput" type="text" id="atleastOneCountrySelected" name="atleastOneCountrySelected" value={atleastOneCountrySelected} readOnly/>
            </FormGroup>

            <TrackRow
              values={trackProps}
              id="releaseTracks"
              name="releaseTracks"
              updateRelease={true}
              status={initialData.status}
              blockedValeues={{blockedSubmit, setBlockedSubmit}}
            />
            {
              blockedSubmit ?
              <>
              <Button id="releaseSubmitBTN" color="success" disabled={true}>
                Submit Form
              </Button>
              <Button id="releaseSaveAndContinue" color="success" disabled={true} style={{marginLeft: 10}}>
                Save and continue
              </Button>
              </>
            :
              <>
              <Button
                id="releaseSubmitBTN"
                color="success"
                type="submit"
                onClick={() => {
                  setSumbitType(0)
                }}
                disabled={(listOfTracks.length !== listOfTracksDetails.length) || formErrRef.current || artworkFileError || trackFileError}
              >
                Submit Form
              </Button>
              <Button
                style={{marginLeft: 10}}
                type="submit"
                id="releaseSaveAndContinue"
                color="success"
                onClick={() => {
                  setSumbitType(1)
                }}
                disabled={(listOfTracks.length !== listOfTracksDetails.length) || formErrRef.current || artworkFileError || trackFileError}
              >
              Save and continue
            </Button>
              </>
            }
            {
              (formErrRef.current || artworkFileError || trackFileError) &&  <p className="fv-help-block" style={{marginTop: 15}}>Form cannot be submited! Please fill all fields and check errors!</p>
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
        <ModalHeader>Release updated!</ModalHeader>
        <ModalBody>Your release was successfully updated!</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => {
            addedReleaseModalSET(false);

            if (submitType === 0) {
              redirectSET(true);
            } else {
              redirectTracksSET(true);
            }
            }}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
      {redirect ? <Redirect to="/releases" /> : null}
      {redirectTracks ? <Redirect to={`/releases/${newReleaseID}/tracks`} /> : null}
    </>
  );


}
export default ReleaseForm;
