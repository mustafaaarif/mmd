import React, {useState} from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, FormText, FormGroup, Label } from "reactstrap";
import { getCookie } from "../../jwt/_helpers/cookie";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const toTitleCase = (str) => {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

const AddNewContributorsModal = props => {
  const { modal, toggleModal, setNewContributor, subUserId, subUserEndpoint, parentUserOnly } = props;
  const token = getCookie().token;
  const [error, setError] = React.useState(false);
  const [errorDupl, setErrorDupl] = React.useState(false);
  const [validationErr, setValidationErr] = useState(false);

  return (
    <Modal isOpen={modal} centered={true}>
      <ModalHeader>Add new Contributor</ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            name: '',
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required').test('is-uppercase', 'Name must not be in all uppercase', value => value !== value.toUpperCase())
          })}
          onSubmit={({ name }, { setStatus, setSubmitting }) => {
            setStatus();
            const reg = new RegExp(/^([A-Z][a-zA-Z]{2,19}\s[a-zA-Z]{1,19}'?-?[a-zA-Z]{2,25}\s?([A-Z][a-zA-Z]{1,25})?)/)

            if (reg.test(name) === false ){
              setValidationErr(true);
              return;
            } else {
              setValidationErr(false);
            }

            let nameTitleCase = toTitleCase(name);

            const options = {
              'method': "GET",
              mode: 'cors',
              headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": X_API_KEY,
                'Content-Type': 'application/json'
              }
            }

            const contributorObj = {
              name: nameTitleCase,
              ...(subUserId && { sub_user_id: subUserId || null})
            };

            axios.get(`${API_URL}contributors/${subUserEndpoint}?search=${nameTitleCase}${parentUserOnly}`, options).then(res => {
              if (res.status === 200){

                const list = res.data.results.length > 0 ? res.data.results : [];

                const getOne = list.filter(i => i.name === nameTitleCase);

                if (getOne.length > 0) {
                  setErrorDupl(true)
                } else {
                  axios
                  .post(
                    `${API_URL}contributors/`,
                    contributorObj,
                    options
                  )
                  .then(res => {
                    if (res.status === 201) {
                      const contributors = res.data;
                      contributors && setNewContributor();
                      contributors && toggleModal(false);
                    }
                  })
                  .catch(err => {
                    setError(true);
                    
                  });
                }
              }
            }).catch(err => {
              setError(true);
            });

          }}
          render={({ errors, status, touched, isSubmitting, setFieldValue }) => (
            <Form className="mt-3" id="loginform">
              <FormGroup>
                <Label>Name</Label>
                <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} onChange={(e) => setFieldValue('name', e.target.value.replace(/[&\/\\#,+()$~^%.'":*?<>{}]/g,''))} />
                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                {validationErr && <div className="invalid-feedback" style={{display: 'block'}}>Please insert the real First and Last name of the person.</div>}
                <FormText color="muted" style={{padding: '5px 0'}}>
                  Please insert the full First and Last name of the songwriter. Example: "Max Mustermann"
                </FormText>
              </FormGroup>
              {
                errorDupl  && <p style={{    fontSize: "12px",color: "red",margin: "4px 0 4px 0"}}>Contributor already exists</p>
              }
              <ModalFooter>
                <Button color="success" type="submit">Create new</Button>{' '}
                <Button color="secondary" onClick={() => toggleModal(false)}>Cancel</Button>
              </ModalFooter>
            </Form>
          )}
        />

      </ModalBody>

    </Modal>
  );
};

export default AddNewContributorsModal;
