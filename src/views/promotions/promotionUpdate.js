import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

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
import Select from "react-select";
import "react-day-picker/lib/style.css";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const PromotionUpdate = ({ match, name }) => {
  const token = getCookie("token");
  const currentID = match.url.split("/")[2];
  const [promoData, error, loading] = useFetch("GET", `promotions/${currentID}/`, token);
  const [listRecipient] = useFetch("GET", "recipients/?page_size=9999&fields=name,token", token);
  const [listRelease] = useFetch("GET", "releases/?page_size=9999&fields=name,get_artists,id", token);
  const [optionList, setOpinionList] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [releaseList, setReleaseList] = useState(null);
  const [loadedAll, setLoadedAll] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errorPut, setErrorPut] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const [selectAll, setSelectAll]= useState(false);

  const reminders = [
    {
      label: "2 weeks",
      value: "2"
    },
    {
      label: "3 weeks",
      value: "3"
    }
  ];

  const selectList = e => {
    setSelectedList(e);
  };

  useEffect(() => {
    if (Object.keys(promoData).length > 0) {
      setSelectedList(promoData.recipients.map(i => ({ value: i.token, label: i.name })));
    }
  }, [promoData]);

  useEffect(() => {
    if (listRecipient.length !== 0) {
      setOpinionList(
        listRecipient.results.map(i => ({ value: i.token, label: i.name }))
      );
      setLoadedAll(true);
    }
    if (listRelease.length !== 0) {
      setReleaseList(
        listRelease.results.map(i => ({ value: i.id, label: i.name }))
      );
    }
  }, [listRecipient, listRelease]);


  return (
    <div>

        {
          !loading && loadedAll && promoData?.id ?
          <>
          <Row>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <h3>Update promotion</h3>
                  <Formik
                    initialValues={{
                      name: promoData.name,
                      release: promoData.release,
                      description: promoData.description,
                      send_reminder: promoData.send_reminder,
                      recipient: selectedList
                    }}
                    validationSchema={Yup.object().shape({
                      name: Yup.string().required().typeError('Name is required'),
                      release: Yup.string().required().typeError('Release is required'),
                      send_reminder: Yup.string().required().typeError('Reminder is required'),
                      description: Yup.string(),
                      recipient: Yup.array()
                    })}
                    onSubmit={(
                      {
                        name,
                        release,
                        description,
                        send_reminder,
                        recipient,
                      },
                      { setStatus, setSubmitting }
                    ) => {
                      setStatus();
                      const options = {
                        method: "PUT",
                        mode: 'cors',
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "x-api-key": X_API_KEY,
                          "Content-Type": "application/json"
                        }
                      };

                      const onlyVals = selectedList.map(i => i.value);

                      axios
                        .put(
                          `${API_URL}promotions/${currentID}/`,
                          {
                            name: name,
                            release: release,
                            recipient: onlyVals,
                            send_reminder: send_reminder,
                            description: description
                          },
                          options
                        )
                        .then(res => {
                          setSuccess(true);
                          setTimeout(() => setRedirect(true), 3000);
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
                      setFieldValue,
                      handleChange
                    }) => (
                      <Form className="mt-3" id="addPromotionForm">
                        <FormGroup row>
                          <Label for="release" sm={2}>
                            Release
                          </Label>
                          <Col sm={10}>
                            <Select
                              components={{ IndicatorSeparator:() => null }}
                              options={releaseList}
                              defaultValue={{
                                label: promoData.name,
                                value: promoData.release
                              }}
                              onChange={e => {
                                const releaseArtist = listRelease.results.filter(i => i.id === e.value)[0].get_artists;
                                const promoname = `Exclusive Release - ${e.label} by ${releaseArtist}`
                                setFieldValue("release", e.value);
                                setFieldValue("name", promoname);
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
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="name" sm={2}>
                            Name
                          </Label>
                          <Col sm={10}>
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
                              name="description"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="description" sm={2}>
                            Description
                          </Label>
                          <Col sm={10}>
                            <Field
                              name="description"
                              type="textarea"
                              component="textarea"
                              style={{minHeight: '80px'}}
                              className={
                                "form-control" +
                                (errors.description && touched.description
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="description"
                              component="div"
                              className="invalid-feedback"
                            />
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="send_reminder" sm={2}>
                            Send Reminder
                          </Label>
                          <Col sm={10}>
                            <Select
                              components={{ IndicatorSeparator:() => null }}
                              options={reminders}
                              defaultValue={{
                                label: `${promoData.send_reminder} weeks`,
                                value: promoData.send_reminder
                              }}
                              isDisabled
                              onChange={e => {
                                setFieldValue("send_reminder", e.value);
                              }}
                            />
                            {errors.send_reminder && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                {errors.send_reminder}
                              </div>
                            )}
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="recSelect" sm={2}>
                            Recipients
                          </Label>
                          <Col sm={10}>
                            
                            <div className="selectAllWrap">
                            {
                              selectAll ?

                              <Select
                                components={{ IndicatorSeparator:() => null }}
                                isMulti={true}
                                allowSelectAll={true}
                                options={optionList}
                                value={optionList}
                                onChange={e => {
                                  setSelectAll(false);
                                  selectList( e);
                                }}
                              />
                              :
                              <Select
                                components={{ IndicatorSeparator:() => null }}
                                isMulti={true}
                                allowSelectAll={true}
                                options={optionList}
                                defaultValue={selectedList}
                                onChange={e => {
                                  selectList( e);
                                }}
                              />
                              }
                              <Button className="btn btn-outline-info" onClick={() => {
                                setSelectAll(true);
                                selectList(optionList);
                              }}>Add All</Button>
                            </div>

                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Button type="submit" color="success">
                            Submit
                          </Button>
                        </FormGroup>
                      </Form>
                    )}
                  />
                  {success && (
                    <Alert color="success">
                      Promotion "{promoData.name}" has been updated!
                    </Alert>
                  )}
                  {redirect ? <Redirect to="/promotions" /> : null}
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
          :   <TableHelper loading/>
        }

    </div>
  );
};

export default PromotionUpdate;
