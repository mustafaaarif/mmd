// eslint-disable-next-line
import FormValidation from "../../validations/es6/core/Core";
import Trigger from "../../validations/es6/plugins/Trigger";
import Bootstrap from "../../validations/es6/plugins/Bootstrap";
import Excluded from "../../validations/es6/plugins/Excluded";
import SubmitButton from "../../validations/es6/plugins/SubmitButton";
import Declarative from "../../validations/es6/plugins/Declarative";

const opt = {
  fields: {
    cardholder_name: {
      validators: {
        notEmpty: {
          message: "Cardholder name is required"
        }
      }
    },
    expiry_year: {
      validators: {
        notEmpty: {
            message: 'Expiry Year is required.'
        },
        regexp: {
            regexp: /([2]{1}[0-9]{3})$/,
            message: 'Expiry Year is not valid'
        },
        promise: {
          message: 'Expiry Year must not be in past',
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              const currentDate = (new Date());
              const currentYear = currentDate.getFullYear();
              if(input.value !== "") {
                let expYearInt = parseInt(input.value);
                if(expYearInt>2000 && expYearInt<currentYear) {
                  resolve({ valid: false, message: "Expiry Year must not be in past" });
                } else {
                  resolve({valid: true, message: ""});
                }
              }
              else {
                reject({valid: false, message: "Expiry Year is not valid"});
              }
            });
          }
        },
      }
    },
    expiry_month: {
      validators: {
        notEmpty: {
            message: 'Expiry Month is required.'
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
  },
  plugins: {
    trigger: new Trigger(),
    bootstrap: new Bootstrap(),
    excluded: new Excluded(),
    submitButton: new SubmitButton(),
    declarative: new Declarative({
      html5Input: true
    })
  }
};

export { opt };
