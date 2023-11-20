// import { BrowserRouter, Outlet} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container } from 'reactstrap';
import Header from './header/Header';
import Customizer from './customizer/Customizer';
import Sidebar from './sidebars/vertical/Sidebar';
import HorizontalHeader from './header/HorizontalHeader';
import HorizontalSidebar from './sidebars/horizontal/HorizontalSidebar';
import routerOrg from '../routes/Router';
import Footer from "./footer/footer"
import { Routes, Route } from 'react-router-dom';
import ContainerTab from "../components/containerTab"
import ThemeRoutes from '../routes/Router';

const FullLayout = () => {
  const customizerToggle = useSelector((state) => state.customizer.customizerSidebar);
  const toggleMiniSidebar = useSelector((state) => state.customizer.isMiniSidebar);
  const showMobileSidebar = useSelector((state) => state.customizer.isMobileSidebar);
  const topbarFixed = useSelector((state) => state.customizer.isTopbarFixed);
  const LayoutHorizontal = useSelector((state) => state.customizer.isLayoutHorizontal);
  const isFixedSidebar = useSelector((state) => state.customizer.isSidebarFixed);

  return (
    <main>
      <div
        className={`pageWrapper d-md-block d-lg-flex ${toggleMiniSidebar ? 'isMiniSidebar' : ''}`}
      >
        {/******** Sidebar **********/}
        {LayoutHorizontal ? (
          ''
        ) : (
          <aside className={`sidebarArea ${showMobileSidebar ? 'showSidebar' : ''}`}>
            <Sidebar />
          </aside>
        )}
        {/********Content Area**********/}

        <div className={`contentArea ${topbarFixed ? 'fixedTopbar' : ''}`}>
          {/********header**********/}
          {LayoutHorizontal ? <HorizontalHeader /> : <Header />}
          {LayoutHorizontal ? <HorizontalSidebar /> : ''}
          {/********Middle Content**********/}
          <Container fluid className="p-4 pb-2 boxContainer">
            <ContainerTab {...ThemeRoutes} className="py-2" />
          </Container>
          <Container fluid className="p-4 boxContainer">
            <div className={isFixedSidebar && LayoutHorizontal ? 'HsidebarFixed' : ''}>
              <Routes>
                {routerOrg.map((prop, key) => {
                  if (prop.navlabel) {
                    return null;
                  } else if (prop.collapse) {
                    return prop.child.map((prop2, key2) => {
                      if (prop2.collapse) {
                        return prop2.subchild.map((prop3, key3) => {
                          return (
                            <Route
                              exact={prop3.exact}
                              title={prop3.name}
                              path={prop3.path}
                              element={<prop3.component />}
                              key={key3}
                            />
                          );
                        });
                      }
                      return (
                        <Route
                          exact={prop2.exact}
                          title={prop2.name}
                          path={prop2.path}
                          element={<prop2.component />}
                          key={key2}
                        />
                      );
                    });
                  } else if (prop.redirect) {
                    return (
                      <Redirect from={prop.path} to={prop.pathTo} key={key} />
                    );
                  } else if (prop.invisible) {
                    return (
                      <Route
                        exact={prop.exact}
                        path={prop.path}
                        title={prop.name}
                        element={<prop.component />}
                        key={key}
                      />
                    );
                  } else {
                    return (
                      <Route
                        exact={prop.exact}
                        title={prop.name}
                        path={prop.path}
                        element={<prop.component />}
                        key={key}
                      />
                    );
                  }
                })}
              </Routes>
              {/* <Outlet /> */}
            </div>
            <Customizer className={customizerToggle ? 'showCustomizer' : ''} />
            {showMobileSidebar || customizerToggle ? <div className="sidebarOverlay" /> : ''}
          </Container>
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default FullLayout;
