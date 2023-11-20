import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link } from "react-router-dom";

const ListsDropdown = ({ editLink }) => {
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret outline color="primary">
        Action
      </DropdownToggle>

      <DropdownMenu>
        <DropdownItem>
          <Link to={editLink}>Edit</Link>
        </DropdownItem>
        <DropdownItem>Delete</DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default ListsDropdown;
