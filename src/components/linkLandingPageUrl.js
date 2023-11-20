import React, {useState} from 'react';
import { Link } from "react-router-dom";

import { UncontrolledPopover, PopoverBody, Alert } from 'reactstrap';

import './releaseStoreUrls.css';

const LinkLandingPageUrl = ({
  id,
  full_urls
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const rowId = "link-landing-page-row-" + id.toString();

  return (
    <div>
      <i className={"fa fa-link fa-2x store-link-icon " + (full_urls.length<=0 ? 'text-tertial' : '')} id={rowId} aria-hidden="true"></i>

          {full_urls.length>0 &&
            <UncontrolledPopover trigger="legacy" placement="bottom" target={rowId}>
              <PopoverBody>
                <table>
                  <tbody>
                  {
                    alertVisible &&
                      <tr>
                        <td className="pt-2" colSpan="4">
                          <Alert color="success" fade={true} isOpen={alertVisible}>
                            Link copied to clipboard!
                          </Alert>
                        </td>
                      </tr>
                  }
                  {
                    full_urls.map(function(full_url, i){
                        return (
                          <tr key={i}>
                              <td className="p-2 pr-3 fontWeight700">
                                Landing Page
                              </td>
                              <td className="p-2">
                                <i className="fa fa-clone fa-lg store-link-icon"
                                  aria-hidden="true"
                                  onClick={() => {
                                    navigator.clipboard.writeText(full_url);
                                    setAlertVisible(true);
                                    setTimeout(() => {
                                      setAlertVisible(false);
                                    }, 2000);
                                  }}>
                                </i>
                              </td>
                              <td className="p-2">
                                <Link to={{pathname: full_url}} target="_blank" rel="noopener noreferrer">
                                  <i className="fa fa-external-link-alt fa-lg store-link-icon" style={{color: '#4f5467'}} aria-hidden="true"></i>
                                </Link>
                              </td>
                          </tr>
                        )
                    })
                  }
                  </tbody>
                </table>
              </PopoverBody>
            </UncontrolledPopover>
        }
    </div>
  );
};

export default LinkLandingPageUrl;
