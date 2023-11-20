import React, { useContext, useState, useEffect }  from "react";
import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import ProfileForm from "../../components/profileForm";
import ProfilePanel from "../../components/profilePanel";
import PasswordForm from "../../components/passwordForm";
import { Link } from "react-router-dom";

import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import {StateContext} from "../../utils/context";

const Profile = props => {
  const token = getCookie("token");
  const {currentUser} = useContext(StateContext);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState([]);
  const [apiData, error, loading] = useFetch("GET", `user-payment/list/`, token, false, forceUpdate);
 

  useEffect(() => {
    if (apiData) {
      let filteredData = apiData.filter(function (el) {
        return el.is_default === true;
      });
      if(filteredData.length === 1)
      {
        setPaymentMethod(
          filteredData[0]
        );
      }
      else{
        setPaymentMethod(apiData[0]);
      }
    }

  }, [apiData]);

  return (
    <Row>
      <Col lg="4">
      <ProfilePanel data={currentUser}/>
        <Card>
          <CardBody>
            <CardTitle tag="h4">Set new password</CardTitle>
            <PasswordForm data={currentUser}/>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <CardTitle tag="h4">Payment Method</CardTitle>
            {
              paymentMethod && <>
              Card Number:  {paymentMethod['number']}, Expiry: {paymentMethod['exp_month']}/{paymentMethod['exp_year']}
              {paymentMethod['is_default'] &&
                <div className="ml-2 btn btn-success btn-status-sm disabled">Default</div>
              }
              <br/><Link to={`/payment-methods`} className="mt-3 btn btn-md btn-success">Manage</Link>
              </>
            }
            {
              !paymentMethod && <>
                <Link to={`/payment-methods/add`} className="btn btn-md btn-success">Add</Link>
              </> 
            }
          </CardBody>
        </Card>
      </Col>

      <Col lg="8">
        <Card>
          <CardBody>
            <CardTitle tag="h4">Edit your profile</CardTitle>
            {currentUser && <ProfileForm data={currentUser}/> }
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
