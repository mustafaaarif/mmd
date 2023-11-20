import React from "react";
import { Row, Col } from "reactstrap";
import TracksTable from "../../components/tracksTable";

const Tracks = props => {
  return (
    <Row>
      <Col>
        <TracksTable />
      </Col>
    </Row>
  );
};

export default Tracks;
