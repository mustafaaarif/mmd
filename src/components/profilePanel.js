import React from "react";
import { Card, CardBody, CardTitle, CardSubtitle } from "reactstrap";
import ProfileImg from "../assets/images/users/1.jpg";

const ProfilePanel = ({data}) => {
  const { id, first_name, last_name,profile_image,  email, company, country, street_and_number, postal_code, city, phone, preferred_payment_method, bank_name, paypal_email, account_holder_name, bank_address, iban, bic } = data;
  return (
    <Card key={id}>
      <CardBody>
        <center className="mt-4">
          <img className="rounded-circle" width="150" src={profile_image ? Object.keys(profile_image).length > 0 ? profile_image.thumb_medium : ProfileImg : ProfileImg} alt={first_name + " " + last_name} />
          
          <CardTitle className="mt-2" tag="h3">
            {first_name} {last_name}
          </CardTitle>
          <CardSubtitle>{company}</CardSubtitle>
        </center>
      </CardBody>
      <hr />
      <CardBody>
        {email && (<><small className="text-muted">Email address </small><h6>{email}</h6></>)}
        {paypal_email && (<><small className="text-muted">Paypal email address </small><h6>{paypal_email}</h6></>)}
        {phone && (<><small className="text-muted pt-4 db">Phone</small><h6>{phone}</h6></>)}
        {street_and_number && (<><small className="text-muted pt-4 db">Street and house Number</small><h6>{street_and_number}</h6></>)}

        {postal_code && (<><small className="text-muted pt-4 db">Postal Code</small><h6>{postal_code}</h6></>)}
        {city && (<><small className="text-muted pt-4 db">City</small><h6>{city}</h6></>)}
        {country && (<><small className="text-muted pt-4 db">Country</small><h6>{country}</h6></>)}
        {(preferred_payment_method === 0 || preferred_payment_method === 1)  && (<><small className="text-muted pt-4 db">Payment Method</small><h6>
        {
          preferred_payment_method.toFixed(0) === '0' ? "Paypal" : "Bank Account"
        }  
        </h6></>)}
        {account_holder_name && (<><small className="text-muted pt-4 db">Account Number Holder</small><h6>{account_holder_name}</h6></>)}
        {bank_name && (<><small className="text-muted pt-4 db">Bank Name</small><h6>{bank_name}</h6></>)}
        {iban && (<><small className="text-muted pt-4 db">IBAN</small><h6>{iban}</h6></>)}
        {bic && (<><small className="text-muted pt-4 db">BIC</small><h6>{bic}</h6></>)}
        {bank_address && (<><small className="text-muted pt-4 db">Bank Address</small><h6>{bank_address}</h6></>)}
      </CardBody>
    </Card>
  );
};

export default ProfilePanel;
