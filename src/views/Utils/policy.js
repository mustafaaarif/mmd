import React, { useEffect, useState } from "react";
import {Container,Card,CardBody,FormText} from "reactstrap";
import axios from "axios";
import ReactHtmlParser from 'react-html-parser';

import TableHelper from "../../components/tableHelper";
const POLICY_URL = process.env.REACT_APP_POLICY_LINK;

const Terms = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);

 useEffect(() => {
   if (data) return false
  axios
  .get(POLICY_URL)
  .then(res => {
    if (res.status === 200) {
      setLoading(false)
      setData(res.data.content)
    }
  })
  .catch(err => {
    console.log(err);
  });
 }, [])


  return (
    <Container fluid={true}>
      <div className="rateWrap">
        <div className="rateInner">
          <Card>
            <CardBody>
              <div className="policyAndTerms">
                {!loading ? (
                  <>
                    {ReactHtmlParser(data)}

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

export default Terms;


