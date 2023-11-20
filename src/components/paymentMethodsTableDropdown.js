import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";

const PaymentMethodsTableDropdown = ({
  data,
  setToggleModal,
  setDataModal
}) => {
  const currentRoute = useLocation().pathname;
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);
  
  const editLink = `${currentRoute}/${
    data.token ? data.token : data.id
  }/update/`;

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret outline color="primary">
        Action
      </DropdownToggle>

      <DropdownMenu>
          <>
            <DropdownItem>
                <Link to={editLink}>Edit</Link>
            </DropdownItem>
            {
                !data.is_default && 
                <DropdownItem
                    onClick={() => {
                    setDataModal(data);
                    setToggleModal(true);
                    }}
                    style={{ cursor: "pointer" }}
                >
                    Delete
                </DropdownItem>
            }
          </>
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default PaymentMethodsTableDropdown;
