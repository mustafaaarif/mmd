import React, { useEffect, useState } from "react";
import { Col, Button } from "reactstrap";
import Select from 'react-select'
import { getCookie } from "../jwt/_helpers/cookie";
import { useFetch } from "../utils/fetchHook";

const SubUserFilterCustom = ({subUserData}) => {

    const token = getCookie("token");

    const [subUserOps, setSubUserOps] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(0);
    const [apiData, error, loading] = useFetch("GET", `sub-users/`, token, false, forceUpdate);

    useEffect(() => {
        if (apiData.results) {
            setSubUserOps(apiData.results.map(i => ({value: i.id, label: i.username})));
        }
      }, [apiData]);

  return (
    <>
    <Col>
        {
            subUserData.subUser ?

            <div className="releaseFileRow">
                <p className="releaseFileRowName"><b>Sub-User: </b> {subUserData.subUser}</p>
            </div>
            :
            <Select
                closeMenuOnSelect={true}
                options={subUserOps}
                placeholder="Select Sub-User"
                onChange={(subUserObj) => {

                    let username = subUserObj.label;
                    let subUserId = subUserObj.value;

                    if(subUserId !== '') {
                    subUserData.setSubUser(username);
                    subUserData.setSubUserEndpoint(`sub-user/${subUserId}/`);
                    subUserData.setSubusersOnly('');
                    }
                    else
                    {
                    subUserData.setSubUser('');
                    subUserData.setSubUserEndpoint('');
                    subUserData.setSubusersOnly('&subusers_only=true');
                } 
 
            }}
            className="artistType"
          />

        }
        </Col>
        <Col>
            {
            subUserData.subUser &&
                <Button className="btn btn-outline-info" 
                onClick={() => {
                    subUserData.setSubUser('');
                    subUserData.setSubUserEndpoint('');
                    subUserData.setSubusersOnly('&subusers_only=true');
                }
                }>
                Reset
                </Button>
            }
        </Col>
    </>
  );
};

export default SubUserFilterCustom;
