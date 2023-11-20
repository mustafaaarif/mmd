import axios from "axios";
import Trigger from "../../validations/es6/plugins/Trigger";
import Bootstrap from "../../validations/es6/plugins/Bootstrap";
import SubmitButton from "../../validations/es6/plugins/SubmitButton";
import Declarative from "../../validations/es6/plugins/Declarative";
import Sequence from "../../validations/es6/plugins/Sequence";
import { getCookie } from "../../jwt/_helpers/cookie";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const validUrlRegex = /^(?:https?|http):\/\/(?:[^\s\/]+\.)?[^\s\/]+\.[^\s\/]+(?:\/[^\/\s]*)*$/;

const platformValidUrls = {
  "instagram": "instagram.com",
  "facebook": "facebook.com",
  "twitter": "twitter.com",
  "linkedin": "linkedin.com",
  "tiktok": "tiktok.com",
  "youtube": "youtube.com",
  "other": "",
};

const opt = {
  fields: {
    title: {
      validators: {
        notEmpty: {
          message: "Title is required"
        },
        stringLength: {
          min: 0,
          max: 32,
          message: "Title can not be longer than 32 characters"
        },
      }
    },
    short_description: {
      validators: {
        stringLength: {
          min: 0,
          max: 80,
          message: "Description can not be longer than 80 characters."
        },
      }
    },
    back_url: {
      validators: {
        notEmpty: {
          message: "Back Url is required"
        },
        stringLength: {
          min: 0,
          max: 10,
          message: "Back Url can not be longer than 10 characters",
        },
        promise: {
          message: "Oops! This back url is already associated with another landing page. Please try another back url.",
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              if(input.value !== "") {
                const token = getCookie("token");
                const requestBody = {
                  back_url: input.value,
                };
                axios({
                  method: "POST",
                  mode: 'cors',
                  url: `${API_URL}link-landingpages/validate-back-url/`,
                  data: requestBody,
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": X_API_KEY,
                  }
                }).then(function(response) {
                  if (response.status === 200) {
                    const valid = response.data.valid;
                    const message = response.data.status;

                    valid ? resolve({ valid: true, message: "Back url is available" }) : resolve({ valid: false, message: message });
                  } else {
                    reject({valid: false, message: "Back url is invalid"});
                  }
                });
              }
            });
          }
        },
      }
    },
    logo: {
      validators: {
        notEmpty: {
          message: "Logo is required"
        },
        promise: {
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              const files = input.element.files;

              const img = new Image();
              img.addEventListener("load", function() {
                const w = this.width;
                const h = this.height;
                resolve({
                  valid: w >= 500 && h >= 500 && w===h,
                  message:
                    "Logo size has to be atleast 500 X 500 px and image 1:1 aspect ratio, JPG/JPEG/PNG formats supported.",
                  meta: {
                    source: img.src,
                    width: w,
                    height: h
                  }
                });
              });
              img.addEventListener("error", function() {
                reject({
                  valid: false,
                  message: "Please choose an image"
                });
              });

              const reader = new FileReader();
              reader.readAsDataURL(files[0]);
              reader.addEventListener("loadend", function(e) {
                img.src = e.target.result;
              });
            });
          }
        },
        file: {
          extension: "jpeg,jpg,png",
          type: "image/jpeg,image/png",
          maxSize: 2048576,
          message:
            "Please Upload JPG or PNG formats, minimal resolution 500 X 500 px and image 1:1 aspect ratio. Max size 2MB"
        }
      }
    },
    background_image: {
      validators: {
        promise: {
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              const files = input.element.files;

              const img = new Image();
              img.addEventListener("load", function() {
                const w = this.width;
                const h = this.height;
                resolve({
                  valid: w >= 1000 && h >= 1000 && w===h,
                  message:
                    "Background Image size has to be atleast 1000 X 1000 px and image 1:1 aspect ratio, JPG/JPEG/PNG formats supported.",
                  meta: {
                    source: img.src,
                    width: w,
                    height: h
                  }
                });
              });
              img.addEventListener("error", function() {
                reject({
                  valid: false,
                  message: "Please choose an image"
                });
              });

              const reader = new FileReader();
              reader.readAsDataURL(files[0]);
              reader.addEventListener("loadend", function(e) {
                img.src = e.target.result;
              });
            });
          }
        },
        file: {
          extension: "jpeg,jpg,png",
          type: "image/jpeg,image/png",
          maxSize: 5121440,
          message:
            "Please Upload JPG or PNG formats, minimal resolution 1000 X 1000 px and image 1:1 aspect ratio. Max size 5MB"
        }
      }
    },
    "social_link[0].destination_url_facebook": {
      validators: {
        notEmpty: {
          message: "Destination Url is required"
        },
        regexp: {
          regexp: validUrlRegex,
          message: 'Invalid Url',
        },
        promise: {
          message: 'Invalid Facebook Url',
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              if(input.value !== "") {
                let destinationUrl = input.value;
                let validPlatformUrl = platformValidUrls["facebook"];
                let socialUrlValid = destinationUrl.includes(validPlatformUrl);
                if(destinationUrl !== "other" && !socialUrlValid) {
                  resolve({ valid: false, message: "Invalid Facebook Url"});
                } else {
                  resolve({valid: true, message: ""});
                }
              }
              else {
                reject({valid: false, message: "Invalid Facebook Url"});
              }
            })
          }
        },
      }
    },
    "social_link[0].destination_url_instagram": {
      validators: {
        notEmpty: {
          message: "Destination Url is required"
        },
        regexp: {
          regexp: validUrlRegex,
          message: 'Invalid url',
        },
        promise: {
          message: 'Invalid Instagram Url',
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              if(input.value !== "") {
                let destinationUrl = input.value;
                let validPlatformUrl = platformValidUrls["instagram"];
                let socialUrlValid = destinationUrl.includes(validPlatformUrl);
                if(destinationUrl !== "other" && !socialUrlValid) {
                  resolve({ valid: false, message: "Invalid Instagram Url"});
                } else {
                  resolve({valid: true, message: ""});
                }
              }
              else {
                reject({valid: false, message: "Invalid Instagram Url"});
              }
            })
          }
        },
      }
    },
    "social_link[0].destination_url_twitter": {
      validators: {
        notEmpty: {
          message: "Destination Url is required"
        },
        regexp: {
          regexp: validUrlRegex,
          message: 'Invalid url',
        },
        promise: {
          message: 'Invalid Twitter Url',
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              if(input.value !== "") {
                let destinationUrl = input.value;
                let validPlatformUrl = platformValidUrls["twitter"];
                let socialUrlValid = destinationUrl.includes(validPlatformUrl);
                if(destinationUrl !== "other" && !socialUrlValid) {
                  resolve({ valid: false, message: "Invalid Twitter Url"});
                } else {
                  resolve({valid: true, message: ""});
                }
              }
              else {
                reject({valid: false, message: "Invalid Twitter Url"});
              }
            })
          }
        },
      }
    },
    "social_link[0].destination_url_youtube": {
      validators: {
        notEmpty: {
          message: "Destination Url is required"
        },
        regexp: {
          regexp: validUrlRegex,
          message: 'Invalid url',
        },
        promise: {
          message: 'Invalid Youtube Url',
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              if(input.value !== "") {
                let destinationUrl = input.value;
                let validPlatformUrl = platformValidUrls["youtube"];
                let socialUrlValid = destinationUrl.includes(validPlatformUrl);
                if(destinationUrl !== "other" && !socialUrlValid) {
                  resolve({ valid: false, message: "Invalid Youtube Url"});
                } else {
                  resolve({valid: true, message: ""});
                }
              }
              else {
                reject({valid: false, message: "Invalid Youtube Url"});
              }
            })
          }
        },
      }
    },
    "social_link[0].destination_url_tiktok": {
      validators: {
        notEmpty: {
          message: "Destination Url is required"
        },
        regexp: {
          regexp: validUrlRegex,
          message: 'Invalid url',
        },
        promise: {
          message: 'Invalid TikTok Url',
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              if(input.value !== "") {
                let destinationUrl = input.value;
                let validPlatformUrl = platformValidUrls["tiktok"];
                let socialUrlValid = destinationUrl.includes(validPlatformUrl);
                if(destinationUrl !== "other" && !socialUrlValid) {
                  resolve({ valid: false, message: "Invalid TikTok Url"});
                } else {
                  resolve({valid: true, message: ""});
                }
              }
              else {
                reject({valid: false, message: "Invalid TikTok Url"});
              }
            })
          }
        },
      }
    },
    "social_link[0].destination_url_linkedin": {
      validators: {
        notEmpty: {
          message: "Destination Url is required"
        },
        regexp: {
          regexp: validUrlRegex,
          message: 'Invalid url',
        },
        promise: {
          message: 'Invalid LinkedIn Url',
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              if(input.value !== "") {
                let destinationUrl = input.value;
                let validPlatformUrl = platformValidUrls["linkedin"];
                let socialUrlValid = destinationUrl.includes(validPlatformUrl);
                if(destinationUrl !== "other" && !socialUrlValid) {
                  resolve({ valid: false, message: "Invalid LinkedIn Url"});
                } else {
                  resolve({valid: true, message: ""});
                }
              }
              else {
                reject({valid: false, message: "Invalid LinkedIn Url"});
              }
            })
          }
        },
      }
    },
    "featured_link[0].title": {
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
    },
    "featured_link[0].destination_url": {
      validators: {
        notEmpty: {
          message: "Destination Url is required"
        },
        regexp: {
          regexp: validUrlRegex,
          message: 'Invalid url',
        },
      }
    },
  },
  plugins: {
    trigger: new Trigger(),
    bootstrap: new Bootstrap(),
    submitButton: new SubmitButton(),
    declarative: new Declarative({
      html5Input: true
    }),
    sequence: new Sequence({
      enabled: true
    }),
  }
};

export { opt };
