import React, { useState } from 'react';
import Select from 'react-select'
import { Badge, FormGroup, Label, Button, Col, FormText, Input, Row, Modal, ModalHeader, ModalBody, ModalFooter, Alert } from "reactstrap";
import AddNewArtistModal from "./AddNewArtistModal";
import AsyncDropdownFeedback from "../../components/asyncDropdownFeedback";
import './row.css';
import { getCookie } from "../../jwt/_helpers/cookie";

const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const arrowStyleWrap = {
  display: 'flex'
}
const arrowStyle = {
  padding: 3,
  cursor: 'pointer'
}

const artistType = [
  { value: 'main', label: 'Main Artist' },
  { value: 'featuring', label: 'Featuring Artist' },
]

const artistTypeFeaturingOnly = [
  { value: 'main', label: 'Main Artist', isDisabled: true },
  { value: 'featuring', label: 'Featuring Artist' },
]

const artistTypeUpdate = [
  { value: 'main', label: 'Main Artist', isDisabled: false },
  { value: 'featuring', label: 'Featuring Artist', isDisabled: false },
  { value: 'remixer', label: 'Remixer', isDisabled: false },
]

const artistTypeUpdateDisabled = [
  { value: 'main', label: 'Main Artist', isDisabled: false },
  { value: 'featuring', label: 'Featuring Artist', isDisabled: false },
  { value: 'remixer', label: 'Remixer', isDisabled: true },
]

const openInNewTab = url => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const RowSelect = ({ values }) => {
  const [featuringModal, featuringModalSET] = useState(false);
  const [featuringModalData, featuringModalDataSET] = useState(false);
  const [artistNameFieldTouched, artistNameFieldTouchedSET] = useState(false);
  const [artistTypeFieldTouched, artistTypeFieldTouchedSET] = useState(false);

  const tokenAPI = getCookie("token");
  const options = {
    'method': 'GET',
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${tokenAPI}`,
      "x-api-key": X_API_KEY,
      'Content-Type': 'application/json'
    }
  }


  const { artist, removeArtist, index, manageArtistData, trackOrderChange, listOfArtists, listOfArtistsSET, editTracks, remix, blockedValeues, subUserEndpoint, parentUserOnly, mainArtistsCount, disabledAtCount, revalidateField } = values;
  const key = artist.key;

  const borderColor = artistTypeFieldTouched
  ? (artist.type ? "#2dce89" : "#f62d51") 
  : "#e9ecef";

  return (
    <>
    <div className="artistWrap" style={{flexDirection: "column"}}>
      <div className="artistWrap" style={{margin: "0", alignItems: 'flex-start'}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div style={arrowStyle} onClick={() => trackOrderChange('up', key, index, artist.order, listOfArtists, listOfArtistsSET)}>▲</div>
          <div style={arrowStyle} onClick={() => trackOrderChange('down', key, index, artist.order, listOfArtists, listOfArtistsSET)}>▼</div>
        </Col>
        <Col xs="3">
          <AsyncDropdownFeedback
            fetchOptions={options}
            endpoint={`artists`}
            subUserEndpoint={subUserEndpoint}
            parentUserOnly={parentUserOnly}
            labelField={"name"}
            value={artist.name}
            isFieldValid={artist.name?true:false}
            revalidateField={revalidateField}
            fieldName={`artist[${index}].name`}
            fieldTouched={artistNameFieldTouched}
            setFieldTouched={artistNameFieldTouchedSET}
            onChange={selectedOption => {
              manageArtistData(index, 'name', selectedOption);
              revalidateField(`artist[${index}].name`)
              revalidateField("duplicateArtists")
              if (blockedValeues !== null && blockedValeues.blockedSubmit) {
                blockedValeues.setBlockedSubmit(false);
              }
            }}
            placeholder="Select Artist..."
          />
          <input className="hiddenInput" type="text" id={`artist[${index}].name`} name={`artist[${index}].name`} value={artist.name} readOnly/>
        </Col>
        <Col xs="3">
          <Select
            components={{ IndicatorSeparator:() => null }}
            options={editTracks ? (remix ? artistTypeUpdate : artistTypeUpdateDisabled) : (mainArtistsCount < disabledAtCount ? artistType : artistTypeFeaturingOnly)}
            value={artist.type}
            onChange={(e) => {
              if (editTracks && e.value === 'featuring') {
                featuringModalSET(true);
                featuringModalDataSET({index: index, type: 'type', obj: e});
                return;
              }
              if (blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
              manageArtistData(index, 'type', e)
              revalidateField(`artist[${index}].type`)
              revalidateField("atleastOneMainArtist")
            }}
            onFocus={() => {
              artistTypeFieldTouchedSET(true)
              revalidateField(`artist[${index}].type`)
            }}
            onMouseEnter={() => {
              artistTypeFieldTouchedSET(true)
              revalidateField(`artist[${index}].type`)
            }}
            styles={{
              menu: styles => ({ ...styles, zIndex: 10 }),
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: artistTypeFieldTouched ? borderColor : baseStyles.borderColor,
                boxShadow: state.isFocused || state.isHovered 
                  ? (artist.type ? "0 0 0 0.2rem rgba(45, 206, 137, 0.25)" : "0 0 0 0.2rem rgba(246, 45, 81, 0.25)") 
                  : "0 0 0 1px #e9ecef",
                borderRadius: "2px",
              }),
            }}
            className="artistType"
            id={`artist[${index}].type`}
            name={`artist[${index}].type`}
          />
        </Col>
        <Col xs="2">
          <Button color={'danger'} onClick={() => {
            removeArtist(index);
            if (blockedValeues !== null && blockedValeues.blockedSubmit){
              blockedValeues.setBlockedSubmit(false);
            }
          }}>Remove </Button>
        </Col>
      </div>
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="1"></Col>
        <Col xs="3">
          <div className="fv-help-block" style={{ display: 'none'}} id={"err_name_" + key}>Please select artist</div>
        </Col>
        <Col xs="3">
          <div className="fv-help-block" style={{ display: 'none'}} id={"err_type_" + key}>Please select type of artist</div>
        </Col>
      </div>
    </div>
    <Modal isOpen={featuringModal} centered={true}>
        <ModalHeader>A​re you sure you want to assign this artist as a Featuring Artist?</ModalHeader>
        <ModalBody>Please do not confuse Featuring Artist with a Remixer. Featuring Artist should only be added if you are confident and sure that this artist is not the Main Artist or Remixer.</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => featuringModalSET(false)}>
            Cancel
          </Button>
          <Button color="success" onClick={() => {
            manageArtistData(featuringModalData.index, featuringModalData.type, featuringModalData.obj);
            featuringModalSET(false);
            revalidateField(`artist[${index}].type`)
            revalidateField("atleastOneMainArtist")
          }}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

const RowLabel = () => {
  return (
    <Row className="artistWrap labelRow">
      <Col xs="1">
        Order
      </Col>
      <Col xs="3">
        Artist name <Badge color="primary">Required</Badge>
      </Col>
      <Col xs="3">
        Artist type <Badge color="primary">Required</Badge>
      </Col>
      <Col xs="2">
      </Col>
      <Col xs="1">
      </Col>
      <Col xs="1">

      </Col>
    </Row>
  )
}

const RowSelectDisabled = ({ data, name }) => {

  let type;
  if (data.kind === 'main') {
    type = 'Main Artist';
  } else if (data.kind === 'featuring') {
    type = 'Featuring Artist';
  } else {
    type = data.kind;
  }
  return (
    <div className="artistWrap" style={{flexDirection: "column"}}> 
      <div className="artistWrap" style={{margin: "0", alignItems: 'flex-start'}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div style={arrowStyle}>▲</div>
          <div style={arrowStyle}>▼</div>
        </Col>
        <Col xs="2">
          <Input
            type="text"
            value={name ? name : ''}
            onChange={(e) => false}
            disabled={true}
          />
          
        </Col>
        <Col xs="2">
        <Input
            type="text"
            value={type}
            onChange={(e) => false}
            disabled={true}
          />
        </Col>
        <Col xs="2">
          <Button color={'danger'} disabled={true}>Remove</Button>
        </Col>
      </div>
    </div>
  )
}

const ArtistRow = ({ values, disabled = false, dataView = null, disabledAtCount = 4, editTracks = false, blockedValeues = null }) => {
  const { setNewArtist, listOfArtists, removeArtist, addNewArtist, manageArtistData, trackOrderChange, listOfArtistsSET, remix = false, subUserId, subUserEndpoint, parentUserOnly, revalidateField } = values;

  let mainArtistsCount = listOfArtists.filter(artist => artist.type && artist.type.value === "main").length;
  let artistNameCounts = listOfArtists.reduce((acc, artist) => (artist.name && artist.name.label ? (acc[artist.name.label] = (acc[artist.name.label] || 0) + 1, acc) : acc), {});
  let hasDuplicates = Object.values(artistNameCounts).some(count => count > 1);

  const [modal, setModal] = useState(false);

  return (
    <>
      <FormGroup>
        <Label>Artists</Label>
        <Row>
          <RowLabel />
        </Row>
        <Row>
          {
            !disabled ? listOfArtists.map((artist, index) => {
              const itemVal = { index, artist, removeArtist, manageArtistData, trackOrderChange, listOfArtists, listOfArtistsSET, editTracks, remix, blockedValeues, subUserEndpoint, parentUserOnly, mainArtistsCount, disabledAtCount, revalidateField }
              return (
                <RowSelect values={itemVal} key={artist.key} />
              );
            })
            :
            dataView.map(artist => {
              
              return <RowSelectDisabled  data={artist} name={artist.artist.name} key={artist.id + artist.artist + artist.kind} />
            })
          }

        </Row>
        <Row style={{width: '100%', display: 'flex'}}>
          <FormGroup>
            <input className="hiddenInput" type="text" id="atleastOneMainArtist" name="atleastOneMainArtist" value={mainArtistsCount>0? "yes": ""} readOnly/>
          </FormGroup>
        </Row>
        <Row style={{width: '100%', display: 'flex'}}>
          <FormGroup>
            <input className="hiddenInput" type="text" id="duplicateArtists" name="duplicateArtists" value={!hasDuplicates? "yes": ""} readOnly/>
          </FormGroup>
        </Row>
        {
          !editTracks && <FormText color="muted">If the release is written by more than <b>4 Main Artists</b> please use <b>Various Artists</b>. Track artists, remixers and contributors should be added in Track Edit step.</FormText>
        }
        {
          !disabled && (
            <div className="mt-2">
              <Button id="addArtistBtn" disabled={mainArtistsCount > disabledAtCount ? true : false} color="primary" onClick={() => addNewArtist([...listOfArtists, { name: "", type: "", order: listOfArtists.length + 1, key: makeid(20) }])}>Add another</Button>{' '}
              <Button color="success" onClick={() => openInNewTab("/artists") }>Create new?</Button>
            </div>
          )
        }
       
      </FormGroup>
      {modal && <AddNewArtistModal toggleModal={setModal} modal={modal} setNewArtist={setNewArtist} subUserId={subUserId} subUserEndpoint={subUserEndpoint} parentUserOnly={parentUserOnly} />}
    </>
  );
};

export default ArtistRow;