import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Row,
  CardBody,
  Col,
  FormGroup,
  Label,
  FormText,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Alert,
  Form,
} from "reactstrap";
import { useFetch } from "../../utils/fetchHook";
import { getCookie } from "../../jwt/_helpers/cookie";
import Select from "react-select";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const OrderCredits = () => {

  const token = getCookie("token");

  const creditsAmountOps = [
    { label: "1 Credit", value: 1 },
    { label: "2 Credits", value: 2 },
    { label: "3 Credits", value: 3 },
    { label: "4 Credits", value: 4 },
    { label: "5 Credits", value: 5 },
    { label: "10 Credits", value: 10 },
    { label: "15 Credits", value: 15 },
    { label: "20 Credits", value: 20 },
    { label: "25 Credits", value: 25 },
    { label: "30 Credits", value: 30 },
    { label: "35 Credits", value: 35 },
    { label: "40 Credits", value: 40 },
    { label: "45 Credits", value: 45 },
    { label: "50 Credits", value: 50 },
    { label: "75 Credits", value: 75 },
    { label: "100 Credits", value: 100 },
  ];

  const options = {
    method: "POST",
    mode: 'cors',
    headers: {
      Authorization: `Bearer ${token}`,
      "x-api-key": X_API_KEY,
      "Content-Type": "application/json"
    }
  };

  const currentDate = (new Date());
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;

  const [openModal, setToggleModal] = useState(false);
  const [errorPut, setError] = useState(false);
  const [forceUpdate, setForce] = useState(1);
  const [checkoutLink, setCheckoutLink] = useState("");
  const [sessionId, setSessionId] = useState("");

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [apiData, error, loading] = useFetch("GET", `user-payment/list/`, token, false, forceUpdate);

  const [paymentMethodValid, setPaymentMethodValid] = useState(true);

  const [creditsAmountTab, setCreditsAmountTab] = useState({
    label: "Select Quantity",
    value: "",
  });

  useEffect(() => {
    if (apiData) {
      setPaymentMethods(apiData);

      let filteredData = apiData.filter(function (el) {
        return el.is_default === true;
      });

      if(filteredData.length === 1)
      {
        let defaultPaymentMethod = filteredData[0];
        let expiryYear = parseInt(defaultPaymentMethod.exp_year);
        let expiryMonth = parseInt(defaultPaymentMethod.exp_month);
        let cardValid = true;

        if(expiryYear===currentYear && expiryMonth<currentMonth)
        {
          cardValid = false;
        }
        else if (defaultPaymentMethod.status==="expired"){
          cardValid = false;
        }
        setPaymentMethodValid(cardValid);
      }
    }
  }, [apiData]);


  const validateFields = () => {
    let validationErrors = 0;
    if (creditsAmountTab.value==="") {
      document.getElementById("err_credits_quantity").style.display = "block";
      validationErrors = validationErrors+1;
    }
    return validationErrors;
  }


  const handleSubmit = () => {

    const validationErrors = validateFields();

    if (validationErrors!==0) {
      return false;
    }

    else {

      let orderData = {
        "quantity": creditsAmountTab.value,
      };

      axios
      .post(`${API_URL}create-checkout-session/`, orderData, options).then(function(response) {
        if (response.status === 200) {
          let response_data = response.data;
          if (response_data.url)
          {
            setCheckoutLink(response_data.url);
            setSessionId(response_data.session_id);
            setToggleModal(true);
          }
        } 
        else {
          setError(true);
        }
      }).catch(function (error) {
        if (error.response) {
          if(error.response.status === 400)
          {
            let error_data = error.response.data;
            if(error_data.error)
            {
              console.log(error_data.error);
              setError(true);
            }
          }
        } else if (error.request) {
          setError(true);
        } else {
          setError(true);
        }
    
      });
    }

  }

  return (
    <div>
      {
        paymentMethods.length<=0 && (
          <Alert color="danger">
            <b>Please add a <a href="/payment-methods">payment method</a> in order to place order for credits.</b>
          </Alert>
        )
      }
      {
        !paymentMethodValid && (
          <Alert color="danger">
            <b>You can not place order for credits as your default <a href="/payment-methods">payment method</a> has expired, please set a valid payment method as default in order to place order for credits.</b>
          </Alert>
        )
      }
      <Row>
        <Col sm={12}>
          <Card>
            <CardBody>
              <h3>Order Credits</h3>

              <Form id="orderCreditsForm">

                <FormGroup>
                  <Label>Quantity</Label>
                  <Select
                      components={{ IndicatorSeparator: () => null }}
                      closeMenuOnSelect={true}
                      className="artistType"
                      name="quantity"
                      options={creditsAmountOps}
                      defaultValue={creditsAmountTab}
                      placeholder="Select Quantity"
                      onChange={(e) => {
                        document.getElementById("err_credits_quantity").style.display = "none";
                        setCreditsAmountTab(e);
                      }}
                  />
                  <FormText color="muted">
                    Amount of credits that you want to order.
                  </FormText>
                  <div style={{width: '100%', display: 'flex', marginTop: '5px'}}>
                    <div className="fv-help-block" style={{ display: 'none'}} id={"err_credits_quantity"}>Quantity is required</div>
                  </div>
                </FormGroup>

                <Button className="btn btn-outline-success pull-right" color="success" onClick={handleSubmit} disabled={paymentMethods.length<=0 || !paymentMethodValid}>
                  Place Order
                </Button>
              </Form>

              <div style={{ paddingTop: "24px" }}>
                {errorPut && (
                  <Alert color="danger">
                    Something went wrong! Please refresh page and try again!
                  </Alert>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {openModal && (
        <Modal isOpen={openModal} centered={true}>
        <ModalHeader>Proceed to checkout</ModalHeader>
        <ModalBody>
            You have ordered <b>{creditsAmountTab.value} Credits</b> 

            <br/><br/>If you want to confirm the order please proceed to checkout, otherwise you can cancel the order.
            
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => {
            axios.post(`${API_URL}expire-checkout-session/`, {"session_id": sessionId }, options);
            setToggleModal(false);
          }}
          >
            Cancel
          </Button>
          <a href={`${checkoutLink}`} className="btn btn-md btn-success" rel="noopener noreferrer">Checkout</a>
        </ModalFooter>
      </Modal>
      )}
    </div>
  );
};

export default OrderCredits;
