import React, { useState, useContext } from "react";
import axios from "axios";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { Link, useLocation } from "react-router-dom";
import { getCookie } from "../jwt/_helpers/cookie";
import {StateContext} from "../utils/context";
import {getUser} from "../utils/getUser";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;


const PromoDropdown = ({
  data,
  setToggleModal,
  setDataModal,
  setDeleteBody,
  actionValues,
  handlerValues
}) => {
  const currentRoute = useLocation().pathname;
  const tokenAPI = getCookie("token");
  const {currentUser, setCurrentUser} = useContext(StateContext);
  const {setSuccessAction, setErorrAction, setSuccessActionText} = actionValues;

  const patchPromo = (url, update = false) => {
    axios({
      method: "get",
      mode: 'cors',
      url: `${API_URL}${url}`,
      headers: {
        Authorization: `Bearer ${tokenAPI}`,
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      if (response.status === 200) {
        setSuccessActionText(response.data.message.split('<br />').join(' ').split('<br/>').join(' '))
        setSuccessAction(true);

        if (update && currentUser.promotion_amount_left > 0) {
          getUser(tokenAPI, currentUser, setCurrentUser);
          handlerValues.setForce( prev => prev + 1);
        }

        setTimeout(() => {
          setSuccessAction(false);
        }, (5000));
      } else {
        setErorrAction(true)
        setTimeout(() => {
          setErorrAction(false);
        }, (3000));
      }
    });
  }


  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);
  const detailsLink = `${currentRoute}/${data.id}/view`;
  const updateLink = `${currentRoute}/${data.id}/update/`;
  const emailPreviewLink = `promotions/${data.id}/preview-email/`
  const sendPromoLink = `promotions/${data.id}/send-promotion/`

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret outline color="primary">
        Action
      </DropdownToggle>

      <DropdownMenu>
        <Link className="dropdown-item" to={updateLink}>
          Edit
        </Link>
        <DropdownItem onClick={() => patchPromo(emailPreviewLink)}>Email Preview</DropdownItem>
        {
          (data.promotion_status === "sending" || currentUser.promotion_amount_left <= 0) ? 
            <DropdownItem disabled >Send to recipients</DropdownItem>
          :
          data.promotion_status === "sent" ?
            <DropdownItem disabled>Send to recipients</DropdownItem>
          :
            <DropdownItem onClick={() => patchPromo(sendPromoLink, true)}>Send to recipients</DropdownItem>

        }
        <Link className="dropdown-item" to={detailsLink}>
          Promotion Details
        </Link>
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
      </DropdownMenu>
    </ButtonDropdown>
  );
};

export default PromoDropdown;
