import React, { useState } from "react";
import { Badge, FormGroup, Label, Button, Col, Input, Row } from "reactstrap";
import AddNewPublisherModal from "./AddNewPublisherModal";
import AsyncDropdownFeedback from "../../components/asyncDropdownFeedback";

import { getCookie } from "../../jwt/_helpers/cookie";

const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const arrowStyleWrap = {
  display: "flex"
};
const arrowStyle = {
  padding: 3,
  cursor: "pointer"
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
  const {
    publisher,
    removePublisher,
    index,
    managePublisherData,
    publisherOrderChange,
    currentPublishers,
    subUserEndpoint, 
    parentUserOnly,
    revalidateField,
  } = values;

  const id = publisher.id;
  const key = publisher.key;

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

  const [publisherNameFieldTouched, publisherNameFieldTouchedSET] = useState(false);

  return (
    <div className="artistWrap" style={{ flexDirection: "column" }}>
      <div className="artistWrap" style={{margin: "0", alignItems: 'flex-start'}}>
        <Col xs="1" style={arrowStyleWrap}>
          <div
            style={arrowStyle}
            onClick={() =>
              publisherOrderChange(
                "up",
                id,
                index,
                publisher.order,
                "listOfPublishers"
              )
            }
          >
            ▲
          </div>
          <div
            style={arrowStyle}
            onClick={() =>
              publisherOrderChange(
                "down",
                id,
                index,
                publisher.order,
                "listOfPublishers"
              )
            }
          >
            ▼
          </div>
        </Col>
        <Col xs="3">
          <AsyncDropdownFeedback
            fetchOptions={options}
            endpoint={`publishers`}
            subUserEndpoint={subUserEndpoint}
            parentUserOnly={parentUserOnly}
            labelField={"name"}
            value={publisher.publisher}
            isFieldValid={publisher.publisher?true:false}
            revalidateField={revalidateField}
            fieldName={`publisher[${index}].name`}
            fieldTouched={publisherNameFieldTouched}
            setFieldTouched={publisherNameFieldTouchedSET}
            onChange={selectedOption => {
              managePublisherData(index, 'publisher', selectedOption);
              revalidateField(`publisher[${index}].name`)
            }}
            placeholder="Select Publisher..."
          />
          <input className="hiddenInput" type="text" id={`publisher[${index}].name`} name={`publisher[${index}].name`} value={publisher.publisher} readOnly/>
        </Col>
        <Col xs="3">
          <Input
            type="text"
            id={`publisher[${index}].author`}
            name={`publisher[${index}].author`}
            defaultValue={publisher.publisher_author}
            onFocus={(e) => {revalidateField(`publisher[${index}].author`)}}
            onChange={(e) => {
              managePublisherData(index, 'publisher_author', e.target.value.replace(/[&\/\\#,+()$~^%.'":*?<>{}]/g,''))
              revalidateField(`publisher[${index}].author`)
            }}
          />
        </Col>

       <Col xs="2">
        <Button color={"danger"} onClick={() => removePublisher(index)}>
          Remove{" "}
        </Button>
       </Col>
      </div>
      <div className="artistWrap" style={{ width: "100%" }}>
        <Col xs="1" style={arrowStyleWrap}></Col>
        <Col xs="3">
        <div
          className="fv-help-block"
          style={{ display: "none" }}
          id={"err_publisher_" + key}
        >
          Please select publisher
        </div>
        </Col>
        <Col xs="3">
        <div
          className="fv-help-block"
          style={{ display: "none" }}
          id={"err_publisher_author_" + key}
        >
           Please insert the real First and Last name of the person.
        </div>
        </Col>     
      </div>
    </div>
  );
};

const RowLabel = () => {
  return (
    <Row className="artistWrap labelRow">
      <Col xs="1">
        Order
      </Col>
      <Col xs="3">
        Publisher name <Badge color="primary">Required</Badge>
      </Col>
      <Col xs="3">
        Author / Songwriter full name <Badge color="primary">Required</Badge>
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

const PublisherRow = ({ values }) => {
  const {
    setNewPublisher,
    optionsPublishers,
    listOfPublishers,
    removePublisher,
    addNewPublisher,
    managePublisherData,
    publisherOrderChange,
    subUserId,
    subUserEndpoint,
    parentUserOnly,
    revalidateField
  } = values;

  const [modal, setModal] = useState(false);
  let key = Math.random().toString(36).substring(1);
  return (
    <>
      <FormGroup>
        <Label>Publishers</Label>
        <Row>
          <RowLabel />
        </Row>
        <Row>
          {listOfPublishers.map((publisher, index) => {
            const itemVal = {
              index,
              publisher,
              removePublisher,
              managePublisherData,
              publisherOrderChange,
              optionsPublishers,
              subUserEndpoint, 
              parentUserOnly,
              revalidateField,
            };
            return <RowSelect values={itemVal} key={publisher.key} />;
          })}
        </Row>
        <div>
          <Button
            color="primary"
            onClick={() =>
              addNewPublisher([
                ...listOfPublishers,
                {
                  publisher: "",
                  publisher_author: "",
                  order: listOfPublishers.length + 1,
                  key: makeid(20)
                }
              ])
            }
          >
            Add another
          </Button>{" "}
          <Button color="success" onClick={() => setModal(true)}>
            Create new?
          </Button>
        </div>
      </FormGroup>
      {modal && (
        <AddNewPublisherModal
          toggleModal={setModal}
          modal={modal}
          setNewPublisher={setNewPublisher}
          subUserId={subUserId} 
          subUserEndpoint={subUserEndpoint} 
          parentUserOnly={parentUserOnly}
        />
      )}
    </>
  );
};

export default PublisherRow;
