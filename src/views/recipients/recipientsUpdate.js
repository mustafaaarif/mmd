import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import { Card, Row, CardBody, Col, FormGroup, Label, Button, Alert,  CustomInput, Modal, ModalHeader, ModalFooter, ModalBody} from "reactstrap";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import { Redirect } from "react-router-dom";
import TableHelper from "../../components/tableHelper";
import {StateContext} from "../../utils/context";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const RecipientUpdate = ({ match, name }) => {
  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);
  const {first_name, last_name} = currentUser;
  const currentID = match.url.split("/")[2];
  const [userData] = useFetch("GET", `recipients/${currentID}/`, token);
  const [listRecipient] = useFetch("GET", "recipient-lists/", token);

  const [optionList, setOpinionList] = useState(null);
  const [selectedList, setSelectedList] = useState(null);

  const [selectedOption, setSelected] = useState(null);
  const [loadedAll, setLoadedAll] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errorPut, setErrorPut] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const [errorDuplName, setErrorDuplName] = useState(false);
  const [errorDuplEmail, setErrorDuplEmail] = useState(false);
  const [error, setError] = useState(false);

  const [modalSending, modalSendingSET] = useState(false);
  const [selectAll, setSelectAll]= useState(false);


  useEffect(() => {
    if (listRecipient.length !== 0) {
      setOpinionList(
        listRecipient.results.map(i => ({ value: i.id, label: i.name }))
      );
    }
  }, [listRecipient, userData]);

  useEffect(() => {
    if (userData && !(userData instanceof Array)) {
      setSelectedList(
        userData.lists?.map(i => optionList.filter(ii => ii.value === i)[0])
      );
      setLoadedAll(true);
    }
    // eslint-disable-next-line
  }, [optionList]);


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
                  <h3>Edit Recipient</h3>
                  <Formik
                    initialValues={{
                      name: userData.name,
                      email: userData.email,
                      emailList: selectedList,
                      sending_allowed: userData.sending_allowed
                    }}
                    validationSchema={Yup.object().shape({
                      name: Yup.string(),
                      email: Yup.string().email(),
                      emaillist: Yup.array()
                    })}
                    onSubmit={(
                      { name, email, emailList, sending_allowed },
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
                      let list = emailList.map(({ value }) => value);


                      const duplicatedName = () => {
                        return new Promise(async (resolve, reject) => {
                          if(userData.name === name) {
                            resolve(true);
                            return;
                          }
                          return axios.get(`${API_URL}recipients/?search=${name}`, options).then(res => {
                            if (res.status === 200){
                              const list = res.data.results.length > 0 ? res.data.results : [];
        
                              const getOne = list.filter(i => i.name === name);
                              if (getOne.length > 0) {
                                setErrorDuplName(true);
                                reject(false)
                              } else {
                                resolve(true)
                              }
                            }
                          })
                        })
                      }

                      const duplicatedEmail = () => {
                        return new Promise(async (resolve, reject) => {
                          if(userData.email === email) {
                            resolve(true);
                            return;
                          }
                          return axios.get(`${API_URL}recipients/?search=${email}`, options).then(res => {
                            if (res.status === 200){
                              const list = res.data.results.length > 0 ? res.data.results : [];
        
                              const getOne = list.filter(i => i.email === email);
                              if (getOne.length > 0) {
                                setErrorDuplEmail(true);
                                reject(false)
                              } else {
                                resolve(true)
                              }
                            }
                          })
                        })
                      }

                      return Promise.all([duplicatedName(), duplicatedEmail()]).then((body) => { 
                        if (body.filter(i => i === true).length !== 2) {
                          return false;
                        }
                        axios
                          .put(
                            `${API_URL}recipients/${currentID}/`,
                            { name: name, email: email, lists: list, sending_allowed: sending_allowed },
                            options
                          )
                          .then(res => {
                            setSuccess(true);
                            setTimeout(() => setRedirect(true), 1000);
                          })
                          .catch(err => {
                            setError(true);
                          });
                        return body; 
                      }).catch(err => {
                        return false
                      });


                    }}
                    render={({
                      errors,
                      status,
                      touched,
                      values,
                      isSubmitting,
                      setFieldValue
                    }) => (
                      <Form className="mt-3" id="updateRecipientForm">
                        <FormGroup row>
                          <Label for="name" sm={2}>
                            Name
                          </Label>
                          <Col sm={10}>
                            <Field
                              name="name"
                              type="text"
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
                              errorDuplName && <p style={{    fontSize: "12px",color: "red",margin: "2px 0 0 0"}}>This name already exists</p>
                            }
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="email" sm={2}>
                            Email
                          </Label>
                          <Col sm={10}>
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
                            {
                              errorDuplEmail && <p style={{    fontSize: "12px",color: "red",margin: "2px 0 0 0"}}>This name already exists</p>
                            }
                          </Col>
                        </FormGroup>

                        <FormGroup row>
                          <Label for="recSelect" sm={2}>
                            Email list
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
                                  setFieldValue("emailList", e);
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
                                  setFieldValue("emailList", e);
                                }}
                              />
                              }
                              <Button className="btn btn-outline-info" onClick={() => {
                                setSelectAll(true);
                                setFieldValue("emailList", optionList);
                              }}>Add All</Button>
                            </div>
                            
                            
                          </Col>
                        </FormGroup>
                        <FormGroup>
                            <div style={{display: 'flex'}}>
                              <CustomInput type="checkbox" id="sendingCheckbox" checked={values.sending_allowed}
                                onChange={() => {
                                  if (values.sending_allowed) {
                                    modalSendingSET(false);
                                    setFieldValue("sending_allowed",false);
                                  } else {
                                    modalSendingSET(true);  
                                  }
                                }}
                              />
                              {" "}Allow sending
                            </div>
                          </FormGroup>
                        <FormGroup>
                          <Button color="success" type="submit">
                            Submit
                          </Button>
                        </FormGroup>
                        <Modal isOpen={modalSending} centered={true}>
                            <ModalHeader>Allow sending</ModalHeader>
                            <ModalBody>Hereby I {first_name} {last_name} confirm that this particular recipient explicitly gave me permission to send promotional e-mails to the affected recipient's e-mail address.I am in posses of the written permission and I am fully aware of the possible legal repercussions.</ModalBody>
                            <ModalFooter>
                              <Button color="secondary" onClick={() => modalSendingSET(false)}>
                                Cancel
                              </Button>
                              <Button color="success" onClick={() => {
                                modalSendingSET(false);
                                setFieldValue("sending_allowed",true);
                              }}>
                                Confirm
                              </Button>
                            </ModalFooter>
                          </Modal>
                      </Form>
                    )}
                  />
                  {success && (
                    <Alert color="success">
                      Recipient of name "{userData.name}" has been updated!
                    </Alert>
                  )}
                  {redirect ? <Redirect to="/recipients" /> : null}
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

export default RecipientUpdate;
