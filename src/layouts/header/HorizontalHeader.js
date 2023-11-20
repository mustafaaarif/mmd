import React, { useContext } from 'react';
import {
  Navbar,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Container,
} from 'reactstrap';
import { Bell, MessageSquare, Grid } from 'react-feather';
import { useSelector, useDispatch } from 'react-redux';
import SimpleBar from 'simplebar-react';
import MessageDD from './MessageDD';
import MegaDD from './MegaDD';
import NotificationDD from './NotificationDD';
import user1 from '../../assets/images/users/user1.jpg';

import { ToggleMobileSidebar } from '../../store/customizer/CustomizerSlice';
import { authenticationService } from '../../jwt/_services';
import ProfileDD from './ProfileDD';

import HorizontalLogo from '../logo/HorizontalLogo';
import UserCredits from "./UserCredits";
import StateContext from '../../utils/context';

const HorizontalHeader = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const topbarColor = useSelector((state) => state.customizer.topbarBg);
  const isMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);
  const dispatch = useDispatch();
  const { token,currentUser, setCurrentUser } = useContext(StateContext);
  const { profile_image } = currentUser;

  return (
    <Navbar
      color={''}
      dark={!isDarkMode}
      light={isDarkMode}
      expand="lg"
      className="shadow HorizontalTopbar p-0"
      style={{ background: "rgb(180, 11, 190) linear-gradient(239deg, rgb(180, 11, 190) 0%, rgb(0, 10, 96) 80%)" }}
    >
      <Container className="d-flex align-items-center">
        {/******************************/}
        {/**********Logo**********/}
        {/******************************/}
        <div className="pe-4 py-1">
          <HorizontalLogo />
        </div>
        {/******************************/}
        {/**********Toggle Buttons**********/}
        {/******************************/}

        <Nav className="me-auto" navbar>
          <button
            // color={topbarColor}
            className="d-sm-block z-2 btn text-white btn-lg border-0 d-lg-none"
            onClick={() => dispatch(ToggleMobileSidebar())}
          >
            <i className={`bi ${isMobileSidebar ? 'bi-x' : 'bi-list'}`} />
          </button>
        </Nav>
        {/******************************/}
        {/**********Mega DD**********/}
        {/******************************/}
        {/* <UncontrolledDropdown className="mega-dropdown mx-1">
          <DropdownToggle className="bg-transparent border-0" color={topbarColor}>
            <Grid size={18} />
          </DropdownToggle>
          <DropdownMenu>
            <MegaDD />
          </DropdownMenu>
        </UncontrolledDropdown> */}
        {/******************************/}
        {/**********Notification DD**********/}
        {/******************************/}
        {/* <UncontrolledDropdown>
          <DropdownToggle color={topbarColor}>
            <Bell size={18} />
          </DropdownToggle>
          <DropdownMenu className="ddWidth" end>
            <DropdownItem header>
              <span className="mb-0">Notifications</span>
            </DropdownItem>
            <DropdownItem divider />
            <SimpleBar style={{ maxHeight: '350px' }}>
              <NotificationDD />
            </SimpleBar>
            <DropdownItem divider />
            <div className="p-2 px-3">
              <Button color="primary" size="sm" block>
                Check All
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown> */}
        {/******************************/}
        {/**********Message DD**********/}
        {/******************************/}
        {/* <UncontrolledDropdown className="mx-1">
          <DropdownToggle color={topbarColor}>
            <MessageSquare size={18} />
          </DropdownToggle>
          <DropdownMenu className="ddWidth" end>
            <DropdownItem header>
              <span className="mb-0">Messages</span>
            </DropdownItem>
            <DropdownItem divider />
            <SimpleBar style={{ maxHeight: '350px' }}>
              <MessageDD />
            </SimpleBar>
            <DropdownItem divider />
            <div className="p-2 px-3">
              <Button color="primary" size="sm" block>
                Check All
              </Button>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown> */}
        {/******************************/}
        {/**********Profile DD**********/}
        {/******************************/}
        {token ? (
          <>
            <UncontrolledDropdown>
              <UserCredits />
            </UncontrolledDropdown>

            <UncontrolledDropdown>
              <DropdownToggle tag="span" className="p-2 cursor-pointer ">
                <img src={profile_image ? Object.keys(profile_image).length > 0 ? profile_image.thumb_small : user1 : user1} alt="profile" className="rounded-circle" width="40" />
              </DropdownToggle>
              <DropdownMenu className="ddWidth" end>
                <ProfileDD />

                <div className="p-2 px-3">
                  <Button color="danger" size="sm" onClick={() => {
                    authenticationService.logout();
                    setTimeout(() => {
                      setCurrentUser({});
                    }, 1000)
                  }}>
                    Logout
                  </Button>
                </div>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        ) : (
          <Button className={'mr-3'} color="success">
            <Link to={'/authentication/login'}> LogIn </Link>
          </Button>
        )}
      </Container>
    </Navbar>
  );
};

export default HorizontalHeader;
