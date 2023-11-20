import Labels from "../views/labels/labels"; // M yameen
import LabelsAdd from "../views/labels/labelsAdd"; // M yameen
// import LabelsUpdate from "../views/labels/labelsUpdate";
import Artists from "../views/artists/artists";
// import ArtistsAdd from "../views/artists/artistsAdd";
// import ArtistsUpdate from "../views/artists/artistsUpdate";
import Accounting from "../views/accounting/accounting";
// import AccountingBreakdown from "../views/accounting/accountingBreakdown";
// import AddAccounting from "../views/accounting/addAccounting";
import EarningsDrilldown from "../views/earningsDrilldown/earningsDrilldown";
import Trends from "../views/trends/trends";
// import Invoices from "../views/invoices/invoices";
// import InvoiceAdd from "../views/invoices/invoiceAdd";
// import Tracks from "../views/tracks/tracks";
import Dashboard from "../views/dashboard/dashboard";
import Promotions from "../views/promotions/promotions";
// import PromotionAdd from "../views/promotions/promotionAdd";
// import PromotionUpdate from "../views/promotions/promotionUpdate";
// import PromoDetails from "../views/promotions/promotionDetails";
import Recipients from "../views/recipients/recipients";
// import RecipientsUpdate from "../views/recipients/recipientsUpdate";
// import RecipientAddNew from "../views/recipients/recipientsAdd";
import Lists from "../views/lists/lists";
// import ListUpdate from "../views/lists/listUpdate";
// import ListAdd from "../views/lists/listAdd";
import Releases from "../views/releases/releases";
import ReleaseForm from "../views/releases/releaseForm";
// import ReleaseUpdate from "../views/releases/releaseUpdate";
// import ReleaseView from "../views/releases/releaseView";
import Feature from "../views/feature/feature";
// import FeatureAdd from "../views/feature/featureAdd";
// import Contact from "../views/contact/contact";
// import Statements from "../views/statements/statements";
// import SubuserStatements from "../views/subuserStatements/subuserStatements";
// import SubuserStatementsViewOnly from "../views/subuserStatements/subuserStatementsViewOnly";
// import Profile from "../views/profile/profile";
// import Help from "../views/help/help";
// import LandingPage from "../views/Landing";
// import CreateLandingPage from "../views/Landing/CreatelandingForm";
// import DemoManagement from "../views/Landing/DemoManagment";
// import SubmittingForm from "../views/Landing/submittingForm";
import MusicLink from "../views/musicLink";
// import AddMusicLink from "../views/musicLink/add";
// import MusicLinkUrlpart from "../views/musicLinkUrlpart";
// import AddMusicLinkUrlpart from "../views/musicLinkUrlpart/add";
// import MusicLinkViewStat from "../views/musicLink/viewStats";
// import SubUsers from "../views/subUsers/subUsers";
// import SubUsersAdd from "../views/subUsers/subUsersAdd";
// import SubUsersUpdate from "../views/subUsers/subUsersUpdate";
import Mastering from "../views/mastering/mastering";
// import AddMastering from "../views/mastering/addMastering";
// import UpdateMastering from "../views/mastering/updateMastering";
// import MasteringSongs from "../views/mastering/masteringSongs";
// import SongParametersUpdate from "../views/mastering/songParametersUpdate";
// import PaymentMethodAdd from "../views/paymentMethods/paymentMethodAdd";
// import PaymentMethodUpdate from "../views/paymentMethods/paymentMethodUpdate";
// import PaymentMethods from "../views/paymentMethods/paymentMethods";
// import OrderCredits from "../views/credits/creditsOrder";

// import Terms from "../views/Utils/terms";
// import Policy from "../views/Utils/policy";
// import { exact } from "prop-types";
// import PurchaseHistory from "../views/purchaseHistory/purchaseHistory";
// import ViewArtistDetails from "../views/artists/viewArtistDetails";
import ArtistsWishlist from "../views/artists/artistWishlist";
// import ArtistsAddFromWishlist from "../views/artists/artistsAddFromWishlist";
// import LinkLandingPageAdd from "../views/linkLandingPages/linkLandingPageAdd";
// import LinkLandingPageUpdate from "../views/linkLandingPages/linkLandingPageUpdate";
import LinkLandingPages from "../views/linkLandingPages/linkLandingPages";
// import LinkLandingPageAnalytics from "../views/linkLandingPages/linkLandingPageAnalytics";
import EarningsPrediction from "../views/prediction/prediction";
// import DeliveryConfirmation from "../views/deliveryConfirmation/confirmation";
// import DeliveryConfirmationBreakdown from "../views/deliveryConfirmation/confirmationBreakdown";
// import TransferRelease from "../views/releases/transferRelease";
// import Tokens from "../views/tokens/tokens";

var ThemeRoutes = [
  {
    path: "/releases",
    exact: true,
    name: "Releases",
    icon: "mdi mdi-format-list-bulleted text-mmddarkblue",
    component: Releases,
    addButton: true,
    buttonText: "Add New Release",
    secondaryButtonText: "Transfer Release",
    headerText: "Releases"
  },
  {
    path: "/releases/add",
    name: "Add new release",
    icon: "mdi mdi-format-list-bulleted text-mmddarkblue",
    component: ReleaseForm,
    invisible: true,
    headerText: "Releases"
  },
  // {
  //   path: "/releases/:id/update/",
  //   name: "Update release",
  //   component: ReleaseUpdate,
  //   invisible: true,
  //   headerText: "Releases"
  // },
  //   {
  //     path: "/releases/:id/view/",
  //     name: "Release Details",
  //     component: ReleaseView,
  //     invisible: true,
  //     headerText: "Releases"
  //   },
  //   {
  //     path: "/releases/:id/tracks/",
  //     name: "Track List",
  //     component: Tracks,
  //     invisible: true,
  //     exact: true,
  //     headerText: "Releases"
  //   },
  //   {
  //     path: "/releases/transfer",
  //     name: "Transfer Release",
  //     component: TransferRelease,
  //     invisible: true,
  //     exact: true,
  //     headerText: "Releases"
  //   },
  //   {
  //     path: "/releases/:id/delivered-list/",
  //     name: "Delivered List",
  //     component: DeliveryConfirmation,
  //     invisible: true,
  //     exact: true,
  //     headerText: "Delivered List"
  //   },
  //   {
  //     path: "/delivery-list/:id/view/",
  //     name: "Store Delivery List",
  //     component: DeliveryConfirmationBreakdown,
  //     invisible: true,
  //     exact: true,
  //     headerText: "Store Delivery List"
  //   },
  {
    path: "/artists",
    name: "Artists",
    icon: "mdi mdi-account-multiple text-mmddarkblue",
    component: Artists,
    addButton: true,
    exact: true,
    buttonText: "Add New Artist",
    headerText: "Artists"
  },
  //   {
  //     path: "/artists/add",
  //     name: "Add New Artist",
  //     component: ArtistsAdd,
  //     invisible: true,
  //     headerText: "Artists"
  //   },
  //   {
  //     path: "/artists/:id/update/",
  //     name: "Update artist",
  //     component: ArtistsUpdate,
  //     invisible: true,
  //     headerText: "Artists"
  //   },
  //   {
  //     path: "/artists/:id/view-details",
  //     name: "View Artist Details",
  //     component: ViewArtistDetails,
  //     exact: true,
  //     invisible: true,
  //     headerText: "View Artist Details"
  //   },
  {
    path: "/artists-wishlist",
    name: "Artists Wishlist",
    icon: "mdi mdi-tag-heart text-mmddarkblue",
    component: ArtistsWishlist,
    exact: true,
    headerText: "Artists Wishlist"
  },
  // {
  //   path: "/artists-wishlist/:id/add-artist/",
  //   name: "Add Artist From Wishlist",
  //   component: ArtistsAddFromWishlist,
  //   invisible: true,
  //   headerText: "Add Artist From Wishlist"
  // },

  {
    path: "/trends",
    name: "Trends",
    icon: "mdi mdi-chart-pie text-mmddarkblue",
    component: Trends,
    headerText: "Trends"
  },

  {
    path: "/earnings",
    name: "Earnings",
    icon: "mdi mdi-chart-areaspline text-mmddarkblue",
    component: EarningsDrilldown,
    headerText: "Earnings Drilldown"
  },

  {
    path: "/accounting",
    name: "Smart Accounting",
    icon: "mdi mdi-calculator text-mmddarkblue",
    component: Accounting,
    headerText: "Smart Accounting",
    exact: true,
    addButton: true,
    buttonText: "Add New Accounting",
  },

  //   {
  //     path: "/accounting/add",
  //     name: "Add New Accounting",
  //     component: AddAccounting,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Add New Accounting",
  //   },

  //   {
  //     path: "/accounting/:id/view",
  //     name: "Accounting Breakdown",
  //     component: AccountingBreakdown,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Accounting Breakdown"
  //   },

  //   {
  //     path: "/invoices",
  //     name: "Invoices",
  //     icon: "ti ti-receipt text-mmddarkblue",
  //     component: Invoices,
  //     headerText: "Invoices",
  //     exact: true,
  //     invisible: true,
  //     addButton: true,
  //     buttonText: "Add Invoice",
  //   },

  //   {
  //     path: "/invoices/add",
  //     name: "Add Invoice",
  //     component: InvoiceAdd,
  //     invisible: true,
  //     headerText: "Add Invoice",
  //   },
  {
    invisible: false,
    path: "/music-link",
    icon: "mdi mdi-playlist-play text-mmddarkblue",
    component: MusicLink,
    name: "Music Link",
    addButton: true,
    buttonText: "Add New Music Link",
    headerText: "Music Link",
    exact: true,
    secondaryButtonText: "Music Link Url"
  },
  //   {
  //     path: "/music-link/add",
  //     name: "Add New Music Link",
  //     component: AddMusicLink,
  //     invisible: true,
  //     headerText: "Create Music Link",
  //     exact: true
  //   },
  //   {
  //     path: "/music-link/:id/update/",
  //     name: "Update music-link",
  //     component: AddMusicLink,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Music Link"
  //   },
  //   {
  //     path: "/music-link/:id/view-stats",
  //     name: "Music Link View Stats",
  //     component: MusicLinkViewStat,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Music Link View Stats"
  //   },
  //   {
  //     invisible: true,
  //     path: "/music-link-urlpart",
  //     icon: "mdi mdi-playlist-play text-mmddarkblue",
  //     component: MusicLinkUrlpart,
  //     name: "Music Link Urlpart",
  //     addButton: true,
  //     buttonText: "Add New Music Link Urlpart",
  //     headerText: "Music Link Urlpart",
  //     exact: true,
  //   },
  //   {
  //     path: "/music-link-urlpart/add",
  //     name: "Add New Music Link Urlpart",
  //     component: AddMusicLinkUrlpart,
  //     invisible: true,
  //     headerText: "Create Music Link Urlpart",
  //   },
  //   {
  //     path: "/music-link-urlpart/:id/update/",
  //     name: "Update music-link-urlpart",
  //     component: AddMusicLinkUrlpart,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Music Link Urlpart"
  //   },

  {
    invisible: false,
    path: "/link-landing-page",
    icon: "mdi mdi-link-variant text-mmddarkblue",
    component: LinkLandingPages,
    name: "Link Landing Page",
    addButton: true,
    buttonText: "Add Link Landing Page",
    headerText: "Link Landing Page",
    exact: true,
  },

  //   {
  //     path: "/link-landing-page/add",
  //     name: "Add Link Landing Page",
  //     component: LinkLandingPageAdd,
  //     invisible: true,
  //     headerText: "Link Landing Page",
  //     exact: true
  //   },

  //   {
  //     path: "/link-landing-page/:id/update/",
  //     name: "Update Link Landing Page",
  //     component: LinkLandingPageUpdate,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Link Landing Page"
  //   },

  //   {
  //     path: "/link-landing-page/:id/view-stats",
  //     name: "Link Landing Page Analytics",
  //     component: LinkLandingPageAnalytics,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Link Landing Page"
  //   },

  //   {
  //     invisible: true,
  //     path: "/demo/:suffix?/:token?",
  //     component: SubmittingForm,
  //     name: "SubmittingForm",
  //     headerText: "Submitting Form"
  //   },
  //   // {
  //   //   invisible: false,
  //   //   path: "/management",
  //   //   icon: "mdi mdi-chart-gantt text-danger",
  //   //   component: DemoManagement,
  //   //   name: "Demo Management",
  //   //   headerText: "Demo Management"
  //   // },
  {
    path: "/mastering",
    name: "Mastering",
    icon: "fas fa-sliders-h text-mmddarkblue",
    exact: true,
    component: Mastering,
    addButton: true,
    buttonText: "Add Mastering",
    headerText: "Audio Mastering",
  },
  //   {
  //     path: "/mastering/add",
  //     name: "Add Mastering",
  //     component: AddMastering,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Add Mastering",
  //   },
  //   {
  //     path: "/mastering/:id/update",
  //     name: "Audio Mastering",
  //     component: UpdateMastering,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Audio Mastering"
  //   },
  //   {
  //     path: "/mastering/:id/view",
  //     name: "Audio Mastering Songs",
  //     component: MasteringSongs,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Audio Mastering Songs"
  //   },
  //   {
  //     path: "/mastering/:id/edit-parameters/",
  //     name: "Audio Mastering Songs",
  //     component: SongParametersUpdate,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Audio Mastering Songs",
  //   },
  {
    path: "/earnings-prediction",
    name: "Earnings Prediction",
    icon: "mdi mdi-matrix text-mmddarkblue",
    exact: true,
    component: EarningsPrediction,
    headerText: "Earnings Prediction",
  },
    {
      path: "/promotions",
      name: "Promotions",
      exact: true,
      icon: "mdi mdi-play-circle text-mmddarkblue",
      component: Promotions,
      addButton: true,
      buttonText: "Add New Promotion",
      headerText: "Promotions"
    },
  //   {
  //     path: "/promotions/:id/view",
  //     name: "Promotion Details",
  //     component: PromoDetails,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Promotions"
  //   },
  //   {
  //     path: "/promotions/:id/update/",
  //     name: "Update Promotion",
  //     component: PromotionUpdate,
  //     exact: true,
  //     invisible: true,
  //     headerText: "Promotions"
  //   },
  //   {
  //     path: "/promotions/add",
  //     name: "Add New Promotion",
  //     component: PromotionAdd,
  //     invisible: true,
  //     headerText: "Promotions"
  //   },
    {
      path: "/recipients",
      name: "Recipients",
      exact: true,
      icon: "mdi mdi-comment-account text-mmddarkblue",
      component: Recipients,
      addButton: true,
      buttonText: "Add New Recipient",
      headerText: "Recipients"
    },

  //   {
  //     path: "/recipients/:id/update/",
  //     name: "Edit Recipient",
  //     component: RecipientsUpdate,
  //     invisible: true,
  //     headerText: "Recipients",
  //   },
  //   {
  //     path: "/recipients/add",
  //     name: "Add New Recipient",
  //     component: RecipientAddNew,
  //     invisible: true,
  //     headerText: "Recipients",
  //   },

    {
      path: "/lists",
      name: "Lists",
      icon: "mdi mdi-clipboard-text text-mmddarkblue",
      component: Lists,
      exact: true,
      addButton: true,
      buttonText: "Add New List",
      headerText: "Lists",
    },
  //   {
  //     path: `/lists/:id/update/`,
  //     name: "Edit List",
  //     component: ListUpdate,
  //     invisible: true,
  //     headerText: "Lists",
  //   },
  //   {
  //     path: `/lists/add`,
  //     name: "Add New List",
  //     component: ListAdd,
  //     invisible: true,
  //     headerText: "Add New List",
  //   },
    {
      path: "/feature",
      name: "Feature Request",
      component: Feature,
      icon: "mdi mdi-file-document-box text-mmddarkblue",
      exact: true,
      addButton: true,
      buttonText: "New Feature Request",
      headerText: "Feature request",
    },
  //   {
  //     path: "/feature/add",
  //     name: "Add new feature request",
  //     component: FeatureAdd,
  //     invisible: true,
  //     headerText: "Feature request",
  //   },
  //   {
  //     path: "/privacy-policy",
  //     exact: true,
  //     invisible: true,
  //     name: "Privacy Policy",
  //     component: Policy,
  //     headerText: "Privacy Policy"
  //   },
  //   {
  //     path: "/terms-and-conditions",
  //     exact: true,
  //     invisible: true,
  //     name: "Terms and Conditions",
  //     component: Terms,
  //     headerText: "Terms and Conditions"
  //   },
  //   /*{
  //     link: true,
  //     path:
  //       "https://docs.google.com/forms/d/e/1FAIpQLSdMdH8cWy0ejyEZ-amMKU2oCqTrz5sQ1HaS5fjO7IYyTweIbQ/viewform",
  //     name: "Spotify Playlist Pitch",
  //     icon: "fab fa-spotify"
  //   },*/
  //   {
  //     path: "/help",
  //     name: "Help & Contact",
  //     icon: "mdi mdi-help-circle text-warning",
  //     headerText: "Help & Contact",
  //     component: Help
  //   },
  //   {
  //     path: "/contact",
  //     name: "Contact & Featuring",
  //     icon: "fas fa-phone",
  //     headerText: "Contact & Featuring",
  //     component: Contact,
  //     invisible: true
  //   },
  //   {
  //     link: true,
  //     path: "https://airtable.com/shrJ0GvjLYKyLJ7at",
  //     name: "SC Whitelist",
  //     icon: "mdi mdi-soundcloud text-mmddarkblue",
  //   },
  //   {
  //     path: "/profile",
  //     name: "Profile",
  //     pathTo: "/profile",
  //     component: Profile,
  //     headerText: "My profile",
  //     invisible: true,
  //     exact: true
  //   },
  //   {
  //     path: "/tokens",
  //     name: "Tokens",
  //     pathTo: "/tokens",
  //     component: Tokens,
  //     headerText: "Tokens",
  //     invisible: true,
  //     exact: true
  //   },

  //   {
  //     invisible: true,
  //     path: "/payment-methods",
  //     exact: true,
  //     name: "Payment Methods",
  //     component: PaymentMethods,
  //     addButton: true,
  //     buttonText: "Add Payment Method",
  //     headerText: "My Payment Methods",
  //   },
  //   {
  //     invisible: true,
  //     path: "/payment-methods/add",
  //     name: "Add Payment Method",
  //     component: PaymentMethodAdd,
  //     headerText: "Add Payment Method",
  //     exact: true,
  //   },

  //   {
  //     invisible: true,
  //     path: "/payment-methods/:id/update/",
  //     name: "Update Payment Method",
  //     component: PaymentMethodUpdate,
  //     headerText: "Update Payment Method",
  //     exact: true,
  //   },

  //   {
  //     path: "/credits/order",
  //     name: "Order Credits",
  //     component: OrderCredits,
  //     headerText: "Order Credits",
  //     exact: true,
  //     icon: "mdi mdi-cart text-mmddarkblue",
  //   },

  //   {
  //     invisible: true,
  //     path: "/purchase-history",
  //     exact: true,
  //     name: "Purchase History",
  //     component: PurchaseHistory,
  //     headerText: "Purchase History",
  //   },

  //   {
  //     invisible: true,
  //     path: "/sub-users",
  //     exact: true,
  //     name: "Sub Users",
  //     icon: "fas fa-cloud",
  //     component: SubUsers,
  //     addButton: true,
  //     buttonText: "Add New Sub-User",
  //     headerText: "My Sub-Users",
  //   },
  //   {
  //     invisible: true,
  //     path: "/sub-users/add",
  //     name: "Add New Sub-User",
  //     component: SubUsersAdd,
  //     headerText: "Add New Sub-User",
  //   },
  //   {
  //     invisible: true,
  //     path: "/sub-users/:id/update/",
  //     name: "Edit Sub-User",
  //     component: SubUsersUpdate,
  //     headerText: "Edit Sub-user",
  //   },
    {
      invisible: true,
      path: "/labels",
      exact: true,
      name: "Labels",
      icon: "fas fa-cloud",
      component: Labels,
      addButton: true,
      buttonText: "Add New Label",
      headerText: "My Labels",
    },
    {
      invisible: true,
      path: "/labels/add",
      name: "Add New Label",
      component: LabelsAdd,
      headerText: "Add New Label",
    },
  //   {
  //     invisible: true,
  //     path: "/labels/:id/update/",
  //     name: "Edit Label",
  //     component: LabelsUpdate,
  //     headerText: "My Labels",
  //   },
  //   {
  //     invisible: true,
  //     path: "/statements",
  //     name: "Statements",
  //     icon: "fas fa-cloud",
  //     component: Statements,
  //     headerText: "Financial Statements",
  //   },
  //   {
  //     invisible: true,
  //     path: "/subuser-statements",
  //     name: "Subuser Statements",
  //     icon: "fas fa-cloud",
  //     component: SubuserStatements,
  //     headerText: "Subuser Statements",
  //   },
  //   {
  //     invisible: true,
  //     path: "/user-statements",
  //     name: "User Statements",
  //     icon: "fas fa-cloud",
  //     component: SubuserStatementsViewOnly,
  //     headerText: "User Statements",
  //   },
  {
    invisible: true,
    path: "/",
    component: Dashboard,
    pathTo: "/dashboard",
    name: "Homepage",
    headerText: "Homepage"
  }
];
export default ThemeRoutes;