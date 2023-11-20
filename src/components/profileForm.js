import React, { useState, useEffect, useContext, useRef } from "react";
import formValidation from "../validations/es6/core/Core";
import {
  Form,
  Input,
  FormGroup,
  Label,
  Alert,
  Button,
  CustomInput,
  FormText,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";
import Select from "react-select";
import axios from "axios";
import { StateContext } from "../utils/context";
import { opt } from "./Profile/profileValidation";
import vat from "../validations/es6/validators/vat";
import iban from "../validations/es6/validators/iban";

import { getCookie } from "../jwt/_helpers/cookie";
import Countries from "../utils/countriesExtended.json";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const preferedMethodArr = [
  { label: "Paypal", value: 0 },
  { label: "Bank account", value: 1 }
];
const ProfileForm = ({ data }) => {
  const { setCurrentUser } = useContext(StateContext);
  const stateRef = useRef();
  const initVal = data;
  const token = getCookie("token");
  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

  //Validation
  const [country, setCountry] = useState(false);
  const [prefMethod, setPrefMethod] = useState(null);
  const [profileURL, setProfileURL] = useState(null);


  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);

  stateRef.current = profileURL;
  useEffect(() => {
    if (typeof initVal.preferred_payment_method !== 'undefined') {
      setPrefMethod(
        preferedMethodArr.filter(
          i => i.value === initVal.preferred_payment_method
        )[0]
      );
    }
  }, [initVal.preferred_payment_method]);

  useEffect(() => {
    if (initVal.country) {
      setCountry(Countries.filter(i => i.value === initVal.country));
    }
  }, [initVal.country]);

  useEffect(() => {
    var formID = document.getElementById("editProfileForm");
    const fv = formValidation(formID, opt)
      .on("core.validator.validating", function(e) {})
      .on("core.validator.validated", function(e) {
        const item = e.field;
        if (item === 'profile_image' && e.result.valid) {
          const file = e.element.files[0];
          handleIMG_AWS(file);
        }
      })
      .on("core.validator.validated", function(e) {
        const item = e.field;
        if (item === 'logo' && e.result.valid) {
          const file = e.element.files[0];
          handleIMG_AWS(file, 'media/linklandingpage_logos/', 'logo');
        }
        if (item === 'background_image' && e.result.valid) {
          const file = e.element.files[0];
          handleIMG_AWS(file, 'media/linklandingpage_bg_images/', 'bgImage');
        }
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
        stateRef.current && formData.append("profile_image", stateRef.current);

        checkData(initVal.street_and_number, getData("street_and_number")) &&
        formData.append("street_and_number", getData("street_and_number"));

        checkData(initVal.postal_code, getData("postal_code")) &&
        formData.append("postal_code", getData("postal_code"));

        checkData(initVal.city, getData("city")) &&
        formData.append("city", getData("city"));

        checkData(initVal.country, getData("country")) &&
        formData.append("country", getData("country"));

        if (initVal.can_edit_vat_number)
        {
          checkData(initVal.vat, getData("vatNumber")) &&
          formData.append("vat", getData("vatNumber"));
        }

        checkData(initVal.paypal_email, getData("paypal_email")) &&
        formData.append("paypal_email", getData("paypal_email"));

        checkData(initVal.account_holder_name, getData("account_holder_name")) &&
        formData.append("account_holder_name", getData("account_holder_name"));

        checkData(initVal.bank_name, getData("bank_name")) &&
        formData.append("bank_name", getData("bank_name"));

        checkData(initVal.preferred_payment_method, getData("preferred_payment_method")) &&
        formData.append("preferred_payment_method", getData("preferred_payment_method"));

        checkData(initVal.iban, getData("iban")) &&
        formData.append("iban", getData("iban"));


        setDataModal(formData);
        setToggleModal(true);
        
      });
      
    fv.registerValidator("vat", vat);
    fv.registerValidator("iban", iban);
  });


  const handleSubmit = () => {
    axios({
      method: "PATCH",
      url: `${API_URL}users/${initVal.id}/`,
      data: dataModal,
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
      }
    }).then(function(response) {
      if (response.status === 200) {
        axios({
          method: "GET",
          url: `${API_URL}users/${initVal.id}/`,
          data: dataModal,
          mode: 'cors',
          headers: {
            Authorization: `Bearer ${token}`,
            "x-api-key": X_API_KEY,
          }
        }).then(function(response) {
          if (response.status === 200){
            setCurrentUser(response.data);
            setSuccess(true);
            setToggleModal(false)
          }
          
        });
       
      } else {
        setToggleModal(false);
        setError(true);
      }
    });
  }

  const handleIMG_AWS = (file) => {
    let fileParts = file.name;
    let fileName = fileParts.split(' ').join('_');
    let fileType = fileParts.split('.')[1]
    axios({
      method: "GET",
      mode: 'cors',
      url: `${API_URL}obtain-signed-url-for-upload/?filename=media/users/profile_images/${fileName}&filetype=${fileType}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
      }
    }).then(function(response) {


      const URL = response.data.signed_url.url;
      const full_URL= response.data.signed_url.fields.key;
      let split = full_URL.split('/');
      split.shift();
      let transformedURL = split.join('/');

      const signedOpts = response.data.signed_url.fields;
      var options = {
        mode: 'cors',
        headers: {
          "Content-Type": fileType
        }
      };
      var postData = new FormData();
      for (let i in signedOpts) {
        postData.append(i, signedOpts[i]);
      }
      postData.append("file", file);

      axios
        .post(URL, postData, options)
        .then(result => {
          setProfileURL(transformedURL);
        })
        .catch(error => {
          console.log("ERROR " + error);
        });
    })
  }

  return (
    <>
      <Form id="editProfileForm">
        <FormGroup>
          <Label for="image">Profile Image</Label>
          <CustomInput
            type="file"
            id="image"
            name="profile_image"
            accept=".jpeg,.jpg"
          />
          <FormText color="muted">
            Upload JPG formats, resolution only 300x300 px, max size 300 KB.
          </FormText>
        </FormGroup>
        <FormGroup>
          <Label>My Street and house number</Label>
          <Input
            name="street_and_number"
            type="text"
            className="form-control"
            defaultValue={initVal.street_and_number}
          />
        </FormGroup>
        <FormGroup>
          <Label>Postal code</Label>
          <Input
            name="postal_code"
            type="text"
            className="form-control"
            defaultValue={initVal.postal_code}
          />
        </FormGroup>
        <FormGroup>
          <Label>City</Label>
          <Input
            name="city"
            type="text"
            className="form-control"
            defaultValue={initVal.city}
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
          <Label>Vat Number</Label>
          <Input
            name="vatNumber"
            type="text"
            disabled={initVal.can_edit_vat_number ? false : true}
            className="form-control"
            defaultValue={initVal.vat}
          />
        </FormGroup>
        <FormGroup>
          <Label>National Tax Number</Label>
          <Input
            name="nationalTaxNumber"
            type="text"
            disabled={true}
            className="form-control"
            defaultValue={initVal.national_tax_number}
          />
        </FormGroup>
        <FormGroup>
          <Label>Business Registration Number</Label>
          <Input
            name="businessRegistrationNumber"
            type="text"
            disabled={true}
            className="form-control"
            defaultValue={initVal.business_reg_number}
          />
        </FormGroup>
        <FormGroup>
          <Label>VAT Status</Label>
          <Input
            name="vatStatus"
            type="text"
            disabled={true}
            className="form-control"
            defaultValue={initVal.vat_status}
          />
        </FormGroup>
        <FormGroup>
          <Label>Business Type</Label>
          <Input
            name="businessType"
            type="text"
            disabled={true}
            className="form-control"
            defaultValue={initVal.business_type_long}
          />
        </FormGroup>

        <FormGroup>
          { initVal.vat_exempt && 
            <div>
              <Label>VAT Exempt Document</Label>&nbsp;
              <i className="fas fa-check-circle fa-lg text-success"></i>
            </div>        
          }
        </FormGroup>

        <FormGroup>
          { initVal.business_certificate && 
            <div>
              <Label>Business Certificate</Label>&nbsp;
              <i className="fas fa-check-circle fa-lg text-success"></i>
            </div>        
          }
        </FormGroup>

        <FormGroup>
          <Label for="preferred_payment_method">Preferred payment method</Label>
          <Select
            components={{ IndicatorSeparator:() => null }}
            name="preferred_payment_method"
            options={preferedMethodArr}
            value={prefMethod}
            onChange={e => setPrefMethod(e)}
          />
        </FormGroup>
        <FormGroup>
          <Label>Paypal email</Label>
          <Input
            name="paypal_email"
            type="email"
            className="form-control"
            defaultValue={initVal.paypal_email}
            disabled={prefMethod ? prefMethod.value === 0 ? false : true : true}
          />
        </FormGroup>
        <FormGroup>
          <Label>Bank Account Holder Name</Label>
          <Input
            name="account_holder_name"
            type="text"
            className="form-control"
            defaultValue={initVal.account_holder_name}
            disabled={prefMethod ? prefMethod.value === 1 ? false : true : true}
          />
        </FormGroup>
        <FormGroup>
          <Label>Bank name</Label>
          <Input
            name="bank_name"
            type="text"
            className="form-control"
            defaultValue={initVal.bank_name}
            disabled={prefMethod ? prefMethod.value === 1 ? false : true : true}
          />
        </FormGroup>
        <FormGroup>
          <Label>Bank Address</Label>
          <Input
            name="bank_address"
            type="text"
            className="form-control"
            defaultValue={initVal.bank_address}
            disabled={prefMethod ? prefMethod.value === 1 ? false : true : true}
          />
        </FormGroup>
        
        <FormGroup>
          <Label>IBAN</Label>
          <Input
            name="iban"
            type="text"
            className="form-control"
            defaultValue={initVal.iban}
            disabled={prefMethod ? prefMethod.value === 1 ? country ? false : true : true : true}
          />
          <FormText color="muted">
            Remember about prefix of your country for example DE, FR, ES
          </FormText>
        </FormGroup>
        <Button color="success" type="submit">
          Submit
        </Button>
      </Form>
      <div style={{ paddingTop: "30px" }}>
        {success && (
          <Alert color="success">Your profile has been updated!</Alert>
        )}
        {errorPut && (
          <Alert color="danger">
            Something went wrong! Please refresh page and try again!
          </Alert>
        )}
      </div>
      {openModal && (
        <Modal isOpen={openModal} centered={true}>
        <ModalHeader>Are you sure you would like change your profile?</ModalHeader>
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

export default ProfileForm;
