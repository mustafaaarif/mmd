import React, {useState, useEffect, useRef, useContext, Fragment} from "react";
import axios from "axios";
import Select from "react-select";
import formValidation from "../../validations/es6/core/Core";

import { Col, Row, Form, FormGroup, Label, Input, FormText, Button, Card, CardBody, Alert, CustomInput, CardTitle, Badge, Collapse } from "reactstrap";
import ArtistRow from "../releases/ArtistRow";
import ContributorsRow from "./ContributorsRow";
import PublishersRow from "./publishersRow";
import ShareholdersRow from "./ShareholdersRow";
import CostsRow from "./CostsRow";

import QCFeedback from "../../components/qcFeedback";

import { getCookie } from "../../jwt/_helpers/cookie";
import {opt} from './tracksOptions.js';

import {formDataArray, formDataPublishers, formDataShareholders, formDataCosts} from "./helpers";

import "../releases/releaseForm.css";
import Langs from "../../utils/languages.json";
import Vocals from "../../utils/Vocals.json";
import { StateContext } from "../../utils/context";

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

const publisherNameValidators = {
  validators: {
    notEmpty: {
      message: "Please select publisher"
    },
  }
};

const publisherAuthorValidators = {
  validators: {
    notEmpty: {
      message: "Please insert the real First and Last name of the person."
    },
  }
}

const contributorNameValidators = {
  validators: {
    notEmpty: {
      message: "Please select contributor"
    },
  }
};

const contributorRoleValidators = {
  validators: {
    notEmpty: {
      message: "Please select contributor role"
    },
  }
}

const shareholderNameValidators = {
  validators: {
    // notEmpty: {
    //   message: "Please select shareholder"
    // },
  }
}

const costTypeValidators = {
  validators: {
    // notEmpty: {
    //   message: "Please select cost type"
    // },
  }
}

const excludedFields = [
  "trackName",
  "mix_name",
]

const TracksUpdate = ({id, data, releaseData,  updateState, setTrackToEdit, setSuccessEdit}) => {
  const token = getCookie().token;
  const {currentUser} = useContext(StateContext);

  const options = {
    method: "GET",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  };

  const {forceUpdate, forceUpdateSET} = updateState
  const [shareholder_roles_ops, setShareholderOps] = useState([]);
  const [metadataChanged, metadataChangedSET] = useState(false);

  const [selectedVocals, selectedVocalsSET] = useState(null);
  const [selectedGenre, selectedGenreSET] = useState(null);
  const [selectedSubGenre, selectedSubGenreSET] = useState(null);

  const [trackData,trackDataSET] = useState(null);
  const [remix, remixSET] = useState(false);
  const [album_only, album_onlySET] = useState(false);
  const [explicit_content, explicit_contentSET] = useState(false);
  const [generate_isrc, generate_isrcSET] = useState(false);
  const [originalmix, originalmixSET] = useState(false);
  const [listOfArtists, listOfArtistsSET] = useState([{ name: "", type: "", key: makeid(20) }]);
  const [listOfPublishers, listOfPublishersSET] = useState([{ order: 0, publisher: "", publisher_author: "", key: makeid(20) }]);
  const [listOfContributors, listOfContributorsSET] = useState([{ name: "", type: "", key: makeid(20) }]);
  const [listOfShareholders, listOfShareholdersSET] = useState([{ shareholder: "", split: "", roles: [], key: makeid(20) }]);
  const [listOfCosts, listOfCostsSET] = useState([{ cost_type: "", cost: "", key: makeid(20) }]);
  const [subUserId, setSubUserId] = useState(null);
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  const [parentUserOnly, setParentUserOnly] = useState('')
  const [autoDetectLanguage, autoDetectLanguageSET] = useState(true);
  const [langMetdataCollapsed, langMetadataCollapsedSET] = useState(false);
  const [accMetadataCollapsed, accMetadataCollapsedSET] = useState(false);

  const [isFVReady, setFVReady] = useState(false);

  const [isVocalsValid, isVocalsValidSET] = useState(false);
  const [isGenreValid, isGenreValidSET] = useState(false);
  const [isSubGenreValid, isSubGenreValidSET] = useState(false);

  const [vocalsFieldTouched, vocalsFieldTouchedSET] = useState(false);
  const [genreFieldTouched, genreFieldTouchedSET] = useState(false);
  const [subGenreFieldTouched, subGenreFieldTouchedSET] = useState(false);

  const [qcFeedback, qcFeedbackSET] = useState({});
  const [hasQCFeedback, hasQCFeedbackSET] = useState(false);
  
  const [contributorType, setContributorType] = useState(null);

  const [isSubmitDisabled, isSubmitDisabledSET] = useState(false);

  const [successAddedNew, successAddedNewSET] = useState(false);
  const [successAddedPublusher, successAddedPublusherSET] = useState(false);
  const [successAddedContributor, successAddedContributorSET] = useState(false);
  const [successAddedShareholder, successAddedShareholderSET] = useState(false);
  const [successAddedCostType, successAddedCostTypeSET] = useState(false);

  const [formError, setFormError] = useState(false);

  const dataRefs = useRef();
  const fvRef = useRef();
  const validationFieldsAddedRef = useRef(false);
  const formErrRef = useRef(false);

  formErrRef.current = formError;

  dataRefs.current = {
    listOfArtists,
    listOfPublishers,
    listOfContributors,
    listOfShareholders,
    listOfCosts
  }

  const revalidateField = (name) => {
    if(fvRef.current) {
      let fv = fvRef.current;
      fv.resetField(name);
      fv.revalidateField(name);
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

  const setNewArtist = () => {
    setSuccessArtist(() => successAddedNewSET(true), () => successAddedNewSET(false));
  }
  const setNewPublisher = () => {
    setSuccessArtist(() => successAddedPublusherSET(true), () => successAddedPublusherSET(false));
  }
  const setNewContributor = () => {
    setSuccessArtist(() => successAddedContributorSET(true), () => successAddedContributorSET(false));
  }
  const setNewShareholder = () => {
    setSuccessArtist(() => successAddedShareholderSET(true), () => successAddedShareholderSET(false));
  }
  const setNewCostType = () => {
    setSuccessArtist(() => successAddedCostTypeSET(true), () => successAddedCostTypeSET(false));
  }

  const setSuccessArtist = (succ, succHide) => {
    succ()
    setTimeout(() => {
      succHide()
    }, 5000);
  }


  const addNewArtist = (obj) => { 
    listOfArtistsSET(obj);
    metadataChangedSET(true);
    if(fvRef.current) {
      let fv = fvRef.current;
      let indexToAdd = obj.length-1;
      fv.addField('artist[' + indexToAdd + '].name', artistNameValidators).addField('artist[' + indexToAdd + '].type', artistTypeValidators);
      fv.revalidateField("atleastOneMainArtist");
      fv.revalidateField("duplicateArtists");
    }
  };
  const addNewPublisher = (obj) => { 
    listOfPublishersSET(obj);
    metadataChangedSET(true);
    if(fvRef.current) {
      let fv = fvRef.current;
      let indexToAdd = obj.length-1;
      fv.addField('publisher[' + indexToAdd + '].name', publisherNameValidators).addField('publisher[' + indexToAdd + '].author', publisherAuthorValidators);
    }
  };
  const addNewContributor = (obj) => {
    listOfContributorsSET(obj);
    metadataChangedSET(true);
    if(fvRef.current) {
      let fv = fvRef.current;
      let indexToAdd = obj.length-1;
      fv.addField('contributor[' + indexToAdd + '].name', contributorNameValidators).addField('contributor[' + indexToAdd + '].role', contributorRoleValidators);
    }
  };
  const addNewShareholder = (obj) => { 
    listOfShareholdersSET(obj);
  }
  const addNewCost = (obj) => {
    listOfCostsSET(obj);
  }

  useEffect(() => {
    if(currentUser?.is_premium_user && releaseData?.sub_user)
    {
      setSubUserId(releaseData.sub_user)
      setSubUserEndpoint(`sub-user/${releaseData.sub_user}/`)
      setParentUserOnly('&parent_user_only=true')
    }
  }, [currentUser, releaseData]);

  useEffect(() => {
    if (data.dataGenres.results && trackData && data.contributorRoles.results) {
      let genre = trackData.genre ? {value: trackData.genre, label: data.dataGenres.results.filter(i => i.id === trackData.genre)[0].name} : false;
      if(genre) {
        isGenreValidSET(true);
      }
      selectedGenreSET(genre);

      const genreMatch = data.dataGenres.results.find(i => i.id === trackData.genre);
      const subGenreMatch = genreMatch ? genreMatch.subgenres.find(i => i.id === trackData.subgenre) : null;
      const subGenreName = subGenreMatch ? subGenreMatch.name : null;
      const subGenre = trackData.subgenre ? {value: trackData.subgenre, label: subGenreName} : false;
      if(subGenre) {
        isSubGenreValidSET(true);
      }
      selectedSubGenreSET(subGenre);
      
      setContributorType(data.contributorRoles.results.map(i => ({value: i.id, label: i.name})))

    }
    if (data.shareholderRoles.results) {
      setShareholderOps(data.shareholderRoles.results.map(i => ({value: i.id, label: i.name})));
    }
  }, [data.dataGenres, trackData, data.contributorRoles, data.shareholderRoles]);

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
    metadataChangedSET(true);
    if(fvRef.current) {
      let fv = fvRef.current;
      let indexToRemove = newList.length;
      fv.removeField('artist[' + indexToRemove + '].name').removeField('artist[' + indexToRemove + '].type');
      fv.revalidateField("atleastOneMainArtist");
      fv.revalidateField("duplicateArtists");
    }
  }

  const removeContributor = (index) => {
    if (listOfContributors.length === 1) return false;

    const newList = listOfContributors.filter((element, i) => {
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
    listOfContributorsSET(newList);
    metadataChangedSET(true);
    if(fvRef.current) {
      let fv = fvRef.current;
      let indexToRemove = newList.length;
      fv.removeField('contributor[' + indexToRemove + '].name').removeField('contributor[' + indexToRemove + '].role');
    }
  }

  const removeShareholder = (index) => {

    const newList = listOfShareholders.filter((element, i) => {
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
    listOfShareholdersSET(newList)
  }

  const removeCost = (index) => {

    const newList = listOfCosts.filter((element, i) => {
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
    listOfCostsSET(newList);
  }

  const removePublisher = (index) => {
    if (listOfPublishers.length === 1) return false;

    const newList = listOfPublishers.filter((element, i) => {
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
    listOfPublishersSET(newList);
    metadataChangedSET(true);
    if(fvRef.current) {
      let fv = fvRef.current;
      let indexToRemove = newList.length;
      fv.removeField('publisher[' + indexToRemove + '].name').removeField('publisher[' + indexToRemove + '].author');
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
    metadataChangedSET(true);
  };

  const manageContributorsData = (index, value, key) => {

    if (key) {
      const newList = listOfContributors.map((element, i) => {
        if (index === i) {
          element[value] = key;
        }
        return element;
      });
      listOfContributorsSET(newList);
    } else {
      const newList = listOfContributors.map((element, i) => {
        if (index === i) {
          element[value] = '';
        }
        return element;
      });
      listOfContributorsSET(newList)
    }
    metadataChangedSET(true);
  };

  const managePublisherData = (index, value, key) => {
    if (key) {
      const newList = listOfPublishers.map((element, i) => {
        if (index === i) {
          element[value] = key;
        }
        return element;
      });
      listOfPublishersSET(newList);
    } else {

      const newList = listOfPublishers.map((element, i) => {
        if (index === i) {
          element[value] = '';
        }
        return element;
      });
      listOfPublishersSET(newList);
    }
    metadataChangedSET(true);
  };

  const manageShareholdersData = (index, value, key) => {

    if (key) {
      const newList = listOfShareholders.map((element, i) => {
        if (index === i) {
          element[value] = key;
        }
        return element;
      });
      listOfShareholdersSET(newList);
    } else {

      const newList = listOfShareholders.map((element, i) => {
        if (index === i) {
          element[value] = '';
        }
        return element;
      });
      listOfShareholdersSET(newList)
    }
  };

  const manageCostsData = (index, value, key) => {
    if (key) {
      const newList = listOfCosts.map((element, i) => {
        if (index === i) {
          element[value] = key;
        }
        return element;
      });
      listOfCostsSET(newList);
    } else {

      const newList = listOfCosts.map((element, i) => {
        if (index === i) {
          element[value] = '';
        }
        return element;
      });
      listOfCostsSET(newList)
    }
  };

  const optionsGenres = data.dataGenres.results
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(i => ({ value: i.id, label: i.name }));
  
  const optionSubGenres = selectedGenre
    ? data.dataGenres.results
        .filter(i => i.name === selectedGenre.label)[0]
        .subgenres
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(i => ({ value: i.id, label: i.name }))
    : [{ value: null, label: "Select..." }];

  const artistProps = {
    listOfArtistsSET,
    listOfArtists,
    // optionsArtists,
    setNewArtist,
    addNewArtist,
    removeArtist,
    manageArtistData,
    trackOrderChange,
    remix,
    subUserId,
    subUserEndpoint,
    parentUserOnly,
    revalidateField,
  };

  const contributorProps = {
    listOfContributorsSET,
    listOfContributors,
    setNewContributor,
    addNewContributor,
    removeContributor,
    manageContributorsData,
    trackOrderChange,
    subUserId,
    subUserEndpoint,
    parentUserOnly,
    selectedVocals,
    revalidateField,
  };

  const publishersProps = {
    listOfPublishersSET,
    listOfPublishers,
    setNewPublisher,
    addNewPublisher,
    removePublisher,
    managePublisherData,
    trackOrderChange,
    subUserId,
    subUserEndpoint,
    parentUserOnly,
    revalidateField,
  };

  const shareholderProps = {
    listOfShareholdersSET,
    listOfShareholders,
    setNewShareholder,
    addNewShareholder,
    removeShareholder,
    manageShareholdersData,
    trackOrderChange,
    shareholder_roles_ops,
    subUserId,
    subUserEndpoint,
    parentUserOnly,
    revalidateField,
  };

  const costProps = {
    listOfCostsSET,
    listOfCosts,
    setNewCostType,
    addNewCost,
    removeCost,
    manageCostsData,
    trackOrderChange,
    subUserId,
    subUserEndpoint,
    parentUserOnly,
    revalidateField,
  };


  useEffect(() => {
    if (!isFVReady) return;
    
    if (fvRef.current && !validationFieldsAddedRef.current) {
        let fv = fvRef.current;
        listOfArtists.forEach((artist, indexToAdd) => {
          if (indexToAdd > 0) {
            fv.addField('artist[' + indexToAdd + '].name', artistNameValidators)
              .addField('artist[' + indexToAdd + '].type', artistTypeValidators)
            fv.revalidateField("atleastOneMainArtist");
            fv.revalidateField("duplicateArtists");
          }
        });

        listOfContributors.forEach((contributor, indexToAdd) => {
          if (indexToAdd > 0) {
            fv.addField('contributor[' + indexToAdd + '].name', contributorNameValidators)
              .addField('contributor[' + indexToAdd + '].role', contributorRoleValidators);
          }
        });

        listOfPublishers.forEach((contributor, indexToAdd) => {
          if (indexToAdd > 0) {
            fv.addField('publisher[' + indexToAdd + '].name', publisherNameValidators)
              .addField('publisher[' + indexToAdd + '].author', publisherAuthorValidators);
          }
        });
        
        validationFieldsAddedRef.current = true;
    }
}, [listOfArtists, listOfContributors, listOfPublishers, listOfShareholders, listOfCosts, isFVReady]);



  useEffect(() => {
    axios.get(`${API_URL}tracks/${id}/`, options).then(res => {
      const r = res.data;
      const artistsArray = formDataArray(res.data.artists, 'artists');
      const contributorsArray = formDataArray(res.data.contributors, 'contributors');
      const publishersArray = formDataPublishers(res.data.publishers);
      const shareholdersArray = formDataShareholders(res.data.shareholders);
      const costsArray = formDataCosts(res.data.costs);

      listOfArtistsSET(artistsArray);
      listOfContributorsSET(contributorsArray);
      listOfPublishersSET(publishersArray);
      listOfShareholdersSET(shareholdersArray);
      listOfCostsSET(costsArray);

      trackDataSET(r);
      generate_isrcSET(r.generate_isrc);
      if(r.generate_isrc) {
        disableValidator("ISRC", "notEmpty");
      } else {
        enableValidator("ISRC", "notEmpty")
      }
      autoDetectLanguageSET(r.auto_detect_language);
      album_onlySET(r.album_only);
      explicit_contentSET(r.explicit_content);

      let resQCFeedback  = r.qc_feedback;
      let resQCPassed = r.qc_passed;
      if (!resQCPassed) {
        qcFeedbackSET(resQCFeedback);
        hasQCFeedbackSET(!resQCPassed);
      }

      if (r.mix_name.length > 0 || r.mix_name === null) {
        originalmixSET(false);
        remixSET(true);
      } else {
        originalmixSET(true);
        remixSET(false);
        disableValidator("mix_name");
      }

      selectedVocalsSET(
        {
          value: r.vocals,
          label: Vocals.map(function(i) {
            if (i.value.toUpperCase() === r.vocals) {
              return i.label;
            } else {
              return false;
            }
          })
        }
      );
    });
  }, [id])


  const handleAutoDetectLanguage = (e) => {
    autoDetectLanguageSET(!autoDetectLanguage)
  }


  const validateShareholders = () => {

    let shareholdersErrors = 0;
    let formID = document.getElementById("tracksForm");
    let labelShare = formID.querySelector('[name="label_share"]').value;

    let anyShareholderAdded  = false;

    listOfShareholders.map(i => {
      if(i.shareholder.label)
      {
        anyShareholderAdded = true;
      }
    });

    if (anyShareholderAdded || labelShare || labelShare!=="") {

      let labelShareFloat = parseFloat(labelShare);
      let splitSum = 0;

      if (!labelShare || labelShare === "") {
        document.getElementById(`err_label_share`).style.display="block";
        shareholdersErrors+=1;
      }
      else if (!(labelShareFloat >=1 && labelShareFloat <= 100)) {
        document.getElementById(`err_label_share`).style.display="block";
        shareholdersErrors+=1;
      }
      else {
        document.getElementById(`err_label_share`).style.display="none";
      }

      listOfShareholders.map(i => {
        let key = i.key;
        let shareholderName = i.shareholder.label;
        let shareholderRoles = i.roles;
        let split = i.split;
        let splitFloat = parseFloat(split);
  
        splitSum += splitFloat;
  
        if (split === "") {
          document.getElementById(`err_split_${key}`).style.display="block";
          shareholdersErrors+=1;
        } 
        else if (!(splitFloat>=1 && splitFloat<=100)) {
          document.getElementById(`err_split_${key}`).style.display="block";
          shareholdersErrors+=1;
        }

        else {
          document.getElementById(`err_split_${key}`).style.display="none";
        }
  
        if (shareholderName === "" || shareholderName === undefined) {
          document.getElementById(`err_name_${key}`).style.display="block";
          shareholdersErrors+=1;
        } 
        else {
          document.getElementById(`err_name_${key}`).style.display="none";
        }
  
        if (!shareholderRoles || shareholderRoles.length===0) {
          document.getElementById(`err_roles_${key}`).style.display="block";
          shareholdersErrors+=1;
        } 
        else {
          document.getElementById(`err_roles_${key}`).style.display="none";
        }
      });
  
      if (splitSum + labelShareFloat !== 100) {
        document.getElementById(`err_share_sum`).style.display="block";
        shareholdersErrors+=1;
      }
      else {
        document.getElementById(`err_share_sum`).style.display="none";
      }

    }

    return shareholdersErrors;
  }

  const validateCosts = () => {
    let costsErrors = 0;

    listOfCosts.map(i => {
      let key = i.key;
      let costType = i.cost_type.label;
      let cost = i.cost;
      let costFloat = parseFloat(cost);      

      if (listOfCosts.length===1) {
          if (!costType && (parseFloat(cost)<0)) {                     
            document.getElementById(`err_cost_type_${key}`).style.display="block";
            costsErrors+=1;
          }          
          else {
            document.getElementById(`err_cost_type_${key}`).style.display="none";
          }

          if (costType && (cost==='' || cost.length===0 || parseFloat(cost)>0)) {
            document.getElementById(`err_cost_${key}`).style.display="block";
            costsErrors+=1;
          }
          else {
            document.getElementById(`err_cost_${key}`).style.display="none";
          }
      }

      if(listOfCosts.length > 1) {
        if (!costType) {
          document.getElementById(`err_cost_type_${key}`).style.display="block";
          costsErrors+=1;
        } 
        else {
          document.getElementById(`err_cost_type_${key}`).style.display="none";
        }

        if (cost === "") {
          document.getElementById(`err_cost_${key}`).style.display="block";
          costsErrors+=1;
        } 
        else if (costFloat>0) {
          document.getElementById(`err_cost_${key}`).style.display="block";
          costsErrors+=1;
        }
        else {
          document.getElementById(`err_cost_${key}`).style.display="none";
        }
      }
    });
    return costsErrors;
  }


  useEffect(() => {
    if ( trackData === null) return undefined;

    let formID = document.getElementById("tracksForm");
    let fv = formValidation(formID, opt);
    fvRef.current = fv;
    setFVReady(true);

      fv.on("core.form.validating", function(e) {
        genreFieldTouchedSET(true)
        subGenreFieldTouchedSET(true)
        vocalsFieldTouchedSET(true)
      })
      .on("core.element.validated", function(e) {
        // console.log('e', e);
        let item = e.field;

        if(item === 'trackVocals') {
          if(!e.valid) {
            isVocalsValidSET(false);
          } else {
            isVocalsValidSET(true);
          }
        }

        if(item === 'releaseGenre') {
          if(!e.valid) {
            isGenreValidSET(false);
          } else {
            isGenreValidSET(true);
          }
        }

        if(item === 'releaseSubGenre') {
          if(!e.valid) {
            isSubGenreValidSET(false);
          } else {
            isSubGenreValidSET(true);
          }
        }

        if (e.valid) {
          const messages = [].slice.call(formID.querySelectorAll('[data-field="' + item + '"][data-validator]'));
            messages.forEach((messageEle) => {
                messageEle.style.display = 'none';
            });
            if (formErrRef.current) {
              setFormError(false);
            }
            return;
        } else {
          setFormError(true);
        }
      })
      .on("core.field.invalid", function(e) {
        if (e) {
          setFormError(true);
          return;
        }
      })
      .on("core.validator.validated",  e => {
        let item = e.field;
        let isExcludedField = excludedFields.includes(item);
        if(!isExcludedField) {
          let offset = e.result.valid? 0: 1;
          const messages = [].slice.call(formID.querySelectorAll('[data-field="' + item + '"][data-validator]'));
          for(let i = 0; i < messages.length - offset; i++) {
            const messageEle = messages[i];
            messageEle.style.display = 'none';
          }
        }
      })
      .on("core.form.valid", async e => {

        const validShareholders = validateShareholders();
        const validCosts = validateCosts();

        if (validShareholders !== 0 || validCosts !== 0) {
          return false;
        }

        const formatedArtists = await listOfArtists.map((i, index) =>({
          "order": index,
          "artist": i.name.value,
          "kind": i.type.value
        }));

        const formatedPublishers = await listOfPublishers.map((i, index) =>({
          "order": index,
          "author": i.publisher_author,
          "publisher": i.publisher.value
        }))

        const formatedContributors = await listOfContributors.map( (i, index) => ({
          "order": index,
          "contributor": i.name.value,
          "role": {
            "id": i.type.value,
            "name": i.type.label
          }
        }))

        const formatedShareholders = await listOfShareholders.reduce((filteredShareholders, shareholder, index) => {
          if (shareholder.shareholder.name && shareholder.split && shareholder.roles.length>0) {
            let shareholderObj = {
              "order": index,
              "revenue_share_holder": shareholder.shareholder.value,
              "split": shareholder.split,
              "roles": shareholder.roles.map(role => role.value)
            };
            filteredShareholders.push(shareholderObj);
          }
          return filteredShareholders;
        }, []);

        const formatedCosts = await listOfCosts.reduce((filteredCosts, cost, index) => {
          if (cost.cost_type.name && cost.cost!=="" && parseFloat(cost.cost)<0) {
            let costObj = {
              "order": index,
              "cost_type": cost.cost_type.value,
              "cost": cost.cost
            };
            filteredCosts.push(costObj);
          }
          return filteredCosts;
        }, []);

        const auto_detect_language = formID.querySelector('#autoDetectLanguage').checked;

        const dataObject = {
          "name": formID.querySelector('[name="trackName"]').value,
          "mix_name": formID.querySelector('[name="mix_name"]').value,
          "auto_detect_language": auto_detect_language,
          ...(!auto_detect_language && { "language": formID.querySelector('[name="trackLanguage"]').value.toUpperCase() || ''}),
          "vocals": formID.querySelector('[name="trackVocals"]').value.toUpperCase(),
          "artists":formatedArtists,
          "publishers": formatedPublishers,
          "contributors": formatedContributors,
          "shareholders": formatedShareholders,
          "costs": formatedCosts,
          "label_share": formID.querySelector('[name="label_share"]').value,
          "genre": formID.querySelector('[name="trackGenre"]').value,
          "subgenre": formID.querySelector('[name="trackSubGenre"]').value,
          "copyright_holder": formID.querySelector('[name="copyright"]').value,
          "copyright_holder_year": formID.querySelector('[name="copyrightYear"]').value,
          "album_only": formID.querySelector('#explicit_content').checked,
          "explicit_content": formID.querySelector('#album_only').checked,
          "ISRC":  formID.querySelector('[name="ISRC"]').value,
          "generate_isrc": formID.querySelector('#generate_isrc').checked,
        }

        axios({
          method: "PATCH",
          mode: 'cors',
          url: `${API_URL}tracks/${id}/`,
          data: dataObject,
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": X_API_KEY,
            "Content-Type": "application/json"
          }
        }).then(function(response) {
          if (response.status === 200) {
            patchTrack(response.data.id, true, metadataChanged);
            if (releaseData.status === "distributed" && metadataChanged) {

              //re_delivery-delivery
              axios({
                method: "patch",
                mode: 'cors',
                url: `${API_URL}releases/${releaseData.id}/`,
                data:{
                  "status": 're_delivery-editing'
                },
                headers: {
                  Authorization: `Bearer ${token}`,
                  "x-api-key": X_API_KEY,
                  "Content-Type": "application/json"
                }
              }).then(function(response) {
                if (response.status === 200) {
                  forceUpdateSET(forceUpdate + 1);
                  setTrackToEdit(null);
                  setSuccessEdit();
                }
              });
            }
            else
            {
              forceUpdateSET(forceUpdate + 1);
              setTrackToEdit(null);
              setSuccessEdit();
            }
          }
        });
      });
  }, [trackData, listOfArtists, listOfPublishers, listOfContributors, listOfShareholders, listOfCosts, selectedGenre, selectedSubGenre, selectedVocals, metadataChanged, formError])


  const patchTrack = (ID, status, editedAfterQC) => {
    axios({
      method: "patch",
      mode: 'cors',
      url: `${API_URL}tracks/${ID}/`,
      data:{
        "track_data_complete": status,
        "edited_after_qc": editedAfterQC,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      if (response.status === 200 && releaseData.status !== 'distributed') {

        forceUpdateSET(forceUpdate + 1);
        setTrackToEdit(null);
        setSuccessEdit();
      }
    });
  }

  return (
    trackData && (
      <Fragment key={trackData.name + trackData.id}>
        <Card>
          <CardBody>
            <Form id="tracksForm">
              <CardTitle tag="h4">Edit track {trackData.name}</CardTitle>

                  <div style={{borderTop: '1px solid #e9ecef', padding: '10px 0px', marginTop: '35px'}}>
                    <h6>Mandatory Metadata</h6>
                  </div>

                  <FormGroup>
                    <Label>Track Name</Label> <Badge color="primary">Required</Badge>
                    <Input
                      type="text"
                      name="trackName"
                      id="name"
                      defaultValue={trackData.name}
                      onFocus={() => {revalidateField("trackName")}}
                      onBlur={() => metadataChangedSET(true)}
                    />
                    { (hasQCFeedback && qcFeedback["name"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["name"]} /> }
                    <FormText color="muted">Title of the track</FormText>
                  </FormGroup>
                  <FormGroup>
                    <Label for="exampleCheckbox">Mix Name</Label>
                    <div className="custom-radio">
                      <CustomInput
                        type="radio"
                        id="originalmix"
                        value="originalmix"
                        label="Original Mix"
                        name="mixradio"
                        checked={originalmix}
                        onChange={e => {
                          originalmixSET(!originalmix);
                          remixSET(!remix);
                          disableValidator("mix_name");
                          metadataChangedSET(true);
                        }}
                      />
                      <CustomInput
                        type="radio"
                        id="remix"
                        value="remix"
                        label="This is a Remix or Mix"
                        name="mixradio"
                        checked={remix}
                        onChange={e => {
                          remixSET(!remix)
                          originalmixSET(!originalmix);
                          enableValidator("mix_name");
                          metadataChangedSET(true);
                        }}
                      />
                    </div>
                    <div style={{display: remix ? 'block': 'none'}}>
                      <Input
                        type="text"
                        name="mix_name"
                        id="mix_name"
                        defaultValue={trackData.mix_name}
                        onFocus={() => {revalidateField("mix_name")}}
                        onBlur={() => metadataChangedSET(true)}
                      />
                      { (hasQCFeedback && qcFeedback["track_version"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["track_version"]} /> }
                      <FormText color="muted">
                        Insert mix name without brackets. Some tracks are
                        released in more than one version. This Field
                        describes the version, for example "Bunte Bummler -
                        Aesub (Monika Ross Remix)"
                      </FormText>
                    </div>
                  </FormGroup>

                  <FormGroup>
                    <Label>Vocals</Label> <Badge color="primary">Required</Badge>
                    <Select
                      id={'trackVocals'}
                      name={'trackVocals'}
                      value={selectedVocals}
                      components={{ IndicatorSeparator:() => null }}
                      styles={{
                        menu: styles => ({ ...styles, zIndex: 10 }),
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: vocalsFieldTouched ? (isVocalsValid ? "#2dce89": "#f62d51"): baseStyles.borderColor,
                          boxShadow: state.isFocused || state.isHovered 
                            ? (isVocalsValid ? "0 0 0 0.2rem rgba(45, 206, 137, 0.25)" : "0 0 0 0.2rem rgba(246, 45, 81, 0.25)") 
                            : "0 0 0 1px #e9ecef",
                          borderRadius: "2px",
                        }),
                      }}
                      options={Vocals}
                      onChange={(e) => {
                        selectedVocalsSET(e);
                        metadataChangedSET(true);
                        revalidateField("trackVocals");
                        revalidateField("atleastOneLyricist");
                      }}
                      onFocus={e => {
                        vocalsFieldTouchedSET(true);
                        revalidateField("trackVocals");
                        revalidateField("atleastOneLyricist");
                      }}
                    />
                    { (hasQCFeedback && qcFeedback["audio_locale"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["audio_locale"]} /> }
                    <FormText color="muted">
                      Listen to your track in full length. If your track is
                      having any vocals, please select the language of vocals.
                      If your track is free of vocals, select the Instrumental
                      option. Double check it to be sure. If this input is
                      wrong, some stores like iTunes and Apple Music will
                      reject the release.
                    </FormText>
                  </FormGroup>
                  <div style={{paddingBottom: 30}}>
                    <ArtistRow values={artistProps} disabledAtCount={999} editTracks={true} />
                    { (hasQCFeedback && qcFeedback["artists"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["artists"]} /> }
                    {successAddedNew && (
                      <Alert color="success">A new Artist has been added!</Alert>
                    )}
                  </div>

                  <div style={{paddingBottom: 30}}>
                    <PublishersRow values={publishersProps} />
                    { (hasQCFeedback && qcFeedback["publishers"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["publishers"]} /> }
                    <FormText color="muted">
                      <p><b>Publisher name:</b> Please insert full Publishing Company Name if you are using publishing services.  If you are not using official publishing services, please insert/select <b>Copyright Control</b>. Please <b>do not insert your label name</b> if it is not a registered publishing company. Legal implications may apply.</p>
                      <p><b>Author / Songwriter full name:</b> Please insert the <b>real First and Last name</b> of the person.</p>
                    </FormText>
                    {successAddedPublusher && (
                      <Alert color="success">A new Publisher has been added!</Alert>
                    )}
                  </div>

                  <div style={{paddingBottom: 30}}>
                    <ContributorsRow values={contributorProps} contributorType={contributorType} />
                    { (hasQCFeedback && qcFeedback["contributors"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["contributors"]} /> }
                    {successAddedContributor && (
                      <Alert color="success">A new Contributor has been added!</Alert>
                    )}
                    <FormText color="muted">
                      <p><b>Contributors name:</b> Please insert the <b>real First and Last name</b> of the person.</p>
                      <p><b>Contributors roles:</b> At least one contributor must be added as a <b>Composer</b>. If your track consists of vocals, least one contributor must be added as a <b>Composer</b> and one contributor must be added as a <b>Lyricist</b>.</p>
                    </FormText>
                  </div>

                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>Genre</Label> <Badge color="primary">Required</Badge>
                        <Select
                          id="trackGenre"
                          name="trackGenre"
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
                          onChange={e => {
                            if(selectedGenre.label !== e.label) {
                              isGenreValidSET(true);
                              selectedGenreSET(e);
                              selectedSubGenreSET(null);
                              metadataChangedSET(true);
                              revalidateField("trackGenre");
                            }
                          }}
                          onFocus={e => {
                            genreFieldTouchedSET(true);
                            revalidateField("trackGenre");
                          }}
                        />
                      { (hasQCFeedback && qcFeedback["main_genre"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["main_genre"]} /> }
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Sub-Genre</Label> <Badge color="primary">Required</Badge>
                        <Select
                          id="trackSubGenre"
                          name="trackSubGenre"
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
                          onChange={(e) => {
                            isSubGenreValidSET(true);
                            selectedSubGenreSET(e);
                            metadataChangedSET(true);
                            revalidateField("trackSubGenre");
                          }} 
                          onFocus={(e) => {
                            subGenreFieldTouchedSET(true);
                            revalidateField("trackSubGenre");
                          }}
                        />
                      </FormGroup>
                      { (hasQCFeedback && qcFeedback["main_subgenre"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["main_subgenre"]} /> }
                    </Col>
                  </Row>

                  <div style={{borderTop: '1px solid #e9ecef', padding: '15px 0px', marginTop: '35px'}}>
                    <h6>Additional Metadata</h6>
                  </div>

                  <Row>
                    <Col>
                      <FormGroup>
                        <Label>Copyright ©</Label> <Badge color="primary">Required</Badge>
                        <Input
                          type="text"
                          name="copyright"
                          id="copyright"
                          defaultValue={trackData.copyright_holder.length > 0 ? trackData.copyright_holder : releaseData.copyright_holder}
                          onFocus={() => {revalidateField("copyright")}}
                          onBlur={() => metadataChangedSET(true)}
                        />
                        { (hasQCFeedback && qcFeedback["p_line_text"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["p_line_text"]} /> }
                        <FormText color="muted">
                          Copyright holder name
                        </FormText>
                      </FormGroup>
                    </Col>
                    <Col>
                      <FormGroup>
                        <Label>Copyright Year</Label> <Badge color="primary">Required</Badge>
                        <Input
                          type="number"
                          name="copyrightYear"
                          id="copyrightYear"
                          defaultValue={trackData.copyright_holder_year.length > 0 ? trackData.copyright_holder_year : releaseData.copyright_holder_year}
                          onFocus={() => {revalidateField("copyrightYear")}}
                          onBlur={() => metadataChangedSET(true)}
                        />
                      { (hasQCFeedback && qcFeedback["p_line_year"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["p_line_year"]} /> }
                      </FormGroup>
                    </Col>
                  </Row>
                  <FormGroup>
                    <Label check>
                      <CustomInput
                        type="checkbox"
                        name="album_only"
                        id="album_only"
                        checked={album_only}
                        onChange={() => {
                          album_onlySET(!album_only)
                          metadataChangedSET(true);
                        }}
                      />
                      Album Only
                    </Label>
                    <FormText color="muted">
                      Indicates whether the track will be sold only as part of
                      bundle release. Note that some shops could override this
                      instruction
                    </FormText>
                  </FormGroup>

                  <FormGroup>
                    <Label check>
                      <CustomInput
                        type="checkbox"
                        name="explicit_content"
                        id="explicit_content"
                        checked={explicit_content}
                        onChange={() => {
                          explicit_contentSET(!explicit_content)
                          metadataChangedSET(true);
                        }}
                      />
                      Explicit content
                    </Label>
                    <FormText color="muted">
                      Please mark this field if track has prohibited lyrics
                    </FormText>
                  </FormGroup>

                  <FormGroup>
                    <Label for="ISRC">ISRC</Label> <Badge color="primary">Required</Badge>
                    <Input
                      type="text"
                      name="ISRC"
                      id="ISRC"
                      defaultValue={trackData.ISRC}
                      onFocus={() => {revalidateField("ISRC")}}
                      onBlur={() => metadataChangedSET(true)}
                      disabled={(releaseData.transferred || generate_isrc) ? true : false}
                    />
                    { (hasQCFeedback && qcFeedback["isrc_code"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["isrc_code"]} /> }
                    <FormText color="muted">
                      The International Standard Recording Code assigned for
                      the track. If you don´t have your own, we will generate
                      one for you
                    </FormText>
                  </FormGroup>
                  <FormGroup>
                    <Label check>
                      <CustomInput
                        type="checkbox"
                        id="generate_isrc"
                        checked={generate_isrc}
                        disabled={releaseData.transferred}
                        onChange={e => {
                          generate_isrcSET(!generate_isrc);
                          if(generate_isrc) {
                            enableValidator("ISRC", "notEmpty");
                          } else {
                            disableValidator("ISRC", "notEmpty");
                          }
                          metadataChangedSET(true);
                        }}
                      />
                      Generate ISRC
                    </Label>
                  </FormGroup>

                  <div style={{borderTop: '1px solid #e9ecef', padding: '10px 0px', marginTop: '25px', marginBottom: '2px'}}>
                    <i className={langMetdataCollapsed?"collapse-icon fa fa-angle-double-up": "collapse-icon fa fa-angle-double-down"} onClick={e => {langMetadataCollapsedSET(!langMetdataCollapsed)}}>
                    &nbsp;<span className="collapse-text">Track Language Metadata</span>
                    </i>
                  </div>

                  <Collapse isOpen={langMetdataCollapsed}>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Label>Language</Label> <Badge color="primary">Required</Badge>
                          <Select
                            components={{ IndicatorSeparator:() => null }}
                            options={Langs}
                            name="trackLanguage"
                            defaultValue={{
                              value: trackData.language,
                              label: Langs.map(function(i) {
                                if (i.value.toUpperCase() === trackData.language) {
                                  return i.label;
                                } else {
                                  return false;
                                }
                              })
                            }}
                            isDisabled={autoDetectLanguage}
                            onChange={() => {
                              const messages = [].slice.call(document.getElementById("tracksForm").querySelectorAll('[data-field="' + 'trackLanguage' + '"][data-validator]'));
                              
                              messages.forEach((messageEle) => {
                                messageEle.style.display = 'none';
                              });
                              metadataChangedSET(true);
                            }}
                          />
                          { (hasQCFeedback && qcFeedback["language"]) && <QCFeedback hasQCFeedback={hasQCFeedback} feedback={qcFeedback["language"]} /> }
                          <FormText color="muted">
                            In which language is the track name written? Please
                            double check if you are not sure. If this input is
                            wrong, some stores like iTunes and Apple Music will
                            reject the release.
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
                  </Collapse>

                  <div style={{borderTop: '1px solid #e9ecef', padding: '10px 0px', marginTop: '25px', marginBottom: '2px'}}>
                    <i className={accMetadataCollapsed?"collapse-icon fa fa-angle-double-up": "collapse-icon fa fa-angle-double-down"} onClick={e => {accMetadataCollapsedSET(!accMetadataCollapsed)}}>
                    &nbsp;<span className="collapse-text">Accounting Data</span>
                    </i>
                  </div>

                  <Collapse isOpen={accMetadataCollapsed}>
                    <Alert color="warning">
                        <p><b>WARNING</b></p>
                        <p>
                          <b>OPTIONAL METADATA - fill in this part of the metadata only if you will issue accounting reports to your artists or shareholders!</b><br/>
                          Please make sure that the submitted data in this section is fully accurate, as it will affect the reports you will send to your artists and shareholders.<br/>
                          We strongly recommend double-checking the inputs as after submission, additional editing and changes are not recommended for the sake of data accuracy.<br/>
                          Accounting reports for your artists and shareholders will have an accurate effect only if you submit all parameters correctly and according to your deals with your artists and shareholders.<br/>
                          <b>Costs could be added only once and can not be edited later for transparency and accuracy reasons. Make sure to insert all track costs accurately on your first try.</b>
                        </p>
                    </Alert>

                    <Row>
                      <Col lg="3" md="6" sm="12">
                        <FormGroup>
                          <Label>Label Share (%)</Label>
                          <Input
                            type="number"
                            name="label_share"
                            id="label_share"
                            min="1"
                            max="100"
                            step='0.01'
                            placeholder="i.e. 50"
                            defaultValue={trackData.label_share? trackData.label_share : ''}
                          />
                          <FormText color="muted">
                            <p><b>Tipp:</b> The industry standard for <b>label share</b> is <b>50%</b> and <b>50%</b> for the <b>shareholders</b>. We strongly advise you to insert the accurate percentage share to which you have agreed with your artists, shareholders, and partners..</p>
                          </FormText>
                          <div style={{width: '100%', display: 'flex'}}>
                              <div className="fv-help-block" style={{ display: 'none'}} id={"err_label_share"}>Please enter a valid value (1-100)</div>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12" md="12" sm="12">         
                        <div style={{paddingBottom: 30}}>
                          <ShareholdersRow values={shareholderProps} disabledAtCount={999} editTracks={true}/>
                          {successAddedShareholder && (
                            <Alert color="success">A new Shareholder has been added!</Alert>
                          )}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="12" md="12" sm="12">         
                        <div style={{paddingBottom: 30}}>
                          <CostsRow values={costProps} disabledAtCount={999} editTracks={true} disabled={!trackData.track_accounting_data_editable}/>
                          {successAddedCostType && (
                            <Alert color="success">A new cost type has been added!</Alert>
                          )}
                          <FormText color="muted">
                            <p>Insert only actual, occurred, or pre-agreed <b>Costs</b> per track. We strongly advise you not to insert false costs.</p>
                            <p><b>Cost types</b> could be any fixed or variable costs i.e. <b>Audio Mastering, Graphic Design, Promotion, Marketing</b>, or any other viable expenditure spent for the particular <b>Track</b> by the <b>Label</b>.</p>
                          </FormText>
                        </div>
                      </Col>
                    </Row>
                  </Collapse>

              <FormGroup>
                <Button id="submitTrackBtn" color="success" disabled={isSubmitDisabled || formErrRef.current}>
                  Submit Track
                </Button>
                {
                  (formErrRef.current) &&  <p className="fv-help-block" style={{marginTop: 15}}>Form cannot be submited! Please fill all fields and check errors!</p>
                }
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      </Fragment>
    )
  );
}


export default TracksUpdate;
