import React, {useState} from 'react';
import { Link } from "react-router-dom";

import { UncontrolledPopover, PopoverBody, Alert } from 'reactstrap';

import './releaseStoreUrls.css';

const MusicLinkUrl = ({
  id,
  musiclink_url
}) => {

  
  const capitalizeFirstLetter = s => (s && s[0].toUpperCase() + s.slice(1)) || "";
  const [alertVisible, setAlertVisible] = useState(false);
  const store_urls = [
    {
      store_name: "music-link",
      url: musiclink_url,
    },
  ]
  const rowId = "musiclink-row-" + id.toString();

  return (
    <div>
      <i className={"fa fa-link fa-2x store-link-icon " + (store_urls.length<=0 ? 'text-tertial' : '')} id={rowId} aria-hidden="true"></i>

          {store_urls.length>0 &&
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
                    store_urls.map(function(store_url, i){
                        return (
                          <tr key={i}>
                              <td className="p-2 pr-3 fontWeight700">
                                {capitalizeFirstLetter(store_url['store_name'])}
                              </td>
                              <td className="p-2">
                                <i className="fa fa-clone fa-lg store-link-icon"
                                  aria-hidden="true"
                                  onClick={() => {
                                    navigator.clipboard.writeText(store_url['url']);
                                    setAlertVisible(true);
                                    setTimeout(() => {
                                      setAlertVisible(false);
                                    }, 2000);
                                  }}>
                                </i>
                              </td>
                              <td className="p-2">
                                <Link to={{pathname: store_url['url']}} target="_blank" rel="noopener noreferrer">
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

export default MusicLinkUrl;
