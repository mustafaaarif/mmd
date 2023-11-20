import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FormText } from "reactstrap";
import * as Yup from "yup";
import axios from "axios";
import AsyncDropdownSpotify from "../../components/aysncDropdownSpotify";

import {
  Card,
  Row,
  CardBody,
  Col,
  FormGroup,
  Label,
  Button,
  Alert
} from "reactstrap";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";
import { Redirect } from "react-router-dom";
import ProfileImg from "../../assets/images/users/1.jpg";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const ArtistsUpdate = ({ match, name }) => {
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
  const currentID = match.url.split("/")[2];
  const [userData, error, loading] = useFetch(
    "GET",
    `artists/${currentID}/`,
    token
  );
  const [success, setSuccess] = useState(false);
  const [errorPut, setErrorPut] = useState(false);
  const [errorInvalidSpotifyId, setErrorInvalidSpotifyId] = useState(false);
  const [errorNameMismatch, setErrorNameMismatch] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [spotifyArtist, setSpotifyArtist] = useState(null);

  const renderOption = (props, option, snapshot, className) => (
    <button {...props} className={className} type="button">
        <img
          src={option.image_small? option.image_small: ProfileImg}
          alt={option.name}
          style={{
              height: '40px',
              width: '40px',
              borderRadius: '30%',
              marginRight: "10px",
          }}
        /><b>{option.name}</b>
    </button>
  );

  useEffect(() => {
    if(userData.image_big && userData.spotify_identifier)
    {
      setSpotifyArtist({name: userData.name, followers: userData.followers, popularity: userData.popularity, image_big: userData.image_big, image_small: userData.image_small});
    }
  }, [userData])

  return (
    <div>
      {loading ? (
        <TableHelper loading />
      ) : error ? (
        <TableHelper error />
      ) : (
        <>
          <Row>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <h3>Edit Artist</h3>
                  <Formik
                    initialValues={{
                      name: userData.name,
                      email: userData.email,
                      spotifyId: userData.spotify_identifier,
                      appleId: userData.apple_identifier
                    }}
                    validationSchema={Yup.object().shape({
                      name: Yup.string().required("Name is required"),
                      email: Yup.string().email().required("Email is required"),
                      spotifyId: Yup.string()
                        .matches(
                          /^[0-9A-Za-z_-]{22}$/,
                          "Please add a valid Spotify ID. Example: 6eUKZXaKkcviH0Ku9w2n3B . Check our Help Center for more info."
                        ),
                        appleId: Yup.string()
                          .matches(
                            /^[0-9]*$/,
                            "Please add a valid Apple ID. Example: 635806095 . Check our Help Center for more info."
                          )
                      })}
                      onSubmit={(
                        { name, email, spotifyId, appleId },
                        { setStatus, setSubmitting }
                      ) => {
                        setStatus();
                        setErrorInvalidSpotifyId(false);
                        setErrorNameMismatch(false);

                      const options = {
                        method: "PATCH",
                        mode: 'cors',
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "x-api-key": X_API_KEY,
                          "Content-Type": "application/json"
                        }
                      };

                      const Data = {
                        ...(name && (userData.name !== name) && {"name": name}),
                        ...(email && (userData.email !== email) && {"email": email}),
                        ...(spotifyId && (userData.spotify_identifier !== spotifyId) && {"spotify_identifier": spotifyId}),
                        ...(appleId && (userData.apple_identifier !== appleId) && {"apple_identifier": appleId}),
                        ...(spotifyArtist && (userData.followers !== spotifyArtist.followers) && {"followers": spotifyArtist.followers}),
                        ...(spotifyArtist && (userData.popularity !== spotifyArtist.popularity) && {"popularity": spotifyArtist.popularity}),
                        ...(spotifyArtist && (userData.image_big !== spotifyArtist.image_big) && {"image_big": spotifyArtist.image_big}),
                        ...(spotifyArtist && (userData.image_small !== spotifyArtist.image_small) && {"image_small": spotifyArtist.image_small}),
                      };

                      if (Object.keys(Data).length === 0) {
                        return false;
                      }


                      axios
                        .patch(
                          `${API_URL}artists/${currentID}/`,
                          {
                            ...(name && (userData.name !== name) && {"name": name}),
                            ...(email && (userData.email !== email) && {"email": email}),
                            ...(spotifyId && (userData.spotify_identifier !== spotifyId) && {"spotify_identifier": spotifyId}),
                            ...(appleId && (userData.apple_identifier !== appleId) && {"apple_identifier": appleId}),
                            ...(spotifyArtist && (userData.followers !== spotifyArtist.followers) && {"followers": spotifyArtist.followers}),
                            ...(spotifyArtist && (userData.popularity !== spotifyArtist.popularity) && {"popularity": spotifyArtist.popularity}),
                            ...(spotifyArtist && (userData.image_big !== spotifyArtist.image_big) && {"image_big": spotifyArtist.image_big}),
                            ...(spotifyArtist && (userData.image_small !== spotifyArtist.image_small) && {"image_small": spotifyArtist.image_small}),
                          },
                          options
                        )
                        .then(res => {
                          setSuccess(true);
                          setTimeout(() => setRedirect(true), 1000);
                        })
                        .catch(err => {
                          setErrorPut(true);
                        });
                    }}
                    render={({
                      errors,
                      status,
                      touched,
                      isSubmitting,
                      setFieldValue
                    }) => (
                      <Form>
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

                      {
                        (spotifyArtist && spotifyArtist.image_big) && 
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
                      }
                        <FormGroup row>
                          <Label for="name" sm={2}>
                            Name
                          </Label>
                          <Col>
                            <Field
                              name="name"
                              type="text"
                              onKeyUp={(e)=> {
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
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="invalid-feedback"
                            />
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

                        <FormGroup row>
                          <Col>
                            <Button color="success" disabled={errorInvalidSpotifyId || errorNameMismatch} type="submit">
                              Submit
                            </Button>
                          </Col>
                        </FormGroup>
                      </Form>
                    )}
                  />
                  {success && (
                    <Alert color="success">
                      Artist of name "{userData.name}" has been updated!
                    </Alert>
                  )}
                  {redirect ? <Redirect to="/artists" /> : null}
                  {errorPut && (
                    <Alert color="danger">
                      Something went wrong! Please refresh page and try again!
                    </Alert>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ArtistsUpdate;
