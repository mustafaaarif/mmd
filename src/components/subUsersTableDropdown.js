import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";

const SubUsersTableDropdown = ({
  data,
  setUpdateBody,
  setToggleModal,
  setDataModal,
  setLastAction
}) => {
  const currentRoute = useLocation().pathname;
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);
  
  const editLink = `${currentRoute}/${data.id}/update/`;
  const activateBtnText = data.is_active ? "Deactivate" : "Activate";
  const activateAction = data.is_active ? "de-activated" : "activated";

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret outline color="primary">
        Action
      </DropdownToggle>

      <DropdownMenu>
        <DropdownItem>
            <Link to={editLink}>Edit</Link>
        </DropdownItem>
        <DropdownItem
            onClick={() => {
            setDataModal(data);
            setToggleModal(true);
            setUpdateBody(true);
            setLastAction(activateAction);
            }}
            style={{ cursor: "pointer" }}
        >
            {activateBtnText}
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default SubUsersTableDropdown;
