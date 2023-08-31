import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { getConfig } from "@edx/frontend-platform";
import { useIntl } from "@edx/frontend-platform/i18n";

import { Form, StatefulButton } from "@edx/paragon";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import messages from "./messages";
import { FormGroup, RedirectLogistration } from "../common-components";
import {
  authenticateUserIdFromNafath,
  checkUserRequestStatus,
  handleNafathUserRegistration,
} from "./data/actions";
import "../sass/_nafath_page.scss";

const NafathAuthenticationPage = (props) => {
  const { formatMessage } = useIntl();
  const [nafathId, setNafathId] = useState("");
  const [nafathEmail, setNafathEmail] = useState("");
  const [
    nafathIdAuthenticationBtnClicked,
    setNafathIdAuthenticationBtnClicked,
  ] = useState(false);
  const [registrationBtnClicked, setRegistrationBtnClicked] = useState(false);

  useEffect(() => {
    if (props.state.registrationError) {
      setRegistrationBtnClicked(false);
    }
  }, [props.state.registrationError]);

  useEffect(() => {
    if (props.state.authenticationError) {
      setNafathIdAuthenticationBtnClicked(false);
    }
  }, [props.state.authenticationError]);

  const handleNafathAuthentication = () => {
    setNafathIdAuthenticationBtnClicked(true);
    props.authenticateUserIdFromNafath(nafathId);
  };
  const handleNafathRegistration = () => {
    setRegistrationBtnClicked(true);
    const userRegistrationPayload = {
      nafath_id: props.state.userId,
      trans_id: props.state.transId,
      user_data: {
        email: nafathEmail,
      },
    };
    props.handleNafathUserRegistration(userRegistrationPayload);
  };

  useEffect(() => {
    if (props.state.status === "WAITING") {
      const interval = setInterval(() => {
        props.checkUserRequestStatus(props.state.userId);
      }, props.state.interval);
      return () => clearInterval(interval);
    }
  }, [props.state.status, props.state.interval]);

  return (
    <>
      <Helmet>
        <title>
          {formatMessage(messages["nafath.page.title"], {
            siteName: getConfig().SITE_NAME,
          })}
        </title>
      </Helmet>
      <RedirectLogistration
        success={props.state.success}
        redirectUrl={props.state.redirectUrl}
        finishAuthUrl={null}
      />
      <div className="mw-xs mt-3">
        {props.state.form == 1 && (
          <Form name="nafath-form1" id="nafath-form1">
            <FormGroup
              name="nafathId"
              value={nafathId}
              handleChange={(e) => {
                setNafathId(e.target.value);
                return nafathId;
              }}
              floatingLabel={formatMessage(
                messages["nafath.user.identity.label"]
              )}
              errorMessage={props.state.authenticationError}
            />
            {props.state.randomText && (
              <FormGroup
                value={props.state.randomText}
                readOnly={true}
                floatingLabel={formatMessage(
                  messages["nafath.user.random.text"]
                )}
                errorMessage={
                  (props.state.status === "EXPIRED" &&
                    formatMessage(
                      messages["nafath.user.random.text.expired"]
                    )) ||
                  props.state.status ===
                    ("REJECTED" &&
                      formatMessage(
                        messages["nafath.user.random.text.rejected"]
                      )) ||
                  ""
                }
              />
            )}
            <StatefulButton
              name="authenticate-nafath"
              id="authenticate-nafath"
              className={"nafath-authenticate-button"}
              variant="brand"
              state={
                (nafathIdAuthenticationBtnClicked && "pending") ||
                (props.state.status === "COMPLETED" && "complete") ||
                "default"
              }
              labels={{
                default: formatMessage(messages["nafath.authenticate.button"]),
                pending: "",
              }}
              disabled={
                props.state.status === "WAITING" ||
                props.state.status === "COMPLETED" ||
                false
              }
              onClick={handleNafathAuthentication}
              onMouseDown={(e) => e.preventDefault()}
            />
          </Form>
        )}
        {props.state.form == 2 && (
          <Form name="nafath-form2" id="nafath-form2">
            <FormGroup
              name="email"
              value={nafathEmail}
              handleChange={(e) => {
                setNafathEmail(e.target.value);
                return nafathEmail;
              }}
              floatingLabel={formatMessage(messages["nafath.user.email.label"])}
              errorMessage={props.state.registrationError}
            />
            <StatefulButton
              name="complete-nafath-registration"
              id="complete-nafath-registration"
              className={"nafath-authenticate-button"}
              variant="brand"
              state={
                (registrationBtnClicked && "pending") ||
                (props.state.success && "complete") ||
                "default"
              }
              labels={{
                default: formatMessage(
                  messages["complete.nafath.registration.button"]
                ),
                pending: "",
              }}
              disabled={registrationBtnClicked}
              onClick={handleNafathRegistration}
              onMouseDown={(e) => e.preventDefault()}
            />
          </Form>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    state: state.nafath,
  };
};

NafathAuthenticationPage.propTypes = {
  userId: PropTypes.string,
  transId: PropTypes.string,
  randomText: PropTypes.string,
  // Actions
  authenticateUserIdFromNafath: PropTypes.func.isRequired,
  checkUserRequestStatus: PropTypes.func.isRequired,
  handleNafathUserRegistration: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  authenticateUserIdFromNafath,
  checkUserRequestStatus,
  handleNafathUserRegistration,
})(NafathAuthenticationPage);
