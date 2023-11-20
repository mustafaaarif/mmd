import React from 'react';
import Select from 'react-select';
import { FormGroup, Label, Input, Row, Col, Button } from "reactstrap";
import './socialLinksRow.css'

const platformOptions = [
  { value: "instagram", label: "Instagram"},
  { value: "facebook", label: "Facebook"},
  { value: "twitter", label: "Twitter"},
  { value: "linkedin", label: "LinkedIn"},
  { value: "tiktok", label: "TikTok"},
  { value: "youtube", label: "YouTube"},
];

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
  const { social_link, index,  manageSocialLinksData, listOfSocialLinks, listOfSocialLinksSET, linkOrderChange, removeSocialLink, blockedValeues, disabled } = values;
  const key = social_link.key;
  const platform = social_link.platform.value;

  return (
    <div className="artistWrap" style={{flexDirection: "column"}}>
      <div className="artistWrap" style={{margin: "0"}}>
      <Col xs="1" style={arrowStyleWrap}>
        <div style={arrowStyle} onClick={() => linkOrderChange('up', key, index, social_link.order, listOfSocialLinks, listOfSocialLinksSET)}>▲</div>
        <div style={arrowStyle} onClick={() => linkOrderChange('down', key, index, social_link.order, listOfSocialLinks, listOfSocialLinksSET)}>▼</div>
      </Col>
       <Col xs="4">
          <Select
            components={{ IndicatorSeparator:() => null }}
            options={platformOptions}
            value={social_link.platform}
            onChange={(e) => {
              if (blockedValeues !== null && blockedValeues.blockedSubmit){
                blockedValeues.setBlockedSubmit(false);
              }
              manageSocialLinksData(index, 'platform', e)
            }}
            className="platform"
          />
        </Col>
        <Col xs="4">
          <Input
              type="text"
              name={`social_link[${index}].destination_url_${platform}`}
              value={social_link.destination_url}
              disabled={disabled}
              onChange={(e) => {
                if (blockedValeues !== null && blockedValeues.blockedSubmit) {
                  blockedValeues.setBlockedSubmit(false);
                }
                manageSocialLinksData(index, 'destination_url', e.target.value);
              }}
              placeholder=""
          />
        </Col>
        <Col xs="2">
          {
            !disabled &&
            <Button color={'danger'} onClick={() => {
              removeSocialLink(index);
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
        Platform
      </Col>
      <Col xs="4">
        Destination Url
      </Col>
      <Col xs="2">
      </Col>
    </Row>
  )
}


const SocialLinksRow = ({ values, disabled = false, dataView = null, blockedValeues = null }) => {
  const { listOfSocialLinks, manageSocialLinksData, listOfSocialLinksSET, linkOrderChange, addNewSocialLink, removeSocialLink } = values;
  
  return (
    <>
      <FormGroup style={{ paddingBottom: 30 }}>
      <Label><b>Social Links</b></Label>
        <Row>
          <RowLabel />
          {
            listOfSocialLinks.map((social_link, index) => {
              const itemVal = { index, social_link, manageSocialLinksData, listOfSocialLinks, listOfSocialLinksSET, linkOrderChange, removeSocialLink, blockedValeues, disabled }
              return <RowSelect values={itemVal} key={social_link.key} />
            })
          }
        </Row>
        
        {
          !disabled && <Button disabled={listOfSocialLinks.length === 6 ? true : false} color="primary" onClick={() => addNewSocialLink([...listOfSocialLinks, { order: listOfSocialLinks.length, platform: { value: "other", label: "Other" }, destination_url: "", key: makeid(20) }])}>Add Another</Button>
        }
        {' '}
      </FormGroup>
    </>
  );
};

export default SocialLinksRow;
