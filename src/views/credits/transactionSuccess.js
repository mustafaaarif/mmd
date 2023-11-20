import React from "react";
import { Row, Col } from "reactstrap";
import './transactionResponse.css';

const TransactionSuccess = props => {

    return (
        <div className='bl-back-image'>
            <Row>
                <Col xl="12" lg="12" md="12" sm="12" xm="12" style={{marginTop: '10%'}}>
                    <div>
                        <h1 className="text-center text-success text-congrats">
                            Transaction Successfull :)
                        </h1>

                        <div className="text-center pl-2 pr-2" style={{fontSize: '20px', marginTop: '40px'}}>
                            <p>
                                You have successfully purchased the credits which will be shortly added to your account!<br/> 
                            </p>
                        </div>

                        <div className="text-center mt-5">
                            <a href="/dashboard" className="btn btn-primary btn-lg mr-3">
                                <span className="fas fa-user pr-2"></span>
                                Return to Dashboard 
                            </a>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default TransactionSuccess;

