import React from "react";
import { Card, CardBody } from "reactstrap";
import serviceData from "../data/serviceData";
import ServiceItem from "../components/serviceItem";

const ServiceWrap = () => {
  return (
    <Card>
      <CardBody>
        <div className="d-flex mt-3">
          <button className="btn btn-circle btn-success text-white btn-lg">
            <i className="ti-plus"></i>
          </button>
          <div className="ml-3">
            <h2 className="display-6">Services - NEW</h2>
            <h5>Purchase additional services</h5>
          </div>
        </div>
      </CardBody>
      <ul className="list-style-none scrollable ps-container ps-theme-default">
        {serviceData.map(item => (
          <ServiceItem key={item.id} {...item} />
        ))}
      </ul>
    </Card>
  );
};

export default ServiceWrap;
