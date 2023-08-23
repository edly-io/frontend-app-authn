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
});

export default messages;
