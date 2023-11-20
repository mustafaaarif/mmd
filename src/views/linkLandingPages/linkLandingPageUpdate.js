import React, { useState, useEffect, useRef, useContext } from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
import formValidation from "../../validations/es6/core/Core";

import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Row,
  CardBody,
  Col,
  FormGroup,
  Label,
  FormText,
  Button,
  CustomInput,
  Alert,
  Form,
  Input
} from "reactstrap";

import classnames from 'classnames';

import Select from "react-select";

import { getCookie } from "../../jwt/_helpers/cookie";
import { opt } from "./linkLandingPageUpdateValidation";
import ModalConfirm from "../../components/modalConfirm";
import {StateContext} from "../../utils/context";

import SocialLinksRow from "./socialLinksRow";
import FeaturedLinksRow from "./featuredLinksRow";

import LandingPageLayoutOnePreview from "./landingPageLayoutOnePreview";
import LandingPageLayoutTwoPreview from "./landingPageLayoutTwoPreview";

import { useFetch } from "../../utils/fetchHook";
import CustomColorPickerInput from "../../components/customColorPickerInput";
import CustomColorPickerGradient from "../../components/customColorGradientInput";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const getOptionLabelByValue = (value, options) => {
  const option = options.find((option) => option.value === value);
  return option ? option.label : null;
}

const layoutOptions = [
  { value: 1, label: "Layout One" },
  { value: 2, label: "Layout Two" },
];

const buttonCornerOptions = [
  { value: 1, label: "Rounded" },
  { value: 2, label: "Semi Rounded" },
  { value: 3, label: "Squared" },
];

const buttonStyleOptions = [
  { value: 1, label: "Outlined" },
  { value: 2, label: "Filled" },
];

const socialIconPlacementOptions = [
  { value: 1, label: "Header" },
  { value: 2, label: "Bottom Of The Body" },
];

const socialIconColorOptions = [
  { value: 1, label: "Color" },
  { value: 2, label: "Black" },
  { value: 3, label: "White" },
];

const fontOptions = [
  { value: 1, label: "Abril Fatface" },
  { value: 2, label: "Amatic SC" },
  { value: 3, label: "Antonio" },
  { value: 4, label: "Bowlby One SC" },
  { value: 5, label: "Cinzel" },
  { value: 6, label: "Courgette" },
  { value: 7, label: "Figtree" },
  { value: 8, label: "Fjalla One" },
  { value: 9, label: "Fredoka One" },
  { value: 10, label: "Inter" },
  { value: 11, label: "Josefin Slab" },
  { value: 12, label: "Kanit" },
  { value: 13, label: "Lato" },
  { value: 14, label: "Lora" },
  { value: 15, label: "Mansalva" },
  { value: 16, label: "Merriweather" },
  { value: 17, label: "Montserrat" },
  { value: 18, label: "Mukta" },
  { value: 19, label: "Noto Sans" },
  { value: 20, label: "Nunito Sans" },
  { value: 21, label: "Oswald" },
  { value: 22, label: "Poppins" },
  { value: 23, label: "Playfair Display" },
  { value: 24, label: "PT Sans" },
  { value: 25, label: "Raleway" },
  { value: 26, label: "Roboto" },
  { value: 27, label: "Rubik" },
  { value: 28, label: "Source Sans Pro" },
  { value: 29, label: "Ubuntu" },
  { value: 30, label: "Work Sans" },
];

const platformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
];

let gradientDegreeDict = {
  1: "180deg",
  2: "90deg",
  3: "135deg",
  4: "225deg",
  5: "270deg",
  6: "0deg"
};

const platformValidUrls = {
  "instagram": "instagram.com",
  "facebook": "facebook.com",
  "twitter": "twitter.com",
  "linkedin": "linkedin.com",
  "tiktok": "tiktok.com",
  "youtube": "youtube.com",
  "other": "",
};

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
  
let keyRandom = makeid(20);

const defaultHeaderGradient = {"first_color": "#b40bbe", "second_color": "#000a60", "direction": 1};
const defaultBodyGradient = {"first_color": "#B6B6CE", "second_color": "#ffffff", "direction": 1};

const validUrlRegex = /^(?:https?|http):\/\/(?:[^\s\/]+\.)?[^\s\/]+\.[^\s\/]+(?:\/[^\/\s]*)*$/;

const titleValidators = {
  validators: {
    notEmpty: {
      message: "Label is required"
    },
    stringLength: {
      min: 0,
      max: 100,
      message: "Label cannot exceed 100 characters"
    },
  }
};

const destinationUrlValidators = {
  validators: {
    notEmpty: {
      message: "Destination Url is required"
    },
    regexp: {
      regexp: validUrlRegex,
      message: 'Invalid url',
    },
  }
};

const getSocialPlatformValidators = (platformName, platformKey) => {
  let spValidators = {
    validators: {
      notEmpty: {
        message: "Destination Url is required"
      },
      regexp: {
        regexp: validUrlRegex,
        message: 'Invalid Url',
      },
      promise: {
        message: `Invalid  ${platformName} Url`,
        promise: function(input) {
          return new Promise(function(resolve, reject) {
            if(input.value !== "") {
              let destinationUrl = input.value;
              let validPlatformUrl = platformValidUrls[platformKey];
              let socialUrlValid = destinationUrl.includes(validPlatformUrl);
              if(destinationUrl !== "other" && !socialUrlValid) {
                resolve({ valid: false, message: `Invalid  ${platformName} Url`});
              } else {
                resolve({valid: true, message: ""});
              }
            }
            else {
              reject({valid: false, message: `Invalid ${platformName} Url`});
            }
          })
        }
      },
    }
  }
  return spValidators;
}

const LinkLandingPageUpdate = ({ match, name }) => {
  const currentID = match.url.split("/")[2];
  const token = getCookie("token");

  const [availableDomains, availableDomainsError, availableDomainsLoading] = useFetch("GET", "link-landingpages/available-domains/", token, false);
  const [initFormData] = useFetch("GET", `link-landingpages/${currentID}/`, token);

  const fvRef = useRef(null);
  const stateRef = useRef();
  const stateRefBg = useRef();

  const [colorScheme, setColorScheme] = useState(1);

  const [openModal, setToggleModal] = useState(false);
  const [dataModal, setDataModal] = useState(null);

    //ajax handlers
    const [success, setSuccess] = useState(false);
    const [errorPut, setError] = useState(false);
  
    const [logoSelected, setLogo] = useState(false);
    const [logoPreview, setLogoPreview] = useState(false);
    const [logoImgUrl, setLogoImgUrl] = useState(null);
  
    const [bgSelected, setBg] = useState(false);
    const [bgPreview, setBgPreview] = useState(false);
    const [bgImgUrl, setBgImgUrl] = useState(null);
  
    const [pageTitle, setPageTitle] = useState("");
    const [description, setDescription] = useState("");
    const [headerColor, setHeaderColor] = useState("#ffffff");
    const [bodyColor, setBodyColor] = useState("#ffffff");
    const [headerGradient, setHeaderGradient] = useState(defaultHeaderGradient);
    const [bodyGradient, setBodyGradient] = useState(defaultBodyGradient);
    const [titleColor, setTitleColor] = useState("#ffffff");
    const [descriptionColor, setDescriptionColor] = useState("#ffffff");
    const [buttonColor, setButtonColor] = useState("#000a60");
    const [buttonTextColor, setButtonTextColor] = useState("#000A60");
    const [backgroundColor, setBackgroundColor] = useState("#111111");
  
    const [layout, setLayout] = useState({ value: 1, label: "Layout One"});
    const [font, setFont] = useState({ value: 26, label: "Roboto"});
    const [btnCorners, setBtnCorners] = useState({ value: 1, label: "Rounded"});
    const [btnStyle, setBtnStyle] = useState({ value: 1, label: "Outlined"});
    const [socialIconPlacement, setSocialIconPlacement] = useState({ value: 1, label: "Header"});
    const [socialIconColor, setSocialIconColor] = useState({ value: 1, label: "Color"});
  
    const [redirect, setRedirect] = useState(false);
  
    stateRef.current = logoSelected;
    stateRefBg.current = bgSelected;
  
    const featuredLinksListREF = useRef();
    const [listOfFeaturedLinks, listOfFeaturedLinksSET] = useState([{ order: 0,  title: "", destination_url: "", key: keyRandom }]);
    featuredLinksListREF.current = listOfFeaturedLinks;

  const [headerSingleColorSelected, headerSingleColorSelectedSET] = useState(true);
  const [bodySingleColorSelected, bodySingleColorSelectedSET] = useState(true);
  const [headerGradientSelected, headerGradientSelectedSET] = useState(false);
  const [bodyGradientSelected, bodyGradientSelectedSET] = useState(false);

  const {currentUser} = useContext(StateContext);

  const [backgroundBlurred, backgroundBlurredSET] = useState(false);
  const [blurStrength, blurStrengthSET] = useState(6);

  const [premadeColors, error, isloading] = useFetch("GET", "premade-colors/?page_size=9999", token, false);
  const [premadeColorOptions, setPremadeColorOptions] = useState([]);
  const [premadeColorSelected, setPremadeColorSelected] = useState(null);
  const [customColorSelected, setCustomColorSelected] = useState(null);

  const [domainOps, setDomainOps] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);

  useEffect(() => {
    if (availableDomains) {
      if(availableDomains.results) {
        let landingPageDomains = [];
        availableDomains.results.map(domain => {
          let domain_object = {};
          let domain_label = domain.domain_url;
          domain_label = domain_label.replace("https://", "").replace("http://", "");
          if (domain.premium) {
            domain_label = `${domain_label} [Premium]`
          }
          domain_object["label"] = domain_label;
          domain_object["value"] = domain.id;
          domain_object["premium"] = domain.premium;
          landingPageDomains.push(domain_object);
        });
        setDomainOps(landingPageDomains);
        if (initFormData && initFormData.domain) {
          const selectedDomainOption = landingPageDomains.filter(({ value }) => value === initFormData.domain);
          setSelectedDomain(selectedDomainOption);
        }
        else {
          setSelectedDomain(landingPageDomains[0]);
        }
      }
    }
  }, [availableDomains, initFormData, isloading, availableDomainsLoading]);

  useEffect(() => {
    if(initFormData.color_scheme)
    {
      if(initFormData.color_scheme === 1)
      {
        setColorScheme(1)
      } else {
        setColorScheme(2)
      }
    }

    if(initFormData.header_color_scheme)
    {
      if(initFormData.header_color_scheme === 1)
      {
        headerSingleColorSelectedSET(true)
        headerGradientSelectedSET(false)
      } else {
        headerSingleColorSelectedSET(false)
        headerGradientSelectedSET(true)
      }
    }

    if(initFormData.body_color_scheme)
    {
      if(initFormData.body_color_scheme === 1)
      {
        bodySingleColorSelectedSET(true)
        bodyGradientSelectedSET(false)
      } else {
        bodySingleColorSelectedSET(false)
        bodyGradientSelectedSET(true)
      }
    }

    if (initFormData.logo?.full_size)
    {
      setLogoImgUrl(initFormData.logo.full_size);
    }

    if (initFormData.background_image?.full_size)
    {
      setBgImgUrl(initFormData.background_image?.full_size)
    }

    if (initFormData.title)
    {
      setPageTitle(initFormData.title)
    }

    if (initFormData.short_description)
    {
      setDescription(initFormData.short_description)
    }

    if (initFormData.button_text_color)
    {
      setButtonTextColor(initFormData.button_text_color)
    }

    if (initFormData.header_gradient) {
      setHeaderGradient(initFormData.header_gradient!==null? initFormData.header_gradient: defaultHeaderGradient);
    }
    if (initFormData.body_gradient) {
      setBodyGradient(initFormData.body_gradient!==null? initFormData.body_gradient: defaultBodyGradient);
    }

    if (initFormData.layout) {
      let layoutLabel = getOptionLabelByValue(initFormData.layout, layoutOptions);
      setLayout({value: initFormData.layout, label: layoutLabel })
    }

    if (initFormData.font) {
      let fontLabel = getOptionLabelByValue(initFormData.font, fontOptions);
      setFont({value: initFormData.font, label: fontLabel })
    }

    if (initFormData.social_icon_placement) {
      let socialIconPlacementLabel = getOptionLabelByValue(initFormData.social_icon_placement, socialIconPlacementOptions);
      setSocialIconPlacement({value: initFormData.social_icon_placement, label: socialIconPlacementLabel })
    }

    if (initFormData.social_icon_color) {
      let socialIconColorLabel = getOptionLabelByValue(initFormData.social_icon_color, socialIconColorOptions);
      setSocialIconColor({value: initFormData.social_icon_color, label: socialIconColorLabel })
    }

    if (initFormData.button_style) {
      let buttonStyleLabel = getOptionLabelByValue(initFormData.button_style, buttonStyleOptions);
      setBtnStyle({value: initFormData.button_style, label: buttonStyleLabel })
    }

    if (initFormData.button_corners) {
      let buttonCornersLabel = getOptionLabelByValue(initFormData.button_corners, buttonCornerOptions);
      setBtnCorners({value: initFormData.button_corners, label: buttonCornersLabel })
    }

    if (initFormData.header_color)
    {
      setHeaderColor(initFormData.header_color)
    }

    if (initFormData.body_color)
    {
      setBodyColor(initFormData.body_color)
    }

    if (initFormData.title_color)
    {
      setTitleColor(initFormData.title_color)
    }

    if (initFormData.description_color)
    {
      setDescriptionColor(initFormData.description_color)
    }

    if (initFormData.button_color)
    {
      setButtonColor(initFormData.button_color)
    }

    if (initFormData.button_text_color)
    {
      setButtonTextColor(initFormData.button_text_color)
    }

    if (initFormData.background_color)
    {
      setBackgroundColor(initFormData.background_color);
    }

    if (initFormData.premade_color)
    {
      const pmColorObj = premadeColorOptions.filter(obj => obj.id === initFormData.premade_color);

      setPremadeColorSelected(
        pmColorObj[0]
      )
    }

    if(initFormData.background_blurred)
    {
      backgroundBlurredSET(initFormData.background_blurred)
    }

    blurStrengthSET(initFormData.blur_strength)

    setCustomColorSelected({
      title_color: initFormData.title_color,
      description_color: initFormData.description_color,
      button_color: initFormData.button_color,
      button_text_color: initFormData.button_text_color,
      header_color: initFormData.header_color,
      body_color: initFormData.body_color,
      header_gradient: initFormData.header_gradient!==null? initFormData.header_gradient: defaultHeaderGradient,
      body_gradient: initFormData.body_gradient!==null? initFormData.body_gradient: defaultBodyGradient,
      background_color: initFormData.background_color,
      header_color_scheme: initFormData.header_color_scheme,
      body_color_scheme: initFormData.body_color_scheme,
    })

    if (initFormData.social_links && initFormData.social_links.length>0) {
      
      const socialLinks = initFormData.social_links.map(i => {
        let randomKey = makeid(20);
        let socialLinkPlatform = { "value": i.platform, "label": getOptionLabelByValue(i.platform, platformOptions) }
        if(fvRef.current)
        {
          let fv = fvRef.current;
          let indexToAdd = i.order;
          fv.addField('social_link[' + indexToAdd + '].destination_url_facebook', getSocialPlatformValidators("Facebook", "facebook"));
          fv.addField('social_link[' + indexToAdd + '].destination_url_twitter', getSocialPlatformValidators("Twitter", "twitter"));
          fv.addField('social_link[' + indexToAdd + '].destination_url_tiktok', getSocialPlatformValidators("Tiktok", "tiktok"));
          fv.addField('social_link[' + indexToAdd + '].destination_url_youtube', getSocialPlatformValidators("Youtube", "youtube"));
          fv.addField('social_link[' + indexToAdd + '].destination_url_linkedin', getSocialPlatformValidators("LinkedIn", "linkedin"));
          fv.addField('social_link[' + indexToAdd + '].destination_url_instagram', getSocialPlatformValidators("Instagram", "instagram"));
        }
        return (
          {
            order: i.order,
            platform: socialLinkPlatform,
            destination_url: i.destination_url,
            key: randomKey,
          }
        )
      })
      listOfSocialLinksSET(socialLinks);
    }

    if (initFormData.featured_links && initFormData.featured_links.length>0) {
      
        const featuredLinks = initFormData.featured_links.map(i => {
          let randomKey = makeid(20);
          if(fvRef.current)
          {
            let fv = fvRef.current;
            let indexToAdd = i.order;
            fv.addField('featured_link[' + indexToAdd + '].title', titleValidators).addField('featured_link[' + indexToAdd + '].destination_url', destinationUrlValidators);
          }
          return (
            {
              order: i.order,
              title: i.title,
              destination_url: i.destination_url,
              key: randomKey,
            }
          )
        })
        listOfFeaturedLinksSET(featuredLinks);
      }
  }, [initFormData, isloading]);


  useEffect(() => {
    let colorSelected = premadeColorSelected;
    if(colorScheme === 2) {
      colorSelected = customColorSelected;
    }

    if(colorSelected!==null)
    {
      setTitleColor(colorSelected.title_color);
      setDescriptionColor(colorSelected.description_color);
      setButtonColor(colorSelected.button_color);
      setButtonTextColor(colorSelected.button_text_color);
      setHeaderColor(colorSelected.header_color);
      setBodyColor(colorSelected.body_color);
      setHeaderGradient(colorSelected.header_gradient!==null? colorSelected.header_gradient: defaultHeaderGradient);
      setBodyGradient(colorSelected.body_gradient!==null? colorSelected.body_gradient: defaultBodyGradient);
      setBackgroundColor(colorSelected.background_color);
      if(colorSelected.header_color_scheme === 1) {
        headerSingleColorSelectedSET(true);
        headerGradientSelectedSET(false);
      }
      else {
        headerSingleColorSelectedSET(false);
        headerGradientSelectedSET(true);
      }
      if(colorSelected.body_color_scheme === 1) {
        bodySingleColorSelectedSET(true);
        bodyGradientSelectedSET(false);
      }
      else {
        bodySingleColorSelectedSET(false);
        bodyGradientSelectedSET(true);
      }
    }
  }, [customColorSelected, premadeColorSelected, colorScheme]);


  useEffect(() => {
    if(premadeColors.results && premadeColors.results.length>0)
    {
      setPremadeColorOptions(premadeColors.results);
    }
  }, [premadeColors]);

  useEffect(() => {
    if(logoPreview)
    {
      let logoImgPreviewUrl = URL.createObjectURL(logoPreview)
      setLogoImgUrl(logoImgPreviewUrl);
    }
  }, [logoPreview]);


  useEffect(() => {
    if(bgPreview)
    {
      let bgImgPreviewUrl = URL.createObjectURL(bgPreview)
      setBgImgUrl(bgImgPreviewUrl);
    }
  }, [bgPreview]);


  const linkOrderChange = (type, key, index, order, statename, setStateName) => {
    const current = { key: key, index: index, order: order };
    let sibling;

    if (type === "up") {
      if (index === 0) {
        return false
      } else {
        sibling = {
          key: statename[index - 1].key,
          index: index - 1,
          order: statename[index - 1].order
        };
      }
    } else if (type === "down") {
      if (index + 1 === statename.length) {
        return false
      } else {
        sibling = {
          key: statename[index + 1].key,
          index: index + 1,
          order: statename[index + 1].order
        };
      }
    }

    const newList = statename.map((element, i) => {
      if (element.key === current.key) {
        element.order = sibling.order;
      }
      if (element.key === sibling.key) {
        element.order = current.order;
      }
      return element;
    });
    setStateName(newList.sort((a, b) => a.order - b.order))
  }

  const manageFeaturedLinksData = (index, key, value) => {
    const newList = listOfFeaturedLinks.map((element, i) => {
      if (index === i) {
        element[key] = value;
      }
      return element;
    });
    listOfFeaturedLinksSET(newList);
  };

  const addNewFeaturedLink = (obj) => {
    listOfFeaturedLinksSET(obj)
    if(fvRef.current)
    {
      let fv = fvRef.current;
      let indexToAdd = obj.length-1;
      fv.addField('featured_link[' + indexToAdd + '].title', titleValidators).addField('featured_link[' + indexToAdd + '].destination_url', destinationUrlValidators);
    }
  }

  const removeFeaturedLink = (index) => {
    if (listOfFeaturedLinks.length === 1) return false;

    const newList = listOfFeaturedLinks.filter((element, i) => {
      if (index === i) {
        return false;
      } else {
        if (i < index) {
          return element;
        } else {
          element.order = element.order - 1;
          return element;
        }
      }
    });
    listOfFeaturedLinksSET(newList)

    if(fvRef.current)
    {
      let fv = fvRef.current;
      let indexToRemove = newList.length;
      fv.removeField('featured_link[' + indexToRemove + '].title').removeField('featured_link[' + indexToRemove + '].destination_url');
    }
  }

  const featuredLinkProps = {
    listOfFeaturedLinks,
    manageFeaturedLinksData,
    listOfFeaturedLinksSET,
    addNewFeaturedLink,
    removeFeaturedLink,
    linkOrderChange,
  };

  const socialLinksListREF = useRef();
  const [listOfSocialLinks, listOfSocialLinksSET] = useState([{ order: 0,  platform: { value: "facebook", label: "Facebook" }, destination_url: "", key: keyRandom }]);
  socialLinksListREF.current = listOfSocialLinks;

  const manageSocialLinksData = (index, key, value) => {
    const newList = listOfSocialLinks.map((element, i) => {
      if (index === i) {
        element[key] = value;
      }
      return element;
    });
    listOfSocialLinksSET(newList);
  };

  const addNewSocialLink = (obj) => {
    listOfSocialLinksSET(obj)
    if(fvRef.current)
    {
      let fv = fvRef.current;
      let indexToAdd = obj.length-1;
      fv.addField('social_link[' + indexToAdd + '].destination_url_facebook', getSocialPlatformValidators("Facebook", "facebook"));
      fv.addField('social_link[' + indexToAdd + '].destination_url_twitter', getSocialPlatformValidators("Twitter", "twitter"));
      fv.addField('social_link[' + indexToAdd + '].destination_url_tiktok', getSocialPlatformValidators("Tiktok", "tiktok"));
      fv.addField('social_link[' + indexToAdd + '].destination_url_youtube', getSocialPlatformValidators("Youtube", "youtube"));
      fv.addField('social_link[' + indexToAdd + '].destination_url_linkedin', getSocialPlatformValidators("LinkedIn", "linkedin"));
      fv.addField('social_link[' + indexToAdd + '].destination_url_instagram', getSocialPlatformValidators("Instagram", "instagram"));
    }
  }

  const removeSocialLink = (index) => {
    if (listOfSocialLinks.length === 0) return false;

    const newList = listOfSocialLinks.filter((element, i) => {
      if (index === i) {
        return false;
      } else {
        if (i < index) {
          return element;
        } else {
          element.order = element.order - 1;
          return element;
        }
      }
    });
    listOfSocialLinksSET(newList)
    if(fvRef.current)
    {
      let fv = fvRef.current;
      let indexToRemove = newList.length;
      fv.removeField('social_link[' + indexToRemove + '].destination_url_facebook', getSocialPlatformValidators("Facebook", "facebook"));
      fv.removeField('social_link[' + indexToRemove + '].destination_url_twitter', getSocialPlatformValidators("Twitter", "twitter"));
      fv.removeField('social_link[' + indexToRemove + '].destination_url_tiktok', getSocialPlatformValidators("Tiktok", "tiktok"));
      fv.removeField('social_link[' + indexToRemove + '].destination_url_youtube', getSocialPlatformValidators("Youtube", "youtube"));
      fv.removeField('social_link[' + indexToRemove + '].destination_url_linkedin', getSocialPlatformValidators("LinkedIn", "linkedin"));
      fv.removeField('social_link[' + indexToRemove + '].destination_url_instagram', getSocialPlatformValidators("Instagram", "instagram"));
    }
  }

  const socialLinkProps = {
    listOfSocialLinks,
    manageSocialLinksData,
    listOfSocialLinksSET,
    addNewSocialLink,
    removeSocialLink,
    linkOrderChange,
  };

  useEffect(() => {
    let formID = document.getElementById("updateLinkLandingPage");
    let fv = formValidation(formID, opt)
    fvRef.current = fv;
    fv.on("core.element.validated", function(e) {
      if (e.valid) {
          if (e.field === "title")
          {
            setPageTitle(e.element.value)
          }
          if (e.field === "short_description")
          {
            setDescription(e.element.value)
          }
          const messages = [].slice.call(formID.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
          messages.forEach((messageEle) => {
              messageEle.style.display = 'none';
          });
          return;
        }
      }
    )
    .on("core.validator.validated", function(e) {
      const item = e.field;
      if (item === 'logo' && e.result.valid) {
        const file = e.element.files[0];
        handleIMG_AWS(file, 'media/linklandingpage_logos/', 'logo');
      }
      if (item === 'background_image' && e.result.valid) {
        const file = e.element.files[0];
        handleIMG_AWS(file, 'media/linklandingpage_bg_images/', 'bgImage');
      }
      if (!e.result.valid) {
        const messages = [].slice.call(formID.querySelectorAll('[data-field="' + e.field + '"][data-validator]'));
        for(let i = 0; i < messages.length - 1; i++) {
          const messageEle = messages[i];
          messageEle.style.display = 'none';
        }
      }
    })
    .on("core.form.valid", async e => {
      
      const formatedFeaturedLinks = await listOfFeaturedLinks.reduce((filteredFeaturedLinks, featured_link, index) => {
        if (featured_link.title && featured_link.destination_url) {
          let linkObj = {
            "order": featured_link.order,
            "title": featured_link.title,
            "destination_url": featured_link.destination_url,
          };
          filteredFeaturedLinks.push(linkObj);
        }
        return filteredFeaturedLinks;
      }, []);

      const formatedSocialLinks = await listOfSocialLinks.reduce((filteredSocialLinks, social_link, index) => {
        if (social_link.destination_url) {
          let linkObj = {
            "order": social_link.order,
            "platform": social_link.platform.value,
            "destination_url": social_link.destination_url,
          };
          filteredSocialLinks.push(linkObj);
        }
        return filteredSocialLinks;
      }, []);

      const getData = inputName => formID.querySelector(`[name="${inputName}"]`).value;

      const checkData = (name, newVal) => (name !== newVal ? true : false);

      const dataObject = {
        ...(checkData(initFormData.title, getData("title")) && {"title": getData("title")}),
        ...(checkData(initFormData.short_description, getData("short_description")) && {"short_description": getData("short_description")}),
        ...(checkData(initFormData.back_url, getData("back_url")) && {"back_url": getData("back_url")}),
        ...(stateRef.current) && {"logo": stateRef.current},
        ...(stateRefBg.current) && {"background_image": stateRefBg.current},
        ...(checkData(initFormData.layout, layout.value) && {"layout": layout.value}),
        ...(checkData(initFormData.font, font.value) && {"font": font.value}),
        ...(checkData(initFormData.button_corners, btnCorners.value) && {"button_corners": btnCorners.value}),
        ...(checkData(initFormData.button_style, btnStyle.value) && {"button_style": btnStyle.value}),
        ...(checkData(initFormData.social_icon_placement, socialIconPlacement.value) && {"social_icon_placement": socialIconPlacement.value}),
        ...(checkData(initFormData.social_icon_color, socialIconColor.value) && {"social_icon_color": socialIconColor.value}),
        ...(checkData(initFormData.color_scheme, colorScheme) && {"color_scheme": colorScheme}),
        ...(checkData(initFormData.background_blurred, backgroundBlurred) && {"background_blurred": backgroundBlurred}),
        ...(checkData(initFormData.blur_strength, blurStrength) && {"blur_strength": blurStrength}),
        "domain": (selectedDomain !== null) ? selectedDomain.value: null,
        "premade_color": colorScheme === 1 ? premadeColorSelected.id: null,
        "custom_color": colorScheme === 2 ? {
          ...(initFormData.custom_color) && {"id": initFormData.custom_color},
          "name": `Colors for ${getData("title")}`,
          "header_color": headerColor,
          "body_color": bodyColor,
          "header_color_scheme": headerSingleColorSelected? 1: 2,
          "body_color_scheme": bodySingleColorSelected? 1: 2,
          "header_gradient": headerSingleColorSelected? null: headerGradient,
          "body_gradient": bodySingleColorSelected? null: bodyGradient,
          "title_color": titleColor,
          "description_color": descriptionColor,
          "button_color": buttonColor,
          "button_text_color": buttonTextColor,
          "background_color": backgroundColor,
          "created_by": currentUser.id,
        }: null,
        "social_links": formatedSocialLinks,
        "featured_links": formatedFeaturedLinks,
      };
      setDataModal(dataObject);
      setToggleModal(true);

    });
  });

  const handleIMG_AWS = (file, path, uploadType) => {
    let fileParts = file.name;
    let fileType = fileParts.split('.')[1];
    axios({
      method: "GET",
      mode: 'cors',
      url: `${API_URL}obtain-signed-url-for-upload/?filename=${path}${fileParts}&filetype=${fileType}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-key": X_API_KEY,
      }
    }).then(function(response) {
      const URL = response.data.signed_url.url;
      const full_URL= response.data.signed_url.fields.key;
      let split = full_URL.split('/');
      split.shift();
      let transformedURL = split.join('/');

      const signedOpts = response.data.signed_url.fields;
      var options = {
        mode: 'cors',
        headers: {
          "Content-Type": fileType
        }
      };
      var postData = new FormData();
      for (let i in signedOpts) {
        postData.append(i, signedOpts[i]);
      }
      postData.append("file", file);

      axios
        .post(URL, postData, options)
        .then(result => {
          if(uploadType==="logo")
          {
            setLogo(transformedURL);
          }
          if(uploadType==="bgImage")
          {
            setBg(transformedURL);
          }
        })
        .catch(error => {
          console.log("ERROR " + error);
        });
    })
  }


  return (
    <div>
      <Row>
        <Col xl={9} lg={7} md={7} sm={7} xm={6}>
          <Card>
            <CardBody>
              <h3>Update Link Landing Page</h3>
              <Form id="updateLinkLandingPage">
                <FormGroup>
                  <Label>Domain</Label>
                  <Select
                    name="domain"
                    value={selectedDomain}
                    closeMenuOnSelect={true}
                    options={domainOps}
                    className="artistType"
                    placeholder="Select Domain"
                    onChange={(e) => {
                      setSelectedDomain(e);
                    }}
                  />
                  <FormText color="muted">
                    Select the domain for which you want to create Link Landing Page.
                  </FormText>
                </FormGroup>

                <FormGroup>
                  <Label>Title</Label>
                  <Input name="title" type="text" className="form-control" defaultValue={initFormData.title} />
                </FormGroup>

                <FormGroup>
                  <Label>Back Url</Label>
                  <Input name="back_url" type="text" className="form-control" defaultValue={initFormData.back_url} />
                  <Input name="back_url_initial" type="text" className="form-control" hidden={true} disabled={true} defaultValue={initFormData.back_url} />
                </FormGroup>

                <FormGroup>
                  <Label>Short Description</Label>
                  <Input
                    type="textarea"
                    id="short_description"
                    name="short_description"
                    placeholder="A few words about your landing page. 80 characters max"
                    defaultValue={initFormData.short_description}
                  />
                </FormGroup>
            
                <FormGroup>
                  <Label for="image">Logo</Label>
                  <CustomInput
                    type="file"
                    id="logo"
                    name="logo"
                    accept=".jpeg,.jpg,.png"
                    onChange={e => setLogoPreview(e.target.files[0])}
                  />
                  <FormText color="muted">
                    Upload JPG or PNG formats, resolution atleast 500x500 px
                  </FormText>
                  {logoImgUrl && (
                    <img
                      alt="logo"
                      src={logoImgUrl? logoImgUrl: ""}
                      style={{
                        width: "auto",
                        maxWidth: "100%",
                        maxHeight: 200
                      }}
                    />
                  )}
                </FormGroup>
                {
                  (layout.value === 1) &&
                  <FormGroup>
                    <Label for="background_image">Background Image</Label>
                    <CustomInput
                      type="file"
                      id="background_image"
                      name="background_image"
                      accept=".jpeg,.jpg,.png"
                      onChange={e => {
                        setBgPreview(e.target.files[0])
                        if (!backgroundBlurred) {
                          backgroundBlurredSET(true)
                        }
                      }}
                    />
                    <FormText color="muted">
                      Upload JPG or PNG formats, resolution of 1000x1000 px
                    </FormText>
                    {bgImgUrl && (
                      <img
                        alt="background_image"
                        src={bgImgUrl? bgImgUrl: ""}
                        style={{
                          width: "auto",
                          maxWidth: "100%",
                          maxHeight: 200
                        }}
                      />
                    )}
                  </FormGroup>
                }
                {
                  (layout.value === 1 && (bgPreview || bgImgUrl)) &&
                  <FormGroup>
                    <Label>Blurred Background</Label>
                    <div style={{display: "flex", alignItems: "center", width: "100%", marginBottom: "10px"}}>
                      <CustomInput
                        type="radio"
                        id="backgroundBlurredRadio"
                        value="backgroundBlurredRadio"
                        label="Blurred"
                        name="backgroundBlurredRadio"
                        checked={backgroundBlurred}
                        onChange={e => {
                          backgroundBlurredSET(!backgroundBlurred)
                        }}
                      />
                      <CustomInput
                      className="ml-2"
                        type="radio"
                        id="backgroundNotBlurredRadio"
                        value="backgroundNotBlurredRadio"
                        label="Not Blurred"
                        name="backgroundNotBlurredRadio"
                        checked={!backgroundBlurred}
                        onChange={e => {
                          backgroundBlurredSET(!backgroundBlurred)
                        }}
                      />
                  </div>
                  </FormGroup>
                }
                {
                  (layout.value === 1 && backgroundBlurred) && 
                  <FormGroup>
                    <Label>Blur Strength</Label>
                    <Input
                        name="blur_strength"
                        type="range"
                        value={blurStrength}
                        min="3"
                        max="10"
                        step="1"
                        className="mt-2"
                        onChange={e => {
                          blurStrengthSET(e.target.value);
                        }}
                      />
                    <output id="blur-strenth-val"><b>{blurStrength} px</b></output>
                  </FormGroup>
                }
                <FormGroup>
                  <Label>Layout</Label>
                  <Select
                    components={{ IndicatorSeparator:() => null }}
                    name="layout"
                    options={layoutOptions}
                    value={layout}
                    onChange={(e) => {
                      setLayout(e);
                    }}
                  />
              </FormGroup>
              <FormGroup>
                <Label>Font</Label>
                <Select
                  components={{ IndicatorSeparator:() => null }}
                  name="font"
                  options={fontOptions}
                  value={font}
                  onChange={(e) => {
                    setFont(e);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label>Social Icon Placement</Label>
                <Select
                  components={{ IndicatorSeparator:() => null }}
                  name="social_icon_placement"
                  options={socialIconPlacementOptions}
                  value={socialIconPlacement}
                  onChange={(e) => {
                    setSocialIconPlacement(e);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label>Social Icon Color</Label>
                <Select
                  components={{ IndicatorSeparator:() => null }}
                  name="social_icon_color"
                  options={socialIconColorOptions}
                  value={socialIconColor}
                  onChange={(e) => {
                    setSocialIconColor(e);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label>Button Corners</Label>
                <Select
                  components={{ IndicatorSeparator:() => null }}
                  name="button_corners"
                  options={buttonCornerOptions}
                  value={btnCorners}
                  onChange={(e) => {
                    setBtnCorners(e);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <Label>Button Style</Label>
                <Select
                  components={{ IndicatorSeparator:() => null }}
                  name="button_style"
                  options={buttonStyleOptions}
                  value={btnStyle}
                  onChange={(e) => {
                    setBtnStyle(e);
                  }}
                />
              </FormGroup>

              <div style={{marginTop: "50px", marginBottom: "50px"}}>
                <Label><b>Color Customisation</b></Label>
                <Nav tabs style={{border: "1px solid #e9ecef", borderRadius: "5px", padding: "4px"}}>
                  <NavItem
                      className={"color-selection-nav-item" + classnames({
                        'color-selection-nav-item-active': colorScheme !== 1
                      })}>
                    <NavLink
                      className={classnames({
                        'active': colorScheme === 1
                      })}
                      onClick={() => {
                        setColorScheme(1)
                        setCustomColorSelected({
                          title_color: titleColor,
                          description_color: descriptionColor,
                          button_color: buttonColor,
                          button_text_color: buttonTextColor,
                          header_color: headerColor,
                          body_color: bodyColor,
                          header_gradient: headerGradient!==null? headerGradient: defaultHeaderGradient,
                          body_gradient: bodyGradient!==null? bodyGradient: defaultBodyGradient,
                          background_color: backgroundColor,
                          header_color_scheme: headerSingleColorSelected? 1: 2,
                          body_color_scheme: bodySingleColorSelected? 1: 2,
                        })
                        if(premadeColorSelected === null)
                        {
                          setPremadeColorSelected(premadeColorOptions[0])
                        }
                        else {
                          setPremadeColorSelected(premadeColorSelected)
                        }
                      }}
                    >
                      <b>Premade Colors</b>
                    </NavLink>
                  </NavItem>
                  <NavItem
                      className={"color-selection-nav-item" + classnames({
                        'color-selection-nav-item-active': colorScheme !== 2
                      })}>
                    <NavLink
                      className={classnames({
                        'active': colorScheme === 2
                      })}
                      onClick={() => {
                        setColorScheme(2)
                        if(customColorSelected === null)
                        {
                          setCustomColorSelected(premadeColorSelected)
                        }
                        else {
                          setCustomColorSelected(customColorSelected)
                        }
                      }}
                    >
                      <b>Custom Colors</b>
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={colorScheme} style={{border: "1px solid #e9ecef", borderRadius: "5px", padding: "4px"}}>
                  <TabPane tabId={1} className="mt-3 p-3">
                    <Row>
                      <Col sm="12">
                        <div style={{display: "flex", flexWrap: "wrap", alignItems: "right", width: "100%"}}>
                        {
                            premadeColorOptions.map(pmColor => {
                                let isPmColorSelected = (pmColor?.id === premadeColorSelected?.id)
                                let firstCirleBackgroundStyle = {backgroundColor: pmColor.header_color};
                                let secondCirleBackgroundStyle = {backgroundColor: pmColor.button_color};

                                if(pmColor.header_color_scheme === 2 && pmColor.header_gradient!==null) {
                                  let headerGradientDirection = gradientDegreeDict[pmColor.header_gradient.direction];
                                  firstCirleBackgroundStyle = {
                                    "background": pmColor.header_gradient.first_color,
                                    "background": `-moz-linear-gradient(${headerGradientDirection}, ${pmColor.header_gradient.first_color}, ${pmColor.header_gradient.second_color})`,
                                    "background": `-webkit-linear-gradient(${headerGradientDirection}, ${pmColor.header_gradient.first_color}, ${pmColor.header_gradient.second_color})`,
                                    "background": `linear-gradient(${headerGradientDirection}, ${pmColor.header_gradient.first_color}, ${pmColor.header_gradient.second_color}`,
                                    "filter": `progid:DXImageTransform.Microsoft.gradient(startColorstr="${pmColor.header_gradient.first_color}",endColorstr="${pmColor.header_gradient.second_color}",GradientType=1)`,
                                  };
                                }

                                return (
                                  <div className="premade-color-container" onClick={()=> {setPremadeColorSelected(pmColor)}} key={pmColor.id}>
                                    <div className="premade-color-circle-container">
                                      <div className="premade-color-circle" style={{...firstCirleBackgroundStyle, borderColor: isPmColorSelected? "#b40bbe": "grey"}}></div>
                                      <div className="premade-color-circle" style={{...secondCirleBackgroundStyle, borderColor: isPmColorSelected? "#b40bbe": "grey"}}></div>
                                    </div>
                                    <h4 className="premade-color-name" style={{color: isPmColorSelected? "#b40bbe": "black"}}>{pmColor.name}</h4>
                                  </div>
                                );
                            })
                          }
                        </div>
                      </Col>
                    </Row>
                  </TabPane>

                  <TabPane tabId={2} className="mt-3 p-3">
                  <Row>
                    <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                        <FormGroup>
                            <Label>Header Background</Label>
                            <div style={{display: "flex", alignItems: "center", width: "100%", marginBottom: "10px"}}>
                              <CustomInput
                                type="radio"
                                id="headerColorRadio"
                                value="headerColorRadio"
                                label="Single Color"
                                name="headerColorRadio"
                                checked={headerSingleColorSelected}
                                onChange={e => {
                                  headerSingleColorSelectedSET(!headerSingleColorSelected);
                                  headerGradientSelectedSET(!headerGradientSelected);
                                }}
                              />
                              <CustomInput
                                className="ml-2"
                                type="radio"
                                id="headerGradientRadio"
                                value="headerGradientRadio"
                                label="Gradient"
                                name="headerGradientRadio"
                                checked={headerGradientSelected}
                                onChange={e => {
                                  headerSingleColorSelectedSET(!headerSingleColorSelected);
                                  headerGradientSelectedSET(!headerGradientSelected);
                                  setHeaderGradient(headerGradient!==null? headerGradient: defaultHeaderGradient);
                                }}
                              />
                          </div>
                          {
                            headerSingleColorSelected && <CustomColorPickerInput color={headerColor} setColor={setHeaderColor} />
                          }
                          {
                            headerGradientSelected && <CustomColorPickerGradient gradient={headerGradient} setGradient={setHeaderGradient} />
                          }
                        </FormGroup>
                      </Col>
                      <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                        <FormGroup>
                            <Label>Body Background</Label>
                            <div style={{display: "flex", alignItems: "center", width: "100%", marginBottom: "10px"}}>
                              <CustomInput
                                type="radio"
                                id="bodyColorRadio"
                                value="bodyColorRadio"
                                label="Single Color"
                                name="bodyColorRadio"
                                checked={bodySingleColorSelected}
                                onChange={e => {
                                  bodySingleColorSelectedSET(!bodySingleColorSelected);
                                  bodyGradientSelectedSET(!bodyGradientSelected);
                                }}
                              />
                              <CustomInput
                                className="ml-2"
                                type="radio"
                                id="bodyGradientRadio"
                                value="bodyGradientRadio"
                                label="Gradient"
                                name="bodyGradientRadio"
                                checked={bodyGradientSelected}
                                onChange={e => {
                                  bodySingleColorSelectedSET(!bodySingleColorSelected);
                                  bodyGradientSelectedSET(!bodyGradientSelected);
                                  setBodyGradient(bodyGradient!==null? bodyGradient: defaultBodyGradient);
                                }}
                              />
                          </div>
                          {
                            bodySingleColorSelected && <CustomColorPickerInput color={bodyColor} setColor={setBodyColor} />
                          }
                          {
                            bodyGradientSelected && <CustomColorPickerGradient gradient={bodyGradient} setGradient={setBodyGradient} />
                          }
                        </FormGroup>
                      </Col>
                    </Row>
                  <Row>
                    <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                        <FormGroup>
                            <Label>Title Color</Label>
                            <CustomColorPickerInput color={titleColor} setColor={setTitleColor} />
                        </FormGroup>
                      </Col>
                      <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                        <FormGroup>
                            <Label>Description Color</Label>
                            <CustomColorPickerInput color={descriptionColor} setColor={setDescriptionColor} />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                        <FormGroup>
                          <Label>Button Background Color</Label>
                          <CustomColorPickerInput color={buttonColor} setColor={setButtonColor} />
                        </FormGroup>
                      </Col>
                      <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                        <FormGroup>
                          <Label>Button Text Color</Label>
                          <CustomColorPickerInput color={buttonTextColor} setColor={setButtonTextColor} />
                        </FormGroup>
                      </Col>
                    </Row>
                    {
                      (layout.value === 1) &&
                      <Row>
                        <Col xl={6} lg={6} md={12} sm={12} xs={12}>
                          <FormGroup>
                            <Label>Background Color</Label>
                            <CustomColorPickerInput color={backgroundColor} setColor={setBackgroundColor} />
                          </FormGroup>
                        </Col>
                      </Row>
                    }
                  </TabPane>
                </TabContent>
              </div>

                <SocialLinksRow
                  values={socialLinkProps}
                  id="socialLinks"
                  name="socialLinks"
                />

                <FeaturedLinksRow
                  values={featuredLinkProps}
                  id="featuredLinks"
                  name="featuredLinks"
                />

                <Button color="success" type="submit">
                  Submit
                </Button>
              </Form>

              <div style={{ paddingTop: "24px" }}>
                {success && (
                  <Alert color="success">Link Landing Page has been updated!</Alert>
                )}
                {redirect ? <Redirect to="/link-landing-page" /> : null}
                {errorPut && (
                  <Alert color="danger">
                    Something went wrong! Please refresh page and try again!
                  </Alert>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
        <Col xl={3} lg={5} md={5} sm={5} xm={6}>
            {
              layout.value === 1?
              <LandingPageLayoutOnePreview
                landingPageData={{
                    "title": pageTitle ? pageTitle : "Title",
                    "short_description": description ? description : "Description",
                    "back_url": "",
                    "logo": logoImgUrl,
                    "background_image": bgImgUrl,
                    "background_blurred": backgroundBlurred,
                    "blur_strength": blurStrength,
                    "layout": layout.value,
                    "social_icon_placement": socialIconPlacement.value,
                    "social_icon_color": socialIconColor.value,
                    "font": font.value,
                    "button_corners": btnCorners.value,
                    "button_style": btnStyle.value,
                    "color_scheme": colorScheme,
                    "header_color_scheme": headerSingleColorSelected? 1: 2,
                    "body_color_scheme": bodySingleColorSelected? 1: 2,
                    "header_color": headerColor,
                    "body_color": bodyColor,
                    "header_gradient": headerGradient,
                    "body_gradient": bodyGradient,
                    "title_color": titleColor,
                    "description_color": descriptionColor,
                    "button_color": buttonColor,
                    "button_text_color": buttonTextColor,
                    "background_color": backgroundColor,
                    "social_links": listOfSocialLinks,
                    "featured_links": listOfFeaturedLinks,
                  }}
              />:
              <LandingPageLayoutTwoPreview
                landingPageData={{
                    "title": pageTitle ? pageTitle : "Title",
                    "short_description": description ? description : "Description",
                    "back_url": "",
                    "logo": logoImgUrl,
                    "background_image": bgImgUrl,
                    "layout": layout.value,
                    "social_icon_placement": socialIconPlacement.value,
                    "social_icon_color": socialIconColor.value,
                    "font": font.value,
                    "button_corners": btnCorners.value,
                    "button_style": btnStyle.value,
                    "title_color": titleColor,
                    "color_scheme": colorScheme,
                    "header_color_scheme": headerSingleColorSelected? 1: 2,
                    "body_color_scheme": bodySingleColorSelected? 1: 2,
                    "header_color": headerColor,
                    "body_color": bodyColor,
                    "header_gradient": headerGradient,
                    "body_gradient": bodyGradient,
                    "description_color": descriptionColor,
                    "button_color": buttonColor,
                    "button_text_color": buttonTextColor,
                    "background_color": backgroundColor,
                    "social_links": listOfSocialLinks,
                    "featured_links": listOfFeaturedLinks,
                  }}
              />
            }
        </Col>
      </Row>
      {dataModal && (
        <ModalConfirm
          openModal={openModal}
          setToggleModal={setToggleModal}
          dataModal={dataModal}
          title={`Update Landing Page ${dataModal.title? dataModal.title: initFormData.title}?`}
          setSuccess={setSuccess}
          setError={setError}
          method={"PATCH"}
          body={`Are you sure you want to update Link Landing Page with the title ${dataModal.title? dataModal.title: initFormData.title}?`}
          apiURL={`link-landingpages/${currentID}`}
          setRedirect={setRedirect}
        />
      )}
    </div>
  );
};

export default LinkLandingPageUpdate;
