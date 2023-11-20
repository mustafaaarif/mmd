import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import formValidation from "../../validations/es6/core/Core";
import Datetime from "react-datetime";
import {
  Card,
  Row,
  CardBody,
  Col,
  FormGroup,
  Label,
  Button,
  Alert,
  Form,
  FormText,
  Input,
} from "reactstrap";
import Select from "react-select";
import axios from "axios";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import { opt } from "./subUsersUpdateValidation";
import Countries from "../../utils/countriesExtended.json";

import 'react-datetime/css/react-datetime.css';

require('moment/locale/en-gb');

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const SubUsersUpdate = ({ match, name }) => {
  const currentID = match.url.split("/")[2];
  const token = getCookie("token");
  const [initFormData] = useFetch("GET", `sub-users/${currentID}/`, token);

  const [country, setCountry] = useState(false);

  const [contractExpiryDate, setContractExpiryDate] = useState(null);
  const [contractExpiryChanged, contractExpiryChangedSET] = useState(false);

  let afterOneYear = Datetime.moment().add(1, 'year');
  let validDate = function (current) {
    return current.isAfter(afterOneYear);
  };

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (initFormData.country) {
      setCountry(Countries.filter(i => i.value === initFormData.country));
    }
    
    if (initFormData.contract_expiry)
    {
      setContractExpiryDate(Datetime.moment(initFormData.contract_expiry));
    }
  }, [initFormData.country, initFormData.contract_expiry]);

  useEffect(() => {
    var formID = document.getElementById("editSubUser");
    const fv=formValidation(formID, opt)
    .on("core.validator.validated", function(e) {
      if (!e.result.valid) {
        const messages = [].slice.call(formID.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
        for(let i = 0; i < messages.length - 1; i++) {
          const messageEle = messages[i];
          messageEle.style.display = 'none';
        }
      }
    })
    .on("core.form.valid", e => {
      
      const getData = inputName => formID.querySelector(`[name="${inputName}"]`).value;

      const checkData = (name, newVal) => (name !== newVal ? true : false);

      let formData = new FormData();

      checkData(initFormData.first_name, getData("first_name")) &&
        formData.append("first_name", getData("first_name"));
      checkData(initFormData.last_name, getData("last_name")) &&
        formData.append("last_name", getData("last_name"));
      contractExpiryChanged && formData.append("contract_expiry", contractExpiryDate.format("YYYY-MM-DDThh:mm:ss"));
      checkData(initFormData.company, getData("company")) &&
        formData.append("company", getData("company"));
      checkData(initFormData.national_tax_number, getData("national_tax_number")) &&
        formData.append("national_tax_number", getData("national_tax_number"));
      checkData(initFormData.business_reg_number, getData("business_reg_number")) &&
        formData.append("business_reg_number", getData("business_reg_number"));
      checkData(initFormData.sub_user_deal, getData("sub_user_deal")) &&
        formData.append("sub_user_deal", getData("sub_user_deal"));
      checkData(initFormData.street_and_number, getData("street_and_number")) &&
        formData.append("street_and_number", getData("street_and_number"));
      checkData(initFormData.postal_code, getData("postal_code")) &&
        formData.append("postal_code", getData("postal_code"));
      checkData(initFormData.city, getData("city")) &&
        formData.append("city", getData("city"));
      checkData(initFormData.country, getData("country")) &&
        formData.append("country", getData("country"));
      checkData(initFormData.phone, getData("phone")) &&
        formData.append("phone", getData("phone"));

      axios({
        method: "PATCH",
        mode: 'cors',
        url: `${API_URL}sub-users/${currentID}/`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": X_API_KEY,
        }
      }).then(function(response) {
        if (response.status === 200) {
          setSuccess(true);
          setTimeout(() => setRedirect(true), 1000);
        } else {
          setError(true);
        }
      });
    });
  });

  return (
    <div>
      <Row>
        <Col sm={12}>
          <Card>
            <CardBody>
              <h3>Edit Sub-User</h3>
              <Form id="editSubUser">

                <div className="mt-3 mb-5">
                  <h6>Personal Details</h6>
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input
                      type="text"
                      className="form-control"
                      name="first_name"
                      defaultValue={initFormData.first_name}
                      disabled={false}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input
                      type="text"
                      className="form-control"
                      name="last_name"
                      defaultValue={initFormData.last_name}
                      disabled={false}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input
                      type="text"
                      className="form-control"
                      name="email"
                      defaultValue={initFormData.email}
                      disabled={true}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label>Username</Label>
                    <Input
                      type="text"
                      className="form-control"
                      name="username"
                      defaultValue={initFormData.username}
                      disabled={true}
                    />
                  </FormGroup>
                </div>

                <div className="mt-5 mb-5">
                  <h6>Business Details</h6>
                  <FormGroup>
                    <Label>Company Name</Label>
                    <Input
                      type="text"
                      className="form-control"
                      name="company"
                      defaultValue={initFormData.company}
                      disabled={false}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Contract Expiry</Label>
                    <Datetime
                      inputProps={{ name: "contract_expiry" }}
                      locale="en-gb"
                      timeFormat={false}
                      isValidDate={validDate}
                      value={contractExpiryDate}
                      onChange={(e) => {
                        setContractExpiryDate(e)
                        contractExpiryChangedSET(true);
                      }}
                    />
                    <FormText color="muted">
                      Note: Contract Expiry date cannot be set earlier than {afterOneYear.format('DD/MM/YYYY')}.
                    </FormText>
                  </FormGroup>

                  <FormGroup>
                    <Label>Subuser Deal (%)</Label>
                    <Input
                      type="number"
                      className="form-control"
                      name="sub_user_deal"
                      min={0}
                      max={100}
                      step={0.1}
                      defaultValue={initFormData.sub_user_deal}
                      disabled={false}
                    />
                  </FormGroup>


                  <FormGroup>
                    <Label>National Tax Number</Label>
                    <Input
                      type="text"
                      className="form-control"
                      name="national_tax_number"
                      defaultValue={initFormData.national_tax_number}
                      disabled={false}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Business Registration Number</Label>
                    <Input
                      type="text"
                      className="form-control"
                      name="business_reg_number"
                      defaultValue={initFormData.business_reg_number}
                      disabled={false}
                    />
                  </FormGroup>
                </div>

                <div className="mt-5 mb-5">
                  <h6>Contact Details</h6>
                  <FormGroup>
                    <Label>Street and house number</Label>
                    <Input
                      type="text"
                      className="form-control"
                      name="street_and_number"
                      defaultValue={initFormData.street_and_number}
                      disabled={false}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Postal code</Label>
                    <Input
                      type="text"
                      className="form-control"
                      name="postal_code"
                      defaultValue={initFormData.postal_code}
                      disabled={false}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>City</Label>
                    <Input
                      type="text"
                      className="form-control"
                      name="city"
                      defaultValue={initFormData.city}
                      disabled={false}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label>Country</Label>
                    <Select
                      components={{ IndicatorSeparator:() => null }}
                      name="country"
                      options={Countries}
                      value={country}
                      onChange={e => setCountry(e)}
                    />
                  </FormGroup>


                  <FormGroup>
                    <Label>Phone Number</Label>
                    <Input
                      type="text"
                      className="form-control"
                      name="phone"
                      defaultValue={initFormData.phone}
                      disabled={false}
                    />
                  </FormGroup>
                </div>

                <Button color="success" type="submit">
                  Submit
                </Button>
              </Form>

              <div style={{ paddingTop: "24px" }}>
                {success && (
                  <Alert color="success">Sub-user has been updated!</Alert>
                )}
                {redirect ? <Redirect to="/sub-users" /> : null}
                {errorPut && (
                  <Alert color="danger">
                    Something went wrong! Please refresh page and try again!
                  </Alert>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SubUsersUpdate;