import React, {useState, useContext }from "react";
import {Button, Modal, ModalBody, ModalHeader} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import ThemeRoutes from "../routes/router";
import { useSelector } from 'react-redux';

import {StateContext} from "../utils/context";

const ContainerTab = ({ name, buttonArr }) => {
  const {currentUser} = useContext(StateContext);
  const location = useLocation();
  // const history = useHistory();
  const history = useNavigate();
  const landings = useSelector((state) => state.landings)
  const musicLinksUrlParts = useSelector((state) => state.musicLinks)
  const [modalErrorOpen, setModalErrorOpen] = useState(false);
  const MAX_URL_PARTS = 10;
  const ALLOWED_PAYMENT_METHODS = 3;
  buttonArr = [];
  let routeList = ThemeRoutes;

  ThemeRoutes.forEach(function(item, index) {
    item.hasOwnProperty("addButton") && buttonArr.push(item);
  });

  const currentLocation = location.pathname;

  const newName = routeList.filter(i => {
    if ( !(i.path.includes(':id')) && i.path === currentLocation) {
      return i;
    } else if (i.path.includes(':id')){
      let newPathName = currentLocation.split('/');
      newPathName[2] = ':id';
      const joinded = newPathName.join('/');
      if (joinded === i.path) {
        return i
      }
    }
  });


  const handleClickLink = (path) => {

    if(location.pathname.split('/')[1] === 'landing' && landings.length >= 5){
      setModalErrorOpen(true)
      return
    }
    history({pathname: `${path}/add`})
  }

  const fnToggle = () => {
    setModalErrorOpen(!modalErrorOpen)
  }

  return (
    <div className="page-breadcrumb rounded-2 bg-white">
      <div className="containerTab">
        <div>
          <h5 className="font-bold text-uppercase mb-0">{newName.length > 0 ? newName[0].headerText : ''}</h5>
        </div>

        <div className="flexBetween">
          {buttonArr.map(item => {
                if ((!currentUser.distribution) && (item.path === currentLocation) && (item.buttonText === "Add New Release")) {
                  return (
                    <>
                      <Button key={item.buttonText} color={''} className="btn btn-outline-primary" style={{marginRight: '10px'}} disabled>
                        {item.buttonText}
                      </Button>
                      <Button key={item.secondaryButtonText} 
                        color={''}
                        className="btn btn-outline-primary" disabled>
                        {item.secondaryButtonText}
                      </Button>
                    </>
                  )
                }
                else if ((!currentUser.unlimited_track_amount && (currentUser.total_allowed_track_amount <= 0)) &&  (item.path === currentLocation) && (item.buttonText === "Add New Release")) {
                  return (
                    <>
                      <Button key={item.buttonText} color={''} className="btn btn-outline-primary" style={{marginRight: '10px'}} disabled>
                        {item.buttonText}
                      </Button>
                      <Button key={item.secondaryButtonText} 
                        color={''}
                        className="btn btn-outline-primary" disabled>
                        {item.secondaryButtonText}
                      </Button>
                    </>
                  )
                }
                else if ((currentUser.distribution) && ((currentUser.unlimited_track_amount) || (currentUser.total_allowed_track_amount > 0)) && (item.path === currentLocation) && (item.path === "/releases")) {
                  return (
                    <>
                      <Button
                        key={item.buttonText} color={''}
                        className="btn btn-outline-primary"
                        onClick={() => history({pathname: `/releases/add`})}
                        style={{marginRight: '10px'}}
                        >
                        {item.buttonText}
                      </Button>
                      <Button
                        key={item.secondaryButtonText}
                        color={''}
                        className="btn btn-outline-primary"
                        onClick={() => history({pathname: `/releases/transfer`})}
                        disabled={!currentUser.release_transfer}
                        style={{marginRight: '10px'}}
                        >
                        {item.secondaryButtonText}
                      </Button>
                    </>
                  )
                }
                else if ((!currentUser.promotions) && (item.path === currentLocation) &&  (item.buttonText === "Add New Promotion" || item.buttonText === "Add New List" || item.buttonText === "Add New Recipient" || item.buttonText === "New Feature Request")) {
                  return (
                    <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                      {item.buttonText}
                    </Button>
                  )
                }
                else if ((currentUser.promotion_amount_left <= 0) && (item.path === currentLocation) &&  (item.buttonText === "Add New Promotion")) {
                  return (
                    <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                      {item.buttonText}
                    </Button>
                  )
                }
                else if ((!currentUser.artists) && (item.path === currentLocation) &&  (item.buttonText === "Add New Artist")) {
                  return (
                    <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                      {item.buttonText}
                    </Button>
                  )
                }
                else if ((!currentUser.labels_enabled) && (item.path === currentLocation) &&  (item.buttonText === "Add New Label")) {
                  return (
                    <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                      {item.buttonText}
                    </Button>
                  )
                }
                else if ((!currentUser.mastering) && (item.path === currentLocation) &&  (item.buttonText === "Add Mastering")) {
                  return (
                    <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                      {item.buttonText}
                    </Button>
                  )
                }
                else if ((currentUser.total_payment_methods >= ALLOWED_PAYMENT_METHODS) && (item.path === currentLocation) &&  (item.buttonText === "Add Payment Method")) {
                  return (
                    <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                      {item.buttonText}
                    </Button>
                  )
                }
                else if ((!currentUser.can_add_invoices || !currentUser.invoicing_available || currentUser.invoices_generating>0 ) && (item.path === currentLocation) &&  (item.buttonText === "Add Invoice")) {
                  if(!currentUser.is_sub_user) {
                    return (
                      <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                        {item.buttonText}
                      </Button>
                    )
                  }
                }
                else if ((!currentUser.artists_accounting ) && (item.path === currentLocation) &&  (item.buttonText === "Add New Accounting")) {
                  return (
                    <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                      {item.buttonText}
                    </Button>
                  )
                }
                else if ((!currentUser.link_in_bio ) && (item.path === currentLocation) &&  (item.buttonText === "Add Link Landing Page")) {
                  return (
                    <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                      {item.buttonText}
                    </Button>
                  )
                }
                else if ((!currentUser.music_link ) && (item.path === currentLocation) &&  (item.buttonText === "Add New Music Link")) {
                  return (
                    <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                      {item.buttonText}
                    </Button>
                  )
                }
                else if ((!currentUser.music_link ) && (item.path === currentLocation) &&  (item.buttonText === "Add New Music Link Urlpart")) {
                  return (
                    <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                      {item.buttonText}
                    </Button>
                  )
                }
                else if ((item.path === currentLocation) &&  (item.buttonText === "Add New Sub-User")) {
                    if(currentUser.is_premium_user && !currentUser.is_sub_user)
                    {
                      return (
                        <Button 
                          key={item.buttonText} color={''}                          
                          onClick={() => history({pathname: `/sub-users/add`})}
                          className="btn btn-outline-primary"
                        >
                          {item.buttonText}
                        </Button>
                      )
                    }
                    else
                    {
                      return (
                        <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                          {item.buttonText}
                        </Button>
                      )
                    }
                }
                else if ((currentUser.credits<=0) &&  (item.path === currentLocation) && (item.buttonText === "Add Mastering")) {
                  return (
                    <Button key={item.buttonText} color={''} className="btn btn-outline-primary" disabled>
                      {item.buttonText}
                    </Button>
                  )
                }
                else {
                  return item.path === currentLocation && (
                    <>
                      {item.path === '/music-link' && <Button
                        key={`${item.name}_1`}
                        color={''}
                        className="btn btn-outline-primary"
                        onClick={() => history({pathname: `/music-link-urlpart`})}
                        style={{marginRight: '10px'}}
                      >
                        {item.secondaryButtonText}
                      </Button>}
                      <Button
                        key={item.name}
                        color={''}
                        className="btn btn-outline-primary"
                        onClick={() => handleClickLink(item.path)}
                        disabled={['/music-link-urlpart'].includes(item.path) && (!currentUser.is_premium_user && musicLinksUrlParts?.length > (MAX_URL_PARTS - 1))}
                      >
                        {item.buttonText}
                      </Button>
                    </>
                  )
                }
            }


          )}
          {/* <!--a
            className="btn btn-danger text-white float-right ml-3 d-md-block"
            href="https://platform.movemusic.io/help"
            rel="noopener noreferrer"
          >
            Help Center
          </a--> */}

          <Modal isOpen={modalErrorOpen} toggle={fnToggle} centered={true}>
            <ModalHeader>
              Sorry, but you can create only 5 landings
            </ModalHeader>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ContainerTab;
