import React, { useState } from "react";
import axios from "axios";
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import { Link } from "react-router-dom";
import { getCookie } from "../../jwt/_helpers/cookie";
const API_URL = process.env.REACT_APP_API_URL_BASE;

const ManagmentDropdown = ({data}) => {
  const tokenAPI = getCookie("token");
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);

  // const patchRelease = (ID, status, func) => {
  //   axios({
  //     method: "patch",
  //     mode: 'cors',
  //     url: `${API_URL}releases/${ID}/`,
  //     data:{
  //       "status": status
  //     },
  //     headers: {
  //       Authorization: `Bearer ${tokenAPI}`,
  //       "x-api-key": X_API_KEY,
  //       "Content-Type": "application/json"
  //     }
  //   }).then(function(response) {
  //     if (response.status === 200) {
  //       setSuccessAction(true);
  //       setForceUpdate(forceUpdate + 1);
  //       if (func){
  //         func();
  //       }
  //
  //       setTimeout(() => {
  //         setSuccessAction(false);
  //       }, (3000));
  //     }
  //   });
  // }

  return (
    <>
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret outline color="primary">
        Action
      </DropdownToggle>

      <DropdownMenu>
        <DropdownItem><Link to={`/demo/${data?.url_suffix}/${data?.token}`}>Open</Link></DropdownItem>
        <DropdownItem><Link to={`#`}>Delete</Link></DropdownItem>
      </DropdownMenu>

    </ButtonDropdown>
    </>
  );
};

export default ManagmentDropdown;
