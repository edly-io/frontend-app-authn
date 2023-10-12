import { defineMessages } from "@edx/frontend-platform/i18n";

const messages = defineMessages({
  "nafath.page.title": {
    id: "nafath.page.title",
    defaultMessage: "Nafath | {siteName}",
    description: "login page title",
  },
  // Nafath labels
  "nafath.user.identity.label": {
    id: "nafath.user.identity.label",
    defaultMessage: "Nafath ID",
    description: "Label for user identity field to enter Nafath ID to login",
  },
  "nafath.user.activation_code.label": {
    id: "nafath.user.activation_code.label",
    defaultMessage: "Activation Code sent to you via email",
    description: "Label for user identity field to enter Nafath ID to login",
  },
  "help.text.activation_code": {
    id: "help.text.activation_code",
    defaultMessage: "Enter the activation code that is sent to you via email",
    description: "Label for activation code field to enter activation code sent via email to  complete registeration",
  },
  "empty.activation_code.field.error": {
    id: "help.text.activation_code",
    defaultMessage: "Enter the activation code that is sent to you via email",
    description: "Error message for empty activation code field to enter activation code sent via email to  complete registeration",
  },
  "registration.activation.code.do.not.match.error": {
    id: "registration.activation.code.do.not.match.error",
    defaultMessage: "Activation code does not match with the code that is sent to you via email",
    description: "Error message for empty activation code field to enter activation code sent via email to  complete registeration",
  },
  "nafath.user.email.label": {
    id: "nafath.user.email.label",
    defaultMessage: "Enter Email to complete registration",
    description: "Label for user email field to enter Nafath email to complete registration",
  },
  "nafath.user.random.text": {
    id: "nafath.user.random.text",
    defaultMessage: "Enter this text into your Nafath App",
    description: "Label for random text field to enter into Nafath App",
  },
  "nafath.user.random.text.expired": {
    id: "nafath.user.random.text.expired",
    defaultMessage:
      "This random text is expired, Kindly again authenticate to Nafath",
    description: "Label for random text expired error",
  },
  "nafath.user.random.text.rejected": {
    id: "nafath.user.random.text.rejected",
    defaultMessage:
      "The user has rejected to authenticate from the app with this random text",
    description: "Label for random text expired error",
  },
  "nafath.authenticate.button": {
    id: "nafath.sign.in.button",
    defaultMessage: "Authenticate with Nafath App",
    description: "Nafath sign in button label that appears on login page",
  },
  "nafath.authenticate.error": {
    id: "nafath.authenticate.error",
    defaultMessage: "An unexpected error occur",
    description: "Nafath sign in button label that appears on login page",
  },
  "nafath.registration.error": {
    id: "nafath.registration.error",
    defaultMessage: "Email is already registered with another account",
    description: "Nafath email registration error message",
  },
  "complete.nafath.registration.button": {
    id: "complete.nafath.registration.button",
    defaultMessage: "Complete Registration",
    description: "Nafath sign in button label that appears on login page",
  },
  // nafath id Validation messages
  "nafathId.empty.field.error": {
    id: "nafathId.empty.field.error",
    defaultMessage: "Please enter the Nafath ID",
    description: "Error message for empty nafath id field",
  },
  // email Validation messages
  "email.empty.field.error": {
    id: "email.empty.field.error",
    defaultMessage: "Please enter the Email",
    description: "Error message for empty email field",
  },
  "email.invalid.format.error": {
    id: "email.invalid.format.error",
    defaultMessage: "Enter a valid email address",
    description: "Validation error for invalid email address",
  },
});

export default messages;
