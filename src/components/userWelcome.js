import React, { useContext } from "react";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import { StateContext } from "../utils/context";

const UserWelcome = () => {
  const { currentUser } = useContext(StateContext);

  return (
    <Card>
      <CardBody>
        {Object.keys(currentUser).length > 0 && (
          <>
            <CardTitle>Hey {currentUser.first_name}, welcome back to Move Music Platform.</CardTitle>
            <CardText>
              {
                currentUser.is_sub_user &&
                <div>Your account is owned and managed by <b>{currentUser.parent_company}</b>, visit our <a href="/help"><b>Help Page</b></a> to learn more.</div>
              }
            </CardText>
          </>
        )}
      </CardBody>
    </Card>
  );
};

export default UserWelcome;
