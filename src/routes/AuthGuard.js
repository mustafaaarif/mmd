import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useFetch } from '../utils/fetchHook';
import StateContext from "../utils/context";
import { setCookie, removeCookie, getCookie } from "../jwt/_helpers/cookie";

const AuthGuard = (props) => {

  const { children } = props;
  const { setCurrentUser, token } = useContext(StateContext);

  const [isSubUser, isSubUserSET] = useState(false);
  const [bulkUploadEnabled, bulkUploadEnabledSET] = useState(false);
  const [canAddInvoices, canAddInvoicesSET] = useState(false);
  const [canAddAccounting, canAddAccountingSET] = useState(false);
  const [canAddEditMusicLink, canAddEditMusicLinkSET] = useState(false);
  const [canAddEditLinkLandingPage, canAddEditLinkLandingPageSET] = useState(false);
  const [canAddEditSubUser, canAddEditSubUserSET] = useState(false);
  const [canAddPaymentMethod, canAddPaymentMethodSET] = useState(false);
  const [releaseTransferEnabled, releaseTransferEnabledSET] = useState(false);
  const [distributionEnabled, distributionEnabledSET] = useState(false);
  const [promotionsEnabled, promotionsEnabledSET] = useState(false);
  const [artistsEnabled, artistsEnabledSET] = useState(false);
  const [labelsEnabled, labelsEnabledSET] = useState(false);
  const [masteringEnabled, masteringEnabledSET] = useState(false);

  // removeCookie('token')
  // setCookie('token','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAwMzUwMTEzLCJpYXQiOjE3MDAxNzczMTMsImp0aSI6IjQyOGVkNmYyNGU2YjRkZTc4ZTEwOTdhYzg4OGQ2MDQ5IiwidXNlcl9pZCI6MTJ9.9HVwcwh-nv9Z5wG39ULQleU7xeqiKjGZouUAahe9neY')

  const [data] = useFetch("GET", "users/", token);

  useEffect(() => {
    if (data.count > 0) {
      const currentUser = data.results[0];
      setCurrentUser(currentUser);
      if (currentUser.is_sub_user) {
        isSubUserSET(true);
      }
      if (currentUser.bulk_upload) {
        bulkUploadEnabledSET(true);
      }
      if (currentUser.artists_accounting) {
        canAddAccountingSET(true);
      }
      if (currentUser.music_link) {
        canAddEditMusicLinkSET(true);
      }
      if (currentUser.link_in_bio) {
        canAddEditLinkLandingPageSET(true);
      }
      if (currentUser.can_add_invoices && currentUser.invoicing_available && currentUser.invoices_generating === 0) {
        canAddInvoicesSET(true);
      }
      if (currentUser.is_premium_user) {
        canAddEditSubUserSET(true);
      }
      if (currentUser.total_payment_methods <= 3) {
        canAddPaymentMethodSET(true);
      }
      if (currentUser.distribution) {
        distributionEnabledSET(true);
      }
      if (currentUser.release_transfer) {
        releaseTransferEnabledSET(true);
      }
      if (currentUser.promotions) {
        promotionsEnabledSET(true);
      }
      if (currentUser.artists) {
        artistsEnabledSET(true);
      }
      if (currentUser.labels_enabled) {
        labelsEnabledSET(true);
      }
      if (currentUser.mastering) {
        masteringEnabledSET(true);
      }
    }
    // eslint-disable-next-line
  }, [data])


  const originUrl = window.location.origin;
  const urlPath = window.location.pathname;

  const musicLinkRequest = originUrl.includes("musiclink.io");
  const linkInBioRequest = originUrl.includes("mylnk.io");
  const invoicesUrl = urlPath.includes("invoices");
  const tokensUrl = urlPath.includes("tokens");
  const subUserUrl = urlPath.includes("sub-users");
  const accountingAddUrl = urlPath.includes("accounting/add");
  const invoicesAddUrl = urlPath.includes("invoices/add");
  const musicLinkAddEditUrl = urlPath.includes("music-link") && (urlPath.includes("add") || urlPath.includes("update") || urlPath.includes("view-stats"));
  const linkLandingPageAddEditUrl = urlPath.includes("link-landing-page") && (urlPath.includes("add") || urlPath.includes("update") || urlPath.includes("view-stats"));
  const subUsersAddEditUrl = urlPath.includes("sub-users") && (urlPath.includes("add") || urlPath.includes("update"));
  const paymentMethodAddUrl = urlPath.includes("payment-methods/add");
  const distributionUrl = urlPath.includes("releases") && (urlPath.includes("add") || urlPath.includes("update") || urlPath.includes("view") || urlPath.includes("tracks"));
  const releaseTransferUrl = urlPath.includes("releases") && urlPath.includes("transfer");
  const promotionsUrl = urlPath.includes("promotions") && (urlPath.includes("add") || urlPath.includes("update") || urlPath.includes("view"));
  const listsUrl = urlPath.includes("lists") && (urlPath.includes("add") || urlPath.includes("update"));
  const recipientsUrl = urlPath.includes("recipients") && (urlPath.includes("add") || urlPath.includes("update"));
  const featureUrl = urlPath.includes("feature") && urlPath.includes("add");
  const artistsUrl = urlPath.includes("artists") && (urlPath.includes("add") || urlPath.includes("update") || urlPath.includes("view-details"));
  const labelsUrl = urlPath.includes("labels") && (urlPath.includes("add") || urlPath.includes("update"));
  const masteringUrl = urlPath.includes("mastering") && (urlPath.includes("add") || urlPath.includes("update") || urlPath.includes("view") || urlPath.includes("edit-parameters"));

  if ((musicLinkRequest || linkInBioRequest) && !token) {
    window.location.href = "https://www.movemusic.io";
  }

  else if (!token) {
    return <Navigate to={'/authentication/login'} />
  }

  else {

    // Not authorized to access Invoicing, Sub-users modules

    if (isSubUser && (invoicesUrl || subUserUrl)) {
      return <Navigate to={'/'} />
    }

    // Not authorized to access Tokens module

    if (!bulkUploadEnabled && tokensUrl) {
      return <Navigate to={'/'} />
    }

    // Not authorized to access Releases module

    if (!distributionEnabled && distributionUrl) {
      return <Navigate to={'/releases'} />
    }

    // Not authorized to access Releases Transfer module

    if (!releaseTransferEnabled && releaseTransferUrl) {
      return <Navigate to={'/releases'} />
    }

    // Not authorized to access Artists module

    if (!artistsEnabled && artistsUrl) {
      return <Navigate to={'/artists'} />
    }

    // Not authorized to access Labels module

    if (!labelsEnabled && labelsUrl) {
      return <Navigate to={'/labels'} />
    }

    // Not authorized to access Promotions module

    if (!promotionsEnabled && promotionsUrl) {
      return <Navigate to={'/promotions'} />
    }

    // Not authorized to access Lists module

    if (!promotionsEnabled && listsUrl) {
      return <Navigate to={'/lists'} />
    }

    // Not authorized to access Recipients module

    if (!promotionsEnabled && recipientsUrl) {
      return <Navigate to={'/recipients'} />
    }

    // Not authorized to access Feature Request module

    if (!promotionsEnabled && featureUrl) {
      return <Navigate to={'/feature'} />
    }

    // Not authorized to Add/Edit Sub-Users

    if (!canAddEditSubUser && subUsersAddEditUrl) {
      return <Navigate to={'/sub-users'} />
    }

    // Not authorized to Add Invoices               
    if (!canAddInvoices && invoicesAddUrl) {
      return <Navigate to={'/invoices'} />
    }

    // Not authorized to Add Accounting                
    if (!canAddAccounting && accountingAddUrl) {
      return <Navigate to={'/accounting'} />
    }

    // Not authorized to Add/Edit/ViewStats For Music Link And Music Link Url Parts                
    if (!canAddEditMusicLink && musicLinkAddEditUrl) {
      return <Navigate to={'/music-link'} />
    }

    // Not authorized to Add/Edit For Link Landing Page                
    if (!canAddEditLinkLandingPage && linkLandingPageAddEditUrl) {
      return <Navigate to={'/link-landing-page'} />
    }

    // Not allowed to Add a new Payment Method                
    if (!canAddPaymentMethod && paymentMethodAddUrl) {
      return <Navigate to={'/payment-methods'} />
    }

    // Not authorized to access Mastering module

    if (!masteringEnabled && masteringUrl) {
      return <Navigate to={'/mastering'} />
    }
  }

  return <>{children}</>;
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default AuthGuard;
