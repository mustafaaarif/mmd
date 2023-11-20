import React, { useState, useEffect, useContext, useRef } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Select from "react-select";
import { Redirect } from "react-router-dom";
import {
  Card,
  Row,
  CardBody,
  Col,
  FormGroup,
  Label,
  Button,
  Alert,
  CardTitle,
  FormText,
} from "reactstrap";
import { getCookie } from "../../jwt/_helpers/cookie";
import { useFetch } from "../../utils/fetchHook";
import ean from "../../validations/es6/validators/ean";
import stringLength from "../../validations/es6/validators/stringLength";
import PreviewFiles from "./previewFiles";
import TableHelper from "../../components/tableHelper";

import { StateContext } from "../../utils/context";
import AsyncDropdownNormal from "../../components/asyncDropdownNormal";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const URL_REGEX =
  /^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;

const SOURCE_OPTIONS = [
  {
    value: 1,
    label: "Existing Move Music Release",
  },
  { value: 2, label: "External Release" },
];

const Schema = Yup.object().shape({
  source: Yup.string().required("Source is required"),
  release_name: Yup.string().required("Release name is required"),
  ean: Yup.string().required("UPC/EAN is required"),
  artist_name: Yup.string().required("Artist name is required"),
  spotify_url: Yup.string()
    .required("Spotify is required")
    .matches(
      /^((http|https):\/\/open.spotify.com)\/album\/[0-9]/,
      "Please add a valid spotify Url."
    ),
  deezer_url: Yup.string()
    .required("Deezer is required")
    .matches(
      /^((http|https):\/\/www.deezer.com)\/?[a-z]{0,10}?\/album\/[0-9]/,
      "Please add a valid Deezer Url."
    ),
  junodownload_url: Yup.string().matches(
    URL_REGEX,
    "Please add a valid Junodownload Url."
  ),
  tidal_url: Yup.string().matches(URL_REGEX, "Please add a valid Tidal Url."),
  youtube_url: Yup.string().matches(
    URL_REGEX,
    "Please add a valid Youtube Url."
  ),
  soundcloud_url: Yup.string().matches(
    URL_REGEX,
    "Please add a valid Soundcloud Url."
  ),
  applemusic_url: Yup.string().matches(
    URL_REGEX,
    "Please add a valid Applemusic Url."
  ),
  traxsource_url: Yup.string().matches(
    URL_REGEX,
    "Please add a valid Traxsource Url."
  ),
  beatport_url: Yup.string().matches(
    URL_REGEX,
    "Please add a valid Beatport Url."
  ),
  amazonmusic_url: Yup.string().matches(
    URL_REGEX,
    "Please add a valid Amazon music Url."
  ),

  url_part1: Yup.string().required("Url part1 is required"),
  url_part2: Yup.string().required("Url part2 is required"),
});

const createFormObject = (params) => {
  const formData = new FormData();
  for (const key in params) {
    formData.set(key, params[key]);
  }
  return formData;
};

const FORM_VALUES = {
  source: null,
  artist_name: "",
  ean: "",
  image_big: "",
  image_small: "",
  deezer_url: "",
  spotify_url: "",
  beatport_url: "",
  traxsource_url: "",
  url_part1: "",
  url_part2: "",
  applemusic_url: "",
  soundcloud_url: "",
  youtube_url: "",
  tidal_url: "",
  junodownload_url: "",
  other_url: "",
  info: "",
};

const INITIAL_PREVIEW_FILES = [];

const MusicLinkAdd = ({ match }) => {
  const token = getCookie("token");
  const [forceUpdate, setForce] = useState(0);
  const didEff = useRef(false);
  const sourceSelectRef = useRef();
  const options = {
    method: "GET",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  };
  const currentID =
    match.url.split("/")[2] === "add" ? null : match.url.split("/")[2];
  const currentIdEndpoint = match.url.split("/")[2] === "add" ? '' : `${currentID}`;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [source, setSource] = useState("");
  const [releases, setReleases] = useState([]);
  const [urlParts, setUrlParts] = useState([]);
  const [release, setRelease] = useState(null);
  const [eanNumber, eanNumberSET] = useState([{ valid: true }]);
  const [previewFiles, setPreviewFiles] = useState(INITIAL_PREVIEW_FILES);
  const [loadedAll, setLoadedAll] = useState(false);
  const [urlPart1, setUrlPart1] = useState(null);
  const [errorDupl, setErrorDupl] = useState(false);
  const [urlPartTwo, setUrlPartTwo] = useState(null);

  const {currentUser} = useContext(StateContext);
  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');
  const [subUser, setSubUser] = useState('');
  const [subUserId, setSubUserId] = useState(null);
  const [subUserEndpoint, setSubUserEndpoint] = useState('');

  const [listRelease, ,loadingListRelease] = useFetch(
    "GET",
    `releases/${subUserEndpoint}?page_size=9999&status=distributed${parentUserOnly}`,
    token, false , forceUpdate
  );
  const [listUrlParts, , loadingListUrlParts] = useFetch(
    "GET",
    `musiclinks_urlparts/${subUserEndpoint}`,
    token, false , forceUpdate
  );
  const [musicLinkData, loadingMusicLinkData] = useFetch(
    "GET",
    `musiclinks/${currentIdEndpoint}`,
    token, false
  );

  const axiosOptions = {
    method: "POST",
    mode: "cors",
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    if (
      loadingListRelease === false &&
      loadingListUrlParts === false &&
      (loadingMusicLinkData === false || loadingMusicLinkData === null)
    ) {
      setLoadedAll(true);
    }
  }, [loadingListRelease, loadingListUrlParts, loadingMusicLinkData]);

  useEffect(() => {
    if (musicLinkData && Object.keys(musicLinkData).length) {
      const { preview_files: newPreviewFiles, ...rest } = musicLinkData;
      setPreviewFiles(newPreviewFiles);
      setSource(rest.source);
      setUrlPartTwo(rest.url_part2);
      if(rest.sub_user)
      {
        setSubUserId(rest.sub_user);
        setSubUserEndpoint(`sub-user/${rest.sub_user}/`);
        setParentUserOnly('');
      }
    }
  }, [musicLinkData]);

  useEffect(() => {
    if (listUrlParts.results) {
      setUrlParts(
        listUrlParts.results.map((l) => ({ value: l.id, label: l.part }))
      );
    }
    else
    {
      setUrlParts([]);
    }
  }, [listUrlParts]);

  useEffect(() => {
    if (listRelease.results) {
      setReleases(
        listRelease.results.map((r) => ({ value: r.id, label: r.name }))
      );
    }
    else
    {
      setReleases([]);
    }
  }, [listRelease]);

  useEffect(() => {
    if (!didEff.current) {
      didEff.current = true;
      return;
    }
    setForce(prev => prev + 1);
  }, [subUserId]);



  const setValues = (result, setFieldValue, type) => {
    setFieldValue("image_big", result?.data?.image_big ?? "");
    setFieldValue("image_small", result?.data?.image_small ?? "");
    setFieldValue("artist_name", result?.data?.artist_name ?? "");
    setFieldValue("beatport_url", result?.data?.beatport_url ?? "");
    setFieldValue("deezer_url", result?.data?.deezer_url ?? "");
    setFieldValue("ean", result?.data?.ean ?? "");
    setFieldValue("spotify_url", result?.data?.spotify_url ?? "");
    setFieldValue("traxsource_url", result?.data?.traxsource_url ?? "");
    setFieldValue("applemusic_url", result?.data?.applemusic_url ?? "");
    setFieldValue("soundcloud_url", "");
    setFieldValue("youtube_url", "");
    setFieldValue("tidal_url", "");
    setFieldValue("junodownload_url", "");
    setFieldValue("amazonmusic_url", result?.data?.amazonmusic_url ?? "");
    setFieldValue("other_url", "");
    setFieldValue("info", "");
    setFieldValue("url_part1", null);
    setFieldValue("url_part2", "");
    setFieldValue(
      "release_name",
      result?.data?.release_name ?? result?.data?.name ?? ""
    );
    if (result?.data?.preview_files?.length) {
      setPreviewFiles(result?.data?.preview_files ?? []);
    }
    eanNumberSET([{ valid: true }]);
    setUrlPart1(null);
  };

  const getEanInformation = (values, setFieldValue) => async () => {
    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
      },
    };
    try {
      const result = await axios({
        url: `${API_URL}release-dist-ean/`,
        data: createFormObject({ ean: values.ean }),
        ...options,
      });
      if (result.status === 200) {
        setValues(result, setFieldValue);
      }
    } catch (error) {
      console.log(error);
      setValues({}, setFieldValue);
    }
  };

  const getDeezarInformation = (values, setFieldValue) => async () => {
    const options = {
      method: "POST",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
      },
    };
    try {
      const result = await axios({
        url: `${API_URL}release-dist-url/`,
        data: createFormObject({
          deezer_url: values.deezer_url,
          spotify_url: values.spotify_url,
        }),
        ...options,
      });
      if (result.status === 200) {
        setValues(result, setFieldValue);
      }
    } catch (error) {
      console.log(error);
      setValues({}, setFieldValue);
    }
  };

  const validateEAN = (e) => {
    const validEAN = ean().validate({
      value: e,
    });

    const length = stringLength().validate({
      value: e,
      options: {
        min: 13,
        max: 13,
        message: "The EAN number must be equal to 13 characters",
      },
    });
    eanNumberSET([validEAN, length]);
  };

  const addNewPreviewFile = (newPreviewFiles) => {
    setPreviewFiles(newPreviewFiles);
  };

  const removePreviewFile = (index) => {
    const newPreviewFiles = JSON.parse(JSON.stringify(previewFiles));
    newPreviewFiles.splice(index, 1);
    setPreviewFiles(newPreviewFiles);
  };

  const manageDataFilePreview = (index, name, value) => {
    const newPreviewFiles = JSON.parse(JSON.stringify(previewFiles));
    newPreviewFiles[index][name] = value;
    setPreviewFiles(newPreviewFiles);
  };

  const onReleaseChange = async (
    id,
    values,
    setFieldValue,
    setFieldTouched
  ) => {
    try {
      const result = await axios.get(
        `${API_URL}releases_dist/${id}/`,
        axiosOptions
      );
      if (result.status === 200) {
        setValues(result, setFieldValue, "release_change");
        setRelease(id);
      }
    } catch (error) {
      console.log(error);
      setValues({}, setFieldValue);
    }
  };

  const onSubmit = async (payload, { setStatus, setSubmitting }) => {
    setStatus();
    setErrorDupl(false);

    const dataObject = { 
      ...payload, 
      preview_files: previewFiles,
      ...(subUserId && { sub_user_id: subUserId || null}),
    };

    let result = null;

    const urlPartTwoChanged = (urlPartTwo !== payload.url_part2);
    const urlPartOneObj = urlParts?.find(
      (s) => s.value === payload.url_part1
    );

    try {
      if (currentID) {
        if (urlPartTwoChanged) {

          const reqData = {
            url_part1: urlPartOneObj.label,
            url_part2: payload.url_part2,
          };

          const landingPageExists = await axios({
            method: "POST",
            mode: "cors",
            url: `${API_URL}musiclinks_urlparts/validate-urlparts/`,
            data: reqData,
            headers: {
              Authorization: `Bearer ${token}`,
              "x-api-key": X_API_KEY,
              "Content-Type": "application/json",
            },
          });

          if (landingPageExists.status === 200) {
            let resData = landingPageExists.data;
            let valid = resData.valid;

            if (!valid) {
              setErrorDupl(true);
            } else {
              result = await axios({
                url: `${API_URL}musiclinks/${currentID}`,
                data: dataObject,
                ...axiosOptions,
                method: "PUT",
              });
              setRedirect(true);
            }
          }
        }

        else {
          result = await axios({
            url: `${API_URL}musiclinks/${currentID}`,
            data: dataObject,
            ...axiosOptions,
            method: "PUT",
          });
          setRedirect(true);
        }

      } else {

        const reqData = {
          url_part1: urlPartOneObj.label,
          url_part2: payload.url_part2,
        };

        const landingPageExists = await axios({
          method: "POST",
          mode: "cors",
          url: `${API_URL}musiclinks_urlparts/validate-urlparts/`,
          data: reqData,
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": X_API_KEY,
            "Content-Type": "application/json"
          },
        })

        if (landingPageExists.status === 200) {
          let resData = landingPageExists.data;
          let valid = resData.valid;
          if (!valid) {
            setErrorDupl(true);
          } else {
            result = await axios({
              url: `${API_URL}musiclinks/`,
              data: dataObject,
              ...axiosOptions,
            });
            console.log(result);
            setRedirect(true);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSourceChange = (values, setFieldValue) => (e) => {
    values.source = e.value;
    setSource(e.value);
    setPreviewFiles(INITIAL_PREVIEW_FILES);
    setValues({}, setFieldValue);
  };

  return (
    <div>
      {loadedAll === false ? (
        <TableHelper loading />
      ) : (
        <Row>
          <Col sm={12}>
            <Card>
              <CardBody>
                <CardTitle tag="h4">
                  {currentID ? "Edit" : "Add"} music link
                </CardTitle>
                <Formik
                  initialValues={{
                    source: musicLinkData.source || null,
                    artist_name: musicLinkData.artist_name || "",
                    release_name: musicLinkData.release_name || "",
                    ean: musicLinkData.ean || "",
                    image_big: musicLinkData.image_big || "",
                    image_small: musicLinkData.image_small || "",
                    deezer_url: musicLinkData.deezer_url || "",
                    spotify_url: musicLinkData.spotify_url || "",
                    beatport_url: musicLinkData.beatport_url || "",
                    traxsource_url: musicLinkData.traxsource_url || "",
                    url_part1: musicLinkData.url_part1 || null,
                    url_part2: musicLinkData.url_part2 || "",
                    applemusic_url: musicLinkData.applemusic_url || "",
                    soundcloud_url: musicLinkData.soundcloud_url || "",
                    youtube_url: musicLinkData.youtube_url || "",
                    tidal_url: musicLinkData.tidal_url || "",
                    junodownload_url: musicLinkData.junodownload_url || "",
                    other_url: musicLinkData.other_url || "",
                    info: musicLinkData.info || "",
                  }}
                  validationSchema={Schema}
                  onSubmit={onSubmit}
                  render={({
                    errors,
                    status,
                    touched,
                    isSubmitting,
                    setFieldValue,
                    setFieldTouched,
                    values,
                    ...rest
                  }) => {
                    return (
                      <Form className="mt-3" id="addArtistForm">
                        { (currentUser.is_premium_user && !currentID)  &&
                          <FormGroup className="select-search-wrap" row>
                            <Label
                              sm={2}
                            >
                              Sub-User
                            </Label>
                            <Col>
                              {
                                subUser ?
                                  <div className="releaseFileRow">
                                      <p className="releaseFileRowName"> {subUser}</p>
                                      <Button className="btn btn-outline-info" 
                                        onClick={() => {
                                          sourceSelectRef.current.select.setValue(0);
                                          setSource("");
                                          setValues({}, setFieldValue);
                                          setPreviewFiles([]);
                                          setFieldValue("release_name", "");
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
                                      sourceSelectRef.current.select.setValue(0);
                                      setSource("");
                                      setValues({}, setFieldValue);
                                      setPreviewFiles([]);

                                      setSubUser(username);
                                      setSubUserId(subUserId);
                                      setSubUserEndpoint(`sub-user/${subUserId}/`);
                                      setParentUserOnly('');
                                    } else {
                                      sourceSelectRef.current.select.setValue(0);
                                      setSource("");
                                      setValues({}, setFieldValue);
                                      setPreviewFiles([]);                                        
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
                              Note: Only use this dropdown if you want to Add Music Link for any of your Sub-users otherwise leave un-selected.
                            </FormText>
                            </Col>
                          </FormGroup>
                        }

                        <FormGroup row>
                          <Label for="source" sm={2}>
                            Source
                          </Label>
                          <Col>
                            <Select
                              ref={sourceSelectRef}
                              value={SOURCE_OPTIONS.find(
                                (s) => s.value === values.source
                              )}
                              components={{ IndicatorSeparator: () => null }}
                              options={SOURCE_OPTIONS}
                              onChange={onSourceChange(values, setFieldValue)}
                            />
                            {errors.source && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                Source is required
                              </div>
                            )}

                            <input
                              id="selectedLang"
                              className="hiddenInput"
                              type="text"
                              value={values.source}
                              onChange={() => false}
                            />
                          </Col>
                        </FormGroup>

                        {(source === undefined || source === 2) && (
                          <FormGroup row>
                            <Label for="release_name" sm={2}>
                              Release name
                            </Label>
                            <Col>
                              <Field
                                name="release_name"
                                type="text"
                                className={
                                  "form-control" +
                                  (errors.release_name && touched.release_name
                                    ? " is-invalid"
                                    : "")
                                }
                              />
                              <ErrorMessage
                                name="release_name"
                                component="div"
                                className="invalid-feedback"
                              />
                            </Col>
                          </FormGroup>
                        )}

                        {source === 1 && (
                          <FormGroup row>
                            <Label for="release_name" sm={2}>
                              Release name
                            </Label>
                            <Col>
                              <Select
                                value={releases.find(
                                  (r) => r.label === values.release_name
                                )}
                                components={{ IndicatorSeparator: () => null }}
                                options={releases}
                                onChange={({ value }) => {
                                  onReleaseChange(
                                    value,
                                    values,
                                    setFieldValue,
                                    setFieldTouched
                                  );
                                }}
                              />
                              <FormText color="muted">
                                Note: You can only select releases which are <b>Distributed</b>.
                              </FormText>

                              <input
                                id="selectedLang"
                                className="hiddenInput"
                                type="text"
                                value={source}
                                onChange={() => false}
                              />
                            </Col>
                          </FormGroup>
                        )}

                        <FormGroup row>
                          <Label for="ean" sm={2}>
                            UPC/EAN
                          </Label>
                          <Col>
                            <Field
                              name="ean"
                              type="text"
                              className={
                                "form-control" +
                                (errors.ean && touched.ean ? " is-invalid" : "")
                              }
                              onChange={(e) => {
                                validateEAN(e.target.value);
                                setFieldValue("ean", e.target.value);
                              }}
                            />
                            {errors.ean && (
                              <ErrorMessage
                                name="ean"
                                component="div"
                                className="invalid-feedback"
                              />
                            )}
                          </Col>

                          {eanNumber && (
                            <Col sm={12}>
                              <Col className="form-text" sm={{ offset: 2 }}>
                                {eanNumber.map((i, index) => {
                                  if (i.valid) return false;
                                  return (
                                    <div
                                      className="fv-help-block"
                                      key={i.message}
                                    >
                                      {i.message}
                                    </div>
                                  );
                                })}
                              </Col>
                            </Col>
                          )}
                        </FormGroup>

                        {source === 2 && (
                          <FormGroup row>
                            <Label sm={2}></Label>
                            <Col xs={2}>
                              <Button
                                color="success"
                                onClick={getEanInformation(
                                  values,
                                  setFieldValue
                                )}
                              >
                                Get information from UPC/EAN
                              </Button>
                            </Col>
                          </FormGroup>
                        )}

                        <FormGroup row>
                          <Label for="artist_name" sm={2}>
                            Artist name
                          </Label>
                          <Col>
                            <Field
                              name="artist_name"
                              type="text"
                              className={
                                "form-control" +
                                (errors.artist_name && touched.artist_name
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="artist_name"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Col>
                        </FormGroup>

                        {values.image_big && (
                          <FormGroup row>
                            <Label sm={2}>Image</Label>
                            <Col xs={2}>
                              <img
                                src={values.image_big}
                                style={{ width: "300px", padding: "10px 0" }}
                                alt={"Image big"}
                              />
                            </Col>
                          </FormGroup>
                        )}

                        <FormGroup row>
                          <Label for="deezer_url" sm={2}>
                            Deezer url
                          </Label>
                          <Col>
                            <Field
                              name="deezer_url"
                              type="text"
                              className={
                                "form-control" +
                                (errors.deezer_url && touched.deezer_url
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="deezer_url"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="spotify_url" sm={2}>
                            Spotify url
                          </Label>
                          <Col>
                            <Field
                              name="spotify_url"
                              type="text"
                              className={
                                "form-control" +
                                (errors.spotify_url && touched.spotify_url
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="spotify_url"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Col>
                        </FormGroup>

                        {source === 2 && (
                          <FormGroup row>
                            <Label sm={2}></Label>
                            <Col xs={2}>
                              <Button
                                color="success"
                                onClick={getDeezarInformation(
                                  values,
                                  setFieldValue
                                )}
                              >
                                Get information from Deezer/Spotify url
                              </Button>
                            </Col>
                          </FormGroup>
                        )}

                        <FormGroup row>
                          <Label for="beatport_url" sm={2}>
                            Beatport url
                          </Label>
                          <Col>
                            <Field
                              name="beatport_url"
                              type="text"
                              className={
                                "form-control" +
                                (errors.beatport_url && touched.beatport_url
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="traxsource_url" sm={2}>
                            Traxsource url
                          </Label>
                          <Col>
                            <Field
                              name="traxsource_url"
                              type="text"
                              className={
                                "form-control" +
                                (errors.traxsource_url && touched.traxsource_url
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="applemusic_url" sm={2}>
                            Applemusic url
                          </Label>
                          <Col>
                            <Field
                              name="applemusic_url"
                              type="text"
                              className={
                                "form-control" +
                                (errors.applemusic_url && touched.applemusic_url
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="soundcloud_url" sm={2}>
                            Soundcloud url
                          </Label>
                          <Col>
                            <Field
                              name="soundcloud_url"
                              type="text"
                              className={
                                "form-control" +
                                (errors.soundcloud_url && touched.soundcloud_url
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="youtube_url" sm={2}>
                            Youtube url
                          </Label>
                          <Col>
                            <Field
                              name="youtube_url"
                              type="text"
                              className={
                                "form-control" +
                                (errors.youtube_url && touched.youtube_url
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="tidal_url" sm={2}>
                            Tidal url
                          </Label>
                          <Col>
                            <Field
                              name="tidal_url"
                              type="text"
                              className={
                                "form-control" +
                                (errors.tidal_url && touched.tidal_url
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="junodownload_url" sm={2}>
                            Junodownload url
                          </Label>
                          <Col>
                            <Field
                              name="junodownload_url"
                              type="text"
                              className={
                                "form-control" +
                                (errors.junodownload_url &&
                                touched.junodownload_url
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="amazonmusic_url" sm={2}>
                            Amazon music url
                          </Label>
                          <Col>
                            <Field
                              name="amazonmusic_url"
                              type="text"
                              className={
                                "form-control" +
                                (errors.amazonmusic_url && touched.amazonmusic_url
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="other_url" sm={2}>
                            Other url
                          </Label>
                          <Col>
                            <Field
                              name="other_url"
                              type="text"
                              className={
                                "form-control" +
                                (errors.other_url && touched.other_url
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="description" sm={2}>
                            Info
                          </Label>
                          <Col sm={10}>
                            <Field
                              name="info"
                              type="textarea"
                              component="textarea"
                              style={{ minHeight: "80px" }}
                              className={
                                "form-control" +
                                (errors.info && touched.info
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="name" sm={2}>
                            Url part1
                          </Label>
                          <Col>
                            <Select
                              value={
                                urlParts?.find(
                                  (s) => s.value === values.url_part1
                                )
                                  ? urlParts?.find(
                                      (s) => s.value === values.url_part1
                                    )
                                  : []
                              }
                              components={{ IndicatorSeparator: () => null }}
                              options={urlParts}
                              isDisabled={currentID?true:false}
                              onChange={({ value }) => {
                                setFieldValue("url_part1", value);
                                values.url_part1 = value;
                                setUrlPart1(value);
                              }}
                            />
                            {errors.url_part1 && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                Url part1 is required
                              </div>
                            )}
                            <input
                              id="selectedLang"
                              className="hiddenInput"
                              type="text"
                              value={values.url_part1}
                              onChange={() => false}
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="name" sm={2}>
                            Url part2
                          </Label>
                          <Col>
                            <Field
                              name="url_part2"
                              type="text"
                              disabled={currentID?true:false}
                              className={
                                "form-control" +
                                (errors.url_part2 && touched.url_part2
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="url_part2"
                              component="div"
                              className="invalid-feedback"
                            />
                            {errorDupl && (
                              <p
                                style={{
                                  fontSize: "12px",
                                  color: "red",
                                  margin: "2px 0 0 0",
                                }}
                              >
                                This Music Link URL is already in use by you account or another user account. Please try something else.
                              </p>
                            )}
                          </Col>
                        </FormGroup>

                        <PreviewFiles
                          id="releaseTracks"
                          name="releaseTracks"
                          values={{
                            previewFiles,
                            addNew: addNewPreviewFile,
                            remove: removePreviewFile,
                            manageData: manageDataFilePreview,
                          }}
                        />

                        <FormGroup row>
                          <Col>
                            <Button color="success">Submit</Button>
                          </Col>
                        </FormGroup>
                      </Form>
                    );
                  }}
                />
                {success && (
                  <Alert color="success">Music link has been added!</Alert>
                )}
                {redirect ? <Redirect to="/music-link" /> : null}
                {error && (
                  <Alert color="danger">
                    Something went wrong! Please refresh page and try again!
                  </Alert>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default MusicLinkAdd;
