import React, { useState } from "react";
import {
  FormGroup,
  Label,
  Alert,
  Button
} from "reactstrap";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ModalConfirm from "../components/modalConfirm";


const Schema = Yup.object().shape({
  password: Yup.string().required("Your old password is required"),
  newpassword: Yup.string().min(8, 'Your password should be min 8 characters length').required("New password is required"),
  passwordConfirmation: Yup.string().oneOf([Yup.ref('newpassword'), null], 'New password must match')
})
const PasswordForm = ({data}) => {
  const [success, setSuccess] = useState(false);
  const [errorPut, setErrorPut] = useState(false);

  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);

  return (
    <>
      <Formik
        initialValues={{password:'', newpassword: '', passwordConfirmation: '',}}
        validationSchema={Schema}
        onSubmit={({password, newpassword, passwordConfirmation},{ setStatus, setSubmitting }) => {
          setStatus();
          setToggleModal(true);
          setDataModal({
            old_password: password,
            new_password: newpassword
          });
        }}
        render={({ errors, status, touched, isSubmitting, setFieldValue }) => {
          return (
            <Form>
              <FormGroup>
                <Label>Current password</Label>
                <Field
                  name="password"
                  type="password"
                  className={
                    "form-control" +
                    (errors.password && touched.password ? " is-invalid" : "")
                  }
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="invalid-feedback"
                />
              </FormGroup>
              <FormGroup>
                <Label>New password</Label>
                <Field
                  name="newpassword"
                  type="password"
                  className={
                    "form-control" +
                    (errors.newpassword && touched.newpassword
                      ? " is-invalid"
                      : "")
                  }
                />
                <ErrorMessage
                  name="newpassword"
                  component="div"
                  className="invalid-feedback"
                />
              </FormGroup>
              <FormGroup>
                <Label>Repeat new password</Label>
                <Field
                  name="passwordConfirmation"
                  type="password"
                  className={
                    "form-control" +
                    (errors.repassword && touched.passwordConfirmation
                      ? " is-invalid"
                      : "")
                  }
                />
                <ErrorMessage
                  name="repassword"
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
      <div style={{paddingTop: 20}}>
      {success && <Alert color="success">Your password has been changed!</Alert>}
      {errorPut && <Alert color="danger">Something went wrong! Please refresh page and try again!</Alert>}
      </div>
      {openModal && (
        <ModalConfirm
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          title={`Are you sure you would like change your password?`}
          setSuccess={setSuccess}
          setError={setErrorPut}
          method={"POST"}
          body={`Please confirm`}
          apiURL={`users/${data.id}/change-password`}
          setRedirect={false}
        />
      )}
    </>
  );
};

export default PasswordForm;
