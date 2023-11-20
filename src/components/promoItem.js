import React from "react";
import { Card, CardBody } from "reactstrap";

const PromoItem = ({
  itemIcon,
  itemHeading,
  itemSubHeading,
  itemCount,
  cardBg
}) => {
  return (
    <div className="col-lg-6 col-md-6">
      <Card style={{ backgroundColor: cardBg }}>
        <CardBody>
          <div className="d-flex">
            <div className="me-3 align-self-center">
              <h1 className="text-white">
                <i className={itemIcon}></i>
              </h1>
            </div>
            <div>
              <h4 className="card-title text-white">{itemHeading}</h4>
              <h5 className="card-subtitle text-white">{itemSubHeading}</h5>
            </div>
          </div>
          <div className="row">
            <div className="col-4 align-self-center">
              <font className="display-6 text-white">{itemCount}</font>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PromoItem;
