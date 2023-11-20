import React from "react";
import PropTypes from "prop-types";
import { Badge, Button } from "reactstrap";

const ReleaseItem = props => {
  const {
    id,
    name,
    label,
    catalogue_number,
    get_artists,
    ean,
    official_date,
    exclusive_date,
    get_mixes_number,
    status
  } = props.data;
  return (
    <tr id={id}>
      <td>{label}</td>
      <td>{catalogue_number}</td>
      <td>{name}</td>
      <td>{get_artists}</td>
      <td>{ean}</td>
      <td>{official_date}</td>

      <td>{exclusive_date}</td>

      <td>{get_mixes_number}</td>
      <td>
        {status === "ready" ? (
          <Badge color="success">Ready</Badge>
        ) : (
          <Badge color="warning">Waiting Approval</Badge>
        )}
      </td>
      <td>
        <Button size="sm" disabled color="success">
          Distribute
        </Button>
      </td>

      <td>
        <Button size="sm" disabled color="secondary">
          Edit
        </Button>
      </td>
      <td>
        <Button size="sm" disabled color="danger">
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default ReleaseItem;

ReleaseItem.propTypes = {
  data: PropTypes.object
};
