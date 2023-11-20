import React from "react";
import {Container,Card,CardBody} from "reactstrap";
import TableHelper from "../../components/tableHelper";
import "./promotions.scss";
import { useLocation } from "react-router-dom";
import { useBasicFetch } from "../../utils/fetchHookNoToken";

const PromotionShare = () => {
  const location = useLocation();
  const promotionToken = location.pathname.split("/")[2];


  const [data, error, loading] = useBasicFetch(
    "GET",
    `public-promotion-feedbacks/${promotionToken}/`
  );  
  if (data?.detail ===  "Not found." || data?.message === "Cannot access this resource") {
    return (
      <Container fluid={true}>
      <div className="rateWrap">
        <div className="rateInner">
          <div className="logoBackground"></div>
          <Card>
            <CardBody>
              <div className="promoFeedbackWrap">
                <h2 className="rateHeader" style={{margin: 0}}>Promotion not found</h2>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
    )
  }

  if (data?.detail ===  "You do not have permission to perform this action.") {
    return (
      <Container fluid={true}>
      <div className="rateWrap">
        <div className="rateInner">
          <div className="logoBackground"></div>
          <Card>
            <CardBody>
              <div className="promoFeedbackWrap">
                <h2 className="rateHeader" style={{margin: 0}}>You do not have permission to perform this action.</h2>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
    )
  }


  const opt = [
    { value: 1, label: "Beatport 2 weeks" },
    { value: 3, label: "Beatport 4 weeks" },
    { value: 5, label: "Pre-order 1 weeks" },
    { value: 4, label: "Pre-order 2 weeks" },
    { value: 2, label: "Traxsource 2 weeks" }
  ];
  function formatDate (input) {
    var datePart = input.match(/\d+/g),
    year = datePart[0], // get only two digits
    month = datePart[1], day = datePart[2];
  
    return day+'-'+month+'-'+year;
  }


  let part1 = data?.release?.exclusive_shop ?  opt.filter(i => i.value === data.release.exclusive_shop)[0].label : '';
  let part2 = data?.release?.exclusive_date ? formatDate(data.release.exclusive_date) : '';

  const sum = (part1 || part2) ? `(${part1}${part2 ? ", " + part2 : ''})` : '';

  return (
    <Container fluid={true}>
      <div className="rateWrap">
        <div className="rateInner">
          <Card>
            <CardBody>
              <div className="promoFeedbackWrap">
                {!loading ? (
                  <>
                    <div className="promoshare1">
                      <div className="promoshare2">
                        <table border="0" cellPadding="0" cellSpacing="0" style={{width: "100%", marginBottom: "20px"}}>
                            <tbody>
                                <tr>
                                    <td className="promoshare3" align="center">
                                      <a href="http://www.movemusic.io" target="_blank" rel="noopener noreferrer" >
                                        <img src="https://movemusic.s3.amazonaws.com/media/static/images/MMD-LOGO-MAIL.png" alt="Eliteadmin Responsive web app kit" style={{border:"none"}} />
                                      </a>
                                      <br/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table border="0" cellPadding="0" cellSpacing="0" style={{width: '100%'}}>
                          <tbody>
                              <tr>
                                  <td className="promoshare4"> <b>PROMO CAMPAIGN - FEEDBACK REPORT</b> </td>
                              </tr>
                          </tbody>
                      </table>
                        <div style={{padding: "40px 0", background: "#fff"}}>
                            <table border="0" cellPadding="0" cellSpacing="0" style={{width: "100%"}}>
                                <tbody>
                                    <tr>
                                        <td>                                           

                                            <h4>Info:</h4>
                                            <p><b>Release name:</b> {data?.release?.name}</p>
                                            <p><b>Main release artist:</b> {data?.release?.get_artists}</p>
                                            <p><b>Catalog number:</b> { data?.release?.catalogue_number }</p>
                                            <p><b>Label name:</b> {data?.release?.label_name}</p>
                                            <p><b>Release date (MM/DD/YY):</b> { data?.release?.official_date && formatDate(data.release.official_date) } {sum}</p>


                                            <h4>Feedbacks:</h4>

                                            <div style={{marginBottom: "32px"}}>
                                            {
                                              data.feedbacks.map(i => {
                                                return (
                                                <div style={{marginBottom: "20px"}} key={i?.recipient?.name + i?.comment}>
                                                  <p className="promoshareP">{i.recipient.name} - {i.comment}</p>
                                                  <p className="promoshareP">Rating {i.rating}/10</p>
                                                </div>
                                                )
                                              })
                                            }
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style={{textAlign: "center", fontSize: "12px", color: "#b2b2b5", marginTop: "20px"}}>
                          <p> Distribution and Promotion powered by <a href="https://www.movemusic.io/" target="_blank" rel="noopener noreferrer">movemusic.io</a> </p>
                        </div>
                    </div>
                </div>

                  </>
                ) : (
                  <TableHelper loading></TableHelper>
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default PromotionShare;


