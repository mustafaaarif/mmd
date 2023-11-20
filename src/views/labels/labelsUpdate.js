import React, { useState, useEffect, useRef } from "react";
import { Redirect } from "react-router-dom";
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
  CustomInput,
  Alert,
  Form,
  Input
} from "reactstrap";
import axios from "axios";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import { opt } from "./labelsValidation";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const LabelsUpdate = ({ match, name }) => {
  const stateRef = useRef();
  const stateRefPromo = useRef();
  const currentID = match.url.split("/")[2];
  const token = getCookie("token");
  const [initFormData] = useFetch("GET", `labels/${currentID}/`, token);


  //ajax handlers
  const [success, setSuccess] = useState(false);
  const [errorPut, setError] = useState(false);

  const [logoSelected, setLogo] = useState(false);
  const [promoGraphicSelected, setPromo] = useState(false);

  const [logoPreview, setLogoPreview] = useState(false);
  const [promoPreview, setPromoPreview] = useState(false);

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
        handleIMG_AWS(file, 'media/label/logo/', 'logo');
      }
      if (item === 'promo_graphic' && e.result.valid) {
        const file = e.element.files[0];
        handleIMG_AWS(file, 'media/label/promo_graphic/', 'promo_graphic');
      }
    })
    .on("core.form.valid", e => {
      let formData = new FormData();
      
      const getData = inputName => formID.querySelector(`[name="${inputName}"]`).value;

      const checkData = (name, newVal) => (name !== newVal ? true : false);

      stateRef.current && formData.append("logo", stateRef.current);

      stateRefPromo.current && formData.append("promo_graphic", stateRefPromo.current);

      checkData(initFormData.biography, getData("labelBio")) &&
        formData.append("biography", getData("labelBio"));
      checkData(initFormData.primary_genre, getData("genre")) &&
        formData.append("primary_genre", getData("genre"));
      checkData(initFormData.secondary_genre, getData("secondaryGenre")) &&
        formData.append("secondary_genre", getData("secondaryGenre"));
      checkData(initFormData.year, getData("year")) &&
        formData.append("year", getData("year"));
      checkData(initFormData.catalog_num, getData("releaseCatalog")) &&
        formData.append("catalog_num", getData("releaseCatalog"));
      checkData(initFormData.soundcloud, getData("soundcloud")) &&
        formData.append("soundcloud", getData("soundcloud"));
      checkData(initFormData.skype, getData("skype")) &&
        formData.append("skype", getData("skype"));
      checkData(initFormData.website, getData("website")) &&
        formData.append("website", getData("website"));
      checkData(initFormData.facebook, getData("facebook")) &&
        formData.append("facebook", getData("facebook"));
      checkData(initFormData.twitter, getData("twitter")) &&
        formData.append("twitter", getData("twitter"));
      checkData(initFormData.youtube, getData("youtube")) &&
        formData.append("youtube", getData("youtube"));
      checkData(initFormData.instagram, getData("instagram")) &&
        formData.append("instagram", getData("instagram"));
      checkData(initFormData.mixcloud, getData("mixcloud")) &&
        formData.append("mixcloud", getData("mixcloud"));
      checkData(initFormData.myspace, getData("myspace")) &&
        formData.append("myspace", getData("myspace"));
      checkData(initFormData.beatport, getData("beatport")) &&
        formData.append("beatport", getData("beatport"));
      checkData(initFormData.itunes, getData("itunes")) &&
        formData.append("itunes", getData("itunes"));
      checkData(initFormData.junodownload, getData("junodownload")) &&
        formData.append("junodownload", getData("junodownload"));
      checkData(initFormData.googlemusic, getData("googlemusic")) &&
        formData.append("googlemusic", getData("googlemusic"));

      axios({
        method: "PATCH",
        mode: 'cors',
        url: `${API_URL}labels/${currentID}/`,
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


  const handleIMG_AWS = (file, path, kind) => {
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
          if (kind === 'logo') {
            setLogo(transformedURL);
          } else {
            setPromo(transformedURL);
          }
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
              <h3>Edit label</h3>
              <Form id="addNewLabel">
                <FormGroup>
                  <Label>Name</Label>
                  <Input
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.name}
                    disabled={true}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Label biography</Label>
                  <Input
                    name="labelBio"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.biography}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="image">Logo</Label>
                  <CustomInput
                    type="file"
                    id="logo"
                    name="logo"
                    accept=".jpeg,.jpg,.png"
                    onChange={e => setLogoPreview(e.target.files[0])}
                  />
                  <FormText color="muted">
                    Upload JPG or PNG formats, resolution only 1000x1000 px
                  </FormText>
                  {logoPreview ? (
                    <img
                      alt="Your logo"
                      src={URL.createObjectURL(logoPreview)}
                      style={{
                        width: "auto",
                        maxWidth: "100%",
                        maxHeight: 200
                      }}
                    />
                  ) : initFormData.logo ? (
                    <img
                      alt="Your logo"
                      src={'https://stagingmovemusic.s3.amazonaws.com/media/' + initFormData.logo}
                      style={{
                        width: "auto",
                        maxWidth: "100%",
                        maxHeight: 200
                      }}
                    />
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label for="image">Promotional Graphic</Label>
                  <CustomInput
                    type="file"
                    id="promoGraphic"
                    name="promo_graphic"
                    accept=".jpeg,.jpg,.png"
                    onChange={e => setPromoPreview(e.target.files[0])}
                  />
                  <FormText color="muted">
                    Upload JPG or PNG formats, resolution only 960x150px, max 100kb
                  </FormText>
                  {promoPreview ? (
                    <img
                      alt="Your promotional graphic"
                      src={URL.createObjectURL(promoPreview)}
                      style={{ width: "100%" }}
                    />
                  ) : initFormData.promo_graphic ? (
                    <img
                      alt="Your promotional graphic"
                      src={'https://stagingmovemusic.s3.amazonaws.com/media/' + initFormData.promo_graphic}
                      style={{ width: "100%" }}
                    />
                  ) : null}
                </FormGroup>
                <FormGroup>
                  <Label>Primary genre</Label>
                  <Input
                    name="genre"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.primary_genre}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Secondary genre</Label>
                  <Input
                    name="secondaryGenre"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.secondary_genre}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Year established</Label>
                  <Input
                    name="year"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.year}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Releases in catalog</Label>
                  <Input
                    name="releaseCatalog"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.catalog_num}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Soundcloud</Label>
                  <Input
                    name="soundcloud"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.soundcloud}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Skype</Label>
                  <Input
                    name="skype"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.skype}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Website</Label>
                  <Input
                    name="website"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.website}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Facebook</Label>
                  <Input
                    name="facebook"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.facebook}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Twitter</Label>
                  <Input
                    name="twitter"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.twitter}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Youtube</Label>
                  <Input
                    name="youtube"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.youtube}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Instagram</Label>
                  <Input
                    name="instagram"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.instagram}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Mixcloud</Label>
                  <Input
                    name="mixcloud"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.mixcloud}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Myspace</Label>
                  <Input
                    name="myspace"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.myspace}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Beatport</Label>
                  <Input
                    name="beatport"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.beatport}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Itunes</Label>
                  <Input
                    name="itunes"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.itunes}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Junodownload</Label>
                  <Input
                    name="junodownload"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.junodownload}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Googlemusic</Label>
                  <Input
                    name="googlemusic"
                    type="text"
                    className="form-control"
                    defaultValue={initFormData.googlemusic}
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
                {redirect ? <Redirect to="/labels" /> : null}
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

export default LabelsUpdate;
