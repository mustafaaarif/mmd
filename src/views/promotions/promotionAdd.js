import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { Card, Row, CardBody, Col, FormGroup, Label, Button, Alert, CardTitle, FormText } from "reactstrap";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import TableHelper from "../../components/tableHelper";
import { Redirect } from "react-router-dom";
import Select from "react-select";
import "react-day-picker/lib/style.css";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const PromotionAdd = ({ match, name }) => {
  const token = getCookie("token");
  const [recipients] = useFetch("GET", "recipients/?page_size=9999&fields=name,token", token);
  const [listRelease] = useFetch("GET", "releases/?page_size=9999&fields=name,get_artists,id,release_date_passed", token);
  const [listRecipients] = useFetch("GET",`recipient-lists/?page_size=999`,token);

  const [optionList, setOptionList] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [releaseList, setReleaseList] = useState(null);
  const [listOfRecipients, setList] = useState(null);
  const [loadedAll, setLoadedAll] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errorPut, setErrorPut] = useState(false);
  const [errorText, setErrorText] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const [selectAll, setSelectAll]= useState(false);
  
  const [selectAll2, setSelectAll2]= useState(false);
  const [recipientList, setRecipientList] = useState(false);
  const [recipientListOptions, setRecipientsListOptions] = useState(false);
  const [selectedRecipientsList, setSelectedRecipientsList] = useState([]);

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
    if (recipients.length !== 0) {
      setOptionList(
        recipients.results.map(i => ({ label: i.name, value: i.token }))
      );
      setLoadedAll(true);
    }
  }, [recipients]);

  useEffect(() => {
    if (listRelease.length !== 0) {

      let filteredReleases = listRelease.results.filter(function (release) {
        return release.release_date_passed === false;
      });

      setReleaseList(
        filteredReleases.map(i => ({ value: i.id, label: i.name }))
      );
    }
  }, [listRelease]);

  useEffect(() => {
    if (listRecipients.length !== 0) {
      setList(
        listRecipients.results.map(i => ({ value: i.id, label: i.name }))
      );
    }
  }, [listRecipients]);

  useEffect(() => {
    if (recipientList) {
      const options = {
        method: "GET",
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": X_API_KEY,
          "Content-Type": "application/json"
        }
      };
      axios.get(`${API_URL}recipient-lists/${recipientList.value}/`, options).then(res => {
        if (res.status === 200){
          const fullItems = res.data.recipient_set.map(i => {
            const filteredItem = recipients.results.filter(a =>  a.token === i);
            if (filteredItem.length > 0) {
              return filteredItem[0]
            }
          }).map( i => ({label: i.name, value: i.token}));
          setRecipientsListOptions(fullItems);
          setSelectedRecipientsList(fullItems);
          setSelectAll2(true);
        }
      })
    }
  }, [recipientList]);


  return (
    <div>
      {!loadedAll ? (
        <TableHelper loading />
      ) : (
        <>
          <Row>
            <Col sm={12}>
              <Card>
                <CardBody>
                  <CardTitle tag="h4">Add new promotion</CardTitle>
                  <Formik
                    initialValues={{
                      name: "",
                      release: "",
                      description: "",
                      send_reminder: "",
                      recipient: []
                    }}
                    validateOnChange={false}
                    validateOnBlur={false}
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
                        recipient
                      },
                      { setStatus, setSubmitting }
                    ) => {
                      setStatus();
                      const options = {
                        method: "post",
                        mode: 'cors',
                        headers: {
                          Authorization: `Bearer ${token}`,
                          "x-api-key": X_API_KEY,
                          "Content-Type": "application/json"
                        }
                      };


                      const onlyVals = selectedList.map(i => i.value);
                      const onlyVals2 = selectedRecipientsList.map(i => i.value);

                      const sumVals = [...new Set(onlyVals.concat(onlyVals2))];

                      axios
                        .post(
                          `${API_URL}promotions/`,
                          {
                            name: name,
                            release: release,
                            recipient: sumVals,
                            send_reminder: send_reminder,
                            description: description
                          },
                          options
                        )
                        .then(res => {
                          if (res.status === 201) {
                            setSuccess(true);
                            setTimeout(() => setRedirect(true), 1000);
                            return res;
                          }
                          
                        })
                        .catch(err => {
                          if (err.response.data?.release) {
                            setErrorText(err.response.data?.release[0])
                          }
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
                          <Col>
                            <Select
                              components={{ IndicatorSeparator:() => null }}
                              options={releaseList}
                              onChange={e => {
                                const releaseArtist = listRelease.results.filter(i => i.id === e.value)[0].get_artists;
                                const promoname = `Exclusive Release - ${e.label} by ${releaseArtist}`
                                setFieldValue("release", e.value);
                                setFieldValue("name", promoname);
                              }}
                            />
                            <FormText color="muted">
                              Note: You can only create promotions for releases which have a future release date i.e. not today or earlier.
                            </FormText>
                            {errors.release && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                Release is required
                              </div>
                            )}
                          </Col>
                        </FormGroup>
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
                          <Col >
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
                          <Col>
                            <Select
                              components={{ IndicatorSeparator:() => null }}
                              options={reminders}
                              onChange={e => {
                                setFieldValue("send_reminder", e.value);
                              }}
                            />
                            {errors.send_reminder && (
                              <div
                                className="invalid-feedback"
                                style={{ display: "block" }}
                              >
                                Send reminder is required
                              </div>
                            )}
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="recipient" sm={2}>
                            Recipients list
                          </Label>
                          <Col >
                            <div>
                            
                              <Select
                              components={{ IndicatorSeparator:() => null }}
                              allowSelectAll={true}
                              options={listOfRecipients}
                              onChange={e => {
                                setRecipientList(e)
                              }}
                              />
                            </div>
                            <div className="selectAllWrap" style={{padding: "8px 0 0 0"}}>
                              {
                                recipientList ?
                                selectAll2 ?

                                <Select
                                  components={{ IndicatorSeparator:() => null }}
                                  isMulti={true}
                                  allowSelectAll={true}
                                  options={recipientListOptions}
                                  value={recipientListOptions}
                                  onChange={e => {
                                    setSelectAll2(false);
                                    setSelectedRecipientsList( e);
                                  }}
                                />
                                :
                                <Select
                                  components={{ IndicatorSeparator:() => null }}
                                  isMulti={true}
                                  allowSelectAll={true}
                                  options={recipientListOptions}
                                  onChange={e => {
                                    setSelectedRecipientsList( e);
                                  }}
                                />
                                :
                                <div></div>
                              }
                              {
                                recipientList && 
                                <Button className="btn btn-outline-info" onClick={() => {
                                  setSelectAll2(true);
                                  setSelectedRecipientsList(recipientListOptions);
                                }}>Add All</Button>
                              }
                            </div>
                          </Col>
                        </FormGroup>


                        <FormGroup row>
                          <Label for="recipient" sm={2}>
                            Recipients
                          </Label>
                          <Col >
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
                    <Alert color="success">New promotion has beed added!</Alert>
                  )}
                  {redirect ? <Redirect to="/promotions" /> : null}
                  {errorPut && (
                    <Alert color="danger">
                      { errorText ? errorText : "Something went wrong! Please refresh page and try again!"}
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

export default PromotionAdd;
