import Trigger from "../../validations/es6/plugins/Trigger";
import Bootstrap from "../../validations/es6/plugins/Bootstrap";
import SubmitButton from "../../validations/es6/plugins/SubmitButton";
import Declarative from "../../validations/es6/plugins/Declarative";

import axios from "axios";
import { getCookie } from "../../jwt/_helpers/cookie";

const API_URL = process.env.REACT_APP_API_URL_BASE;
const X_API_KEY = process.env.REACT_APP_X_API_KEY;

const usernameRegex = /^[A-Za-z0-9]*$/;
const passwordRegex = /^(?=.*?[A-Z])(?=.*?[#?!@$%^&*-]).{8,}$/;

const opt = {
  fields: {
    first_name: {
      validators: {
        notEmpty: {
          message: "First name is required"
        }
      }
    },
    last_name: {
      validators: {
        notEmpty: {
          message: "Last name is required"
        }
      }
    },
    email: {
      validators: {
        notEmpty: {
          message: "Email is required"
        },
        emailAddress:
        {
          message: "Email is not valid"
        },
        promise: {
          message: 'Email is associated with another user',
          promise: function(input) {
            return new Promise(function(resolve, reject) {

              if(input.value !== "") {
                const token = getCookie("token");

                const requestBody = {
                  email: input.value,
                };

                axios({
                  method: "POST",
                  mode: 'cors',
                  url: `${API_URL}sub-users/validate-email/`,
                  data: requestBody,
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": X_API_KEY,
                  }
                }).then(function(response) {
                  if (response.status === 200) {
                    const valid = response.data.valid;
                    const message = response.data.status;
                    valid? resolve({ valid: true, message: message }) : resolve({ valid: false, message: message });
                  } else {
                    reject({valid: false, message: "Email is invalid"});
                  }
                });
              }
            
            });
         }
        },
      }
    },
    username: {
      validators: {
        notEmpty: {
          message: "Username is required"
        },
        stringCase:{
          case: 'lower',
          message: 'Username must be in lowercase',
        },
        regexp: {
          regexp: usernameRegex,
          message: 'Username must consist of letters and numbers only',
        },
        promise: {
          message: 'Username is already taken',
          promise: function(input) {
            return new Promise(function(resolve, reject) {

              if(input.value !== "") {

                const token = getCookie("token");
                
                const requestBody = {
                  username: input.value,
                };

                axios({
                  method: "POST",
                  mode: 'cors',
                  url: `${API_URL}sub-users/validate-username/`,
                  data: requestBody,
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "x-api-key": X_API_KEY,
                  }
                }).then(function(response) {
                  if (response.status === 200) {
                    const valid = response.data.valid;
                    const message = response.data.status;
                    valid? resolve({ valid: true, message: message }) : resolve({ valid: false, message: message });
                  } else {
                    reject({valid: false, message: "Username is invalid"});
                  }
                });
              }
            
            });
         }
        },
      }
    },
    password: {
      validators: {
        notEmpty: {
          message: "Password is required"
        },
        regexp: {
          regexp: passwordRegex,
          message: 'Password must consist of at least 8 characters, including 1 uppercase letter and 1 special character',
        },
      }
    },
    confirmPassword: {
      validators: {
        notEmpty: {
          message: "Please confirm password"
        },
        identical: {
          compare: function() {
            return document
              .getElementById("addNewSubUser")
              .querySelector('[name="password"]').value;
          },
          message: 'Password and confirm password values must match',
        },
      },
    },
    contract_expiry: {
      validators: {
        notEmpty: {
          message: "Contract expiry date is required"
        }
      }
    },
    sub_user_deal: {
      validators: {
        notEmpty: {
          message: "Subuser deal is required"
        },
        between: {
          min: 0,
          max: 100,
          message: "Subuser deal must be between 0 and 100"
        }
      }
    },
    street_and_number: {
      validators: {
        notEmpty: {
          message: "Street and house number is required"
        }
      }
    },
    postal_code: {
      validators: {
        notEmpty: {
          message: "Postal code is required"
        }
      }
    },
    city: {
      validators: {
        notEmpty: {
          message: "City is required"
        }
      }
    },
    country: {
      validators: {
        notEmpty: {
          message: "Country is required"
        }
      }
    },
    phone: {
      validators: {
        notEmpty: {
          message: "Phone number is required"
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