import React, { useState } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";

const TableDropdown = ({
  data,
  setDeleteBody,
  setToggleModal,
  setDataModal
}) => {
  const currentRoute = useLocation().pathname;
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);
  const editLink = `${currentRoute}/${
    data.token ? data.token : data.id
  }/update/`;
  const viewStatLink = `${currentRoute}/${data.id}/view-stats`;
  const viewArtistDetailsLink = `${currentRoute}/${data.id}/view-details`;
  const artistDetailsAvailable = (data.spotify_identifier !== "" && data.spotify_identifier !==null)

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret outline color="primary">
        Action
      </DropdownToggle>

      <DropdownMenu>
        {currentRoute === "/artists" ? (
          <>
            <DropdownItem
              onClick={() => {
                setDataModal(data);
                setToggleModal(true);
                setDeleteBody(false);
              }}
              style={{ cursor: "pointer" }}
            >
              Edit
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setDataModal(data);
                setToggleModal(true);
                setDeleteBody(true);
              }}
              style={{ cursor: "pointer" }}
            >
              Delete
            </DropdownItem>
            {
              artistDetailsAvailable &&
              <DropdownItem
                style={{ cursor: "pointer" }}
              >
                <Link to={viewArtistDetailsLink}>View Details</Link>
              </DropdownItem>
            }
          </>
        ) : (
          <>
            <DropdownItem>
              <Link to={editLink}>Edit</Link>
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setDataModal(data);
                setToggleModal(true);
                setDeleteBody(true);
              }}
              style={{ cursor: "pointer" }}
            >
              Delete
            </DropdownItem>
            {(currentRoute === "/music-link" || currentRoute === "/link-landing-page") && <DropdownItem>
              <Link to={viewStatLink}>View Stats</Link>
            </DropdownItem>}
          </>
        )}
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default TableDropdown;
