// eslint-disable-next-line
import FormValidation from "../../validations/es6/core/Core";
import Trigger from "../../validations/es6/plugins/Trigger";
import Bootstrap from "../../validations/es6/plugins/Bootstrap";
import SubmitButton from "../../validations/es6/plugins/SubmitButton";
import Declarative from "../../validations/es6/plugins/Declarative";
import numeric from '../../validations/es6/validators/numeric';
import axios from "axios";
import { getCookie } from "../../jwt/_helpers/cookie";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const opt = {
  fields: {
    name: {
      validators: {
        notEmpty: {
          message: "Name of label is required"
        },
        promise: {
          message: "Oops! This label already exists and is owned by another user. Please try another label name. If you legally own this label name and you own the name copyright, please contact our support team.",
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              if(input.value !== "") {
                const token = getCookie("token");
                const requestBody = {
                  label_name: input.value,
                };
                axios({
                  method: "POST",
                  mode: 'cors',
                  url: `${API_URL}labels/validate-label-name/`,
                  data: requestBody,
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": X_API_KEY,
                  }
                }).then(function(response) {
                  if (response.status === 200) {
                    const valid = response.data.valid;
                    const message = response.data.status;

                    valid ? resolve({ valid: true, message: "Label name is available" }) : resolve({ valid: false, message: message });
                  } else {
                    reject({valid: false, message: "Label name is invalid"});
                  }
                });
              }
            });
          }
        },
      }
    },
    year: {
      validators: {
        notEmpty: {
          message: "Established year is required"
        },
        numeric: {
          message: 'The value is not a number',
        },
        stringLength: {
          min: 4,
          max: 4,
          message: 'Established year has to be 4 digits long',
        },
      }
    },
    releaseCatalog: {
      validators: {
        notEmpty: {
          message: "Releases in catalog is required"
        },
        numeric: {
          message: 'The value is not a number',
        }
      }
    },
    logo: {
      validators: {
        notEmpty: {
          message: 'The logo is required'
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
                  valid: w === 1000 && h === 1000,
                  message:
                    "The label logo size has to be 1000 x 1000 px, JPG/JPEG/PNG.",
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
            "Please Upload JPG or PNG formats, minimal resolution 1000x1000px. Max size 2MB"
        }
      }
    },
    promo_graphic: {
      validators: {
        promise: {
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              const files = input.element.files;
              // if (
              //   !files.length ||
              //   typeof FileReader === "undefined" ||
              //   files[0].type !== "image/jpeg"|| files[0].type !== "image/png"
              // ) {
              //   resolve({
              //     valid: true
              //   });
              // }

              const img = new Image();
              img.addEventListener("load", function() {
                const w = this.width;
                const h = this.height;

                resolve({
                  valid: w === 960 && h === 150,
                  message:
                  "The label promotional graphic size has to be 960 x 150 px, JPG/JPEG/PNG.",
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
          maxSize: 100000,
          message:
            "Upload JPG or PNG formats, minimal resolution 960x150px"
        }
      }
    },
  },
  plugins: {
    trigger: new Trigger(),
    bootstrap: new Bootstrap(),
    submitButton: new SubmitButton(),
    declarative: new Declarative({
      html5Input: true
    })
  }
};

export { opt };
