import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Select from "react-select";

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

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const ListUpdate = ({ match, name }) => {
  const token = getCookie("token");
  const currentID = match.url.split("/")[2];
  const [listData] = useFetch("GET", `recipient-lists/${currentID}/`, token);
  const [listRecipient] = useFetch("GET", "recipients/?page_size=9999&fields=name,token", token);
  const [optionList, setOpinionList] = useState(null);
  const [selectedList, setSelectedList] = useState(null);
  const [loadedAll, setLoadedAll] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errorPut, setErrorPut] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const [selectAll, setSelectAll]= useState(false);

  const selectList = e => {
    setSelectedList(e);
  };


  useEffect(() => {
    if (listRecipient.length !== 0) {
      setOpinionList(listRecipient.results.map(i => ({ label: i.name, value: i.token })));
      
      if (listData.length !== 0) {
        const filtered = listRecipient.results.filter(i => listData.recipient_set.includes(i.token)).map(i => ({label: i.name, value: i.token}))
        setSelectedList(filtered);
        setLoadedAll(true);
      }
    }
  }, [listRecipient, listData]);


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
                  <h3>Update recipient list</h3>
                  <Formik
                    initialValues={{
                      name: listData.name,
                      recipients: selectedList
                    }}
                    validationSchema={Yup.object().shape({
                      name: Yup.string(),
                      recipients: Yup.array()
                    })}
                    onSubmit={(
                      { name, recipients },
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

                     

                      axios
                        .put(
                          `${API_URL}recipient-lists/${currentID}/`,
                          { name: name, recipient_set: selectedList !== null ? selectedList.map(i =>i.value) : [] },
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
                      <Form className="mt-3" id="updateRecipientForm">
                        <FormGroup row>
                          <Label for="recName" sm={2}>
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
                                  selectList(e);
                                  if (e !== null) {
                                    setFieldValue("recipients", e.map(i => i.value));
                                  }
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
                                  selectList(e);
                                  if (e !== null) {
                                    setFieldValue("recipients", e.map(i => i.value));
                                  }
                                }}
                              />
                              }
                              <Button className="btn btn-outline-info" onClick={() => {
                                setSelectAll(true);
                                selectList(optionList);
                                setFieldValue("recipients", optionList.map(i => i.value));
                              }}>Add All</Button>
                            </div>    
                          </Col>
                        </FormGroup>
                        <FormGroup>
                          <Button type="submit">Submit</Button>
                        </FormGroup>
                      </Form>
                    )}
                  />
                  {success && (
                    <Alert color="success">
                      List "{listData.name}" has been updated!
                    </Alert>
                  )}
                  {redirect ? <Redirect to="/lists" /> : null}
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

export default ListUpdate;
