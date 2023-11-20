import React, { useState } from 'react';
import { FormGroup, Label, Button, Col, Input, Row } from "reactstrap";
import AddNewCostTypeModal from "./AddNewCostTypeModal";
import AsyncDropdownFeedback from '../../components/asyncDropdownFeedback';
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

  const { cost, removeCost, index, manageCostsData, trackOrderChange, listOfCosts, listOfCostsSET, blockedValeues, subUserEndpoint, parentUserOnly, revalidateField } = values;
  const key = cost.key;

  const [costTypeFieldTouched, costTypeFieldTouchedSET] = useState(false);

  return (
    <>
    <div className="artistWrap" style={{flexDirection: "column"}}>
    <div className="artistWrap" style={{margin: "0", alignItems: 'flex-start'}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div style={arrowStyle} onClick={() => trackOrderChange('up', key, index, cost.order, listOfCosts, listOfCostsSET)}>▲</div>
          <div style={arrowStyle} onClick={() => trackOrderChange('down', key, index, cost.order, listOfCosts, listOfCostsSET)}>▼</div>
        </Col>
        <Col xs="3">
          <AsyncDropdownFeedback
            fetchOptions={options}
            endpoint={`track-costs`}
            subUserEndpoint={subUserEndpoint}
            parentUserOnly={parentUserOnly}
            labelField={"name"}
            value={cost.cost_type}
            isFieldValid={true}
            showValidFeedback={false}
            revalidateField={revalidateField}
            fieldName={`cost[${index}].type`}
            fieldTouched={costTypeFieldTouched}
            setFieldTouched={costTypeFieldTouchedSET}
            onChange={selectedOption => {
              manageCostsData(index, 'cost_type', selectedOption);  
              if (blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
            }}
            placeholder="Select Cost Type..."
          />
        </Col>
        <Col xs="3">
          <Input
            defaultValue={cost.cost}
            type="number"
            placeholder="i.e. -7.5"
            onBlur={(e) => {
              manageCostsData(index, 'cost', e.target.value);
            }}
            className="artistType"
          />
        </Col>
        <Col xs="2">
          <Button color={'danger'} onClick={() => {
            removeCost(index);
            if (blockedValeues !== null && blockedValeues.blockedSubmit){
              blockedValeues.setBlockedSubmit(false);
            }
          }}>Remove </Button>
        </Col>
      </div>
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="1"></Col>
        <Col xs="3">
          <div className="fv-help-block" style={{ display: 'none'}} id={"err_cost_type_" + key}>Please select cost type</div>
        </Col>
        <Col xs="3">
          <div className="fv-help-block" style={{ display: 'none'}} id={"err_cost_" + key}>Please enter a negative value i.e. -10.0</div>
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
        Cost type
      </Col>
      <Col xs="3">
        Cost (€)
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

const RowSelectDisabled = ({ data, cost_type, cost }) => {

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
            value={cost_type ? cost_type : ''}
            onChange={(e) => false}
            disabled={true}
          />
          
        </Col>
        <Col xs="2">
        <Input
            type="text"
            value={cost ? cost : ''}
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

const CostRow = ({ values, disabled = false, dataView = null, disabledAtCount = 3, editTracks = false, blockedValeues = null }) => {
  const { 
    setNewCostType, 
    listOfCosts, 
    removeCost, 
    addNewCost, 
    manageCostsData, 
    trackOrderChange, 
    listOfCostsSET, 
    remix = false,
    subUserId, 
    subUserEndpoint, 
    parentUserOnly,
    revalidateField,
  } = values;

  const [modal, setModal] = useState(false);

  let key = Math.random().toString(36).substring(1);

  if(!dataView && disabled)
  {
    dataView = listOfCosts;
  }

  return (
    <>
      <FormGroup>
        <Label>Costs</Label>
        <Row>
          <RowLabel />
        </Row>
        <Row>
          {
            !disabled ? listOfCosts.map((cost, index) => {
              const itemVal = { index, cost, removeCost, manageCostsData, trackOrderChange, listOfCosts, listOfCostsSET, editTracks, remix, blockedValeues, subUserEndpoint, parentUserOnly, revalidateField };
              return (
                <RowSelect values={itemVal} key={cost.key} />
              );
            })
            :
            dataView.map(cost => {
              return <RowSelectDisabled  data={cost} name={cost.cost_type.name} split={cost.cost} key={cost.id + cost.cost_type.name } />
            })
          }

        </Row>
        {
          !disabled && (
            <div>
            <Button disabled={listOfCosts.length === disabledAtCount ? true : false} color="primary" onClick={() => addNewCost([...listOfCosts, { cost_type: {name: "", value: ""}, cost: "0.0", order: listOfCosts.length + 1, key: makeid(20) }])}>Add another</Button>{' '}
            <Button color="success" onClick={() => setModal(true)}>Create new?</Button>
          </div>
          )
        }
       
      </FormGroup>
      {modal && <AddNewCostTypeModal toggleModal={setModal} modal={modal} setNewCostType={setNewCostType} subUserId={subUserId} subUserEndpoint={subUserEndpoint} parentUserOnly={parentUserOnly} />}
    </>
  );
};

export default CostRow;