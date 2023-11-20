import React, { useState } from "react";
import {
  FormGroup,
  Label,
  Alert,
  Button,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

const X_API_KEY = process.env.REACT_APP_X_API_KEY;


const Schema = Yup.object().shape({
  email: Yup.string().required("Your old email is required"),
  newEmail: Yup.string()
    .email("Please enter valid email")
    .required("New email is required"),
  newEmailRepeat: Yup.string().oneOf(
    [Yup.ref("newEmail"), null],
    "New email must match"
  )
});

const ChangeEmailForm = ({ data }) => {
  const initVal = data;
  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [error] = useState(false);

  const [modal, setToggleModal] = useState(false);
  const [setFormData] = useState(null);

  const handleSubmit = () => {
    setToggleModal(false);
    setSuccess(true);
  };

  return (
    <>
      <Formik
        initialValues={{
          email: initVal.email || "",
          newEmail: "",
          newEmailRepeat: ""
        }}
        validationSchema={Schema}
        enableReinitialize={true}
        onSubmit={(
          { email, newEmail, newEmailRepeat },
          { setStatus, setSubmitting }
        ) => {
          setStatus();
          // const token = getCookie("token");

          // alert('We are waiting for Borislav API. New email:', newEmailRepeat);
          setFormData({ email: email, newEmail: newEmail });
          setToggleModal(true);
          // const data = {
          //   email: email,
          //   new_email: newEmail
          // }

          // const options = {
          //   method: "PUT",
          //   headers: {
          //     Authorization: `Bearer ${token}`,
          //     "x-api-key": X_API_KEY,
          //     "Content-Type": "application/json"
          //   }
          // };
          // axios.post(`${API_URL}users/change-password`,data,options)
          // .then(res => {
          //   setSuccess(true);
          // })
          // .catch(err => {
          //   setError(true);
          // });
        }}
        render={({
          errors,
          status,
          touched,
          isSubmitting,
          setFieldValue,
          handleChange,
          handleBlur,
          values
        }) => {
          return (
            <Form>
              <FormGroup>
                <Label>Current email</Label>
                <Input
                  type="email"
                  name="email"
                  disabled={true}
                  onChange={e => handleChange(e.target.value)}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {errors.email && touched.email && errors.email}
              </FormGroup>
              <FormGroup>
                <Label>New email</Label>
                <Field
                  name="newEmail"
                  type="email"
                  className={
                    "form-control" +
                    (errors.newEmail && touched.newEmail ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="newEmail"
                  component="div"
                  className="invalid-feedback"
                />
              </FormGroup>
              <FormGroup>
                <Label>Repeat new email</Label>
                <Field
                  name="newEmailRepeat"
                  type="email"
                  className={
                    "form-control" +
                    (errors.newEmailRepeat && touched.newEmailRepeat
                      ? " is-invalid"
                      : "")
                  }
                />
                <ErrorMessage
                  name="newEmailRepeat"
                  component="div"
                  className="invalid-feedback"
                />
              </FormGroup>

              <Button type="submit" color="success">
                Submit
              </Button>
            </Form>
          );
        }}
      />
      <div style={{ paddingTop: "30px" }}>
        {success && (
          <Alert color="success">
            {/* Your email has been updated! */}
            We are waiting for Borislav API
          </Alert>
        )}
        {error && (
          <Alert color="danger">
            Something went wrong! Please refresh page and try again!
          </Alert>
        )}
      </div>
      <Modal isOpen={modal} centered={true}>
        <ModalHeader>Change email</ModalHeader>
        <ModalBody>You are changing your login email, please confirm</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setToggleModal(false)}>
            Cancel
          </Button>
          <Button color="success" onClick={() => handleSubmit()}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ChangeEmailForm;
