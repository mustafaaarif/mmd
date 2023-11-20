import React from "react";
import { Spinner } from "reactstrap";



const LoaderInner = ({ show = false }) => {
  return (
    <div className="loaderInner" style={{display: show ? 'block': 'none'}}>
      <Spinner size="sm" color="primary" className="releaseSpinner"/>
    </div>
  );
};

export default LoaderInner;
