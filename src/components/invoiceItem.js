import React from "react";
import PropTypes from "prop-types";

const InvoiceItem = props => {
  const {
    id,
    name,
    sts_kind,
    quartal,
    month,
    year,
    price,
    status,
    details
  } = props.data;

  let monthArr = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return (
    <tr id={id}>
      <td>{name}</td>
      <td>{sts_kind === 2 ? "Regular" : "Offset"}</td>
      <td>{`Q${quartal + 1}`}</td>
      <td>{year}</td>
      <td>{monthArr[month - 1]}</td>
      <td>{details}</td>
      <td>{price}</td>

      <td>{status === 0 ? "Open" : "Closed"}</td>
    </tr>
  );
};

export default InvoiceItem;

InvoiceItem.propTypes = {
  data: PropTypes.object
};
