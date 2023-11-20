import React, { useState, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FormText } from "reactstrap";
import * as Yup from "yup";
import axios from "axios";
import { Redirect } from "react-router-dom";
import AsyncDropdownNormal from "../../components/asyncDropdownNormal";
import AsyncDropdownSpotify from "../../components/aysncDropdownSpotify";
import {
  Card,
  Row,
  CardBody,
  Col,
  FormGroup,
  Label,
  Button,
  Alert,
  CardTitle
} from "reactstrap";
import { getCookie } from "../../jwt/_helpers/cookie";
import { StateContext } from "../../utils/context";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const ArtistsAdd = () => {
  const token = getCookie("token");
  const options = {
    method: "GET",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  };
  const {currentUser} = useContext(StateContext);
  const [success, setSuccess] = useState(false);
  const [errorDupl, setErrorDupl] = useState(false);
  const [errorInvalidSpotifyId, setErrorInvalidSpotifyId] = useState(false);
  const [errorNameMismatch, setErrorNameMismatch] = useState(false);
  const [error, setError] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');
  const [subUser, setSubUser] = useState('');
  const [subUserId, setSubUserId] = useState(null);
  const [subUserEndpoint, setSubUserEndpoint] = useState('');

  const [spotifyArtist, setSpotifyArtist] = useState(null);

  return (
    <div>
      <Row>
        <Col sm={12}>
          <Card>
            <CardBody>
            <CardTitle tag="h4">Add artist</CardTitle>
              <Formik
                initialValues={{
                  name: "",
                  email: "",
                  spotifyId: "",
                  appleId: "",
                }}
                validationSchema={Yup.object().shape({
                  name: Yup.string().required("Name is required"),
                  email: Yup.string()
                    .email()
                    .required("Email is required"),
                  spotifyId: Yup.string()
                    .matches(
                      /^[0-9A-Za-z_-]{22}$/,
                      "Please add a valid Spotify ID. Example: 6eUKZXaKkcviH0Ku9w2n3B . Check our Help Center for more info."
                    ),
                  appleId: Yup.string()
                    .matches(
                      /^[0-9]*$/,
                      "Please add a valid Apple ID. Example: 635806095 . Check our Help Center for more info."
                    ),
                })}
                onSubmit={(
                  { name, email, spotifyId, appleId },
                  { setStatus, setSubmitting }
                ) => {
                  setStatus();
                  setErrorDupl(false);
                  setErrorInvalidSpotifyId(false);
                  setErrorNameMismatch(false);

                  const options = {
                    method: "POST",
                    mode: 'cors',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "x-api-key": X_API_KEY,
                      "Content-Type": "application/json"
                    }
                  };

                  axios.get(`${API_URL}artists/${subUserEndpoint}?search=${name}${parentUserOnly}`, options).then(res => {
                    if (res.status === 200){
                      const list = res.data.results.length > 0 ? res.data.results : [];

                      const getOne = list.filter(i => i.name === name);

                      if (getOne.length > 0) {
                        setErrorDupl(true)
                      } else {
                        axios
                        .post(
                          `${API_URL}artists/`,
                          {
                            name: name,
                            email: email,
                            spotify_identifier: spotifyId,
                            apple_identifier: appleId,
                            ...(subUserId && { sub_user_id: subUserId || null}),
                            ...(spotifyArtist && { followers: spotifyArtist.followers, popularity: spotifyArtist.popularity, image_big: spotifyArtist.image_big, image_small: spotifyArtist.image_small || null}),
                          },
                          options
                        )
                        .then(res => {
                          setSuccess(true);
                          setTimeout(() => setRedirect(true), 1000);
                        })
                        .catch(err => {
                          setError(true);
                        });
                      }
                    }
                  })

                }}
                render={({
                  errors,
                  status,
                  touched,
                  isSubmitting,
                  setFieldValue,
                }) => {
                  return (
                    <Form className="mt-3" id="addArtistForm">
                        <FormGroup className="select-search-wrap" row>
                          <Label for="Spotify Artist" sm={2}>
                            Spotify Artist
                          </Label>
                          <Col>
                          {
                            spotifyArtist ?
                              <div className="releaseFileRow">
                                  <p className="releaseFileRowName"> {spotifyArtist.name}</p>
                                  <Button className="btn btn-outline-info"
                                    onClick={() => {
                                      setSpotifyArtist(null);
                                      setErrorNameMismatch(false);
                                      setErrorInvalidSpotifyId(false);
                                      setErrorDupl(false);
                                      setFieldValue("name", "");
                                      setFieldValue("spotifyId", "");
                                    }
                                    }>
                                    Reset
                                  </Button>
                              </div>
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
                                  setFieldValue("name", artistObj.name);
                                  setFieldValue("spotifyId", artistId);                                  
                                }}
                                placeholder="Enter Artist Name i.e. The Weekend"
                              />
                              <FormText color="muted">
                                Note: Only use this dropdown if you want to add an Artist who is already on Spotify otherwise leave un-selected.
                              </FormText>
                            </>
                          }
                          </Col>
                        </FormGroup>

                      {spotifyArtist && spotifyArtist.image_big && (
                        <FormGroup row>
                          <Label sm={2}>Image</Label>
                          <Col xs={2}>
                            <img
                              src={spotifyArtist.image_big}
                              style={{ width: "300px", padding: "10px 0" }}
                              alt={"Artist DP"}
                            />
                          </Col>
                        </FormGroup>
                      )}

                      <FormGroup row>
                        <Label for="name" sm={2}>
                          Name
                        </Label>
                        <Col>
                          <Field
                            name="name"
                            // validate={e => validateDuplicates(e, () => getType(artistList, 'name'), "Artist already exists", artistList)}
                            type="text"
                            onKeyUp={(e)=> {
                              setErrorDupl(false);
                              let artistName = e.currentTarget.value? e.currentTarget.value : null;
                              if (artistName && spotifyArtist)
                              {
                                if(artistName === spotifyArtist.name)
                                {
                                  setErrorNameMismatch(false);
                                }
                                else {
                                  setErrorNameMismatch(true);
                                }
                              }
                            }}
                            className={
                              "form-control" +
                              ((errorNameMismatch || errors.name)  && touched.name ? " is-invalid" : "")
                            }
                          />
                          {
                            errorDupl && <p style={{fontSize: "12px",color: "red",margin: "2px 0 0 0"}}>Artist already exists</p>
                          }
                          {
                            errorNameMismatch && <p style={{fontSize: "12px",color: "red",margin: "2px 0 0 0"}}>Artist name is different from Spotify records</p>
                          }
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label for="email" sm={2}>
                          Email
                        </Label>
                        <Col>
                          <Field
                            name="email"
                            type="text"
                            className={
                              "form-control" +
                              (errors.email && touched.email
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="email"
                            component="div"
                            className="invalid-feedback"
                          />
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label for="spotifyId" sm={2}>
                          Spotify ID
                        </Label>
                        <Col>
                          <Field
                            name="spotifyId"
                            type="text"
                            className={
                              "form-control" +
                              ((errors.spotifyId || errorInvalidSpotifyId) && touched.spotifyId
                                ? " is-invalid"
                                : "")
                            }
                            onKeyUp={(e)=> {
                              let spotifyId = e.currentTarget.value? e.currentTarget.value : null;
                              if (spotifyId) {
                                fetch(`${API_URL}artists/spotify-artist-details/?spotify_id=${spotifyId}`, options)
                                .then(response => response.json())
                                .then(data => {
                                  if(data)
                                  {
                                    setFieldValue("name", data.name);
                                    let name = data.name;
                                    let followers = data.followers? data.followers.total: 0;
                                    let popularity = data.popularity? data.popularity : 0;
                                    let image_big = data.images.length>0? data.images[0].url : ""; 
                                    let image_small = data.images.length>0? data.images[2].url : ""; 

                                    let artistDetails = {
                                      name: name,
                                      followers: followers,
                                      popularity: popularity,
                                      image_big: image_big,
                                      image_small: image_small
                                    };
    
                                    setSpotifyArtist(artistDetails);
                                    setErrorInvalidSpotifyId(false);
                                  }
                                  else {
                                    setErrorInvalidSpotifyId(true);
                                  }
                                })
                                .catch(error => {
                                  setErrorInvalidSpotifyId(true);
                                  console.log("Error: ", error);
                                });
                              }
                            }}
                          />
                          <FormText color="muted">
                            Note: If your artists already exist on Spotify, please ADD the Spotify artist ID in this field. If you do not add the correct Spotify Id, your artist's profile will be newly created.
                          </FormText>
                          <ErrorMessage
                            name="spotifyId"
                            component="div"
                            className="invalid-feedback"
                          />
                          {
                            errorInvalidSpotifyId && <p style={{    fontSize: "12px",color: "red",margin: "2px 0 0 0"}}>This Spotify ID doesn't exist.</p>
                          }
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label for="appleId" sm={2}>
                          Apple ID
                        </Label>
                        <Col>
                          <Field
                            name="appleId"
                            type="text"
                            className={
                              "form-control" +
                              (errors.appleId && touched.appleId
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="appleId"
                            component="div"
                            className="invalid-feedback"
                          />
                        </Col>
                      </FormGroup>

                      {currentUser.is_premium_user &&
                        <FormGroup className="select-search-wrap" row>
                          <Label for="subUser" sm={2}>
                            Sub-User
                          </Label>
                          <Col>
                            {
                                subUser ?

                                <div className="releaseFileRow">
                                    <p className="releaseFileRowName"> {subUser}</p>
                                    <Button className="btn btn-outline-info" 
                                      onClick={() => {
                                        setSubUser('');
                                        setSubUserId(null);
                                        setSubUserEndpoint('');
                                      }
                                      }>
                                      Reset
                                    </Button>
                                </div>
                                :
                                <AsyncDropdownNormal
                                  fetchOptions={options}
                                  endpoint={`sub-users`}
                                  subUserEndpoint={subUserEndpoint}
                                  parentUserOnly={parentUserOnly}
                                  labelField="username"
                                  onChange={e => {
                                    let subUserId = e.value;
                                    let username = e.label;
                                    if(subUserId !== '') {
                                      setSubUser(username);
                                      setSubUserId(subUserId);
                                      setSubUserEndpoint(`sub-user/${subUserId}/`);
                                      setParentUserOnly('');
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
                            Note: Only use this dropdown if you want to Add Artist for any of your Sub-users otherwise leave un-selected.
                          </FormText>
                          </Col>
                        </FormGroup>
                        }

                      <FormGroup row>
                        <Col>
                          <Button color="success" disabled={errorDupl || errorInvalidSpotifyId || errorNameMismatch}>Submit</Button>
                        </Col>
                      </FormGroup>
                    </Form>
                  );
                }}
              />
              {success && <Alert color="success">Artist has been added!</Alert>}
              {redirect ? <Redirect to="/artists" /> : null}
              {error && (
                <Alert color="danger">
                  Something went wrong! Please refresh page and try again!
                </Alert>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ArtistsAdd;