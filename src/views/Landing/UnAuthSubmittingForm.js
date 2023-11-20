import React, { useEffect, useRef, useState } from "react";
import { Col, Alert, FormGroup, Label } from 'reactstrap';
import { Formik, Field, Form, ErrorMessage } from "formik";
import ViewLayout from "../../components/viewLayout";
import * as Yup from "yup";
import axios from "axios";
import { getCookie } from "../../jwt/_helpers";
import TrackRow from "./TrackRow";
import { uploadS3 } from "../releases/helperFunctions";
import regexp from "../../validations/es6/validators/regexp";
import { useParams, useLocation, Navigate } from 'react-router-dom';
import Player from "../../components/Player";

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
  // const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const [landingData, setLandingData] = useState();
  const [suffixError, setSuffixError] = useState('');
  const [trackErrors, setTrackErrors] = useState({});

  const options = {
    method: "POST",
    mode: 'cors',
    headers: {
      "Content-Type": "application/json",
      "x-api-key": X_API_KEY,
    }
  }

  // useEffect(() => {
  //   if(!params.token){
  //     axios.get(`${API_URL}demo-landingpage/`, {...options, headers: {...options.headers, Authorization: `Bearer ${tokenAPI}`}}).then(res => {
  //       const suffix = res.data.results.find(elem => elem.url_suffix === params.suffix);
  //       if(!suffix){
  //         setSuffixError('url suffix invalid !!!')
  //       }
  //     });
  //   }
  // }, [])

  useEffect(() => {
    if (params.token && !landingData) {
      axios.get(`${API_URL}demo-submission/token/${params.token}`, options).then(res => {
        console.log('res.data', res.data)
        setLandingData(res.data);
      });
    }
  }, [params.token])

  const handleSubmitForm = async (values) => {
    const validForm = validateTracks();
    if (!validForm) return

    const data = {
      ...values,
      status: 1,
      rating: 8,
      landing_page_url_suffix: params.suffix,
      tracks: listOfTracks.map(item => ({ url: item.url, demo_song_name: item.demo_song_name }))
    }

    try {
      if (params.suffix) {
        const resp = await axios.post(`${API_URL}demo-submission/`, data, options);
        if (resp.data.token) {
          <Navigate to={`/demo/${data.landing_page_url_suffix}/${resp.data.token}`} />
        }
      }
    } catch (err) {
      console.log('error', err.response)
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

    if (!validURL) {
      setTrackErrors(prev => ({ ...prev, key: prevTrack.key, url: "please add valid url" }))
    }

    if (!prevTrack.demo_song_name) {
      setTrackErrors(prev => ({ ...prev, key: prevTrack.key, name: "please add demo song name" }))
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

    if (validateTracks()) {
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

    if (value) {
      uploadResponse = await uploadS3(value, token, file_key, 'mp3', '/demo_tool/submissions/');
    }
    if (uploadResponse) {
      setTrackErrors(prev => ({ ...prev, key, url: "" }))
    }

    listOfTracksSET(prev => {
      const newArr = prev.map(i => {

        if (i.key === file_key) {
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

  const getDate = (date) => {
    const MyDate = new Date(date);
    return ('0' + MyDate.getDate()).slice(-2) + '.'
      + ('0' + (MyDate.getMonth() + 1)).slice(-2) + '.'
      + MyDate.getFullYear();
  }

  function colorHexIsLight(color) {
    const hex = color.replace('#', '');
    const c_r = parseInt(hex.substr(0, 2), 16);
    const c_g = parseInt(hex.substr(2, 2), 16);
    const c_b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
    return brightness > 155;
  }

  return (
    <div
      id="main-wrapper"
      data-layout={'vertical'}
    >
      <div style={{ background: landingData ? `linear-gradient( 210deg, rgb(177, 97, 255) , ${landingData.landingpage_accent_color} , ${landingData.landingpage_accent_color},  rgb(51, 127, 222) ` : '' }}
        className="page-wrapper d-block"
      >
        <div className="page-content container-fluid">
          {(landingData?.error || suffixError) && (
            <Alert color="warning">
              {landingData?.error || suffixError}
            </Alert>
          )}
          <div className="ViewLayout-wrap">
            <ViewLayout>
              {landingData && (
                <>
                  <div className="pt-3 d-flex mb-3">
                    <img style={{ objectFit: 'cover' }} width={200} height={200} src={landingData.landingpage_logo} alt="logo" />
                    <div className="flex-grow-1">
                      <h1 className="text-uppercase font-bold text-center">{landingData.landingpage_name}</h1>
                      {/*<h3 className="text-center font-bold fs-2 mt-5">Demo submission page</h3>*/}
                    </div>
                  </div>
                  <div className="mb-5">
                    <p className="mb-1 font-bold">{landingData.label_name}</p>
                    <p className="mb-1 font-bold">{landingData.genre}</p>
                    <p className="mb-1 font-bold">{getDate(landingData.created)}</p>
                    <p className="mb-1 font-bold">{window ? window.origin : ''}{location.pathname}</p>

                    <ul className="social-icons-list list-unstyled">
                      {landingData.facebook_artist_profile && (
                        <li className="social-icon mr-2">
                          <a href={landingData.facebook_artist_profile} target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook">{''}</i></a>
                        </li>
                      )}
                      {landingData.instagram_artist_profile && (
                        <li className="social-icon mr-2">
                          <a href={landingData.instagram_artist_profile} target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram">{''}</i></a>
                        </li>
                      )}
                      {landingData.soundcloud_artist_profile && (
                        <li className="social-icon mr-2">
                          <a href={landingData.soundcloud_artist_profile} target="_blank" rel="noopener noreferrer"><i className="fab fa-soundcloud">{''}</i></a>
                        </li>
                      )}
                    </ul>
                  </div>
                </>
              )}
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

                  if (landingData) {
                    for (let dataKey in landingData) {
                      if (values.hasOwnProperty(dataKey)) {
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
                        } />
                        {showErrorMessage('first_name')}
                      </FormGroup>

                      <FormGroup>
                        <Label for="last_name">Last Name</Label>
                        <Field disabled={landingData} type="text" name="last_name" id="last_name" placeholder="last name" className={
                          "form-control" +
                          (errors.last_name && touched.last_name
                            ? " is-invalid"
                            : "")
                        } />
                        {showErrorMessage('last_name')}
                      </FormGroup>

                      <FormGroup>
                        <Label for="artist_name">Artist Name</Label>
                        <Field disabled={landingData} type="text" name="artist_name" id="artist_name" placeholder="Artist name" className={
                          "form-control" +
                          (errors.artist_name && touched.artist_name
                            ? " is-invalid"
                            : "")
                        } />
                        {showErrorMessage('artist_name')}
                      </FormGroup>

                      <FormGroup>
                        <Label for="exampleEmail">Email</Label>
                        <Field disabled={landingData} type="email" name="email" id="exampleEmail" placeholder="email" className={
                          "form-control" +
                          (errors.email && touched.email
                            ? " is-invalid"
                            : "")
                        } />
                        {showErrorMessage('email')}
                      </FormGroup>

                      <FormGroup>
                        <Label for="Genre">Genre</Label>
                        <Field disabled={landingData} type="text" name="genre" id="Genre" placeholder="Genre" className={
                          "form-control" +
                          (errors.genre && touched.genre
                            ? " is-invalid"
                            : "")
                        } />
                        {showErrorMessage('genre')}
                      </FormGroup>

                      <FormGroup>
                        <Label for="Soundcloud">Soundcloud Artist profile</Label>
                        <Field disabled={landingData} type="text" name="soundcloud_artist_profile" id="Soundcloud" placeholder="Soundcloud" className={
                          "form-control" +
                          (errors.soundcloud_artist_profile && touched.soundcloud_artist_profile
                            ? " is-invalid"
                            : "")
                        } />
                        {showErrorMessage('soundcloud_artist_profile')}
                      </FormGroup>

                      <FormGroup>
                        <Label for="Facebook">Facebook Artist profile</Label>
                        <Field disabled={landingData} type="text" name="facebook_artist_profile" id="Facebook" placeholder="Facebook" className={
                          "form-control" +
                          (errors.facebook_artist_profile && touched.facebook_artist_profile
                            ? " is-invalid"
                            : "")
                        } />
                        {showErrorMessage('facebook_artist_profile')}
                      </FormGroup>

                      <FormGroup>
                        <Label for="Instagram">Instagram Artist profile</Label>
                        <Field disabled={landingData} type="text" name="instagram_artist_profile" id="Instagram" placeholder="Instagram" className={
                          "form-control" +
                          (errors.instagram_artist_profile && touched.instagram_artist_profile
                            ? " is-invalid"
                            : "")
                        } />
                        {showErrorMessage('instagram_artist_profile')}
                      </FormGroup>

                      <FormGroup>
                        <Label for="Introduction">Introduction text</Label>
                        <Field disabled={landingData} component="textarea" name="introduction_text" id="Introduction" className={
                          "form-control" +
                          (errors.introduction_text && touched.introduction_text
                            ? " is-invalid"
                            : "")
                        } />
                        {showErrorMessage('introduction_text')}
                      </FormGroup>

                      {!landingData &&
                        <div className="my-4">
                          <TrackRow
                            values={trackProps}
                            id="releaseTracks"
                            name="releaseTracks"
                            updateRelease={true}
                            status={initialData.status}
                            blockedValeues={{ blockedSubmit, setBlockedSubmit }}
                            landingData={landingData}
                            trackErrors={trackErrors}
                            setTrackErrors={setTrackErrors}
                            fileType={fileType}
                            setFileType={setFileType}
                          />
                        </div>
                      }

                      {!landingData && (
                        <div className="mt-5 form-group d-flex justify-content-between">
                          <div className="custom-control custom-checkbox my-1 mr-sm-2">
                            <Field type="checkbox" name="consent" id="consent" className={"custom-control-input"} />
                            <label className={'custom-control-label ' + (errors.consent && touched.consent
                              ? " is-invalid"
                              : " ")} htmlFor="Consent">{''}</label>
                            <Label className="ml-2" for="terms">I accept
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
                  )
                }
                }
              </Formik>

              {landingData && params.token && (
                <Player tracks={landingData?.tracks} />
              )}

            </ViewLayout>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateSubmittingForm;
