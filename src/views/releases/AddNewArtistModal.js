import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { getCookie } from "../../jwt/_helpers/cookie";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;


const AddNewArtistModal = props => {
  const { modal, toggleModal, setNewArtist, subUserId, subUserEndpoint, parentUserOnly } = props;
  const token = getCookie().token;
  const [error, setError] = React.useState(false);
  const [errorDupl, setErrorDupl] = React.useState(false);


  return (
    <Modal isOpen={modal} centered={true}>
      <ModalHeader>Add New Artist</ModalHeader>
      <ModalBody>
        <Formik
          initialValues={{
            name: '',
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Name is required')
          })}
          onSubmit={({ name }, { setStatus, setSubmitting }) => {
            setStatus();

            const options = {
              'method': "GET",
              mode: 'cors',
              headers: {
                Authorization: `Bearer ${token}`,
                "x-api-key": X_API_KEY,
                'Content-Type': 'application/json'
              }
            }

            const artistObj = {
              name: name,
              ...(subUserId && { sub_user_id: subUserId || null})
            };

            axios.get(`${API_URL}artists/${subUserEndpoint}?search=${name}${parentUserOnly}`, options).then(res => {
              if (res.status === 200){
                const list = res.data.results.length > 0 ? res.data.results : [];

                const getOne = list.filter(i => i.name === name);

                if (getOne.length > 0) {
                  setErrorDupl(true)
                } else {
                  axios
                  .post(
                    `${API_URL}artists/`,
                    artistObj,
                    options
                  )
                  .then(res => {
                    if (res.status === 201) {
                      const artists = res.data;
                      artists && setNewArtist();
                      artists && toggleModal(false);
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
              <Field name="name" type="text" className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} onChange={(e) => setFieldValue('name', e.target.value)} />
              <ErrorMessage name="name" component="div" className="invalid-feedback" />
              {
                errorDupl  && <p style={{    fontSize: "12px",color: "red",margin: "4px 0 4px 0"}}>Artist already exists</p>
              }
              <ModalFooter>
                <Button color="success" type="submit" disabled={isSubmitting}>Create new</Button>{' '}
                <Button color="secondary" onClick={() => toggleModal(false)}>Cancel</Button>
              </ModalFooter>
            </Form>
          )}
        />

      </ModalBody>

    </Modal>
  );
};

export default AddNewArtistModal;
