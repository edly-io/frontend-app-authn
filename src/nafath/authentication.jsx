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

  const handleNafathAuthentication = () => {
    props.authenticateUserIdFromNafath(nafathId);
  };

  useEffect(() => {
    if (props.state.status === "COMPLETED") {
      const userRegistrationPayload = {
        country: "",
        email: props.state.person.id + "@nafath.gov.sa",
        name: props.state.person.enFullName,
        next: "/",
        password: "acaw",
        username: props.state.person.id,
      };
      props.handleNafathUserRegistration(userRegistrationPayload);
    } else if (props.state.status === "WAITING") {
      const interval = setInterval(() => {
        const body = {
          Action: "CheckSpRequest",
          Parameters: {
            transId: props.state.transId,
            id: props.state.userId,
            random: props.state.randomText,
          },
        };
        props.checkUserRequestStatus(body);
      }, props.state.interval);
      return () => clearInterval(interval);
    }
  }, [props.state.status]);

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
        <Form name="nafath-form" id="nafath-form">
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
          />
          {props.state.randomText && (
            <FormGroup
              value={props.state.randomText}
              readOnly={true}
              floatingLabel={formatMessage(messages["nafath.user.random.text"])}
              errorMessage={
                (props.state.status === "EXPIRED" &&
                  formatMessage(messages["nafath.user.random.text.expired"])) ||
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
              ((props.state.status === "WAITING" ||
                props.state.status === "COMPLETED") &&
                "pending") ||
              (props.state.success && "complete") ||
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
