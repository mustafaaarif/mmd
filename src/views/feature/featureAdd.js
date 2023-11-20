import React, { useEffect, useState } from "react";
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  Card,
  Row,
  CardBody,
  Col,
  FormGroup,
  Label,
  Button,
  Alert,
  FormText
} from "reactstrap";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import ModalConfirm from "../../components/modalConfirm";
import { Redirect } from "react-router-dom";
import "react-day-picker/lib/style.css";
const FeatureAdd = () => {
  const token = getCookie("token");
  const [listRelease] = useFetch("GET", "releases/?page_size=9999&fields=name,id,official_date", token);
  const [listFeature] = useFetch("GET", "feature-request/", token);
  const [optionList, setOpinionList] = useState(null);

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut] = useState(false);
  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);
  const [redirect, setRedirect] = useState(false);

  const today = new Date();
  const datePlus = new Date(new Date().setDate(today.getDate() + 11));

  const formattedDate =
    datePlus.getFullYear() +
    "-" +
    ("0" + (datePlus.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + datePlus.getDate()).slice(-2);

  useEffect(() => {
    if (listRelease.length !== 0) {
      setOpinionList(
        listRelease.results
          .filter(
            i => i.official_date >= formattedDate && listRelease.results.push(i)
          )
          .map(i => ({ value: i.id, label: i.name }))
      );
    }
  }, [listRelease, formattedDate]);

  const idList = [];

  const getFeatureId = () => {
    if (listFeature.length !== 0) {
      listFeature.results.forEach(function(i) {
        idList.push(i.release);
      });
    }
    return idList;
  };

  getFeatureId();

  return (
    <>
      <Row>
        <Col sm={12}>
          <Card>
            <CardBody>
              <h3>Marketing Facts</h3>
              <Formik
                initialValues={{
                  release: "",
                  dj_tastemaker: "",
                  radio_support: "",
                  marketing_pr: "",
                  label_reach: "",
                  artist_remixer: "",
                  label: "",
                  release_name: "",
                  // release_date: "",
                  exclusive_date: "",
                  release_artist_name: ""
                }}
                validationSchema={Yup.object().shape({
                  release: Yup.string().required(
                    "Existing release is required"
                  ),
                  dj_tastemaker: Yup.string(),
                  radio_support: Yup.string(),
                  marketing_pr: Yup.string(),
                  label_reach: Yup.string(),
                  artist_remixer: Yup.string(),
                  label: Yup.string(),
                  release_name: Yup.string(),
                  // release_date: Yup.string(),
                  exclusive_date: Yup.string(),
                  release_artist_name: Yup.string()
                })}
                onSubmit={(
                  {
                    release,
                    dj_tastemaker,
                    radio_support,
                    marketing_pr,
                    label_reach,
                    artist_remixer,
                    label,
                    release_name,
                    // release_date,
                    // exclusive_date,
                    release_artist_name
                  },
                  { setStatus, setSubmitting }
                ) => {
                  setStatus();
                  const body = {
                    release: release.value,
                    dj_tastemaker: dj_tastemaker,
                    radio_support: radio_support,
                    marketing_pr: marketing_pr,
                    label_reach: label_reach,
                    artist_remixer: artist_remixer,
                    label: label,
                    release_name: release_name,
                    // release_date: release_date,
                    // exclusive_date: exclusive_date,
                    release_artist_name: release_artist_name
                  };
                  setToggleModal(true);
                  setDataModal(body);
                }}
                render={({
                  errors,
                  status,
                  touched,
                  isSubmitting,
                  setStatus,
                  setFieldValue
                }) => {
                  return (
                    <Form className="mt-3" id="addFeatureAdd">
                      <FormGroup row>
                        <Label for="recSelect" sm={3}>
                          Release
                        </Label>
                        <Col sm={9}>
                          <Select
                            components={{ IndicatorSeparator:() => null }}
                            options={optionList}
                            onChange={e => {
                              if (idList.includes(e.value)) {
                                errors.release =
                                  "Feature request for this release was already made";
                                setStatus(errors);
                              } else {
                                setFieldValue("release", e);
                              }
                              return errors;
                            }}
                          />
                          {errors.release && (
                            <div
                              className="invalid-feedback"
                              style={{ display: "block" }}
                            >
                              {errors.release}
                            </div>
                          )}
                          <FormText>
                            Select a release for which you want to submit
                            featuring request. You can only see and select
                            releases which are having a general release date 22
                            or more days in advance. If you are targeting for an
                            exclusive release date pitch, please make sure to
                            submit this form at least 22 days before a (first)
                            exclusive release date.
                          </FormText>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label for="dj_tastemaker" sm={3}>
                          DJ / TasteMaker feedbacks:
                        </Label>
                        <Col sm={9}>
                          <Field
                            name="dj_tastemaker"
                            component="textarea"
                            rows="5"
                            className={
                              "form-control" +
                              (errors.dj_tastemaker && touched.dj_tastemaker
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="dj_tastemaker"
                            component="div"
                            className="invalid-feedback"
                          />
                          <FormText>
                            Insert 10 DJ / Radio / Magazine feedbacks in format
                            " Name - Feedback" (Insert each feedback in one
                            line). Submissions containing "downloading for"
                            won´t be promoted or sent to online shops.
                          </FormText>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label for="radio_support" sm={3}>
                          Radio support
                        </Label>
                        <Col sm={9}>
                          <Field
                            name="radio_support"
                            component="textarea"
                            rows="5"
                            className={
                              "form-control" +
                              (errors.radio_support && touched.radio_support
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="radio_support"
                            component="div"
                            className="invalid-feedback"
                          />
                          <FormText>
                            Is your song or a release featured at some radio
                            stations? If so name the station and insert the
                            corresponding link to their page where it is visible
                            they are promoting or playing your songs.
                          </FormText>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label for="marketing_pr" sm={3}>
                          Marketing / Pr
                        </Label>
                        <Col sm={9}>
                          <Field
                            name="marketing_pr"
                            component="textarea"
                            rows="5"
                            className={
                              "form-control" +
                              (errors.marketing_pr && touched.marketing_pr
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="marketing_pr"
                            component="div"
                            className="invalid-feedback"
                          />
                          <FormText>
                            (Interviews, blogs, reviews, magazine articles) -
                            Please list all committed press & marketing
                            activities for this release. Not mandatory but
                            essentially important to stand out of competition.
                          </FormText>
                        </Col>
                      </FormGroup>

                      <FormGroup row>
                        <Label for="label_reach" sm={3}>
                          Label and artists reach:
                        </Label>
                        <Col sm={9}>
                          <Field
                            name="label_reach"
                            component="textarea"
                            rows="5"
                            className={
                              "form-control" +
                              (errors.label_reach && touched.label_reach
                                ? " is-invalid"
                                : "")
                            }
                          />
                          <ErrorMessage
                            name="label_reach"
                            component="div"
                            className="invalid-feedback"
                          />
                          <FormText>
                            The combined ( label and artists) amount of
                            followers on Facebook, Instagram, SoundCloud, and
                            YouTube.{" "}
                            <strong>
                              Please put each platform and number of followers
                              in a new row
                            </strong>
                            .
                          </FormText>
                        </Col>
                      </FormGroup>

                      <FormGroup>
                        <Button type="submit" color="success">
                          Submit
                        </Button>
                      </FormGroup>
                    </Form>
                  );
                }}
              />
              {success && (
                <Alert color="success">Feature request has been added!</Alert>
              )}
              {redirect ? <Redirect to="/feature" /> : null}
              {errorPut && (
                <Alert color="danger">
                  Something went wrong! Please refresh page and try again!
                </Alert>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
      {dataModal && (
        <ModalConfirm
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          title={`New feature request`}
          setSuccess={setSuccess}
          body={`This feature request has to be submitted at least 21 days before first (exclusive or general, whatever comes first) date.
          Unfortunately, late submissions can not be taken into consideration.Do you want to submit your feature request?`}
          apiURL={`feature-request`}
          setRedirect={setRedirect}
        />
      )}
    </>
  );
};

export default FeatureAdd;
