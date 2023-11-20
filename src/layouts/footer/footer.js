import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  let date = new Date();

  return (
    <footer className="footer card mb-0 flex-row text-start">
      <strong>
        Copyright © {date.getFullYear()} &nbsp;
        <a
          href="https://www.movemusic.io"
          target="_blank"
          className="text-decoration-none fw-bold"
          rel="noopener noreferrer"
        >
          Move Music Distribution GmbH&nbsp;
        </a>
      </strong>
      <span>All rights reserved.</span> |
      <Link style={{padding: '0 0 0 4px'}} className="text-decoration-none" to={"/privacy-policy"}>Privacy Policy</Link> |
      <Link style={{padding: '0 0 0 4px'}} className="text-decoration-none" to={"/terms-and-conditions"}>Terms and Conditions</Link>
    </footer>
  );
};

export default Footer;
