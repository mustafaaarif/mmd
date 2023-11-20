import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { FormText } from "reactstrap";
import * as Yup from "yup";
import axios from "axios";
import AsyncDropdownNormal from "../../components/asyncDropdownNormal";

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
import {StateContext} from "../../utils/context";

const API_URL = process.env.REACT_APP_API_URL_BASE;

const ArtistsAddFromWishlist = ({ match, name }) => {
  const token = getCookie("token");
  const options = {
    method: "GET",
    mode: 'cors',
    headers: {
       Authorization: `Bearer ${token}`,
       "Content-Type": "application/json"
    }
  };
  const {currentUser} = useContext(StateContext);
  const currentID = match.url.split("/")[2];
  const [userData, loadingError, loading] = useFetch(
    "GET",
    `artist-wishlist/${currentID}/`,
    token
  );
  const [success, setSuccess] = useState(false);
  const [errorDupl, setErrorDupl] = useState(false);
  const [error, setError] = useState(false);
  const [redirect, setRedirect] = useState(false);
  
  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');
  const [subUser, setSubUser] = useState('');
  const [subUserId, setSubUserId] = useState(null);
  const [subUserEndpoint, setSubUserEndpoint] = useState('');
  
  const [spotifyArtist, setSpotifyArtist] = useState(null);

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
                  <h3>Add Artist</h3>
                  <Formik
                    initialValues={{
                      name: userData.name,
                      email: '',
                      spotifyId: userData.spotify_identifier,
                      appleId: ''
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
                        setErrorDupl(false);
      
                        const options = {
                          method: "POST",
                          mode: 'cors',
                          headers: {
                            Authorization: `Bearer ${token}`,
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
                      setFieldValue
                    }) => (
                      <Form>
                      {
                        spotifyArtist && 
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
                              disabled={true}
                              className={
                                "form-control" +
                                (errors.name && touched.name
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="name"
                              component="div"
                              className="invalid-feedback"
                            />
                            {
                            errorDupl && <p style={{ fontSize: "12px",color: "red",margin: "2px 0 0 0"}}>Artist already exists</p>
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
                              disabled={true}
                              className={
                                "form-control" +
                                (errors.spotifyId && touched.spotifyId
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="spotifyId"
                              component="div"
                              className="invalid-feedback"
                            />
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
                            <Button color="success" type="submit">
                              Submit
                            </Button>
                          </Col>
                        </FormGroup>
                      </Form>
                    )}
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
        </>
      )}
    </div>
  );
};

export default ArtistsAddFromWishlist;
