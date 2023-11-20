import React, { useState } from 'react';
import Select from 'react-select';
import AsyncDropdownFeedback from '../../components/asyncDropdownFeedback';
import { Badge, FormGroup, Label, Button, Col, Input, Row } from "reactstrap";
import AddNewContributorsModal from "./AddNewContributorsModal";
import '../releases/row.css';

import { getCookie } from "../../jwt/_helpers/cookie";

const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const arrowStyleWrap = {
  display: 'flex'
}
const arrowStyle = {
  padding: 3,
  cursor: 'pointer'
}

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
  const { artist, removeContributor, index, manageContributorsData, trackOrderChange, listOfContributors,  listOfContributorsSET, contributorType, subUserEndpoint, parentUserOnly, revalidateField } = values;
  const key = artist.key;

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

  const [contributorNameFieldTouched, contributorNameFieldTouchedSET] = useState(false);
  const [contributorRoleFieldTouched, contributorRoleFieldTouchedSET] = useState(false);

  const borderColor = contributorRoleFieldTouched
  ? (artist.type ? "#2dce89" : "#f62d51") 
  : "#e9ecef";
  

  return (
    <div className="artistWrap" style={{flexDirection: "column"}}> 
      <div className="artistWrap" style={{margin: "0", alignItems: 'flex-start'}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div style={arrowStyle} onClick={() => trackOrderChange('up', key, index, artist.order,  listOfContributors,  listOfContributorsSET)}>▲</div>
          <div style={arrowStyle} onClick={() => trackOrderChange('down', key, index, artist.order,  listOfContributors,  listOfContributorsSET)}>▼</div>
        </Col>
        <Col xs="3">
          <AsyncDropdownFeedback
            fetchOptions={options}
            endpoint={`contributors`}
            subUserEndpoint={subUserEndpoint}
            parentUserOnly={parentUserOnly}
            labelField={"name"}
            value={artist.name}
            isFieldValid={artist.name?true:false}
            revalidateField={revalidateField}
            fieldName={`contributor[${index}].name`}
            fieldTouched={contributorNameFieldTouched}
            setFieldTouched={contributorNameFieldTouchedSET}
            onChange={selectedOption => {
              manageContributorsData(index, 'name', selectedOption);
              revalidateField(`contributor[${index}].name`)
            }}
            placeholder="Select Contributor..."
          />
          <input className="hiddenInput" type="text" id={`contributor[${index}].name`} name={`contributor[${index}].name`} value={artist.name} readOnly/>
        </Col>
        <Col xs="3">
          <Select
            components={{ IndicatorSeparator:() => null }}
            options={contributorType}
            value={artist.type}
            onChange={(e) => {
              manageContributorsData(index, 'type', e);
              revalidateField(`contributor[${index}].role`)
              revalidateField("atleastOneLyricist")
              revalidateField("atleastOneComposer")
            }}
            onFocus={() => {
              contributorRoleFieldTouchedSET(true)
              revalidateField(`contributor[${index}].role`)
              revalidateField("atleastOneLyricist")
              revalidateField("atleastOneComposer")
            }}
            styles={{
              menu: styles => ({ ...styles, zIndex: 10 }),
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: contributorRoleFieldTouched ? borderColor : baseStyles.borderColor,
                boxShadow: state.isFocused || state.isHovered 
                  ? (artist.type ? "0 0 0 0.2rem rgba(45, 206, 137, 0.25)" : "0 0 0 0.2rem rgba(246, 45, 81, 0.25)") 
                  : "0 0 0 1px #e9ecef",
                borderRadius: "2px",
              }),
            }}
            className="artistType"
            id={`contributor[${index}].role`}
            name={`contributor[${index}].role`}
          />
        </Col>
        <Col xs="2">
          <Button color={'danger'} onClick={() => removeContributor(index)}>Remove </Button>
        </Col>
      </div>
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="1"></Col>
        <Col xs="3"></Col>
        <Col xs="3"></Col>
      </div>
    </div>
  )
}


const RowSelectDisabled = ({ data, name }) => {

  let type = data.kind
  // if (data.kind === 'main') {
  //   type = 'Main Artist';
  // } else if (data.kind === 'featuring') {
  //   type = 'Featuring Artist';
  // } else {
  //   type = data.kind;
  // }
  return (
    <div className="artistWrap" style={{flexDirection: "column"}}> 
      <div className="artistWrap" style={{margin: "0"}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div style={arrowStyle}>▲</div>
          <div style={arrowStyle}>▼</div>
        </Col>
        <Col xs="2">
          <Input
            type="text"
            value={name ? name.label : ''}
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
          <Button color={'danger'} disabled={true}>Remove </Button>
        </Col>
      </div>
    </div>
  )
}

const ContributorLabel = () => {
  return (
    <Row className="artistWrap labelRow">
      <Col xs="1">
        Order
      </Col>
      <Col xs="3">
        Contributor full name <Badge color="primary">Required</Badge>
      </Col>
      <Col xs="3">
        Contributor role <Badge color="primary">Required</Badge>
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

const ContributorsRow = ({ values, disabled = false, dataView = null, disabledAtCount = 3, editTracks = false, contributorType }) => {
  const { optionsContributors, setNewContributor,  listOfContributors, removeContributor, addNewContributor, manageContributorsData, trackOrderChange,  listOfContributorsSET, subUserId, subUserEndpoint, parentUserOnly, selectedVocals, revalidateField } = values;

  const [modal, setModal] = useState(false);

  const composersCount = listOfContributors.filter(i => i.type !== '' && i.type.label === 'Composer').length;
  const lyricistCount = listOfContributors.filter(i => i.type !== '' && i.type.label === 'Lyricist').length;
  const atleaseOneComposerPresent = composersCount>0;
  const atleaseOneLyricistPresent = lyricistCount>0;
  const vocalType = selectedVocals? selectedVocals.value.toUpperCase(): "";
  const trackHasVocals = vocalType !== "" && vocalType !== "ZXX";
  const atleaseOneLyricistNeeded = lyricistCount === 0 &&  trackHasVocals;

  return (
    <>
      <FormGroup>
        <Label>Contributors</Label>
        <div>
          <ContributorLabel />
        </div>
        <div>
          {
            !disabled ?  listOfContributors.map((artist, index) => {
              const itemVal = { optionsContributors, index, artist, removeContributor, manageContributorsData, trackOrderChange,  listOfContributors,  listOfContributorsSET, editTracks, contributorType, subUserEndpoint, parentUserOnly, revalidateField }
              return (
                <RowSelect values={itemVal} key={artist.key} />
              );
            })
            :
            dataView.map(artist => {
              const name =  optionsContributors.filter( i => i.value === artist.artist)[0];
              
              return <RowSelectDisabled  data={artist} name={name} key={artist.id + artist.artist + artist.kind} />
            })
          }

        </div>
        <Row style={{width: '100%', display: 'flex', paddingBottom: 5}}>
          <FormGroup>
            <input className="hiddenInput" type="text" id="atleastOneComposer" name="atleastOneComposer" value={atleaseOneComposerPresent? "yes": ""} readOnly/>
          </FormGroup>
        </Row>
        <Row style={{width: '100%', display: 'flex', paddingBottom: 20}}>
          <FormGroup>
            <input className="hiddenInput" type="text" id="atleastOneLyricist" name="atleastOneLyricist" value={(atleaseOneLyricistNeeded && !atleaseOneLyricistPresent)? "": "yes"} readOnly/>
          </FormGroup>
        </Row>

        {
          !disabled && (
            <div>
            <Button id="addContributorBtn" color="primary" onClick={() => addNewContributor([... listOfContributors, { name: "", type: "", order:  listOfContributors.length + 1, key: makeid(20) }])}>Add another</Button>{' '}
            <Button color="success" onClick={() => setModal(true)}>Create new?</Button>
          </div>
          )
        }
       
      </FormGroup>
      {modal && <AddNewContributorsModal toggleModal={setModal} modal={modal} setNewContributor={setNewContributor} subUserId={subUserId} subUserEndpoint={subUserEndpoint} parentUserOnly={parentUserOnly} />}
    </>
  );
};

export default ContributorsRow;