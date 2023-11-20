// eslint-disable-next-line
import FormValidation from "../../validations/es6/core/Core";
import Trigger from "../../validations/es6/plugins/Trigger";
import Bootstrap from "../../validations/es6/plugins/Bootstrap";
import Excluded from "../../validations/es6/plugins/Excluded";
import SubmitButton from "../../validations/es6/plugins/SubmitButton";
import Declarative from "../../validations/es6/plugins/Declarative";
// eslint-disable-next-line
import vat from "../../validations/es6/validators/vat";
// eslint-disable-next-line
import iban from "../../validations/es6/validators/iban";

const opt = {
  fields: {
    email: {
      validators: {
        notEmpty: {
          message: "The email address is required"
        }
      }
    },
    profile_image: {
      validators: {
        promise: {
          promise: function(input) {
            return new Promise(function(resolve, reject) {
              const files = input.element.files;
              if (
                !files.length ||
                typeof FileReader === "undefined" ||
                files[0].type !== "image/jpeg"
              ) {
                resolve({
                  valid: true
                });
              }

              const img = new Image();
              img.addEventListener("load", function() {
                const w = this.width;
                const h = this.height;

                resolve({
                  valid: w === 300 && h === 300,
                  message:
                    "The profile image size has to be exactley 300 x 300 px, JPG/JPEG. Max file size 300 KB",
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
          extension: "jpeg,jpg",
          type: "image/jpeg",
          maxSize: 307200,
          message:
            "The selected file is larger than 300 KB. Please uplaod cover in 300x300 px, JPG/JPEG, max file size 300 KB."
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
    vatNumber: {
      validators: {
        vat: {
          country: function() {
            return document
              .getElementById("editProfileForm")
              .querySelector('[name="country"]').value;
          },
          message: "The value is not a valid VAT number"
        }
      }
    },
    iban: {
      validators: {
        notEmpty: {
          message: "IBAN is required"
        },
        iban: {
          message: "The value is not a valid IBAN number",
          options: {
            country: function() {
              return document
                .getElementById("editProfileForm")
                .querySelector('[name="country"]').value;
            }
          }
        }
      }
    },
    cardholder_name: {
      validators: {
        notEmpty: {
          message: "Cardholder name is required"
        }
      }
    },
    card_number : {
      validators: {
        notEmpty: {
          message: "Card Number is required"
        },
        creditCard: {
          message: "Card Number is not Valid",
          options: {
            country: function() {
              return document
                .getElementById("profilePaymentMethodForm")
                .querySelector('[name="card_number"]').value;
            }
          }
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
        }
      }
    },
    expiry_month: {
      validators: {
        notEmpty: {
            message: 'Expiry Month is required.'
        }
      }
    },
    cvc_code: {
      validators: {
        notEmpty: {
            message: 'Security Code (CVC) is required.'
        },
        regexp: {
            regexp: /^[0-9]{3,4}$/,
            message: 'Security Code (CVC) is not valid'
        }
      }
    },
    paypal_email: {
      validators: {
        notEmpty: {
          message: "Paypal email is required"
        }
      }
    },
    account_holder_name: {
      validators: {
        notEmpty: {
          message: "Bank account holder name is required"
        }
      }
    },
    bank_name: {
      validators: {
        notEmpty: {
          message: "Bank name is required"
        }
      }
    },
    bank_address: {
      validators: {
        notEmpty: {
          message: "Bank address is required"
        }
      }
    },
    preferred_payment_method: {
      validators: {
        notEmpty: {
          message: "Preferred payment method is required"
        }
      }
    }
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
