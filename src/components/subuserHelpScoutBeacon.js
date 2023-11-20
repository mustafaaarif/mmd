import React, { useContext } from "react";
import { StateContext } from "../utils/context";
import { Helmet } from "react-helmet";


const SubUserHelpScoutBeacon = () => {
  const { currentUser } = useContext(StateContext);

  return (
    <>
      <Helmet>
        <script type="text/javascript" async defer>
        {
          `
          !function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});
          `
        }
        </script>
        <script type="text/javascript">
        {
            (currentUser && currentUser.helpscout_hmac) &&
            ` window.Beacon('init', '6c4a59f0-7758-40a6-b986-70450dcfa5f7');
              window.Beacon('on', 'article-viewed', (article) => {
                window.Beacon('article', article.id, { type: 'modal' });
              });
            `
          }
        </script>
      </Helmet>
    </>
  );
};

export default SubUserHelpScoutBeacon;