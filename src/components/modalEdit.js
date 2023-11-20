import React from "react";
import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import axios from "axios";
import { getCookie } from "../jwt/_helpers/cookie";
import { Link } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL_BASE;

const ModalEdit = ({
  openModal,
  setToggleModal,
  title,
  dataModal,
  setRedirect,
  submitformCustom,
  setEditModal,
  body,
  modalEdit
}) => {
  return (
    <Modal isOpen={openModal} centered={true}>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>{body}</ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setToggleModal(false)}>
          Cancel
        </Button>
        <Button color="success">
          <Link to={modalEdit}></Link>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalEdit;
