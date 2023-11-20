import React, { useState } from "react";
import { Col, Row, Collapse, Button } from "reactstrap";

const HelpItem = props => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Col style={{ marginTop: "1rem" }}>
      <Row>
        <Button color="primary" onClick={toggle}>
          {props.heading}
        </Button>
      </Row>
      <Row style={{ marginTop: "1rem" }}>
        <Collapse isOpen={isOpen}>{props.text}</Collapse>
      </Row>
    </Col>
  );
};

export default HelpItem;
