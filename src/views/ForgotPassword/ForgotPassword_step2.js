import React, {useState} from 'react';
import axios from "axios";
import { Container,  Card, CardText, CardBody,Alert,
  CardTitle, Button, Input, Form, FormGroup, Label } from "reactstrap";
import { useLocation, Navigate } from "react-router-dom";

const style = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}


const API_URL = process.env.REACT_APP_API_URL_BASE;

const ForgotPassword_step2 = props => {
  const location = useLocation();
  const [pass, setPass] = useState('');
  const [pass2, setPass2] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorText, setErrorText] = useState('');


  const submit = (event) => {
    let countErrors = 0;
    let error1 = null;
    let error2 = null;
    let error3 = null;

    if (pass.length === 0 ) {
      setError(true);
      error1 = 'Passowrd is required.';
      countErrors++
    }

    if (pass.length < 8 ) {
      setError(true);
      error2 = 'Passowrd is too short.';
      countErrors++
    }

    if (pass !== pass2 ) {
      setError(true);
      error3 = 'Passowrd is should match.';
      countErrors++
    }


    if (countErrors > 0) {
      setErrorText([ error1 &&[error1], error2 && [error2], error3 && [error3]])
      return false;
    }

    const path = location.pathname.split('/confirm/')[1];
    const newPath = path.slice(0, -1);

    var payload={
      "password": pass,
      "token": newPath
    };

    axios.post(API_URL + 'password-reset/confirm/', payload)
    .then(function (response) {
      if(response.status === 200){
        setSuccess(true);
      } else{
        setErrorText([[response.statusText]]);
        setError(true);
      }
    })
    .catch(function (error) {
      setErrorText([[error.response.statusText]]);
      setError(true);
    });
  }

  if (success) {
    setTimeout(() => {
      return <Navigate to="/authentication/login"/>
    }, 3000)
  }

  return (
    <Container fluid={true} style={style}>
      <Card>
        <CardBody>
          <CardTitle>Set new password</CardTitle>
          <CardText>Your password should be at least 8 characters long and it should consist letters and numbers combination.</CardText>
          <Form>
            <FormGroup>
              <Label for="email">New password</Label>
              <Input type="password" name="passwordNew" id="passwordNew" placeholder="Your new password..." value={pass} onChange={(e) => setPass(e.target.value) }/>
            </FormGroup>
            <FormGroup>
              <Label for="email">Repeat new password</Label>
              <Input type="password" name="passwordNew2" id="passwordNew2" placeholder="Repeat your old password..." value={pass2} onChange={(e) => setPass2(e.target.value) }/>
            </FormGroup>
            <Button color="primary" onClick={() =>submit()}>Submit</Button>
          </Form>
          {
              error &&
              errorText.map( i => {
                if (i !== null) {
                  return i.map(i => {
                    return (
                      <Alert key={i} style={{margin: '30px 0 0 0'}} color="danger">
                    {i}
                    </Alert>
                    )
                  })
                } else {
                  return false;
                }
              })

            }
        </CardBody>
      <div style={{ padding: "0 20px" }}>
      {success && (
          <Alert color="success">
            Your password has been updated! Please <b>proceed to the <a href="/">start page</a></b> and log in with your new credentials.
          </Alert>
        )}
      </div>
      </Card>
    </Container>
  );
};

export default ForgotPassword_step2;
