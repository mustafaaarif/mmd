import React, {useState, useContext, useRef} from "react";
import axios from "axios";
import Select from "react-select";
import { Navigate } from "react-router-dom";

import {
  Col,
  Row,
  Form,
  FormGroup,
  Badge,
  Label,
  Collapse,
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
  ModalFooter,
} from "reactstrap";

import ReleaseCalendar from "./ReleaseCalendar";
import ArtistRow from "./ArtistRow";
import TrackRow from "./TrackRow";
import CountriesSelect from "../../components/countriesSelect";

import formValidation from "../../validations/es6/core/Core";
import ean from "../../validations/es6/validators/ean";
import stringLength from "../../validations/es6/validators/stringLength";
import { getCookie } from "../../jwt/_helpers/cookie";
import { opt } from "./validationOpt";
import {StateContext} from "../../utils/context";
import {getUser} from "../../utils/getUser";

import LoaderInner from "../../components/LoaderInner"
import DropboxChooser from "../../components/dropboxChooser";
import AsyncDropdownFeedback from "../../components/asyncDropdownFeedback";

import { checkTrackValidation, checkDropboxTrackFileValidation, checkDropboxReleaseArtworkFileValidation, uploadS3, releaseArtworkUpload, getElByKey, checkTrackURL, checkCatalogNumber, checkCatalogNumberReturn } from "./helperFunctions";

import "./releaseForm.css";

import Langs from "../../utils/languages.json";
import { useEffect } from "react";

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

let keyrandom = makeid(20);
let keyrandomTwo = makeid(20);

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
  const token = getCookie('token');
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
  const {currentUser, setCurrentUser} = useContext(StateContext);
  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');
  const [subUser, setSubUser] = useState('');
  const [subUserId, setSubUserId] = useState(null);
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  const [listOfArtists, listOfArtistsSET] = useState([{ name: "", type: { value: 'main', label: 'Main Artist' }, order: 1, key: keyrandomTwo }]);
  const [listOfTracks, listOfTracksSET] = useState([{
    order: 1,
    track_name: "",
    track_mix_name: "",
    album_only: false,
    key: keyrandom
  }])
  const [listOfTracksDetails, listOfTracksDetailsSET] = useState([])
  const [loadingGenres, loadingGenresSET] = useState(true);
  const [selectedGenre, selectedGenreSET] = useState(null);
  const [selectedSubGenre, selectedSubGenreSET] = useState(null);
  const [language, languageSET] = useState('');
  const [autoDetectLanguage, autoDetectLanguageSET] = useState(true);
  const [genres, genresSET] = useState(null);
  const [selectedTerritories, selectedTerritoriesSET] = useState([]);
  const [artwork, artworkSET] = useState(null);
  const [artworkURL, artworkURLSET] = useState(null);
  const [successAddedNew, successAddedNewSET] = useState(false);
  const [eanUnlocked, eanUnlockedSET] = useState(true);
  const [eanNumber, eanNumberSET] = useState([{ valid: true }]);
  const [isNewRelease, isNewReleaseSET] = useState({ value: 1, label: "Yes" });
  const [exclusiveStoreReleaseDate, exclusiveStoreReleaseDateSET] = useState({ value: undefined, label: "No exclusive" });
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

  const [labelSelected, labelSelectedSET] = useState('');
  const [atleastOneCountrySelected, atleastOneCountrySelectedSET] = useState('');

  const [limitText, setLimitText] = useState(false);
  const [duplicatedCatNumber, setDuplicatedNumber] = useState(null);
  const [duplicatedCatNumberError, setDuplicateError] = useState(null);
  const [formError, setFormError] = useState(false);
  const [artworkFileError, setArtworkFileError] = useState(false);
  const [trackFileError, setTrackFileError] = useState(false);

  const [submitType, setSumbitType] = useState(0);

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
  const [subuserFieldTouched, subuserFieldTouchedSET] = useState(false);
  const [genreFieldTouched, genreFieldTouchedSET] = useState(false);
  const [subGenreFieldTouched, subGenreFieldTouchedSET] = useState(false);
  const [newReleaseFieldTouched, newReleaseFieldTouchedSET] = useState(false);
  const [esrdFieldTouched, esrdFieldTouchedSET] = useState(false);
  const [territoriesFieldTouched, territoriesFieldTouchedSET] = useState(false);
  const [submitInProgress, submitInProgressSET] = useState(false);


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

  const clearArtworkFile = () => {
    disableValidator("releaseArtwork", "notEmpty");
    if(artworkFileRef.current) {
      artworkFileRef.current.value = "";
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
    if(selectedGenre!==event.label)
    {
      selectedGenreSET(event.label)
      selectedSubGenreSET(null)
    }
  }

  const handleEanUnlock = (e) => {
    eanUnlockedSET(!eanUnlocked)
  }

  const handleAutoDetectLanguage = (e) => {
    autoDetectLanguageSET(!autoDetectLanguage)
  }

  const artworkChange = (event) => {
    setArtworkFileError(false);
    enableValidator("releaseArtwork", "notEmpty");
    if(document.getElementById("err_release_artwork_rawa").style.display === "block") {
      document.getElementById("err_release_artwork_rawa").style.display = "none";
    }
    document.getElementById(`uploadProgress_rawa`).style.width = '0%';
    document.getElementById(`uploadProgress_text_rawa`).innerHTML = '';
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
    listOfArtistsSET(newList);
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
          element[value] = key
        }
        return element;
      });
      listOfArtistsSET(newList)
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
    if(fvRef.current)
    {
      let fv = fvRef.current;
      let indexToAdd = obj.length-1;
      fv.addField('track[' + indexToAdd + '].name', trackNameValidators)
    }
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
      const validateDropboxTrackFile = checkDropboxTrackFileValidation(fileMetadata);

      if(!validateDropboxTrackFile.valid)
      {
        setTrackFileError(true)
        document.getElementById(`track_${fileKey}`).value = "";
        document.getElementById(`err_track_file_${fileKey}`).style.display = "block";
        document.getElementById(`err_track_file_${fileKey}`).innerText = validateDropboxTrackFile.message;
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

  const duplicatesState =  e => {
    setDuplicatedNumber(e)
    setDuplicateError(e ? true : false);
  }

  useEffect(() => {
    axios.get(`${API_URL}genres/`, options).then(res => {
      genresSET(res.data);
      loadingGenresSET(false)
    });

    try {
      axios.post(`${API_URL}dropbox-upload/`, {"request_type": "warm-up"}, options);
    } catch (error) {
      console.error("Error during warm up:", error);
    }

  }, [])

  useEffect(() => {
    if(!isWorldWide && selectedTerritories.length>0) {
      atleastOneCountrySelectedSET('yes');
    } else {
      atleastOneCountrySelectedSET('');
    }
    revalidateField("atleastOneCountrySelected")
  }, [isWorldWide, selectedTerritories])


  useEffect(() => {
    if ( loadingGenres ) return undefined;

    let formID = document.getElementById("releaseForm");
    let fv = formValidation(formID, opt);
    fvRef.current = fv;
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

        const validDetails = checkTrackURL(tracksListREF.current, tracksDetailsREF.current);
        const notValidCatNo = await checkCatalogNumberReturn(document.querySelector('[name="releaseCatalogNumber"]').value, token, (val) => duplicatesState(val)).then(r => r);

        if (validDetails !== 0 || duplicatedCatNumberError || notValidCatNo) {
          setFormError(true);
          submitInProgressSET(false);
          return false;
        }

        const formatedTracks = await tracksListREF.current.map(i => {
          const el = getElByKey(tracksDetailsREF.current, i.key)[0];
          return ({
            "order": i.order - 1,
            "name": i.track_name,
            "mix_name": i.track_mix_name,
            "resource": el.URL,
            "album_only": i.album_only,
            "track_lenght": toHHmmSS(el.duration),
            "artists": [],
          })
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

        const ean_checkbox = formID.querySelector('#autoEAN').checked;
        const auto_detect_language = formID.querySelector('#autoDetectLanguage').checked;
        
        const dataObject = {
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
          "original_date": isNewRelease.value? formID.querySelector('#officialReleaseDate').value: formID.querySelector('#originalReleaseDate').value,
          "exclusive_shop": formID.querySelector('[name="releaseExclusiveDate"]').value,
          "territory": formID.querySelector('[name="releaseTerritories"]').value,
          "countries": formID.querySelector('#selectedTerry').value.split('--'),
          "backcatalog":  formID.querySelector('#backcatalog').checked,
          "generate_ean": ean_checkbox,
          ...(!ean_checkbox && { "ean": formID.querySelector('[name="releaseEAN_UPC"]').value || ''}),
          "artwork": formID.querySelector('#artworkURL').value,
          "artists": formatedArtists,
          "tracks": formatedTracks,
          ...(subUserId && { "sub_user_id": subUserId || null}),
        };


        axios({
          method: "post",
          mode: 'cors',
          url: `${API_URL}releases/`,
          data: dataObject,
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
      })
      .on('core.form.invalid', function(event) {
        setFormError(true);
        submitInProgressSET(false);
      });
      fv.registerValidator('releaseVersionMissingOne', releaseVersionMissingOneValidator);
      fv.registerValidator('releaseVersionInvalid', releaseVersionInvalidValidator);
      fv.registerValidator('releaseVersionMissingTwo', releaseVersionMissingTwoValidator);
  }, [loadingGenres, originalReleaseDate, officialReleaseDate, artworkURL, listOfArtists, listOfTracks, selectedTerritories, labelSelected, duplicatedCatNumber, duplicatedCatNumberError, formErrRef, artworkFileError, trackFileError, subUserId, isNewRelease, submitInProgress])


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

    const exclusiveStoreRelaseOptions = [
      { value: null, label: "No exclusive" },
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
              <CardTitle tag="h4">Add New Release</CardTitle>
            </Col>
          </Row>
          <Form id="releaseForm">
            <FormGroup>
              <Label>Release Name</Label> <Badge color="primary">Required</Badge>
              <Input
                id="releaseName"
                name="releaseName"
                type="text"
                onFocus={() => {revalidateField("releaseName")}}
              />
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
                placeholder="Leave blank if you are not sure or if this is a regular release"
                onFocus={() => {revalidateField("releaseVersion")}}
                onChange={() => {revalidateField("releaseVersion")}}
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
                            listOfArtistsSET([{ name: "", type: { value: 'main', label: 'Main Artist' }, order: 1, key: keyrandom }]);
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
                          listOfArtistsSET([{ name: "", type: { value: 'main', label: 'Main Artist' }, order: 1, key: keyrandom }]);
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

            </FormGroup>

            <ArtistRow values={artistProps} />
            {successAddedNew && (
              <Alert color="success">New Artist has been added!</Alert>
            )}

            <Row>
              <Col>
                <FormGroup>
                  <Label>Copyright ©</Label> <Badge color="primary">Required</Badge>
                  <Input
                    id="releaseCopyright"
                    name="releaseCopyright"
                    type="text"
                    placeholder="Usually your label name"
                    onFocus={() => {revalidateField("releaseCopyright")}}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Copyright © Year</Label> <Badge color="primary">Required</Badge>
                  <Input
                    id="releaseCopyrightYear"
                    name="releaseCopyrightYear"
                    type="number"
                    maxLength="4"
                    placeholder="YYYY"
                    onFocus={() => {revalidateField("releaseCopyrightYear")}}
                  />
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col>
                <FormGroup>
                  <Label>Copyright ℗</Label> <Badge color="primary">Required</Badge>
                  <Input
                    id="releaseCopyrightPublisher"
                    name="releaseCopyrightPublisher"
                    type="text"
                    placeholder="Usually your label name"
                    onFocus={() => {revalidateField("releaseCopyrightPublisher")}}
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label>Copyright ℗ Year</Label> <Badge color="primary">Required</Badge>
                  <Input
                    id="releaseCopyrightYearPublisher"
                    name="releaseCopyrightYearPublisher"
                    type="number"
                    maxLength="4"
                    placeholder="YYYY"
                    onFocus={() => {revalidateField("releaseCopyrightYearPublisher")}}
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
                onFocus={() => {
                  revalidateField("releaseCatalogNumber");
                  duplicatesState(null)
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
                  <input
                    type="file"
                    id="releaseArtwork"
                    name="releaseArtwork"
                    innerref={artworkFileRef}
                    onChange={(e) => artworkChange(e)}
                    onFocus={() => {
                      revalidateField("releaseArtwork");
                    }}
                    accept=".jpeg,.jpg"
                  />
                  <div className="artworkUploadContainer">
                    <div className="artworkUpload" id={`uploadProgress_rawa`}></div>
                    <div className="artworkUploadProgresDiv">
                      <span id={`uploadProgress_text_rawa`}></span>
                    </div>
                  </div>
                  <DropboxChooser 
                    keyUploading={"rawa"}
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
                  <input className="hiddenInput" id="artworkURL" name="artworkURL" type="text" value={artworkURL || ''} onChange={(e) => e}/>
                  <FormText color="muted">
                    Upload JPG formats, resolution only 3000x3000 px, @ 72
                    dpi
                  </FormText>
                  <div className="fv-help-block" style={{ display: 'none'}} id={`err_release_artwork_rawa`}></div>
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
                    <input
                      type="checkbox"
                      id="backcatalog"
                      name="backcatalog"
                      disabled={isNewRelease.value}
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
                    <input
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
                    components={{ IndicatorSeparator:() => null }}
                    id="releaseExclusiveDate"
                    name="releaseExclusiveDate"
                    options={exclusiveStoreRelaseOptions}
                    value={exclusiveStoreReleaseDate}
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
                      components={{ IndicatorSeparator:() => null }}
                      options={Langs}
                      id="releaseLanguage"
                      name="releaseLanguage"
                      isDisabled={autoDetectLanguage}
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
                        <input
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
                      onChange={e => validateEAN(e.target.value)}
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

                    <FormGroup check inline className="mt-2">
                      <Label check>
                        <input
                          type="checkbox"
                          id="autoEAN"
                          name="autoEAN"
                          checked={eanUnlocked}
                          value={eanUnlocked}
                          onChange={(e) => handleEanUnlock(e)}
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

            <TrackRow
              values={trackProps}
              id="releaseTracks"
              name="releaseTracks"
            />
            <Button
              id="releaseSaveOnly"
              type="submit"
              color="success"
              onClick={() => {
                setSumbitType(0)
                submitInProgressSET(true)
              }}
              disabled={ (listOfTracks.length !== listOfTracksDetails.length) || formErrRef.current || artworkFileError || trackFileError || submitInProgress}
            >
              Save only
            </Button>
            <Button
              id="releaseSaveAndContinue"
              type="submit"
              color="success"
              style={{marginLeft: 10}}
              onClick={() => {
                setSumbitType(1)
                submitInProgressSET(true)
              }}
              disabled={(listOfTracks.length !== listOfTracksDetails.length) || formErrRef.current || artworkFileError || trackFileError || submitInProgress}
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
      {redirect ? <Navigate to="/releases" /> : null}
      {redirectTracks ? <Navigate to={`/releases/${newReleaseID}/tracks`} /> : null}
    </>
  );


}
export default ReleaseForm;
