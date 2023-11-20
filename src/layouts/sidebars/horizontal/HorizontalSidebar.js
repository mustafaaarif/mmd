import { Container, Nav } from 'reactstrap';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarData from '../sidebardata/HorizontalSidebarData';
import NavSubItem from './NavSubItem';
import NavSingleItem from './NavSingleItem';
import ThemeRoutes from '../../../routes/Router';

const HorizontalSidebar = () => {
  const activeBg = useSelector((state) => state.customizer.sidebarBg);
  const location = useLocation();
  const currentURL = location.pathname.split('/').slice(0, -1).join('/');
  const isFixed = useSelector((state) => state.customizer.isSidebarFixed);
  const isMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);

  console.log(ThemeRoutes)

  return (
    <div
      className={`horizontalNav shadow bg-${activeBg}  ${isFixed ? 'fixedSidebar' : ''} ${isMobileSidebar ? 'showSidebar' : ''
        }`}
    >
      <Container>
        <Nav className={activeBg === 'white' ? '' : 'lightText'}>
          {ThemeRoutes.map((navi ,index) => {

            if (navi.redirect) {
              return null;
            }

            if (navi.invisible) {
              return null;
            }

            if (navi.caption) {
              return (
                <div
                  className="navCaption fw-bold mt-4 d-none d-sm-block d-md-none"
                  key={navi.caption}
                >
                  {navi.caption}
                </div>
              );
            }
            // if (navi.children) {
            //   return (
            //     <NavSubItem
            //       key={navi.id}
            //       icon={navi.icon}
            //       title={navi.title}
            //       items={navi.children}
            //       suffix={navi.suffix}
            //       ddType={navi.ddType}
            //       activeBck={activeBg}
            //       suffixColor={navi.suffixColor}
            //       isUrl={currentURL === navi.href}
            //     />
            //   );
            // }
            return (
              <NavSingleItem
                key={index}
                //toggle={() => toggle(navi.id)}
                className={location.pathname === navi.path ? 'activeLink' : ''}
                to={navi.path}
                title={navi.name}
                // suffix={navi.suffix}
                // suffixColor={navi.suffixColor}
                icon={<i className={navi.icon}></i>}
              />
            );
          })}
        </Nav>
      </Container>
    </div>
  );
};

export default HorizontalSidebar;
