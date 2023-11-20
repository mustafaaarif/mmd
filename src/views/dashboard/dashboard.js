import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "reactstrap";
import PromoItem from "../../components/promoItem";
import UserWelcome from "../../components/userWelcome";
import UserStatementsGraph from "../../components/userStatementsGraph";
import SubuserStatementsGraph from "../../components/subuserStatementsGraph";
import { StateContext } from "../../utils/context";
import UserHelpScoutBeacon from "../../components/userHelpScoutBeacon";
import SubUserHelpScoutBeacon from "../../components/subuserHelpScoutBeacon";


const Dashboard = () => {
  const {currentUser} = useContext(StateContext);
  const [promoFeedbackCount, setPromoFeedbackCount] = useState(0);
  const [promoDownloadCount, setPromoDownloadCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      setPromoFeedbackCount(currentUser.promo_feedback_count);
      setPromoDownloadCount(currentUser.promo_download_count);
    }
  }, [currentUser]);

  return (
    <>
      <Row>
        <Col>
          <UserWelcome />
        </Col>
      </Row>
      <Row>
        <Col>
          {
            (currentUser && currentUser.is_sub_user) && 
            <>
              <SubuserStatementsGraph />
              <SubUserHelpScoutBeacon />
            </>
          }
          {
            (currentUser && !currentUser.is_sub_user) && 
            <>
              <UserStatementsGraph />
              <UserHelpScoutBeacon />
            </>
          }
        </Col>
      </Row>
      <Row>
        <PromoItem
          itemIcon="ti-pie-chart"
          itemHeading="Promo download count"
          itemSubHeading="Total downloads"
          itemCount={promoDownloadCount}
          cardBg="#707cd2"
        />
        <PromoItem
          id="2"
          itemIcon="icon-cloud-download"
          itemHeading="Promo feedback count"
          itemSubHeading="Total feedbacks"
          itemCount={promoFeedbackCount}
          cardBg="#ff5050"
        />
      </Row>
    </>
  );
};

export default Dashboard;
