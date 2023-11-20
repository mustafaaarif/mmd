import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";

const ArtistsWishlistTableDropdown = ({
  data,
  setDeleteID,
  setToggleModal,
  setDataModal
}) => {
  const currentRoute = useLocation().pathname;
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);
  const addArtistLink = `${currentRoute}/${data.id}/add-artist/`;

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret outline color="primary">
        Action
      </DropdownToggle>
        <DropdownMenu>
          <DropdownItem
            style={{ cursor: "pointer" }}
          >
          <Link to={addArtistLink}>Add As Artist</Link>
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              setDataModal(data);
              setDeleteID(data.id);
              setToggleModal(true);
            }}
            style={{ cursor: "pointer" }}
          >
            Delete
          </DropdownItem>
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default ArtistsWishlistTableDropdown;
