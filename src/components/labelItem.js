import React from "react";
import PropTypes from "prop-types";
import { Badge } from "reactstrap";

const LabelItem = props => {
  const {
    name,
    id,
    logo,
    company,
    contract_received,
    information_accepted,
    label_approved
  } = props.data;
  return (
    <tr id={id}>
      <td>{<a href={name}>{name}</a>}</td>
      <td>{logo ? <img className="labelImg" src={logo} alt={name} /> : " "}</td>
      <td>{company}</td>
      <td>
        {contract_received ? (
          <Badge color="success">Recieved</Badge>
        ) : (
          <Badge color="warning">Not recieved</Badge>
        )}
      </td>
      <td>
        {information_accepted ? (
          <Badge color="success">Accepted</Badge>
        ) : (
          <Badge color="warning">Not accepted</Badge>
        )}
      </td>
      <td>
        {label_approved ? (
          <Badge color="success">Approved</Badge>
        ) : (
          <Badge color="warning">Not approved</Badge>
        )}
      </td>
    </tr>
  );
};

export default LabelItem;

LabelItem.propTypes = {
  data: PropTypes.object
};
