import React, { useState } from 'react';
import axios from "axios";
import { Alert, Row, Col, Button, Input, Form, FormGroup, Label } from "reactstrap";

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const API_URL = process.env.REACT_APP_API_URL_BASE;

const ForgotPassword_step1 = props => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState(null);
  const [success, setSuccess] = useState('');

  const submit = (event) => {
    event.preventDefault();
    let countErrors = 0;
    let error1 = null;
    let error2 = null;

    if (email.length === 0) {
      setError(true);
      error1 = 'Email is required.';
      countErrors++
    }

    if (!validateEmail(email)) {
      setError(true);
      error2 = 'Please type valid email.';
      countErrors++
    }


    if (countErrors > 0) {
      setErrorText([error1 && [error1], error2 && [error2]])
      return false;
    }

    var payload = {
      "email": email
    }
    axios.post(API_URL + 'password-reset/', payload)
      .then(function (r) {
        if (r.status === 201 || r.status === 200) {
          setSuccess(true);
        } else {
          setError(true);
        }

      })
      .catch(function (error) {
        setError(true);
        setErrorText([["Unable to log in with provided credentials."]]);
      });
  }

  return (
    <Row className="no-gutters justify-content-center">
      <Col md="6" lg="3" className="bg-primary text-white">
        <div className="p-4">
          <h1 className="display-5">Hi,<br />
            <span className="text-cyan font-bold ">let's send some loud music out there</span></h1>

        </div>
      </Col>
      <Col md="6" lg="4" className="bg-white">
        <div className="p-4">
          <h3 className="font-medium mb-3">Recover Password</h3>
          <Form>
            <FormGroup>
              <Label for="email">Your email</Label>
              <Input type="email" name="email" id="email" placeholder="Type your email..." value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormGroup>

            <Row className="mb-3">
              <Col xs="12">
                <Button color="success" type="submit" block onClick={(event) => submit(event)}>Submit</Button>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs="12">
                <Button color="primary" type="button" block onClick={() => props.handleToLogin()}>Back to login</Button>
              </Col>
            </Row>
          </Form>
        </div>
        {
          (error && errorText) &&
          errorText.map(i => {
            if (i !== null) {
              return i.map(i => {
                return (
                  <Alert key={i} color="danger">
                    {i}
                  </Alert>
                )
              })
            } else {
              return false;
            }
          })

        }
        {
          (error && !errorText) && <div className={"pl-4 pr-4"}><Alert color="danger">Something went wrong</Alert></div>
        }
        {
          success && <div className={"pl-4 pr-4"}><Alert color="success">Email sent! Please check your email box and follow the instruction from the message in order to reset your password.</Alert></div>
        }
      </Col>
    </Row>
  )

};

export default ForgotPassword_step1;
