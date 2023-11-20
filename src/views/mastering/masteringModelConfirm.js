import React from "react";
import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import axios from "axios";
import { getCookie } from "../../jwt/_helpers/cookie";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const MasteringModalConfirm = ({
  openModal,
  setToggleModal,
  title,
  dataModal,
  setRedirect,
  body,
  setError,
  setErrorMsg,
  setMasteringID,
  submitFormCustom,
  setSuccess,
  apiURL,
  method = "POST"
}) => {
  const tokenAPI = getCookie("token");

  const handleSubmit = () => {
    const options = {
      method: "POST",
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${tokenAPI}`,
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json"
      }
    };

    if (method === "POST") {
      axios
        .post(`${API_URL}${apiURL}/`, dataModal, options)
        .then(res => {
          let mastering =  res.data;
          setMasteringID(mastering.id);
          setSuccess(true);
          if (setRedirect) {
            setToggleModal(false);
            setTimeout(() => setRedirect(true), 1000);
          } else {
            setToggleModal(false);
          }
        })
        .catch(err => {
          if(err.response.status === 400){
            let errors = err.response.data.non_field_errors;
            let errorText = "";
            errors.map(error => {
              errorText += error + "\n";
            });
            setErrorMsg(errorText);
          }
          else
          {
            setErrorMsg("Something went wrong! Please refresh page and try again!");
          }
          setError(true);
        });
    } else if (method === "PUT") {
      axios
        .put(`${API_URL}${apiURL}/`, dataModal, options)
        .then(res => {
          setSuccess(true);
          if (setRedirect) {
            setToggleModal(false);
            setTimeout(() => setRedirect(true), 1000);
          } else {
            setToggleModal(false);
          }
        })
        .catch(err => {
          if(err.response.status === 400){
            let errors = err.response.data.non_field_errors;
            let errorText = "";
            errors.map(error => {
              errorText += error + "\n";
            });
            setErrorMsg(errorText);
          }
          else
          {
            setErrorMsg("Something went wrong! Please refresh page and try again!");
          }
          setError(true);
        });
    }
  };
  return (
    <Modal isOpen={openModal} centered={true}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setToggleModal(false)}>
          Cancel
        </Button>
        <Button color="success" onClick={() => handleSubmit()}>
          Confirm
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MasteringModalConfirm;
