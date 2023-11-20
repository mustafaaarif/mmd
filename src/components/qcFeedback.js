import React from 'react';
import { Badge } from 'reactstrap';

function QCFeedback({ hasQCFeedback, feedback }) {
  if (!hasQCFeedback || !feedback) {
    return null;
  }

  return (
    <p className="text-danger mt-2">
      <Badge color="danger" className="mr-2"><b>QC Feedback</b></Badge>
      {
        feedback.length === 1? feedback[0]: feedback.map((message, index) => <span key={index}><br />{message}</span>)
      }
    </p>
  );
}

export default QCFeedback;
