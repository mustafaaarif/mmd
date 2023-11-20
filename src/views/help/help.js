import React, { useState, useContext, useEffect } from "react";
import { Card, CardBody, CardTitle } from "reactstrap";
import HelpItem from "../../components/helpItem";
import helpItemsData from "../../data/helpItemsData";
import subusersHelpItemsData from "../../data/subuserHelpItemsData";
import { StateContext } from "../../utils/context";

const Help = () => {
  const {currentUser} = useContext(StateContext);
  const [helpItems, setHelpItems] = useState([]);

  useEffect(() => {
    if(currentUser && currentUser.is_sub_user) {
      let formattedHelpItems = [];
      const getFormattedData = (helpData) => {
        let helpDataFormatted = helpData.replaceAll("{parent_company}", `${currentUser.parent_company}`);
        helpDataFormatted = helpDataFormatted.replaceAll("{parent_email}", currentUser.parent_email);
        return helpDataFormatted;
      }    
      subusersHelpItemsData.forEach(item => {
        formattedHelpItems.push({
          id: item.id,
          heading: getFormattedData(item.heading),
          text: getFormattedData(item.text)
        });
      });
      setHelpItems(formattedHelpItems);  
    } else {
      setHelpItems(helpItemsData);
    }
  }, [currentUser]);

  return (
    <>
    <Card>
      <CardBody>
        <CardTitle tag="h3">Help Center</CardTitle>
        {Object.keys(currentUser).length > 0 && 
          helpItems.map(item => (
            <HelpItem
              text={item.text}
              heading={item.heading}
              key={item.id}
            ></HelpItem>
          )) 
        }
      </CardBody>
    </Card>
    </>
  );
};

export default Help;
