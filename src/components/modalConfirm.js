import React from "react";
import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import axios from "axios";
import { getCookie } from "../jwt/_helpers/cookie";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const ModalConfirm = ({
  openModal,
  setToggleModal,
  title,
  dataModal,
  setRedirect,
  body,
  setError,
  submitFormCustom,
  setSuccess,
  apiURL,
  method = "POST"
}) => {
  const tokenAPI = getCookie("token");

  const handleSubmit = () => {
    const options = {
      method: method,
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
          setSuccess(true);
          if (setRedirect) {
            setToggleModal(false);
            setTimeout(() => setRedirect(true), 1000);
          } else {
            setToggleModal(false);
          }
        })
        .catch(err => {
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
          setError(true);
        });
    }
    else if (method === "PATCH") {
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

export default ModalConfirm;
