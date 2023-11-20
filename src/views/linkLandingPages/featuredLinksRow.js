import React from 'react';
import { FormGroup, Label, Input, Row, Col, Button } from "reactstrap";
import './featuredLinksRow.css'

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
  const { featured_link, index,  manageFeaturedLinksData, listOfFeaturedLinks, listOfFeaturedLinksSET, linkOrderChange, removeFeaturedLink, blockedValeues, disabled } = values;
  const key = featured_link.key;

  return (
    <div className="artistWrap" style={{flexDirection: "column"}}>
      <div className="artistWrap" style={{margin: "0"}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div style={arrowStyle} onClick={() => linkOrderChange('up', key, index, featured_link.order, listOfFeaturedLinks, listOfFeaturedLinksSET)}>▲</div>
          <div style={arrowStyle} onClick={() => linkOrderChange('down', key, index, featured_link.order, listOfFeaturedLinks, listOfFeaturedLinksSET)}>▼</div>
        </Col>
        <Col xs="4">
          <Input
            type="text"
            className="form-control"
            name={`featured_link[${index}].title`}
            value={featured_link.title}
            disabled={disabled}
            onChange={(e) => {
              if (blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
              manageFeaturedLinksData(index, 'title', e.target.value);
            }}
            placeholder={`i.e. Label # ${featured_link.order + 1}`}
          />
        </Col>
        <Col xs="4">
            <Input
                type="text"
                className="form-control"
                name={`featured_link[${index}].destination_url`}
                value={featured_link.destination_url}
                disabled={disabled}
                onChange={(e) => {
                  if (blockedValeues !== null && blockedValeues.blockedSubmit) {
                    blockedValeues.setBlockedSubmit(false);
                  }
                  manageFeaturedLinksData(index, 'destination_url', e.target.value);
                }}
                placeholder=""
            />
        </Col>
        <Col xs="2">
          {
            !disabled &&
            <Button color={'danger'} onClick={() => {
              removeFeaturedLink(index);
              if (blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
            }}>Remove</Button>
          }
        </Col>
      </div>

      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="1"></Col>
        <Col xs="4"></Col>
        <Col xs="4"></Col>
        <Col xs="2"></Col>
      </div>
      
      <div style={{width: '100%', display: 'flex'}}>
        <Col xs="1"></Col>
        <Col xs="4"></Col>
        <Col xs="4"></Col>
        <Col xs="2"></Col>
      </div>
    </div>
  )
}


const RowLabel = () => {
  return (
    <Row className="artistWrap labelRow">
      <Col xs="1">
        Order
      </Col>
      <Col xs="4">
        Label
      </Col>
      <Col xs="4">
        Destination Url
      </Col>
      <Col xs="2">
      </Col>
    </Row>
  )
}


const FeaturedLinksRow = ({ values, disabled = false, dataView = null, blockedValeues = null }) => {
  const { listOfFeaturedLinks, manageFeaturedLinksData, listOfFeaturedLinksSET, linkOrderChange, addNewFeaturedLink, removeFeaturedLink } = values;
  return (
    <>
      <FormGroup style={{ paddingBottom: 30 }}>
      <Label><b>Featured Links</b></Label>
        <Row>
          <RowLabel />
          {
            listOfFeaturedLinks.map((featured_link, index) => {
              const itemVal = { index, featured_link, manageFeaturedLinksData, listOfFeaturedLinks, listOfFeaturedLinksSET, linkOrderChange, removeFeaturedLink, blockedValeues, disabled }
              return <RowSelect values={itemVal} key={featured_link.key} />
            })
          }
        </Row>
        
        {
          !disabled && <Button disabled={listOfFeaturedLinks.length === 10 ? true : false} color="primary" onClick={() => addNewFeaturedLink([...listOfFeaturedLinks, { order: listOfFeaturedLinks.length, title: "", destination_url: "", key: makeid(20) }])}>Add another</Button>
        }
        {' '}
      </FormGroup>
    </>
  );
};

export default FeaturedLinksRow;
