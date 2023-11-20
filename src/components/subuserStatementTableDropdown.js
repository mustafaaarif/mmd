import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

const SubUserStatementTableDropdown = ({
  data,
  setSuccess,
  setError,
  setToggleModal,
  setDataModal,
  setLastAction
}) => {
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);
  
  const statusUpdateBtnText = (data.status === 0) ? "Mark as PAID" : "Mark as OPEN";
  const statusUpdateAction = (data.status === 0) ? "marked as PAID" : "marked as OPEN";

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret outline color="primary">
        Action
      </DropdownToggle>

      <DropdownMenu>
        <DropdownItem
            onClick={() => {
            setSuccess(false);
            setError(false);
            setDataModal(data);
            setToggleModal(true);
            setLastAction(statusUpdateAction);
            }}
            style={{ cursor: "pointer" }}
        >
            {statusUpdateBtnText}
        </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default SubUserStatementTableDropdown;
