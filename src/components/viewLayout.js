import React from "react";
import { Card, CardBody, Row, Col, CardTitle } from "reactstrap";

const ViewLayout = ({ title, children }) => {
  return (
    <>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row>
                <Col>
                  <CardTitle tag="h4">{title}</CardTitle>
                </Col>
              </Row>
              {children}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ViewLayout;
