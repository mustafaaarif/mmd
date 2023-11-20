import React from "react";
import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import axios from "axios";
import { getCookie } from "../jwt/_helpers/cookie";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const SubUserStatementTableModal = ({
  openModal,
  setToggleModal,
  values,
  title,
  body,
  apiURL,
  statementID,
  statementStatus,
}) => {
  const tokenAPI = getCookie("token");

  const updateData = {
    "id": statementID,
  }

  const statusUpdateBtnText = (statementStatus === 0) ? "Mark as PAID" : "Mark as OPEN";
  const statusUpdateBtnColor = (statementStatus === 0) ? "success" : "danger";

  const handleUpdate = () => {
    const options = {
      method: "POST",
      data: updateData,
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${tokenAPI}`,
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json"
      }
    };

    axios(`${API_URL}${apiURL}/`, options)
      .then(res => {
        setToggleModal(false);
        values.setSuccess(true);
        values.setForce(values.forceUpdate + 1);
      })
      .catch(err => {
        values.setError(true);
      });
  };
  return (
    <Modal isOpen={openModal} centered={true}>
      <ModalHeader>{title}</ModalHeader>
      {body && <ModalBody>{body}</ModalBody>}

      <ModalFooter>
        <Button color="secondary" onClick={() => setToggleModal(false)}>
          Cancel
        </Button>
        <Button color={statusUpdateBtnColor} onClick={() => handleUpdate()}>
            {statusUpdateBtnText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SubUserStatementTableModal;
