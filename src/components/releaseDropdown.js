import React, { useState } from "react";
import axios from "axios";
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import { Link } from "react-router-dom";
import { getCookie } from "../jwt/_helpers/cookie";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const ReleaseDropdown = ({
  id,
  status,
  action,
  todUrl,
  touUrl,
  ppUrl,
  canAddTakedown,
  has_delivery_confirmations,
}) => {
  const tokenAPI = getCookie("token");
  const {setSuccessAction, forceUpdate, setForceUpdate} = action;
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);

  const [openDistribute, setOpenDistribute] = useState(false);
  const [openFinishEditing, setOpenFinishEditing] = useState(false);
  const [openTakeDown, setOpenTakeDown] = useState(false);
  const [distributedModals, setDistributeModals] = useState({type: null, isOpen: false})

  const patchRelease = (ID, status, func) => {
    axios({
      method: "patch",
      mode: 'cors',
      url: `${API_URL}releases/${ID}/`,
      data:{
        "status": status
      },
      headers: {
        Authorization: `Bearer ${tokenAPI}`,
        "x-api-key": X_API_KEY,
        "Content-Type": "application/json"
      }
    }).then(function(response) {
      if (response.status === 200) {
        setSuccessAction(true);
        setForceUpdate(forceUpdate + 1);
        if (func){
          func();
        }

        setTimeout(() => {
          setSuccessAction(false);
        }, (3000));
      }
    });
  }

// BE VALUES - API Pretty Values
// offline - Offline
// takedown_request - Takedown requested
// taken_down - Taken down
// re_delivery-delivery - Re-delivery
// ready - Ready
// approval - Waiting approval
// locked - In Progress - Locked
// unlocked - Please Edit
// distributed - Distributed
// live - Live

  return (
    <>
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle caret outline color="primary">
        Action
      </DropdownToggle>
      {
        status === "distributed" && (
        <DropdownMenu>
          <DropdownItem disabled>Distribute</DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/view/`}>View Release</Link>
          </DropdownItem>
          <DropdownItem onClick={() => setDistributeModals({isOpen: true, type: "release"})}>Edit Release Metadata</DropdownItem>
          <DropdownItem onClick={() => setDistributeModals({isOpen: true, type: "tracks"})}>Edit Tracks</DropdownItem>
          {canAddTakedown && <DropdownItem onClick={() => setOpenTakeDown(true)}>Takedown</DropdownItem>}
          {has_delivery_confirmations && <DropdownItem><Link to={`/releases/${id}/delivered-list/`}>Delivered List</Link></DropdownItem>}
          {!has_delivery_confirmations && <DropdownItem disabled>Delivered List</DropdownItem>}
        </DropdownMenu>
        )
      }

      {
        status === "locked" && (
        <DropdownMenu>
          <DropdownItem disabled>Distribute</DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/view/`}>View Release</Link>
          </DropdownItem>
          <DropdownItem disabled>
            Edit Release Metadata
          </DropdownItem>
          <DropdownItem disabled>
            Edit Tracks
          </DropdownItem>
          {canAddTakedown && <DropdownItem disabled>Takedown</DropdownItem>}
        </DropdownMenu>
        )
      }
      
      {
        status === "unlocked" && (
        <DropdownMenu>
          <DropdownItem disabled>Distribute</DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/view/`}>View Release</Link>
          </DropdownItem>
          <DropdownItem onClick={() => setDistributeModals({isOpen: true, type: "release"})}>Edit Release Metadata</DropdownItem>
          <DropdownItem onClick={() => setDistributeModals({isOpen: true, type: "tracks"})}>Edit Tracks</DropdownItem>
          {canAddTakedown && <DropdownItem disabled>Takedown</DropdownItem>}
        </DropdownMenu>
        )
      }

      {
        status === "ready" && (
        <DropdownMenu>
          <DropdownItem onClick={() => setOpenDistribute(true)}>Distribute</DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/view/`}>View Release</Link>
          </DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/update/`}>Edit Release Metadata</Link>
          </DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/tracks`}>Edit Tracks</Link>
          </DropdownItem>
          {canAddTakedown && <DropdownItem disabled>Takedown</DropdownItem>}
        </DropdownMenu>
        )
      }
      {
        status === "approval" && (
        <DropdownMenu>
          <DropdownItem disabled>Distribute</DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/view/`}>View Release</Link>
          </DropdownItem>
          <DropdownItem disabled>
            Edit Release Metadata
          </DropdownItem>
          <DropdownItem disabled>
            Edit Tracks
          </DropdownItem>
          {canAddTakedown && <DropdownItem disabled>Takedown</DropdownItem>}
        </DropdownMenu>
        )
      }
      {
        status === "re_delivery-delivery" && (
        <DropdownMenu>
          <DropdownItem disabled>Distribute</DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/view/`}>View Release</Link>
          </DropdownItem>
          <DropdownItem disabled>
            Edit Release Metadata
          </DropdownItem>
          <DropdownItem disabled>
            Edit Tracks
          </DropdownItem>
          {canAddTakedown && <DropdownItem disabled>Takedown</DropdownItem>}
        </DropdownMenu>
        )
      }
      {
        status === "re_delivery-editing" && (
        <DropdownMenu>
          <DropdownItem disabled>Distribute</DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/view/`}>View Release</Link>
          </DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/update/`}>Edit Release Metadata</Link>
          </DropdownItem>
          <DropdownItem onClick={() => setOpenFinishEditing(true)}>Submit Editing</DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/tracks`}>Edit Tracks</Link>
          </DropdownItem>
          {canAddTakedown && <DropdownItem disabled>Takedown</DropdownItem>}
        </DropdownMenu>
        )
      }
      {
        status === "takedown_request" && (
        <DropdownMenu>
          <DropdownItem disabled>Distribute</DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/view/`}>View Release</Link>
          </DropdownItem>
          <DropdownItem disabled>
            Edit Release Metadata
          </DropdownItem>
          <DropdownItem disabled>
            Edit Tracks
          </DropdownItem>
          {canAddTakedown && <DropdownItem disabled>Takedown</DropdownItem>}
        </DropdownMenu>
        )
      }
      {
        status === "taken_down" && (
        <DropdownMenu>
          <DropdownItem disabled>Distribute</DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/view/`}>View Release</Link>
          </DropdownItem>
          <DropdownItem disabled>
            Edit Release Metadata
          </DropdownItem>
          <DropdownItem disabled>
            Edit Tracks
          </DropdownItem>
          {canAddTakedown && <DropdownItem disabled>Takedown</DropdownItem>}
        </DropdownMenu>
        )
      }
      {
        status === "offline" && (
        <DropdownMenu>
          <DropdownItem disabled>Distribute</DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/view/`}>View Release</Link>
          </DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/update/`}>Edit Release Metadata</Link>
          </DropdownItem>
          <DropdownItem>
            <Link to={`/releases/${id}/tracks`}>Edit Tracks</Link>
          </DropdownItem>
          {canAddTakedown && <DropdownItem disabled>Takedown</DropdownItem>}
        </DropdownMenu>
        )
      }
    </ButtonDropdown>


    <Modal isOpen={distributedModals.isOpen} centered={true}>
      <ModalHeader>Are you really sure you want to do edit metadata?</ModalHeader>
      <ModalBody>
        <p><b>This will change your metadata and can affect the release.</b></p>
        <p>Proceed only if you are completely sure.</p>
        <p><b>PLEASE DO NOT</b> edit metadata just for testing and exploring.</p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setDistributeModals({isOpen: false, type: null})}>
          Cancel
        </Button>
        <Button color="success">
          {
            distributedModals.type === 'tracks' ?
            <Link to={`/releases/${id}/tracks`}>I understand</Link>
            :
            <Link to={`/releases/${id}/update/`}>I understand</Link>
          }
        </Button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={openDistribute} centered={true}>
      <ModalHeader>Are you sure all information entered is valid and represents this release fully?</ModalHeader>
      <ModalBody>
        <p>After this action, your release will be checked and if the information is correct it will be distributed on the official and exclusive distribution dates.</p>
        <p>By confirming and accepting this form, you are fully accepting and complying with the <a href={todUrl} target="blank" rel="noopener noreferrer">Terms Of Distribution</a>, <a href={touUrl} target="blank" rel="noopener noreferrer">Terms Of Use</a> and <a href={ppUrl} target="blank" rel="noopener noreferrer">Privacy Policy</a>.</p>
        <p>By confirming and accepting this form, you are undisputedly confirming that submitted content release with belonging assets, audio files, and metadata, either belongs exclusively to you or it is fully licensed to your label.</p>
        <p>Hereby you fully accept that you will solely be responsible for any misleading information, unlicensed usage, illegal activity or any kind of dispute. </p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setOpenDistribute(false)}>
          Cancel
        </Button>
        <Button color="success" onClick={() => patchRelease(id, 'approval', setOpenDistribute(false))}>
        Confirm and Accept
        </Button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={openTakeDown} centered={true}>
      <ModalHeader>Are you sure you want to remove this release from all stores?</ModalHeader>
      <ModalBody>
      This action is irreversible.
      <p>By taking this release down, you are complying with the <a href={todUrl} target="blank" rel="noopener noreferrer">Terms Of Distribution</a>, <a href={touUrl} target="blank" rel="noopener noreferrer">Terms Of Use</a> and <a href={ppUrl} target="blank" rel="noopener noreferrer">Privacy Policy</a>.</p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setOpenTakeDown(false)}>
          Cancel
        </Button>
        <Button color="success" onClick={() => patchRelease(id, 'takedown_request', setOpenTakeDown(false))}>
          Confirm and Accept
        </Button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={openFinishEditing} centered={true}>
      <ModalHeader>Are you sure all information entered is valid and represents this release fully?</ModalHeader>
      <ModalBody>
      <p>After this action, your release will be checked and if the information is correct it will be re-distributed to the DSP partners. <b>NOTE, only METADATA will be sent to DSP-s, content such as IMAGE and AUDIO files can not be updated this way.</b></p><p> By confirming and accepting this form, you are fully accepting and complying with the <Link to={"/terms-and-conditions"} target="_blank">Terms Of Use</Link> and Terms of our Exclusive Distribution Agreement.</p><p> By confirming and accepting this form, you are fully accepting and complying with the <Link to={"/privacy-policy"} target="_blank">Privacy Policy</Link>.</p><p>By confirming and accepting this form, you are undisputedly confirming that submitted content release with belonging assets, audio files, and metadata, either belongs exclusively to you or it is fully licensed to your label.</p><p>Hereby you fully accept that you will solely be responsible for any misleading information, unlicensed usage, illegal activity or any kind of dispute. </p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={() => setOpenFinishEditing(false)}>
          Cancel
        </Button>
        <Button color="success" onClick={() => patchRelease(id, 're_delivery-delivery', setOpenTakeDown(false))}>
        Confirm and Accept
        </Button>
      </ModalFooter>
    </Modal>

    </>
  );
};

export default ReleaseDropdown;
