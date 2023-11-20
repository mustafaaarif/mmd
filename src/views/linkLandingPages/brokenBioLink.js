import React from "react";
import { Row, Col } from "reactstrap";
import './brokenBioLink.css';

const BrokenBioLink = props => {

    return (
        <div className='bl-back-image'>
            <Row>
                <Col xl="12" lg="12" md="12" sm="12" xm="12" style={{marginTop: '10%'}}>
                    <div>
                        <h1 className="text-center" style={{fontSize: '100px'}}>Oops!</h1>

                        <div className="text-center pl-2 pr-2" style={{fontSize: '20px', marginTop: '40px'}}>
                            <p>
                                Link Landing Page that you have requested does not exist!<br/>
                                It might be either due to the change of URL or Link Landing Page been taken down by the owner.
                            </p>
                        </div>
    
                        <div className="text-center mt-5">
                            <a href="https://www.movemusic.io" className="btn btn-primary btn-lg">
                                <span className="fas fa-home pr-2"></span>
                                Take Me Home 
                            </a>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default BrokenBioLink;
