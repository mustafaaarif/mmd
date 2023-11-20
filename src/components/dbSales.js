import React from "react";
import { CardGroup,Col, CardBody } from "reactstrap";
const DbSales = ({ promoCoins, toBePaid, allTime }) => {
  return (
    <CardGroup className="dashboard-3-items">
      <Col sm="12" md="4" lg="4">
        <CardBody className="pl-0 pr-0 pt-0">
          <div className="d-flex align-items-center">
            <button className="btn btn-circle btn-danger text-white btn-lg dashbord-icon-outer">
              <i className="dashboard-icon mdi mdi-wallet"></i>
            </button>
            <div className="ms-3">
              <div className="dashboard-p">All Time Sales</div>
              <div className="dashboard-header">{allTime ? `${allTime} €` : `0€`}</div>
            </div>
          </div>
        </CardBody>
      </Col>
      <Col sm="12" md="4" lg="4">
        <CardBody className="pl-0 pr-0 pt-0">
          <div className="d-flex align-items-center">
            <button className="btn btn-circle btn-cyan text-white btn-lg dashbord-icon-outer">
              <i className="dashboard-icon  mdi mdi-currency-eur"></i>
            </button>
            <div className="ms-3">
              <div className="dashboard-p">Total To Be Paid</div>
              <div className="dashboard-header">{toBePaid ? `${toBePaid} €` : `0€`}</div>
            </div>
          </div>
        </CardBody>
      </Col>
      <Col sm="12" md="4" lg="4">
        <CardBody className="pl-0 pr-0  pt-0">
          <div className="d-flex align-items-center">
            <button className="btn btn-circle btn-success text-white btn-lg dashbord-icon-outer">
              <i className="dashboard-icon  mdi mdi-star"></i>
            </button>
            <div className="ms-3">
              <div className="dashboard-p">Promo Coins</div>
              <div className="dashboard-header">{promoCoins ? `${promoCoins}` : `0`}</div>
            </div>
          </div>
        </CardBody>
      </Col>
    </CardGroup>
  );
};

export default DbSales;
