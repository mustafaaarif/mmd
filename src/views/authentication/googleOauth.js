import React, { useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';

import { authenticationService } from "../../jwt/_services";
import { useLocation } from "react-router-dom";

import GoogleLogoSvg from "../../assets/images/google-logo.svg"

import "./googleOauth.css"


const GoogleOauth = () => {

    const location = useLocation();
    // const history = useHistory();

    const { from } = location.state || { from: { pathname: "/" } }

    const [authError, setAuthError] = useState(false);
    const [authErrorMsg, setAuthErrorMsg] = useState("");

    const googleLogin = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (codeResponse) => {
            let authCode = codeResponse.code;
            authenticationService.socialAuth("google-oauth2", authCode, "postmessage", "login").then(
                user => {
                    // history.push(from);
                },
                error => {
                    console.log("Error in login with Google");
                    console.log(error.message);
                    setAuthError(true);
                    setAuthErrorMsg(error.message);
                }
            );
        },
        onError: (errorResponse) => {
            console.log("Error in login with Google");
            console.log(errorResponse);
            setAuthErrorMsg("Error in login with Google");
            setAuthError(true);
        },
    });

  return (
    <>
        <div className="mt-3" onClick={() => { 
            setAuthError(false);
            setAuthErrorMsg("");
            googleLogin();
        }}>
            <span className="google-btn">
                <img width="20px" height="100%" style={{marginBottom: '3px', marginRight: '16px'}} alt="Google login" src={GoogleLogoSvg} />
                Sign in with Google
            </span>
        </div>
        
        {authError &&
            <div className={'alert alert-danger mt-3'}>{authErrorMsg}</div>
        }
    </>
  );
};


export default GoogleOauth;