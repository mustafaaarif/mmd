import React, {useState} from 'react';
import { Link } from "react-router-dom";

import { UncontrolledPopover, PopoverBody, Alert } from 'reactstrap';

import './releaseStoreUrls.css';

import beatportIcon from "../assets/images/beatport_icon.png";
import deezerIcon from "../assets/images/deezer_icon.png";
import spotifyIcon from "../assets/images/spotify_icon.png";
import traxsourceIcon from "../assets/images/traxsource_icon.png";
import amazonMusicIcon from "../assets/images/amazonmusic_icon.png";
import appleMusicIcon from "../assets/images/applemusic_icon.png";

const ReleaseStoreUrls = ({
  id,
  store_urls,
}) => {
  const [alertVisible, setAlertVisible] = useState(false);
  const getStoreIcon = (store_name) =>
  {
    switch(store_name) {
        case 'beatport':
          return beatportIcon;
        case 'deezer':
          return deezerIcon;
        case 'spotify':
          return spotifyIcon;
        case 'traxsource':
          return traxsourceIcon;
        case 'amazon-music':
          return amazonMusicIcon;
        case 'apple-music':
          return appleMusicIcon;
        default:
          return '';
      }
  }

  const getStoreName = (store_name) =>
  {
    switch(store_name) {
        case 'beatport':
          return 'Beatport';
        case 'deezer':
          return 'Deezer';
        case 'spotify':
          return 'Spotify';
        case 'traxsource':
          return 'Traxsource';
        case 'amazon-music':
          return 'Amazon Music';
        case 'apple-music':
          return 'Apple Music';
        default:
          return '';
      }
  }

  const rowId = "release-row-" + id.toString();

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
                              <td className="p-2">
                                <img src={getStoreIcon(store_url['store_name'])} width="25px" height="25px" alt="store-icon" />
                              </td>
                              <td className="p-2 pr-3 fontWeight700">
                                {getStoreName(store_url['store_name'])}
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

export default ReleaseStoreUrls;
