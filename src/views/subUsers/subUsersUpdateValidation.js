import Trigger from "../../validations/es6/plugins/Trigger";
import Bootstrap from "../../validations/es6/plugins/Bootstrap";
import SubmitButton from "../../validations/es6/plugins/SubmitButton";
import Declarative from "../../validations/es6/plugins/Declarative";

const usernameRegex = /^[A-Za-z0-9]*$/;

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
      }
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