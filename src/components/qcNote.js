import React from 'react';

import { UncontrolledPopover, PopoverBody, Alert } from 'reactstrap';

import './qcNote.css';

const QCNote = ({
  id,
  status,
  name,
  qc_passed,
  qc_feedback,
  edited_after_qc,
  noteType,
}) => {
  const rowId = noteType + "-row-qcn-" + id.toString();
  let showStatusNote = false;
  if(edited_after_qc) {
    showStatusNote = false;
  } else {
    if(noteType === "Release") {
      showStatusNote = !qc_passed && qc_feedback.results && Object.keys(qc_feedback.results).length !== 0;
    } else {
      showStatusNote = !qc_passed && !edited_after_qc;
    }
  }

  let statusNoteText = `${noteType} ${name} has QC Issues, please edit the ${noteType} for detailed QC Feedback, make required changes and resubmit!`;

  return (
    <div>
      <i className={"fas fa-bell fa-2x note-icon" + (showStatusNote ? " note-avl-icon" : "")} id={rowId} aria-hidden="true" disabled={!showStatusNote}></i>
      <UncontrolledPopover trigger="legacy" id="qc-popover" placement="bottom" target={rowId} disabled={!showStatusNote}>
        <PopoverBody style={{padding: "0px"}}>
          { showStatusNote &&
            <Alert color="danger" style={{fontSize: "14px", fontWeight: "bolder", "color": "red", margin: "0px"}} fade={true} isOpen={showStatusNote}>
              <b>{statusNoteText}</b>
            </Alert>
          }
        </PopoverBody>
      </UncontrolledPopover>
    </div>
  );
};

export default QCNote;
