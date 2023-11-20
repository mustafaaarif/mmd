import React, { Suspense, lazy, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Modal } from "reactstrap";
import { useSelector } from 'react-redux';
import ThemeSelector from './layouts/theme/ThemeSelector';
import Loader from './layouts/loader/Loader';
import StateContext from './utils/context';
import { getCookie, setCookie } from './jwt/_helpers';
import Loadable from './layouts/loader/Loadable';


const PromotionRate = Loadable(lazy(() => import("./views/promotions/promotionRate")));
const PromotionShare = Loadable(lazy(() => import("./views/promotions/promotionShare")));
const Unsubscribe = Loadable(lazy(() => import("./views/unsubscribe/unsubscribe")));


const ForgotPassword_step2 = Loadable(lazy(() => import("./views/ForgotPassword/ForgotPassword_step2")));
const MusicLinkLandingPage = Loadable(lazy(() => import("./views/musicLink/landingPage")));


// import { IntercomProvider } from 'react-use-intercom';
const CreateSubmittingForm = Loadable(lazy(() => import("./views/Landing/UnAuthSubmittingForm")));
const BrokenLink = Loadable(lazy(() => import("./views/musicLink/brokenLink")));
const TransactionSuccess = Loadable(lazy(() => import("./views/credits/transactionSuccess")));
const TransactionFailure = Loadable(lazy(() => import("./views/credits/transactionFailure")));


import { GoogleOAuthProvider } from '@react-oauth/google';
const LinkLandingPage = Loadable(lazy(() => import("./views/linkLandingPages/brokenBioLink")));
const BrokenBioLink = Loadable(lazy(() => import("./views/linkLandingPages/brokenBioLink")));


const AuthGuard = Loadable(lazy(() => import('./routes/AuthGuard')));
const FullLayout = Loadable(lazy(() => import('./layouts/FullLayout')));
const Login = Loadable(lazy(() => import('./views/authentication/login')));



function App() {

  Modal.prototype.componentWillUnmount = function () {
    if (this.props.onExit) {
      this.props.onExit();
    }

    if (this._element) {
      this.destroy();
      if (this.props.isOpen || this.state.isOpen) {
        this.close();
      }
    }

    this._isMounted = false;
  };

  setCookie('token','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAwNTU0ODgzLCJpYXQiOjE3MDAzODIwODMsImp0aSI6IjYxMDczMDg0YjIzMjQ2ZjJiODI3MTQzNWRhNzNiNTYzIiwidXNlcl9pZCI6MTJ9.sMk66FHybuagoDqbSsC0JYw7hLaOulnJ7Qhd1ELtMGg')

  // const routing = useRoutes(Themeroutes);
const GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;

  const direction = useSelector((state) => state.customizer.isRTL);
  const isMode = useSelector((state) => state.customizer.isDark);

  const [currentUser, setCurrentUser] = useState({});
  const [token, setToken] = useState(getCookie('token'));
  const stateValue = { currentUser, setCurrentUser, token, setToken };

  return (
    <Suspense fallback={<Loader />}>
      <StateContext.Provider value={stateValue}>
        <GoogleOAuthProvider clientId={GOOGLE_OAUTH_CLIENT_ID}>
          <div
            className={`${direction ? 'rtl' : 'ltr'} ${isMode ? 'dark' : ''}`}
            dir={direction ? 'rtl' : 'ltr'}
          >
            <ThemeSelector />
            <Routes>
              <Route
                path="/promotions/:promotionId/release-feedback/:recipientToken/"
                exact={true}
                component={PromotionRate}
              />
              <Route
                path="/unsubscribe/:id/:token/"
                exact={true}
                component={Unsubscribe}
              />

              <Route
                path="/promo-share/:token/"
                exact={true}
                component={PromotionShare}
              />
              <Route
                path="/forgot-my-password/confirm/:token/"
                exact={true}
                component={ForgotPassword_step2}
              />
              {!token && (
                <Route
                  path="/demo/:suffix?/:token?"
                  exact={true}
                  component={CreateSubmittingForm}
                />
              )}
              <Route
                path="/l/:urlpart1/:urlpart2"
                exact={true}
                component={MusicLinkLandingPage}
              />
              <Route
                path="/l/:urlpart1/"
                exact={true}
                component={BrokenLink}
              />;
              <Route
                path="/l/notFound/"
                exact={true}
                component={BrokenLink}
              />;
              <Route
                path="/l/"
                exact={true}
                render={() => (window.location.assign('https://www.movemusic.io/'))}
              />;
              <Route
                path="/b/:back_url/"
                exact={true}
                component={LinkLandingPage}
              />
              <Route
                path="/bioNotFound/"
                exact={true}
                component={BrokenBioLink}
              />;
              <Route
                path="/b/"
                exact={true}
                render={() => (window.location.assign('https://www.movemusic.io/'))}
              />;

              <Route path="/credits/order/transactionSuccessfull" exact={true} component={TransactionSuccess} />;
              <Route path="/credits/order/transactionCancelled" exact={true} component={TransactionFailure} />;



              <Route path="*" element={<AuthGuard><FullLayout /></AuthGuard>} />;
              <Route path="/authentication/login" element={<Login />} />;

              {/* 
                {indexRoutes.map((prop, key) => {
                return (
                  <PrivateRoute
                    path={prop.path}
                    key={key}
                    component={prop.component}
                  />
                );
              })} */}
            </Routes>
          </div>
        </GoogleOAuthProvider>
      </StateContext.Provider>
    </Suspense>
  );
}

export default App
