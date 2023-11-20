import React, { useState, useEffect, useRef, useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import formValidation from "../../validations/es6/core/Core";

import {
  Card,
  Row,
  CardBody,
  Col,
  FormGroup,
  Label,
  FormText,
  Button,
  // CustomInput,
  Alert,
  Form,
  Input
} from "reactstrap";

import { getCookie } from "../../jwt/_helpers/cookie";
import { opt } from "./labelsValidation";
import ModalConfirm from "../../components/modalConfirm";
import {StateContext} from "../../utils/context";
import AsyncDropdownNormal from "../../components/asyncDropdownNormal";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const LabelsAdd = () => {
  const stateRef = useRef();
  const stateRefPromo = useRef();
  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);

  const {currentUser} = useContext(StateContext);

  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

  const [logoSelected, setLogo] = useState(false);
  const [logoPreview, setLogoPreview] = useState(false);
  const [promoPreview, setPromoPreview] = useState(false);

  const [promoGraphicSelected, setPromo] = useState(false);

  const token = getCookie("token");
  const options = {
    method: "GET",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  };

  const [parentUserOnly, setParentUserOnly] = useState('&parent_user_only=true');
  const [subUser, setSubUser] = useState('');
  const [subUserId, setSubUserId] = useState(null);
  const [subUserEndpoint, setSubUserEndpoint] = useState('');

  const [redirect, setRedirect] = useState(false);

  stateRef.current = logoSelected;
  stateRefPromo.current = promoGraphicSelected;

  useEffect(() => {
    var formID = document.getElementById("addNewLabel");
    formValidation(formID, opt)
    .on("core.validator.validated", function(e) {
      const item = e.field;
      if (item === 'logo' && e.result.valid) {
        const file = e.element.files[0];
        handleIMG_AWS(file, 'media/label/logo/');
      }
      // if (item === 'promo_graphic' && e.result.valid) {
      //   const file = e.element.files[0];
      //   handleIMG_AWS(file);
      // }
    })
    .on("core.form.valid", e => {
      let formData = new FormData();

      formData.append("name", formID.querySelector('[name="name"]').value);
      formData.append(
        "biography",
        formID.querySelector('[name="labelBio"]').value
      );
      formData.append("logo",stateRef.current);
      stateRefPromo.current && formData.append("promo_graphic", stateRefPromo.current);

      formData.append(
        "primary_genre",
        formID.querySelector('[name="genre"]').value
      );
      formData.append(
        "secondary_genre",
        formID.querySelector('[name="secondaryGenre"]').value
      );
      formData.append("year", formID.querySelector('[name="year"]').value);
      formData.append(
        "catalog_num",
        formID.querySelector('[name="releaseCatalog"]').value
      );
      formData.append(
        "soundcloud",
        formID.querySelector('[name="soundcloud"]').value
      );
      formData.append("skype", formID.querySelector('[name="skype"]').value);
      formData.append(
        "website",
        formID.querySelector('[name="website"]').value
      );
      formData.append(
        "facebook",
        formID.querySelector('[name="facebook"]').value
      );
      formData.append(
        "twitter",
        formID.querySelector('[name="twitter"]').value
      );
      formData.append(
        "youtube",
        formID.querySelector('[name="youtube"]').value
      );
      formData.append(
        "instagram",
        formID.querySelector('[name="instagram"]').value
      );
      formData.append(
        "mixcloud",
        formID.querySelector('[name="mixcloud"]').value
      );
      formData.append(
        "myspace",
        formID.querySelector('[name="myspace"]').value
      );
      formData.append(
        "beatport",
        formID.querySelector('[name="beatport"]').value
      );
      formData.append("itunes", formID.querySelector('[name="itunes"]').value);
      formData.append(
        "junodownload",
        formID.querySelector('[name="junodownload"]').value
      );
      formData.append(
        "googlemusic",
        formID.querySelector('[name="googlemusic"]').value
      );

      if(subUserId) 
      { 
        formData.append("sub_user_id", subUserId);
      }

      setDataModal(formData);
      setToggleModal(true);

    });
  });

  const handleIMG_AWS = (file, path) => {
    let fileParts = file.name;
    let fileType = fileParts.split('.')[1];
    axios({
      method: "GET",
      mode: 'cors',
      url: `${API_URL}obtain-signed-url-for-upload/?filename=${path}${fileParts}&filetype=${fileType}`,
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
          setLogo(transformedURL);
        })
        .catch(error => {
          console.log("ERROR " + error);
        });
    })
  }


  return (
    <div>
      <Row>
        <Col sm={12}>
          <Card>
            <CardBody>
              <h3>Add Label</h3>
              <Form id="addNewLabel">
                <FormGroup>
                  <Label>Name</Label>
                  <Input name="name" type="text" className="form-control" />
                </FormGroup>
                {currentUser.is_premium_user &&
                  <FormGroup className="select-search-wrap">
                    <Label>
                      Sub-User
                    </Label>
                      {
                          subUser ?

                          <div className="releaseFileRow">
                              <p className="releaseFileRowName"> {subUser}</p>
                              <Button className="btn btn-outline-info" 
                                onClick={() => {
                                  setSubUser('');
                                  setSubUserId(null);
                                  setSubUserEndpoint('');
                                }
                                }>
                                Reset
                              </Button>
                          </div>
                          :
                          <AsyncDropdownNormal
                            fetchOptions={options}
                            endpoint={`sub-users`}
                            subUserEndpoint={subUserEndpoint}
                            parentUserOnly={parentUserOnly}
                            labelField="username"
                            onChange={e => {
                              let subUserId = e.value;
                              let username = e.label;
                              if(subUserId !== '') {
                                setSubUser(username);
                                setSubUserId(subUserId);
                                setSubUserEndpoint(`sub-user/${subUserId}/`);
                                setParentUserOnly('');
                              } else {
                                setSubUser('');
                                setSubUserId(null);
                                setSubUserEndpoint('');
                                setParentUserOnly('&parent_user_only=true');
                              }
                            }}
                            placeholder="Select Sub-user..."
                          />
                      }
                    <FormText color="muted">
                      Note: Only use this dropdown if you want to Add Label for any of your Sub-users otherwise leave un-selected.
                    </FormText>
                  </FormGroup>
                  }
                <FormGroup>
                  <Label>Label biography</Label>
                  <Input name="labelBio" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label for="image">Logo</Label>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept=".jpeg,.jpg,.png"
                    onChange={e => setLogoPreview(e.target.files[0])}
                  />
                  <FormText color="muted">
                    Upload JPG or PNG formats, resolution only 1000x1000 px
                  </FormText>
                  {logoPreview && (
                    <img
                      alt="Your logo"
                      src={URL.createObjectURL(logoPreview)}
                      style={{
                        width: "auto",
                        maxWidth: "100%",
                        maxHeight: 200
                      }}
                    />
                  )}
                </FormGroup>

                <FormGroup>
                  <Label for="image">Promotional Graphic</Label>
                  <input
                    type="file"
                    id="promoGraphic"
                    name="promo_graphic"
                    accept=".jpeg,.jpg,.png"
                    onChange={e => setPromoPreview(e.target.files[0])}
                  />
                  <FormText color="muted">
                    Upload JPG or PNG formats, resolution only 960x150px, max 100kb
                  </FormText>
                  {promoPreview && (
                    <img
                      alt="Your promotional graphic"
                      src={URL.createObjectURL(promoPreview)}
                      style={{ width: "100%" }}
                    />
                  )
                  }
                </FormGroup>
                <FormGroup>
                  <Label>Primary genre</Label>
                  <Input name="genre" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label>Secondary genre</Label>
                  <Input
                    name="secondaryGenre"
                    type="text"
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Year established</Label>
                  <Input name="year" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label>Releases in catalog</Label>
                  <Input
                    name="releaseCatalog"
                    type="text"
                    className="form-control"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Soundcloud</Label>
                  <Input
                    name="soundcloud"
                    type="text"
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Skype</Label>
                  <Input name="skype" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label>Website</Label>
                  <Input name="website" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label>Facebook</Label>
                  <Input name="facebook" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label>Twitter</Label>
                  <Input name="twitter" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label>Youtube</Label>
                  <Input name="youtube" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label>Instagram</Label>
                  <Input
                    name="instagram"
                    type="text"
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Mixcloud</Label>
                  <Input name="mixcloud" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label>Myspace</Label>
                  <Input name="myspace" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label>Beatport</Label>
                  <Input name="beatport" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label>Itunes</Label>
                  <Input name="itunes" type="text" className="form-control" />
                </FormGroup>
                <FormGroup>
                  <Label>Junodownload</Label>
                  <Input
                    name="junodownload"
                    type="text"
                    className="form-control"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Googlemusic</Label>
                  <Input
                    name="googlemusic"
                    type="text"
                    className="form-control"
                  />
                </FormGroup>

                <Button color="success" type="submit">
                  Submit
                </Button>
              </Form>

              <div style={{ paddingTop: "24px" }}>
                {success && (
                  <Alert color="success">Label has been added!</Alert>
                )}
                {redirect ? <Navigate to="/labels" /> : null}
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
          title={`Add label ${dataModal.name}?`}
          setSuccess={setSuccess}
          setError={setError}
          body={`Are you sure you want to create a new label? Please make sure you are
          inserting a unique label name. In order to be sure, please check if the
          name already exists in stores like Beatport and Traxsource. Every
          submission has to be approved and registered by the Move Music team. We
          usually approve and registered new labels within 48 hours.`}
          apiURL={`labels`}
          setRedirect={setRedirect}
        />
      )}
    </div>
  );
};

export default LabelsAdd;
