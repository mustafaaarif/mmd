import React, { useState, useEffect } from "react";
import formValidation from "../../validations/es6/core/Core";
import Select from "react-select";
import {
  Form,
  Input,
  CustomInput,
  FormGroup,
  Label,
  Alert,
  Button,
  FormText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Card,
  CardTitle,
  CardBody,
  Row,
  Col
} from "reactstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { opt } from "./paymentMethodUpdateValidation";
import creditCard from "../../validations/es6/validators/creditCard";
import { getCookie } from "../../jwt/_helpers";
import Countries from "../../utils/countriesExtended.json";
import { useFetch } from "../../utils/fetchHook";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const PaymentMethodUpdate = ({ match, name }) => {
  const token = getCookie("token");
  const currentID = match.url.split("/")[2];
  const [apiData] = useFetch("GET", `user-payment/list/`, token);

  const options = {
    method: "POST",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  };

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);
  const [cardDeclinedError, setCardDeclinedError] = useState(false);
  const [cardDeclinedErrorMsg, setCardDeclinedErrorMsg] = useState("");
  const [redirect, setRedirect] = useState(false);

  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState([]);

  const [expiryYear, setExpiryYear] = useState("");
  const [expiryMonth, setExpiryMonth] = useState({label: "Select Expiry Month", value: ""});
  const [country, setCountry] = useState({label: "Select Country", value: ""});
  const [isDefault, setDefault] = useState(false);

  const currentDate = (new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const monthsArr = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];

  const validateFields = () => {
    let validationErrors = 0;
    if (expiryMonth.value==="") {
      validationErrors = validationErrors+1;
      document.getElementById('err_expiry_month').style.display = "block";
    }
    if (country.value==="") {
      validationErrors = validationErrors+1;
      document.getElementById('err_country').style.display = "block";
    }
    if (expiryMonth.value!=="" && expiryYear!=="")
    {
      let expMonthInt = parseInt(expiryMonth.value);
      let expYearInt = parseInt(expiryYear);
      if(expYearInt===currentYear && expMonthInt<currentMonth) {
        validationErrors = validationErrors+1;
        document.getElementById('err_expiry_month_valid').style.display = "block";
      }
    }
    return validationErrors;
  }

  useEffect(() => {
    if (apiData) {
      let filteredData = apiData.filter(function (el) {
        return el.id == currentID;
      });
      setPaymentMethod(
        filteredData[0]
      );
    }
  }, [apiData]);

  useEffect(() => {
    if (paymentMethod) {
      if(paymentMethod.country)
      {
        let filteredCountry = Countries.filter(i => i.value === paymentMethod.country);
        setCountry(filteredCountry[0]);
      }

      if (paymentMethod.exp_month) {
        setExpiryMonth(
          monthsArr.filter(
            i => i.value === paymentMethod.exp_month
          )[0]
        );
      }

      setExpiryYear(paymentMethod.exp_year);

      setDefault(paymentMethod.is_default);

    }

  }, [paymentMethod]);

  useEffect(() => {
    var formID = document.getElementById("profilePaymentMethodUpdateForm");
    const fv = formValidation(formID, opt)
      .on("core.element.validated", function(e) {
        if (e.valid) {
          const messages = [].slice.call(formID.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
            messages.forEach((messageEle) => {
                messageEle.style.display = 'none';
            });
            return;
        }
      })
      .on("core.form.valid", async e => {

        const validationErrors = validateFields();

        if (validationErrors!==0) {
          return false;
        }

        const getData = inputName => formID.querySelector(`[name="${inputName}"]`).value;
        const checkData = (name, newVal) => (name !== newVal ? true : false);

        let formData = new FormData();

        checkData(paymentMethod.holder_name, getData("cardholder_name")) &&
        formData.append("holder_name", getData("cardholder_name"));

        checkData(paymentMethod.exp_month, expiryMonth.value) &&
        formData.append("exp_month", expiryMonth.value);

        checkData(paymentMethod.exp_year, getData("expiry_year")) &&
        formData.append("exp_year", getData("expiry_year"));

        checkData(paymentMethod.street_and_number, getData("street_and_number")) &&
        formData.append("street_and_number", getData("street_and_number"));

        checkData(paymentMethod.country, country.value) &&
        formData.append("country", country.value);

        checkData(paymentMethod.city, getData("city")) &&
        formData.append("city", getData("city"));

        checkData(paymentMethod.postal_code, getData("postal_code")) &&
        formData.append("postal_code", getData("postal_code"));

        checkData(paymentMethod.is_default, isDefault) &&
        formData.append("is_default", isDefault);

        setDataModal(formData);
        setToggleModal(true);
        
      });
      
    fv.registerValidator("card_number", creditCard);
  });

  const handleSubmit = () => {
    setCardDeclinedErrorMsg("");
    setCardDeclinedError(false);

    axios
    .post(`${API_URL}user-payment/${paymentMethod.id}/update/`, dataModal, options).then(function(response) {
      if (response.status === 200) {
           if (response.status === 200){
            setToggleModal(false);
            setSuccess(true);
            setTimeout(() => setRedirect(true), 1000);
          }
      } 
      else if (response.status === 400)
      {
        let error  = response.error;
        console.log(error);
        setToggleModal(false);
        setError(true);
      }
      else {
        setToggleModal(false);
        setError(true);
      }
    }).catch(function (error) {
      if (error.response) {
        if(error.response.status === 400)
        {
          let error_data = error.response.data;
          if(error_data.error)
          {
            setCardDeclinedErrorMsg(error_data.error);
            setCardDeclinedError(true);
            setToggleModal(false);
          }
        }
        else {
          setToggleModal(false);
          setError(true); 
        }
      } else if (error.request) {
        setToggleModal(false);
        setError(true);
      } else {
        setToggleModal(false);
        setError(true);
      }
  
    });
  }

  return (
    <>
      <Card>
        <CardBody>
          <CardTitle>
            <h4>Update Payment Method</h4>
          </CardTitle>
          <br/>

          <div hidden={!paymentMethod}>
            <Form id="profilePaymentMethodUpdateForm">
              <Row>
                <Col lg="5" md="6" sm="12" xm="12">
                  <h6>Card Details</h6>
                  <FormGroup>
                    <Label>Cardholder Name</Label>
                    <Input
                    name="cardholder_name"
                    type="text"
                    defaultValue={paymentMethod?paymentMethod.holder_name: ""}
                    className="form-control"
                    />
                  </FormGroup>
                  <FormGroup>
                      <Label>Card Number</Label>
                      <Input
                        name="card_number"
                        type="text"
                        className="form-control"
                        disabled={true}
                        value={paymentMethod?paymentMethod.number: ""}
                      />
                  </FormGroup>
                  <FormGroup>
                      <Label>Expiry Month</Label>
                      <Select
                        components={{ IndicatorSeparator:() => null }}
                        name="expiry_month"
                        options={monthsArr}
                        value={expiryMonth}
                        onChange={(e) => {
                          document.getElementById('err_expiry_month').style.display = "none";
                          document.getElementById('err_expiry_month_valid').style.display = "none";
                          setExpiryMonth(e);
                        }}
                      />
                      <div style={{width: '100%', display: 'flex', marginTop: '5px'}}>
                        <div className="fv-help-block" style={{ display: 'none'}} id={"err_expiry_month"}>Expiry Month is required</div>
                      </div>
                      <div style={{width: '100%', display: 'flex', marginTop: '5px'}}>
                        <div className="fv-help-block" style={{ display: 'none'}} id={"err_expiry_month_valid"}>Expiry Month must not be in past</div>
                      </div>
                  </FormGroup>
                  <FormGroup>
                      <Label>Expiry Year (YYYY)</Label>
                      <Input
                      name="expiry_year"
                      type="text"
                      defaultValue={expiryYear}
                      onBlur={(e) => {
                        setExpiryYear(e.target.value);
                      }}
                      className="form-control"
                      />
                  </FormGroup>
                  <FormGroup>
                      <Label>Security Code (CVC)</Label>
                      <Input
                        name="cvc_code"
                        type="text"
                        className="form-control"
                        disabled={true}
                        value={paymentMethod?paymentMethod.cvc: ""}
                      />
                      <FormText color="muted">
                          Your card's security code (CVC) is the 3 or 4 digit number located on the back of most cards.
                      </FormText>
                  </FormGroup>
                </Col>

                <Col lg="7" md="6" sm="12" xm="12">
                  <h6>Billing Details</h6>
                  <FormGroup>
                    <Label>Country</Label>
                    <Select
                      components={{ IndicatorSeparator:() => null }}
                      name="country"
                      options={Countries}
                      value={country}
                      onChange={(e) => {
                        document.getElementById('err_country').style.display = "none";
                        setCountry(e);
                      }}
                    />
                    <div style={{width: '100%', display: 'flex', marginTop: '5px'}}>
                      <div className="fv-help-block" style={{ display: 'none'}} id={"err_country"}>Country is required</div>
                    </div>
                  </FormGroup>
                  <FormGroup>
                    <Label>Street And House Number</Label>
                    <Input
                      name="street_and_number"
                      type="text"
                      defaultValue={paymentMethod?paymentMethod.street_and_number: ""}
                      className="form-control"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>City</Label>
                    <Input
                      name="city"
                      type="text"
                      defaultValue={paymentMethod?paymentMethod.city: ""}
                      className="form-control"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Postal Code</Label>
                    <Input
                      name="postal_code"
                      type="text"
                      defaultValue={paymentMethod?paymentMethod.postal_code: ""}
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                
                <Col lg="12" md="12" sm="12" xm="12">
                <FormGroup>
                  <Label check>
                    <CustomInput
                      type="checkbox"
                      name="is_default"
                      id="is_default"
                      checked={isDefault}
                      disabled={paymentMethod? paymentMethod.is_default: false}
                      onChange={() => {
                        setDefault(!isDefault)
                      }}
                    />
                    Set as Default
                  </Label>
                </FormGroup>
                  <Button color="success" type="submit" disabled={!paymentMethod}>
                    Submit
                  </Button>
                </Col>
              </Row>
              </Form>
              <div style={{ paddingTop: "30px" }}>
                {success && (
                  <Alert color="success">Payment method has been updated!</Alert>
                )}
                {redirect ? <Redirect to="/payment-methods" /> : null}
                {errorPut && (
                  <Alert color="danger">
                    Something went wrong! Please refresh page and try again!
                  </Alert>
                )}
                {cardDeclinedError && (
                  <Alert color="danger">
                    {cardDeclinedErrorMsg}
                  </Alert>
                )}
              </div>
          </div>
      </CardBody>
      </Card>
      {openModal && (
        <Modal isOpen={openModal} centered={true}>
        <ModalHeader>Are you sure you would like to update your payment method?</ModalHeader>
        <ModalBody>Hereby you warrant that all given data is truthful. You are solely and legally responsible for the given data and for the truthfulness of such information.</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setToggleModal(false)}>
            Cancel
          </Button>
          <Button color="success" onClick={() => handleSubmit()}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
      )}
    </>
  );
};

export default PaymentMethodUpdate;
