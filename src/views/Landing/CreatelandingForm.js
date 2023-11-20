import React, {useEffect, useState} from "react";
import {Col, Button, FormGroup, Label, CustomInput, Input, FormText} from 'reactstrap';
import {Formik, Field, Form, ErrorMessage} from "formik";
import ViewLayout from "../../components/viewLayout";
import * as Yup from "yup";
import {getCookie} from "../../jwt/_helpers";
import axios from "axios";
import {addNewLanding, setLandings} from "../../redux/landings/action";
import {connect} from "react-redux";
import {useHistory} from "react-router-dom";
import Select from "react-select";
import { ChromePicker } from 'react-color'

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const CreateLandingPageForm = ({addNewLanding}) => {
  const [respErrors, setRespErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState('');
  const [validUrlSuffix, setValidUrlSuffix] = useState(null);
  const tokenAPI = getCookie("token");
  const [labels, labelsSET] = useState(null);
  const [accent_color, setAccentColor] = useState( '#F17013');
  const [displayColorPicker, setDisplayColorPicker] = useState('');
  const history = useHistory();

  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      Authorization: `Bearer ${tokenAPI}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "multipart/form-data"
    }
  }

  useEffect(() => {
    axios.get(`${API_URL}labels/`, options).then(res => {
      labelsSET(res.data.results);
    });
  }, [])

  const showErrorMessage = (name) => (
    <ErrorMessage
      name={name}
      component="div"
      className="invalid-feedback"
    />
  )

  const handleSubmitForm = async (values) => {
    let formData = new FormData()

    Object.keys(values).forEach(key => {
      formData.append(key, values[key])
    })
    formData.append('accent_color', accent_color)

    try{
      if(validUrlSuffix.success){
        const resp = await axios.post(`${API_URL}demo-landingpage/`, formData, options);
        if(resp.data){
          addNewLanding(resp.data)
          history.push('/landing');
        }
      }
    }catch(err){
      console.log('error', err.response)
      setRespErrors(err.response.data)
    }
  }

  const themeOptions = [
    {value: 1, label: 'Dark'},
    {value: 2, label: 'Light'}
  ]

  const labelOptions = labels ? labels.map(item => ({value: item.id, label: item.name })) : []

  const handleCheckUrlSuffix = (url) => {
    let formData = new FormData()
    formData.append('url_suffix', url)
    axios.post(`${API_URL}demo-landingpage-url/`, formData, options).then(resp => {
      setValidUrlSuffix(resp.data)
    }).catch(err => {
      setValidUrlSuffix(err.response.data)
    })

  }

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker )
  };

  const handleClose = () => {
    setDisplayColorPicker( false )
  };

  const handleChange = (color) => {
    setAccentColor(color.hex);
  };

  const styles = {
    color: {
      width: '60px',
      height: '22px',
      borderRadius: '2px',
      background: accent_color,
    },
    swatch: {
      padding: '5px',
      background: '#fff',
      borderRadius: '1px',
      boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
      display: 'inline-block',
      cursor: 'pointer',
    },
    popover: {
      position: 'absolute',
      top: '-50px',
      left: '80px',
      zIndex: '2',
    },
    cover: {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    }
  }

  return (
    <>
      <ViewLayout title={"Create Landing Page"}>
        <Formik
          initialValues={{
            label: '',
            name: '',
            url_suffix: '',
            logo: '',
            theme: '1',
          }}
          validationSchema={Yup.object().shape({
            label: Yup.string().required("Label is required"),
            name: Yup.string().required(" Name is required"),
            url_suffix: Yup.string().required("Suffix is required"),
            logo: Yup.mixed().required('A file is required'),
            theme: Yup.string().required("Theme is required"),
          })}
          onSubmit={handleSubmitForm}
        >
          {({
              values,
              errors,
              touched,
            }) => {

            if(validUrlSuffix?.error){
              errors.url_suffix = validUrlSuffix.error
            }else {
              delete errors.url_suffix
            }

            return (
              <Form className="mt-4" id="landingForm">
                <FormGroup>
                  <Label for="label">Label</Label>
                    <Select
                      components={{ IndicatorSeparator:() => null }}
                      name="label"
                      id="label"
                      options={labelOptions}
                      onChange={(e) => {
                        values.label = e.value;
                        delete errors.label
                      }}
                    />
                    {errors.label && <div className="error">{errors.label}</div>}
                </FormGroup>

                <FormGroup>
                  <Label for="name">Name</Label>
                    <Field type="text" name="name" id="name" placeholder="name" className={
                      "form-control" +
                      (errors.name && touched.name
                        ? " is-invalid"
                        : "")
                    }/>
                    {showErrorMessage('name')}
                </FormGroup>

                <FormGroup>
                  <Label for="suffix">Url suffix</Label>
                    <Field
                      type="text"
                      name="url_suffix"
                      id="suffix"
                      placeholder="url suffix"
                      className={"form-control" + (errors.url_suffix && touched.url_suffix ? " is-invalid" : "")}
                      onBlur={()=> {
                        if(values.url_suffix){
                          handleCheckUrlSuffix(values.url_suffix)
                        }
                      }}
                      onFocus={()=> {
                        delete errors.url_suffix
                      }}
                    />
                    {errors.url_suffix && <div className="error">{errors.url_suffix}</div>}
                </FormGroup>

                <FormGroup>
                  <Label for="logo">Logo</Label>
                    <CustomInput
                      onChange={e => {
                        values.logo = e.target.files[0];
                        setLogoPreview(e.target.files[0])
                        delete errors.logo
                      }}
                      type="file"
                      name="logo"
                      id="logo"
                      accept=".jpeg,.jpg,.png"
                      className={(errors.logo && touched.logo && !logoPreview
                        ? "is-invalid"
                        : "")}
                    />
                    {/*<input className="hiddenInput" id="artworkURL" type="text" value={artworkURL || ''} onChange={(e) => e}/>*/}
                    <FormText color="muted" className="mb-1">
                      Upload JPG formats, resolution only 3000x3000 px, @ 72
                      dpi
                    </FormText>
                    {errors.logo && <div className="error">{errors.logo}</div>}
                    {logoPreview && (
                      <img
                        alt="Your logo"
                        src={URL.createObjectURL(logoPreview)}
                        style={{
                          maxWidth: "200px",
                          height: 'auto'
                        }}
                      />
                    )}
                </FormGroup>

                <FormGroup>
                  <Label for="theme">Theme</Label>
                    <Select
                      components={{ IndicatorSeparator:() => null }}
                      name="theme"
                      id="theme"
                      defaultValue={themeOptions[0]}
                      options={themeOptions}
                      onChange={(e) => {
                        values.theme = e.value;
                        delete errors.theme
                      }}
                    />
                    {errors.theme && <div className="error">{errors.theme}</div>}
                </FormGroup>

                <div className="mb-4">
                  <Label for="accentColor">Accent color</Label>
                  <div style={{position: 'relative'}}>
                    <div style={ styles.swatch } onClick={ handleClick }>
                      <div style={ styles.color } />
                    </div>
                    { displayColorPicker ? <div style={ styles.popover }>
                      <div style={ styles.cover } onClick={ handleClose }/>
                      <ChromePicker color={ accent_color } onChange={ handleChange } />
                    </div> : null }
                  </div>
                </div>

                <FormGroup>
                    <button
                      disabled={!Object.keys(errors).length < 1}
                      className={`btn btn-success`}
                      type="submit">
                        Submit
                    </button>
                </FormGroup>
              </Form>
            )}
          }
        </Formik>

      </ViewLayout>
    </>
  );
};

const mapStateToProps = state => ({
  tableData: state.landings
});

const mapDispatchToProps = {
  addNewLanding
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateLandingPageForm);
