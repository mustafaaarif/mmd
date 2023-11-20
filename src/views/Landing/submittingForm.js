import React, {useEffect, useRef, useState} from "react";
import {Col, Alert, FormGroup, Label,} from 'reactstrap';
import {Formik, Field, Form, ErrorMessage} from "formik";
import ViewLayout from "../../components/viewLayout";
import * as Yup from "yup";
import axios from "axios";
import {getCookie} from "../../jwt/_helpers";
import TrackRow from "./TrackRow";
import regexp from "../../validations/es6/validators/regexp";
import { useHistory , useParams } from 'react-router-dom';

import Player from '../../components/Player';
import {uploadS3} from "../releases/helperFunctions";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

function makeid(length) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
let keyrandom2 = makeid(20);

const CreateSubmittingForm = props => {
  const tokenAPI = getCookie("token");
  const token = getCookie().token;
  const history = useHistory();
  const params = useParams();
  const [landingData, setLandingData] = useState();
  const [trackErrors, setTrackErrors] = useState({});
  const [alertError, setAlertError] = useState('');

  const options = {
    method: "POST",
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    }
  }

  useEffect(() => {
    if(!params.token){
      axios.get(`${API_URL}demo-landingpage/`, {...options, headers: {...options.headers, Authorization: `Bearer ${tokenAPI}`}}).then(res => {
        const suffix = res.data.results.find(elem => elem.url_suffix === params.suffix);
        if(!suffix){
          setAlertError('url suffix invalid !!!')
        }
      });
    }
  }, [])

  useEffect(() => {
    if(params.token && !landingData) {
      axios.get(`${API_URL}demo-submission/token/${params.token}`, options).then(res => {
        console.log('res.data', res.data)
        setLandingData(res.data);
      }).catch(err => {
        console.log(err.response)
      });
    }
  }, [params.token])

  const handleSubmitForm = async (values) => {
    const validForm = validateTracks();
    if(!validForm) return

    const data = {
      ...values,
      status: 1,
      rating: 8,
      landing_page_url_suffix: params.suffix,
      tracks: listOfTracks.map(item => ({url: item.url, demo_song_name: item.demo_song_name}))
    }

    try{
      if(params.suffix){
        const resp = await axios.post(`${API_URL}demo-submission/`, data, options);
        if(resp.data.token){
          history.push(`/demo/${data.landing_page_url_suffix}/${resp.data.token}`)
        }
      }
    }catch(err){
      if(err.response.data.error[0] === 'Monthly submission limit'){
        setAlertError('Monthly submission limit')
      }
    }
  }

  const showErrorMessage = (name) => (
    <ErrorMessage
      name={name}
      component="div"
      className="invalid-feedback"
    />
  )


  // track state
  const stateRef = useRef();
  const [initialData, initialDataSET] = useState({})
  const [blockedSubmit, setBlockedSubmit] = useState(true);
  const [listOfTracksDetails, listOfTracksDetailsSET] = useState([])
  const [fileType, setFileType] = useState('')
  const [listOfTracks, listOfTracksSET] = useState([{
    order: 1,
    created_id: '',
    demo_song_name: "",
    url: "",
    track_mix_name: "",
    file: "",
    album_only: false,
    key: keyrandom2
  }])
  stateRef.current = listOfTracksDetails;

  const validateTracks = () => {
    const prevTrack = listOfTracks[listOfTracks.length - 1];
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    const validURL = urlRegex.test(prevTrack.url)

    if(!validURL){
      setTrackErrors(prev => ({...prev, key: prevTrack.key, url: "please add valid url"}))
    }

    if(!prevTrack.demo_song_name){
      setTrackErrors(prev => ({...prev, key: prevTrack.key, name: "please add demo song name"}))
    }

    return (validURL && prevTrack.demo_song_name)
  }

  const addNewTrack = () => {
    const track = {
      order: listOfTracks.length + 1,
      demo_song_name: "",
      track_mix_name: "",
      file: "",
      url: "",
      album_only: false,
      key: Math.random().toString(36).substring(1),
      track_mix_select: 2
    }

    if(validateTracks()){
      const newTrack = [...listOfTracks, track];
      listOfTracksSET(newTrack);
    }
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

  const manageTrackDataDetails = (index, key, value) => {
    const newList = listOfTracksDetails.map((element, i) => {
      if (index === i) {
        element[key] = value;
      }
      return element;
    });
    listOfTracksDetailsSET(newList)
  };

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
    setTrackErrors({})
  }

  const manageTrackDataFile = async (index, key, value, file_key) => {
    let uploadResponse = '';
    let amazonURL = 'https://stagingmovemusic.s3.amazonaws.com/media/';

     if(value){
       uploadResponse = await uploadS3(value,token, file_key, 'mp3', '/demo_tool/submissions/');
     }
     if(uploadResponse){
       setTrackErrors(prev => ({...prev, key, url: ""}))
     }

    listOfTracksSET( prev => {
      const newArr = prev.map( i => {

        if(i.key === file_key) {
          return {
            ...i,
            demo_song_name: i.demo_song_name,
            url: i.url || `${amazonURL}${uploadResponse}`,
            key: i.key,
          }
        } else {
          return i
        }
      })

      return newArr
    })

  };

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

  const testMixName = e => {
    return regexp().validate({
      value: e,
      options: {
        regexp: /^[^\{\}\[\]\(\)]*$/
      },
    });
  }

  const validateMixName = (e, key) => {
    const result = testMixName(e);

    if (!result.valid) {
      document.getElementById(`err_track_mix_name_regex_${key}`).style.display = 'block'
    } else {
      document.getElementById(`err_track_mix_name_regex_${key}`).style.display = 'none';
    }
  }

  const trackProps = {
    listOfTracks,
    listOfTracksSET,
    manageTrackData,
    manageTrackDataDetails,
    removeTrack,
    addNewTrack,
    manageTrackDataFile,
    trackOrderChange,
    validateMixName
  };

  return (
    <>
      { alertError && (
        <Alert color="warning">
          {alertError}
        </Alert>
      )}
      <ViewLayout title={"Create Landing Page"}>
        <Formik
          initialValues={{
            first_name: "",
            last_name: "",
            artist_name: "",
            consent: false,
            email: "",
            genre: "",
            soundcloud_artist_profile: "",
            facebook_artist_profile: "",
            instagram_artist_profile: "",
            introduction_text: "",
          }}
          validationSchema={Yup.object().shape({
            first_name: Yup.string().required("First Name is required"),
            last_name: Yup.string().required("Last Name is required"),
            artist_name: Yup.string().required("Artist Name is required"),
            consent: Yup.bool().oneOf([true], 'Field must be checked'),
            email: Yup.string()
              .email()
              .required("Email is required"),
            genre: Yup.string().required("Genre is required"),
            introduction_text: Yup.string().required("Introduction text is required"),
          })}
          onSubmit={handleSubmitForm}
        >
          {({
              values,
              errors,
              touched,
            }) => {

            if(landingData){
              for(let dataKey in landingData){
                if(values.hasOwnProperty(dataKey)){
                  values[dataKey] = landingData[dataKey] || "";
                }
              }
            }

            return (
              <Form className=" mt-2">
                <FormGroup>
                  <Label for="first_name">First Name</Label>
                  <Field disabled={landingData} type="text" name="first_name" id="first_name" placeholder="first name" className={
                    "form-control" +
                    (errors.first_name && touched.first_name
                      ? " is-invalid"
                      : "")
                  }/>
                  {showErrorMessage('first_name')}
                </FormGroup>

                <FormGroup>
                  <Label for="last_name">Last Name</Label>
                  <Field disabled={landingData} type="text" name="last_name" id="last_name" placeholder="last name"  className={
                    "form-control" +
                    (errors.last_name && touched.last_name
                      ? " is-invalid"
                      : "")
                  }/>
                  {showErrorMessage('last_name')}
                </FormGroup>

                <FormGroup>
                  <Label for="artist_name">Artist Name</Label>
                  <Field disabled={landingData} type="text" name="artist_name" id="artist_name" placeholder="Artist name"  className={
                    "form-control" +
                    (errors.artist_name && touched.artist_name
                      ? " is-invalid"
                      : "")
                  }/>
                  {showErrorMessage('artist_name')}
                </FormGroup>

                <FormGroup>
                  <Label for="exampleEmail">Email</Label>
                  <Field  disabled={landingData}  type="email" name="email" id="exampleEmail" placeholder="email" className={
                    "form-control" +
                    (errors.email && touched.email
                      ? " is-invalid"
                      : "")
                  }/>
                  {showErrorMessage('email')}
                </FormGroup>

                <FormGroup>
                  <Label for="Genre">Genre</Label>
                  <Field disabled={landingData} type="text" name="genre" id="Genre" placeholder="Genre" className={
                    "form-control" +
                    (errors.genre && touched.genre
                      ? " is-invalid"
                      : "")
                  }/>
                  {showErrorMessage('genre')}
                </FormGroup>

                <FormGroup>
                  <Label for="Soundcloud">Soundcloud Artist profile</Label>
                  <Field disabled={landingData} type="text" name="soundcloud_artist_profile" id="Soundcloud" placeholder="Soundcloud" className={
                    "form-control" +
                    (errors.soundcloud_artist_profile && touched.soundcloud_artist_profile
                      ? " is-invalid"
                      : "")
                  }/>
                  {showErrorMessage('soundcloud_artist_profile')}
                </FormGroup>

                <FormGroup>
                  <Label for="Facebook">Facebook Artist profile</Label>
                  <Field disabled={landingData} type="text" name="facebook_artist_profile" id="Facebook" placeholder="Facebook" className={
                    "form-control" +
                    (errors.facebook_artist_profile && touched.facebook_artist_profile
                      ? " is-invalid"
                      : "")
                  }/>
                  {showErrorMessage('facebook_artist_profile')}
                </FormGroup>

                <FormGroup>
                  <Label for="Instagram">Instagram Artist profile</Label>
                  <Field disabled={landingData} type="text" name="instagram_artist_profile" id="Instagram" placeholder="Instagram" className={
                    "form-control" +
                    (errors.instagram_artist_profile && touched.instagram_artist_profile
                      ? " is-invalid"
                      : "")
                  }/>
                  {showErrorMessage('instagram_artist_profile')}
                </FormGroup>

                <FormGroup>
                  <Label for="Introduction">Introduction text</Label>
                  <Field disabled={landingData} component="textarea" name="introduction_text" id="Introduction" className={
                    "form-control" +
                    (errors.introduction_text && touched.introduction_text
                      ? " is-invalid"
                      : "")
                  }/>
                  {showErrorMessage('introduction_text')}
                </FormGroup>

                <div className="my-4">
                  <TrackRow
                    values={trackProps}
                    id="releaseTracks"
                    name="releaseTracks"
                    updateRelease={true}
                    status={initialData.status}
                    blockedValeues={{blockedSubmit, setBlockedSubmit}}
                    landingData={landingData}
                    trackErrors={trackErrors}
                    setTrackErrors={setTrackErrors}
                    fileType={fileType}
                    setFileType={setFileType}
                  />
                </div>

                {!landingData && (
                  <div className="mt-5 form-group d-flex justify-content-between">
                    <div className="custom-control custom-checkbox my-1 mr-sm-2">
                      <Field type="checkbox" name="consent" id="Consent" className={"custom-control-input"}/>
                      <label className={'custom-control-label ' + (errors.consent && touched.consent
                        ? " is-invalid"
                        : " ")} htmlFor="Consent">{''}</label>
                      <Label className="ml-2" htmlFor="Consent">I accept
                        <a href="https://www.iubenda.com/api/terms-and-conditions/51840490" target="_blank"> Terms </a>
                        Of Use and
                        <a href="https://www.iubenda.com/api/privacy-policy/51840490" target="_blank"> Privacy Policy </a>
                      </Label>
                      {showErrorMessage('consent')}
                    </div>

                    <button
                      className={`btn btn-success`}
                      disabled={!errors.consent && !Object.keys(errors).length < 1}
                      type="submit">SUBMIT</button>
                  </div>
                )}

              </Form>
            )}
          }
        </Formik>

        {landingData && params.token && (
          <Player tracks={landingData?.tracks}/>
        )}

      </ViewLayout>
    </>
  );
};

export default CreateSubmittingForm;
