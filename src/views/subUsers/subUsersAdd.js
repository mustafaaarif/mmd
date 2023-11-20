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
import { opt } from "./subUsersAddValidation";
import ModalConfirm from "../../components/modalConfirm";

import Countries from "../../utils/countriesExtended.json"

import 'react-datetime/css/react-datetime.css';

require('moment/locale/en-gb');

const SubUsersAdd = () => {
  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

  const [redirect, setRedirect] = useState(false);

  const [country, setCountry] = useState(false);

  let afterOneYear = Datetime.moment().add(1, 'years');
  let validDate = function (current) {
    return current.isAfter(afterOneYear);
  };
  const [contractExpiryDate, setContractExpiryDate] = useState(afterOneYear);

  useEffect(() => {
    var formID = document.getElementById("addNewSubUser");
    const fv =formValidation(formID, opt)
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
      let formData = new FormData();

      formData.append("first_name", formID.querySelector('[name="first_name"]').value);
      formData.append("last_name", formID.querySelector('[name="last_name"]').value);
      formData.append("email", formID.querySelector('[name="email"]').value);
      formData.append("username", formID.querySelector('[name="username"]').value);
      formData.append("password", formID.querySelector('[name="password"]').value);
      formData.append("contract_expiry", contractExpiryDate.format("YYYY-MM-DDThh:mm:ss"));
      formData.append("company", formID.querySelector('[name="company"]').value);
      formData.append("sub_user_deal", formID.querySelector('[name="sub_user_deal"]').value);
      formData.append("national_tax_number", formID.querySelector('[name="national_tax_number"]').value);
      formData.append("business_reg_number", formID.querySelector('[name="business_reg_number"]').value);
      formData.append("street_and_number", formID.querySelector('[name="street_and_number"]').value);
      formData.append("postal_code", formID.querySelector('[name="postal_code"]').value);
      formData.append("city", formID.querySelector('[name="city"]').value);
      formData.append("country", formID.querySelector('[name="country"]').value);
      formData.append("phone", formID.querySelector('[name="phone"]').value);

      setDataModal(formData);
      setToggleModal(true);

    });
  });

  return (
    <div>
      <Row>
        <Col sm={12}>
          <Card>
            <CardBody>
              <h3>Add Sub-User</h3>
              <Form id="addNewSubUser">
                
                <div className="mt-3 mb-5">
                  <h6>Personal Details</h6>
                  <FormGroup>
                    <Label>First Name</Label>
                    <Input name="first_name" type="text" className="form-control" />
                  </FormGroup>
                  <FormGroup>
                    <Label>Last Name</Label>
                    <Input name="last_name" type="text" className="form-control" />
                  </FormGroup>
                  <FormGroup>
                    <Label>Email</Label>
                    <Input name="email" type="email" className="form-control" />
                  </FormGroup>
                  <FormGroup>
                    <Label>Username</Label>
                    <Input name="username" type="text" className="form-control" />
                  </FormGroup>
                  <FormGroup>
                    <Label>Password</Label>
                    <Input name="password" type="password" className="form-control" />
                  </FormGroup>
                  <FormGroup>
                    <Label>Confirm Password</Label>
                    <Input name="confirmPassword" type="password" className="form-control" />
                  </FormGroup>
                </div>

                <div className="mt-5 mb-5">
                  <h6>Business Details</h6>
                  <FormGroup>
                    <Label>Company Name</Label>
                    <Input name="company" type="text" className="form-control" />
                  </FormGroup>

                  <FormGroup>
                    <Label>Contract Expiry</Label>
                    <Datetime
                      inputProps={{ name: "contract_expiry" }}
                      locale="en-gb"
                      timeFormat={false}
                      isValidDate={validDate}
                      value={contractExpiryDate}
                      onChange={(e) => setContractExpiryDate(e)}
                    />
                    <FormText color="muted">
                      Note: Contract Expiry date cannot be set earlier than {afterOneYear.format('DD/MM/YYYY')}.
                    </FormText>
                  </FormGroup>

                  <FormGroup>
                    <Label>Subuser Deal (%)</Label>
                    <Input name="sub_user_deal" type="number" min={0} max={100} step={0.1} className="form-control" />
                  </FormGroup>

                  <FormGroup>
                    <Label>National Tax Number</Label>
                    <Input name="national_tax_number" type="text" className="form-control" />
                  </FormGroup>

                  <FormGroup>
                    <Label>Business Registration Number</Label>
                    <Input name="business_reg_number" type="text" className="form-control" />
                  </FormGroup>
                </div>

                <div className="mt-5 mb-5">
                  <h6>Contact Details</h6>
                  <FormGroup>
                    <Label>Street and house number</Label>
                    <Input name="street_and_number" type="text" className="form-control" />
                  </FormGroup>

                  <FormGroup>
                    <Label>Postal Code</Label>
                    <Input name="postal_code" type="text" className="form-control" />
                  </FormGroup>

                  <FormGroup>
                    <Label>City</Label>
                    <Input name="city" type="text" className="form-control" />
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
                    <Input name="phone" type="text" className="form-control" />
                  </FormGroup>
                </div>

                <Button color="success" type="submit">
                  Submit
                </Button>
              </Form>

              <div style={{ paddingTop: "24px" }}>
                {success && (
                  <Alert color="success">Sub-User has been added!</Alert>
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
      {dataModal && (
        <ModalConfirm
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          title={`Add Sub-User`}
          setSuccess={setSuccess}
          setError={setError}
          body={`Are you sure you want to create a new sub-user?`}
          apiURL={`sub-users`}
          setRedirect={setRedirect}
        />
      )}
    </div>
  );
};

export default SubUsersAdd;