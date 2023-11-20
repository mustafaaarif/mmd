import React, { useState } from "react";
import Select from 'react-select'
import { FormGroup, Label, Button, Col, Input, Row } from "reactstrap";
import AddNewShareholderModal from "./AddNewShareholderModal";
import AsyncDropdownFeedback from "../../components/asyncDropdownFeedback";
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

const hideErrorShareholders = () => {
  document.getElementById(`err_share_sum`).style.display = 'none';
}

const RowSelect = ({ values }) => {

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

  const { shareholder, removeShareholder, index, manageShareholdersData, trackOrderChange, listOfShareholders, listOfShareholdersSET, blockedValeues, shareholder_roles_ops, subUserEndpoint, parentUserOnly, revalidateField } = values;
  const key = shareholder.key;

  const [shareholderNameFieldTouched, shareholderNameFieldTouchedSET] = useState(false);

  return (
    <>
    <div className="artistWrap" style={{flexDirection: "column"}}>
    <div className="artistWrap" style={{margin: "0", alignItems: 'flex-start'}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div style={arrowStyle} onClick={() => trackOrderChange('up', key, index, shareholder.order, listOfShareholders, listOfShareholdersSET)}>▲</div>
          <div style={arrowStyle} onClick={() => trackOrderChange('down', key, index, shareholder.order, listOfShareholders, listOfShareholdersSET)}>▼</div>
        </Col>
        <Col xs="3">
          <AsyncDropdownFeedback
            fetchOptions={options}
            endpoint={`shareholders`}
            subUserEndpoint={subUserEndpoint}
            parentUserOnly={parentUserOnly}
            labelField={"name"}
            value={shareholder.shareholder}
            isFieldValid={true}
            showValidFeedback={false}
            revalidateField={revalidateField}
            fieldName={`shareholder[${index}].name`}
            fieldTouched={shareholderNameFieldTouched}
            setFieldTouched={shareholderNameFieldTouchedSET}
            onChange={selectedOption => {
              manageShareholdersData(index, 'shareholder', selectedOption);
              if (blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
            }}
            placeholder="Select Shareholder..."
          />
        </Col>
        <Col xs="3">
          <Input
            defaultValue={shareholder.split}
            type="number"
            onBlur={(e) => {
              hideErrorShareholders();
              manageShareholdersData(index, 'split', e.target.value);
            }}
            min="1"
            max="100"
            step="0.01"
            placeholder="i.e. 50"
            className="artistType"
          />
        </Col>
        <Col xs="3">
          <Select
            closeMenuOnSelect={false}
            isMulti
            options={shareholder_roles_ops}
            defaultValue={shareholder.roles}
            className="artistType"
            onChange={(e) => {
              manageShareholdersData(index, 'roles', e);
            }}
          />
        </Col>
        <Col xs="2">
          <Button color={'danger'} onClick={() => {
            removeShareholder(index);
            if (blockedValeues !== null && blockedValeues.blockedSubmit){
              blockedValeues.setBlockedSubmit(false);
            }
          }}>Remove </Button>
        </Col>
      </div>
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="1"></Col>
        <Col xs="3">
          <div className="fv-help-block" style={{ display: 'none'}} id={"err_name_" + key}>Please select shareholder</div>
        </Col>
        <Col xs="3">
          <div className="fv-help-block" style={{ display: 'none'}} id={"err_split_" + key}>Please enter a valid value (1-100)</div>
        </Col>
        <Col xs="3">
          <div className="fv-help-block" style={{ display: 'none'}} id={"err_roles_" + key}>Please select atleast one role</div>
        </Col>
      </div>
    </div>
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
        Shareholder Name
      </Col>
      <Col xs="3">
        Shareholder Split (%)
      </Col>
      <Col xs="3">
        Shareholder Roles
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

const RowSelectDisabled = ({ data, name, split, roles }) => {

  return (
    <div className="artistWrap" style={{flexDirection: "column"}}> 
      <div className="artistWrap" style={{margin: "0"}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div style={arrowStyle}>▲</div>
          <div style={arrowStyle}>▼</div>
        </Col>
        <Col xs="3">
          <Input
            type="text"
            value={name ? name : ''}
            onChange={(e) => false}
            disabled={true}
          />
          
        </Col>
        <Col xs="3">
          <Input
              type="text"
              value={split}
              onChange={(e) => false}
              disabled={true}
            />
        </Col>
        <Col xs="3">
          <Select
            closeMenuOnSelect={false}
            isMulti
            defaultValue={roles}
            onChange={(e) => false}
            className="artistType"
            isDisabled
          />
        </Col>
        <Col xs="2">
          <Button color={'danger'} disabled={true}>Remove</Button>
        </Col>
      </div>
    </div>
  )
}

const ShareholdersRow = ({ values, disabled = false, dataView = null, disabledAtCount = 3, editTracks = false, blockedValeues = null }) => {
  const { 
    setNewShareholder, 
    listOfShareholders, 
    removeShareholder, 
    addNewShareholder, 
    manageShareholdersData, 
    trackOrderChange, 
    listOfShareholdersSET, 
    remix = false, 
    shareholder_roles_ops, 
    subUserId, 
    subUserEndpoint, 
    parentUserOnly,
    revalidateField,
  } = values;

  const [modal, setModal] = useState(false);

  let key = Math.random().toString(36).substring(1);

  if(!dataView && disabled)
  {
    dataView = listOfShareholders;
  }

  return (
    <>
      <FormGroup>
        <Label>Shareholders</Label>
        <Row>
          <RowLabel />
        </Row>
        <Row>
          {
            !disabled ? listOfShareholders.map((shareholder, index) => {
              const itemVal = { index, shareholder, removeShareholder, manageShareholdersData, trackOrderChange, listOfShareholders, listOfShareholdersSET, editTracks, remix, blockedValeues, shareholder_roles_ops, subUserEndpoint, parentUserOnly, revalidateField }
              return (
                <RowSelect values={itemVal} key={shareholder.key} />
              );
            }):dataView.map(shareholder => {
              return <RowSelectDisabled  data={shareholder} name={shareholder.shareholder.label} split={shareholder.split} roles={shareholder.roles} key={shareholder.id + shareholder.shareholder } />
            })
          }

        </Row>

        <div style={{width: '100%', paddingBottom: 20}}>
          <div className="fv-help-block" style={{ display: 'none'}} id={"err_share_sum"}>Label Share and Shareholder Splits should add up to 100%</div>
        </div>

        {
          !disabled && (
            <div>
            <Button disabled={listOfShareholders.length === disabledAtCount ? true : false} color="primary" onClick={() => addNewShareholder([...listOfShareholders, { shareholder: {name: "", value: ""}, split: "0.0", order: listOfShareholders.length + 1, key: makeid(20) }])}>Add another</Button>{' '}
            <Button color="success" onClick={() => setModal(true)}>Create new?</Button>
          </div>
          )
        }
       
      </FormGroup>
      {modal && <AddNewShareholderModal toggleModal={setModal} modal={modal} setNewShareholder={setNewShareholder} subUserId={subUserId} subUserEndpoint={subUserEndpoint} parentUserOnly={parentUserOnly} />}
    </>
  );
};

export default ShareholdersRow;