import React from "react";
import { Button, Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
import axios from "axios";
import { getCookie } from "../jwt/_helpers/cookie";
import { Link } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const SubUsersTableModal = ({
  openModal,
  setToggleModal,
  values,
  title,
  body,
  apiURL,
  bodyID,
  activateUser,
  updateBody
}) => {
  const tokenAPI = getCookie("token");

  const updateData = {
      "is_active": activateUser? true: false,
  }

  const activateBtnText = activateUser ? "Activate" : "De-Activate";
  const activateBtnColor = activateUser ? "success" : "danger";

  const handleUpdate = () => {
    const options = {
      method: "PATCH",
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
        {updateBody ? (
          <>
            <Button color={activateBtnColor} onClick={() => handleUpdate()}>
                {activateBtnText}
            </Button>
          </>
        ) : (
          <Button color="success">
            <Link to={`${apiURL}update/`}>Edit</Link>
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default SubUsersTableModal;
