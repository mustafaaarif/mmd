import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';
import './statementUnavailableTooltip.css';

const StatementUnavailbleTooltip = ({id}) => {
  const rowId = "statement-row-" + id.toString();
  return (
    <div>
        <i className="tooltip-icon mdi mdi-24px mdi-help-circle text-center" style={{color: "#000a60"}} id={rowId} aria-hidden="true"></i>
        <UncontrolledTooltip style={{background: "#000a60"}}  placement="bottom" target={rowId}>
          All statements issued earlier than January 2023 are available as ZIP file attachments in your email.
        </UncontrolledTooltip>
    </div>
  );
};

export default StatementUnavailbleTooltip;
