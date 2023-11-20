import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
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
import TableHelper from "../../components/tableHelper";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const Schema = Yup.object().shape({
  part: Yup.string()
    .required("Part is required")
    .max(16, "Must be exactly 16 characters"),
});

const MusicLinkUrlpartAdd = ({ match }) => {
  const token = getCookie("token");
  const currentID =
    match.url.split("/")[2] === "add" ? null : match.url.split("/")[2];
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorDupl, setErrorDupl] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [loadedAll, setLoadedAll] = useState(() => (currentID ? false : true));
  const [urlpartData, loadingurlpartData] = useFetch(
    "GET",
    `musiclinks_urlparts/${currentID}/`,
    token
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
    if (Array.isArray(urlpartData) && urlpartData.length === 0) {
      return;
    }
    setLoadedAll(true);
  }, [urlpartData]);

  const onSubmit = async (payload, { setStatus, setSubmitting }) => {
    setStatus();
    setErrorDupl(false);

    let result = null;
    try {
      if (currentID) {
        await axios({
          url: `${API_URL}musiclinks_urlparts/${currentID}`,
          data: payload,
          ...axiosOptions,
          method: "PUT",
        });
        setRedirect(true);
      } else {
        const isExist = await axios.get(
          `${API_URL}musiclinks_urlparts/?search=${payload.part}`,
          axiosOptions
        );
        if (isExist.status === 200) {
          if (isExist.data.count) {
            setErrorDupl(true);
          } else {
            await axios({
              url: `${API_URL}musiclinks_urlparts/`,
              data: payload,
              ...axiosOptions,
            });
            setRedirect(true);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
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
                  {currentID ? "Edit" : "Add"} Url Part
                </CardTitle>
                <Formik
                  initialValues={{
                    part: urlpartData.part || "",
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
                      <Form className="mt-3">
                        <FormGroup row>
                          <Label for="part" sm={2}>
                            Part
                          </Label>
                          <Col>
                            <Field
                              name="part"
                              type="text"
                              className={
                                "form-control" +
                                (errors.part && touched.part
                                  ? " is-invalid"
                                  : "")
                              }
                            />
                            <ErrorMessage
                              name="part"
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
                                This Music Link URL is already taken by your account or another user account. Please try something else.
                              </p>
                            )}
                          </Col>
                        </FormGroup>

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
                  <Alert color="success">
                    Music link urlpart has been added!
                  </Alert>
                )}
                {redirect ? <Redirect to="/music-link-urlpart" /> : null}
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

export default MusicLinkUrlpartAdd;
