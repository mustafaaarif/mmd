import React, {useState} from 'react';
import axios from "axios";
import { Container,  Card, CardText, CardBody,Alert, CardTitle, Button} from "reactstrap";
import { useLocation } from "react-router-dom";
import { useBasicFetch } from "../../utils/fetchHookNoToken";
import TableHelper from "../../components/tableHelper";

const style = {
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}


const API_URL = process.env.REACT_APP_API_URL_BASE;

const Unsubscribe = props => {
  const location = useLocation();
  const promotionID = location.pathname.split("/")[2];
  const recipientToken = location.pathname.split("/")[3];

  const [dataDetails] = useBasicFetch("GET",`promotions/${promotionID}/promo-info/${recipientToken}/`);

  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);


  const submit = (labelId) => {

    var payload={
      "recipient": recipientToken,
      "label": labelId
    };

    axios.post(API_URL + 'recipients/'+ recipientToken+ '/unsubscribe/', payload)
    .then(function (response) {
      if(response.status === 200){
        setSuccess(true);
      } else{
        setError(true);
      }
    })
    .catch(function (error) {
      setError(true);
    });

   
  }


  return (
    <Container fluid={true} style={style}>
      <Card>
        {
          (dataDetails.release && !success) ?
          <CardBody>
            <CardTitle>Unsubscribe from label {dataDetails.release.label.name}</CardTitle>
            <CardText>Are you sure you want to unsubscribe?</CardText>
            <Button color="danger" onClick={() =>submit(dataDetails.release.label.id)}>Yes</Button>

          </CardBody>
          :
          <TableHelper loading padding></TableHelper>
        }
        {
          error &&
          <div style={{ padding: "0 20px 20px 20px" }}>
            <Alert color="info" style={{margin: 0}}>
              You are already unsubscribed from {dataDetails.release.label.name}
            </Alert>
          </div>
        }
        
      {success && (
        <div style={{ padding: "20px" }}>
          <Alert color="success" style={{margin: 0}}>
            We have unsubscribed you from future emails from {dataDetails.release.label.name}
          </Alert>
        </div>
        )}
      </Card>
    </Container>
  );
};

export default Unsubscribe;