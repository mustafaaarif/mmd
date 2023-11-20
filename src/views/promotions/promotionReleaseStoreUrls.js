import React from "react";
import { Link } from "react-router-dom";

import amazonMusicIcon from "../../assets/images/landingPage/svg/AmazonMusic.svg"
import beatportIcon from "../../assets/images/landingPage/svg/beatport_green.svg"
import deezerIcon from "../../assets/images/landingPage/svg/deezer.svg"
import spotifyIcon from "../../assets/images/landingPage/svg/spotify.svg"
import traxsourceIcon from "../../assets/images/landingPage/svg/Traxsource.svg"

const PromotionReleaseStoreUrls = ({storeUrls}) => {
  const getStoreIcon = (storeName) => {
    switch(storeName) {
      case "Beatport":
        return beatportIcon;
      case "Deezer":
        return deezerIcon;
      case "Spotify":
        return spotifyIcon;
      case "Traxsource":
        return traxsourceIcon;
      case "Amazon Music":
          return amazonMusicIcon;
      default:
        return "";
    }
  }

  const getStoreIconStyle = (storeName) => {
    switch(storeName) {
      case "Beatport":
        return "p-2";
      case "Deezer":
        return "p-2";
      case "Spotify":
        return "p-2";
      case "Traxsource":
        return "p-2";
      case "Amazon Music":
        return "p-2 pt-0";
      default:
        return "";
    }
  }

  return (
    <div style={{display: "inline-flex", flexWrap: "wrap", paddingTop: "1px"}}>
    {
      storeUrls.map(function(store, index) {
        let storeName = store["store_name"];
        let storeUrl = store["url"];
        let storeIcon = getStoreIcon(storeName);
        let storeIconStyle = getStoreIconStyle(storeName);
        
        return (
          <div key={index}>
            <Link to={{pathname: storeUrl}} target="_blank" rel="noopener noreferrer">
              <img src={storeIcon} width="100px" height="100%" alt="store-icon" className={storeIconStyle} />
            </Link>
          </div>
        )
      })
    }
    </div>
  );
};

export default PromotionReleaseStoreUrls;
