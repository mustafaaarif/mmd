import React, {useState} from "react";
import {Alert, PopoverBody, UncontrolledPopover} from "reactstrap";
import {Link, useLocation, useRouteMatch, useHistory} from "react-router-dom";


export const UrlSuffixFormatter = (row) => {
  const [alertVisible, setAlertVisible] = useState(false);

  return (
    <div>
      <i className={"fa fa-link fa-2x store-link-icon"} aria-hidden="true" id={row['url_suffix']}>{''}</i>

      {Object.keys(row).length > 0 && (
        <UncontrolledPopover trigger="legacy" placement="bottom" target={row['url_suffix']}>
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

              <tr>
                <td className="p-2">
                  <i className="fa fa-clone fa-lg store-link-icon"
                     aria-hidden="true"
                     onClick={() => {
                       navigator.clipboard.writeText(`${window.location.origin}/demo/${row['url_suffix']}`);
                       setAlertVisible(true);
                       setTimeout(() => {
                         setAlertVisible(false);
                       }, 2000);
                     }}>
                  </i>
                </td>
                <td className="p-2">
                  <Link to={{pathname: row['url_suffix']}} target="_blank" rel="noopener noreferrer">
                    <i className="fa fa-external-link-alt fa-lg store-link-icon" style={{color: '#4f5467'}} aria-hidden="true">{''}</i>
                  </Link>
                </td>
              </tr>


              </tbody>
            </table>
          </PopoverBody>
        </UncontrolledPopover>
      )}

    </div>
  );
};
