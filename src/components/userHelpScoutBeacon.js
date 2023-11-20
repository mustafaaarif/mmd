import React, { useContext } from "react";
import { StateContext } from "../utils/context";
import { Helmet } from "react-helmet";


const UserHelpScoutBeacon = () => {
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
            ` window.Beacon('init', '1b06c5cd-1e64-454a-92bf-a03657e1d471');
              window.Beacon('on', 'article-viewed', (article) => {
                window.Beacon('article', article.id, { type: 'modal' });
              });
              window.Beacon('identify', {
                'signature': '${currentUser.helpscout_hmac}',
                'name': '${currentUser.first_name} ${currentUser.last_name}',
                'email': '${currentUser.email}',
                'company': '${currentUser.company}',
                'user-id': '${currentUser.id}',
                'sub-user': '${currentUser.is_sub_user}',
                'platform_user-type': '${currentUser.user_type_long}',
                'can-add-invoices': '${currentUser.can_add_invoices}',
                'credits': '${currentUser.credits}',
                'allowed-track-amount': '${currentUser.allowed_track_amount}',
                'deal': '${currentUser.deal}',
                'labels': '${currentUser.labels}',
                'business-type': '${currentUser.business_type_long}',
                'business-registration-number': '${currentUser.business_reg_number}',
                'national-tax-number': '${currentUser.national_tax_number}',
                'vat-number': '${currentUser.vat}',
                'vat-status': '${currentUser.vat_status}',
                'payment-method': '${currentUser.preferred_payment_method_long}',
                'contract-expiration': '${currentUser.contract_expiry}',
                'signed-up': '${currentUser.date_joined}',
                'address': '${currentUser.street_and_number}',
                'city': '${currentUser.city}',
                'postalCode': '${currentUser.postal_code}',
                'country': '${currentUser.country}',
                'country_mmd': '${currentUser.country}',
                'phone':  '${currentUser.phone}',
                'soundcloud': '${currentUser.soundcloud}',
                'facebook': '${currentUser.facebook}',
                'twitter': '${currentUser.twitter}',
              });
            `
          }
        </script>
      </Helmet>
    </>
  );
};

export default UserHelpScoutBeacon;