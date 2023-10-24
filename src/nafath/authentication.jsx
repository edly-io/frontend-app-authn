import React, { useEffect, useState } from "react";
import { connect } from "react-redux";

import { getConfig } from "@edx/frontend-platform";
import { useIntl } from "@edx/frontend-platform/i18n";

import { Form, StatefulButton, Input, InputSelect, FormCheck } from "@edx/paragon";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

import messages from "./messages";
import registrationFormMessages from "./../register/messages";
import { FormGroup, RedirectLogistration } from "../common-components";
import {
  authenticateUserIdFromNafath,
  checkUserRequestStatus,
  handleNafathUserRegistration,
  setNafathUserRegistrationError,
  setNafathUserIdAuthenticationError,
  emptyState,
  setFormNumber,
  setFormName,
  setFormNameError,
  setFormEmail,
  setFormEmailError,
  setFormUsername,
  setFormUsernameError,
  setFormActivationCode,
  setFormActivationCodeError,
  setFormPhoneNumber,
  setFormPhoneNumberError,
  setFormGender,
  setFormGenderError,
  setFormLinkedInAccount,
  setFormDateOfBirth,
  setFormDateOfBirthError,
  setFormRegion,
  setFormRegionError,
  setFormCity,
  setFormCityError,
  setFormAddressLine,
  setFormLevelOfEducation,
  setFormLevelOfEducationError,
  setFormEnglishLanguageLevel,
  setFormEnglishLanguageLevelError,
  setFormWorkExperienceLevel,
  setFormWorkExperienceLevelError,
  setFormEmploymentStatus,
  setFormEmploymentStatusError,
  setFormJobTitle,
  setFormJobTitleError,
  setTermsAndConditions,
} from "./data/actions";
import LoginFailureMessage from "../login/LoginFailure";
import { validateEmailAddress } from "../register/data/utils";
import RegistrationFailure from "../register/RegistrationFailure";
import { INVALID_NAME_REGEX, VALID_EMAIL_REGEX } from "../data/constants";
import "../sass/_nafath_page.scss";

const emailRegex = new RegExp(VALID_EMAIL_REGEX, "i");
const urlRegex = new RegExp(INVALID_NAME_REGEX);

const NafathAuthenticationPage = (props) => {
  const { formatMessage } = useIntl();
  const [nafathId, setNafathId] = useState("");
  const [
    nafathIdAuthenticationBtnClicked,
    setNafathIdAuthenticationBtnClicked,
  ] = useState(false);
  const [registrationBtnClicked, setRegistrationBtnClicked] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    if (props.state.loginError) {
      setNafathId("");
      setNafathIdAuthenticationBtnClicked(false);
      setRegistrationBtnClicked(false);
      props.emptyState();
    }
  }, [props.state.loginError]);

  useEffect(() => {
    const error = props.state.registrationError;
    if (error) {
      setRegistrationBtnClicked(false);
    }
    if (error && error.includes("duplicate-email")) {
      props.setFormNumber(2);
      props.setFormEmailError(
        formatMessage(
          registrationFormMessages["registration.email.duplicate.error"]
        )
      );
    } else if (error && error.includes("duplicate-username")) {
      props.setFormNumber(2);
      props.setFormUsernameError(
        formatMessage(
          registrationFormMessages["registration.username.duplicate.error"]
        )
      );
    } else if (error && error.includes("activation-code-do-not-match")) {
      props.setFormNumber(7);
      props.setFormActivationCodeError(
        formatMessage(
          messages["registration.activation.code.do.not.match.error"]
        )
      );
    }
  }, [props.state.registrationError]);

  useEffect(() => {
    if (props.state.authenticationError) {
      setNafathIdAuthenticationBtnClicked(false);
    }
  }, [props.state.authenticationError]);

  const handleNafathAuthentication = () => {
    setNafathIdAuthenticationBtnClicked(true);
    if (!nafathId) {
      setNafathIdAuthenticationBtnClicked(false);
      props.setNafathUserIdAuthenticationError({
        authenticationError: formatMessage(
          messages["nafathId.empty.field.error"]
        ),
      });
    } else {
      props.authenticateUserIdFromNafath(nafathId);
    }
  };

  const handleNafathRegistration = () => {
    if (props.state.form == 2) {
      const form2fields = ["name", "username", "email", "phone_number"];
      Object.keys(form2fields).forEach((key) => {
        let fieldName = form2fields[key];
        let value =
          (fieldName == "name" && props.state.name) ||
          "" ||
          (fieldName == "username" && props.state.username) ||
          "" ||
          (fieldName == "phone_number" && props.state.phone_number) ||
          "" ||
          (fieldName == "email" && props.state.email) ||
          "";
        validateInput(fieldName, value);
      });
      if (
        props.state.name &&
        !props.state.nameError &&
        props.state.username &&
        !props.state.usernameError &&
        props.state.email &&
        !props.state.emailError &&
        props.state.phone_number &&
        !props.state.phone_numberError
      ) {
        props.setFormNumber(props.state.form + 1);
      } else {
        setRegistrationBtnClicked(false);
      }
    } else if (props.state.form == 3) {
      const form3fields = ["gender", "date_of_birth"];
      Object.keys(form3fields).forEach((key) => {
        let fieldName = form3fields[key];
        let value =
          (fieldName == "gender" && props.state.gender) ||
          "" ||
          (fieldName == "date_of_birth" && props.state.date_of_birth) ||
          "";
        validateInput(fieldName, value);
      });
      if (
        props.state.gender &&
        !props.state.genderError &&
        props.state.date_of_birth &&
        !props.state.date_of_birthError
      ) {
        props.setFormNumber(props.state.form + 1);
      } else {
        setRegistrationBtnClicked(false);
      }
    } else if (props.state.form == 4) {
      const form4fields = ["region", "city"];
      Object.keys(form4fields).forEach((key) => {
        let fieldName = form4fields[key];
        let value =
          (fieldName == "region" && props.state.region) ||
          "" ||
          (fieldName == "city" && props.state.city) ||
          "";
        validateInput(fieldName, value);
      });
      if (
        props.state.region &&
        !props.state.regionError &&
        props.state.city &&
        !props.state.cityError
      ) {
        props.setFormNumber(props.state.form + 1);
      } else {
        setRegistrationBtnClicked(false);
      }
    } else if (props.state.form == 5) {
      validateInput("level_of_education", props.state.level_of_education);
      if (
        props.state.level_of_education &&
        !props.state.level_of_educationError
      ) {
        props.setFormNumber(props.state.form + 1);
      } else {
        setRegistrationBtnClicked(false);
      }
    } else if (props.state.form == 6) {
      const form6fields = [
        "employment_status",
        "work_experience_level",
        "job_title",
      ];
      Object.keys(form6fields).forEach((key) => {
        let fieldName = form6fields[key];
        let value =
          (fieldName == "employment_status" && props.state.employment_status) ||
          "" ||
          (fieldName == "job_title" && props.state.job_title) ||
          "" ||
          (fieldName == "work_experience_level" &&
            props.state.work_experience_level) ||
          "";
        validateInput(fieldName, value);
      });
      if (
        props.state.employment_status &&
        !props.state.employment_statusError &&
        props.state.job_title &&
        !props.state.job_titleError &&
        props.state.work_experience_level &&
        !props.state.work_experience_levelError
      ) {
        const userRegistrationPayload = {
          nafath_id: props.state.userId,
          trans_id: props.state.transId,
          user_data: {
            username: props.state.username,
            email: props.state.email,
            activation_code: props.state.activation_code,
            form: props.state.form,
          },
        };
        props.setNafathUserRegistrationError("");
        props.handleNafathUserRegistration(userRegistrationPayload);
      } else {
        setRegistrationBtnClicked(false);
      }
    } else if (props.state.form == 7) {
      setRegistrationBtnClicked(true);
      validateInput("activation_code", props.state.activation_code);
      if (props.state.activation_code && !props.state.activation_codeError) {
        const userRegistrationPayload = {
          nafath_id: props.state.userId,
          trans_id: props.state.transId,
          user_data: {
            name: props.state.name,
            username: props.state.username,
            email: props.state.email,
            phone_number: props.state.phone_number,
            gender: props.state.gender,
            linkedin_account: props.state.linkedin_account,
            date_of_birth: props.state.date_of_birth,
            region: props.state.region,
            city: props.state.city,
            address_line: props.state.address_line,
            level_of_education: props.state.level_of_education,
            english_language_level: props.state.english_language_level,
            employment_status: props.state.employment_status,
            work_experience_level: props.state.work_experience_level,
            job_title: props.state.job_title,
            activation_code: props.state.activation_code,
          },
        };
        const date = new Date(userRegistrationPayload.user_data.date_of_birth);
        userRegistrationPayload.user_data.year_of_birth = date.getFullYear();

        props.setNafathUserRegistrationError("");
        props.handleNafathUserRegistration(userRegistrationPayload);
      } else {
        setRegistrationBtnClicked(false);
      }
    }
  };

  const validateInput = (fieldName, value) => {
    let fieldError = "";
    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          fieldError = formatMessage(
            registrationFormMessages["empty.name.field.error"]
          );
        } else if (value && value.match(urlRegex)) {
          fieldError = formatMessage(
            registrationFormMessages["name.validation.message"]
          );
        }
        props.setFormNameError(fieldError || props.state.nameError);
        break;
      case "activation_code":
        if (!value.trim()) {
          fieldError = formatMessage(
            messages["empty.activation_code.field.error"]
          );
        }
        props.setFormActivationCodeError(
          fieldError || props.state.activation_codeError
        );
        break;
      case "email":
        if (!value) {
          fieldError = formatMessage(
            registrationFormMessages["empty.email.field.error"]
          );
        } else if (value.length <= 2 || !emailRegex.test(value)) {
          fieldError = formatMessage(
            registrationFormMessages["email.invalid.format.error"]
          );
        } else {
          const [username, domainName] = value.split("@");
          const response = validateEmailAddress(value, username, domainName);
          if (response.hasError) {
            fieldError = formatMessage(
              registrationFormMessages["email.invalid.format.error"]
            );
            delete response.hasError;
          }
        }
        props.setFormEmailError(fieldError || props.state.emailError);
        break;
      case "phone_number":
        if (!value.trim()) {
          fieldError = formatMessage(
            registrationFormMessages["empty.phone_number.field.error"]
          );
        } else if (!value.match(/^[0-9+]+$/)) {
          fieldError = formatMessage(
            registrationFormMessages["phone_number.validation.message"]
          );
        }
        props.setFormPhoneNumberError(
          fieldError || props.state.phone_numberError
        );
        break;
      case "date_of_birth":
        if (!value.trim()) {
          fieldError = formatMessage(
            registrationFormMessages["empty.date_of_birth.field.error"]
          );
        }
        props.setFormDateOfBirthError(
          fieldError || props.state.date_of_birthError
        );
        break;
      case "region":
        if (!value.trim()) {
          fieldError = formatMessage(
            registrationFormMessages["empty.region.field.error"]
          );
        }
        props.setFormRegionError(fieldError || props.state.regionError);
        break;
      case "level_of_education":
        if (!value.trim()) {
          fieldError = formatMessage(
            registrationFormMessages["empty.level_of_education.field.error"]
          );
        }
        props.setFormLevelOfEducationError(
          fieldError || props.state.level_of_educationError
        );
        break;
      case "employment_status":
        if (!value.trim()) {
          fieldError = formatMessage(
            registrationFormMessages["empty.employment_status.field.error"]
          );
        }
        props.setFormEmploymentStatusError(
          fieldError || props.state.employment_statusError
        );
        break;
      case "work_experience_level":
        if (!value.trim()) {
          fieldError = formatMessage(
            registrationFormMessages["empty.work_experience_level.field.error"]
          );
        }
        props.setFormWorkExperienceLevelError(
          fieldError || props.state.work_experience_levelError
        );
        break;
      case "job_title":
        if (!value.trim()) {
          fieldError = formatMessage(
            registrationFormMessages["empty.job_title.field.error"]
          );
        }
        props.setFormJobTitleError(fieldError || props.state.job_titleError);
        break;
      case "city":
        if (!value.trim()) {
          fieldError = formatMessage(
            registrationFormMessages["empty.city.field.error"]
          );
        }
        props.setFormCityError(fieldError || props.state.cityError);
        break;
      case "gender":
        if (!value.trim()) {
          fieldError = formatMessage(
            registrationFormMessages["empty.gender.field.error"]
          );
        }
        props.setFormGenderError(fieldError || props.state.genderError);
        break;
      case "username":
        if (!value || value.length <= 2 || value.length > 30) {
          fieldError = formatMessage(
            registrationFormMessages["username.validation.message"]
          );
        } else if (!value.match(/^[a-zA-Z0-9_-]*$/i)) {
          fieldError = formatMessage(
            registrationFormMessages["username.format.validation.message"]
          );
        }
        props.setFormUsernameError(fieldError || props.state.usernameError);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (props.state.status === "WAITING") {
      const interval = setInterval(() => {
        props.checkUserRequestStatus({
          nafath_id: props.state.userId,
          trans_id: props.state.transId,
        });
      }, props.state.interval);
      return () => clearInterval(interval);
    }
    if (props.state.status !== "WAITING") {
      setNafathIdAuthenticationBtnClicked(false);
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
        {props.state.loginError ? (
          <LoginFailureMessage loginError={props.state.loginError} />
        ) : null}
        {props.state.registrationError && (
          <RegistrationFailure
            errorCode={props.state.registrationError}
            failureCount={1}
          />
        )}
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
              errorMessage={
                (props.state.authenticationError == "ERR001" &&
                  formatMessage(messages["nafath.authenticate.error"])) ||
                props.state.authenticationError ||
                ""
              }
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
                  (props.state.status === "REJECTED" &&
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
              onClick={handleNafathAuthentication}
              onMouseDown={(e) => e.preventDefault()}
            />
          </Form>
        )}
        <Form name="nafath-form2" id="nafath-form2">
          {props.state.form == 2 && (
            <>
              <FormGroup
                name="name"
                value={props.state.name}
                handleChange={(e) => {
                  let value = e.target.value;
                  if (value.length > 255) {
                    value = value.substring(0, value.length - 1);
                  }
                  if (value.startsWith(" ")) {
                    value = value.trim();
                  }
                  props.setFormName(value);
                  props.setFormNameError("");
                  return value;
                }}
                handleBlur={(e) => {
                  setFocusedField("");
                  validateInput(e.target.name, e.target.value);
                }}
                handleFocus={() => {
                  setFocusedField("name");
                }}
                errorMessage={
                  (!(focusedField == "name") && props.state.nameError) || ""
                }
                helpText={[
                  formatMessage(registrationFormMessages["help.text.name"]),
                ]}
                floatingLabel={formatMessage(
                  registrationFormMessages["registration.fullname.label"]
                )}
              />
              <FormGroup
                name="username"
                value={props.state.username}
                handleChange={(e) => {
                  let value = e.target.value;
                  if (value.startsWith(" ")) {
                    value = value.trim();
                  }
                  if (value.length > 30) {
                    return;
                  }
                  props.setFormUsername(value);
                  props.setFormUsernameError("");
                  return value;
                }}
                handleBlur={(e) => {
                  setFocusedField("");
                  validateInput(e.target.name, e.target.value);
                }}
                handleFocus={() => {
                  setFocusedField("username");
                }}
                errorMessage={
                  (!(focusedField == "username") &&
                    props.state.usernameError) ||
                  ""
                }
                helpText={[
                  formatMessage(
                    registrationFormMessages["help.text.username.1"]
                  ),
                  formatMessage(
                    registrationFormMessages["help.text.username.2"]
                  ),
                ]}
                floatingLabel={formatMessage(
                  registrationFormMessages["registration.username.label"]
                )}
              />
              <FormGroup
                name="email"
                value={props.state.email}
                handleChange={(e) => {
                  let value = e.target.value;
                  if (value.startsWith(" ")) {
                    value = value.trim();
                  }
                  props.setFormEmail(value);
                  props.setFormEmailError("");
                  return value;
                }}
                handleBlur={(e) => {
                  setFocusedField("");
                  validateInput(e.target.name, e.target.value);
                }}
                handleFocus={() => {
                  setFocusedField("email");
                }}
                errorMessage={
                  (!(focusedField == "email") && props.state.emailError) || ""
                }
                helpText={[
                  formatMessage(registrationFormMessages["help.text.email"]),
                ]}
                floatingLabel={formatMessage(
                  registrationFormMessages["registration.email.label"]
                )}
              />
              <FormGroup
                name="phone_number"
                value={props.state.phone_number}
                handleChange={(e) => {
                  let value = e.target.value;
                  if (value.startsWith(" ")) {
                    value = value.trim();
                  }
                  if (value.length > 50 || !value.match(/^[0-9+]+$/)) {
                    value = value.substring(0, value.length - 1);
                  }
                  props.setFormPhoneNumber(value);
                  props.setFormPhoneNumberError("");
                  return value;
                }}
                handleBlur={(e) => {
                  setFocusedField("");
                  validateInput(e.target.name, e.target.value);
                }}
                handleFocus={() => {
                  setFocusedField("phone_number");
                }}
                errorMessage={
                  (!(focusedField == "phone_number") &&
                    props.state.phone_numberError) ||
                  ""
                }
                helpText={[
                  formatMessage(
                    registrationFormMessages["help.text.phone_number"]
                  ),
                ]}
                floatingLabel={formatMessage(
                  registrationFormMessages["registration.phone_number.label"]
                )}
              />
            </>
          )}
          {props.state.form == 3 && (
            <>
              <Form.Group
                style={{ "margin-bottom": "1.75rem" }}
                className="d-flex align-items-center"
              >
                <Form.Label>
                  <h5>
                    {formatMessage(
                      registrationFormMessages["gender.heading.text"]
                    )}
                  </h5>
                  <Form.RadioSet
                    name="gender"
                    value={props.state.gender}
                    onBlur={(e) => {
                      setFocusedField("");
                      validateInput(e.target.name, e.target.value);
                    }}
                    onChange={(e) => {
                      let value = e.target.value;
                      props.setFormGender(value);
                      props.setFormGenderError("");
                      return value;
                    }}
                    onFocus={() => {
                      setFocusedField("gender");
                    }}
                  >
                    <Form.Radio value="m">
                      {formatMessage(
                        registrationFormMessages["gender.option.male.text"]
                      )}
                    </Form.Radio>
                    <Form.Radio value="f">
                      {formatMessage(
                        registrationFormMessages["gender.option.female.text"]
                      )}
                    </Form.Radio>
                  </Form.RadioSet>
                </Form.Label>
              </Form.Group>
              <p
                style={{
                  "font-size": "0.75rem",
                  "margin-top": (props.state.genderError && "-1.4rem") || "",
                  "margin-bottom": "2rem",
                  color: "#C32D3A",
                }}
              >
                {props.state.genderError}
              </p>
              <FormGroup
                name="linkedin_account"
                value={props.state.linkedin_account}
                handleChange={(e) => {
                  let value = e.target.value;
                  if (value.startsWith(" ")) {
                    value = value.trim();
                  }
                  props.setFormLinkedInAccount(value);
                  return value;
                }}
                handleBlur={(e) => {
                  setFocusedField("");
                }}
                handleFocus={() => {
                  setFocusedField("linkedin_account");
                }}
                helpText={[
                  formatMessage(
                    registrationFormMessages["help.text.linkedin_account"]
                  ),
                ]}
                floatingLabel={formatMessage(
                  registrationFormMessages[
                    "registration.linkedin_account.label"
                  ]
                )}
              />
              <h6>
                {formatMessage(
                  registrationFormMessages["registration.date_of_birth.label"]
                )}
                :
              </h6>
              <Input
                type="date"
                name="date_of_birth"
                style={{
                  "font-weight": 400,
                  color:
                    (props.state.date_of_birth == "" && "#707070") || "#101820",
                  padding: "0.5625rem 1rem",
                  display: "block",
                  width: "98.1%",
                  "font-size": "0.875rem",
                  "line-height": "1.5rem",
                  height: "2.75rem",
                  "background-clip": "padding-box",
                  border: !props.state.date_of_birthError
                    ? "1px solid #707070"
                    : "1px solid #C32D3A",
                  "border-radius": "0.375rem",
                  transition:
                    "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
                  overflow: "visible",
                  "font-family": "inherit",
                  "box-sizing": "border-box",
                  "margin-bottom": "1.75rem",
                }}
                value={props.state.date_of_birth}
                onChange={(e) => {
                  let value = e.target.value;
                  if (value.startsWith(" ")) {
                    value = value.trim();
                  }
                  const date = new Date(value);
                  let year = (date.getFullYear()) + '';
                  if (year.length > 4) {
                    const month = (date.getMonth() + 1) + '';
                    const day = (date.getDate()) + '';
                    year = year.substring(0, year.length - 1);
                    value = year + "-" + month + "-" + day;
                  }
                  props.setFormDateOfBirth(value);
                  props.setFormDateOfBirthError("");
                  return value;
                }}
                onBlur={(e) => {
                  setFocusedField("");
                  validateInput(e.target.name, e.target.value);
                }}
                onFocus={() => {
                  setFocusedField("date_of_birth");
                }}
              />
              <p
                style={{
                  "font-size": "0.75rem",
                  "margin-top":
                    (focusedField == "date_of_birth" && "-1.4rem") || "",
                  "margin-bottom": "2rem",
                  color: "#707070",
                }}
              >
                {focusedField == "date_of_birth" &&
                  formatMessage(
                    registrationFormMessages["help.text.date_of_birth"]
                  )}
              </p>
              <p
                style={{
                  "font-size": "0.75rem",
                  "margin-top":
                    (props.state.date_of_birthError && "-1.4rem") || "",
                  "margin-bottom": "2rem",
                  color: "#C32D3A",
                }}
              >
                {!(focusedField == "date_of_birth") &&
                  props.state.date_of_birthError}
              </p>
            </>
          )}
          {props.state.form == 4 && (
            <>
              <h6>
                {formatMessage(
                  registrationFormMessages["registration.region.label"]
                )}
                :
              </h6>
              <InputSelect
                style={{
                  "margin-top": "-1.75rem",
                  "margin-bottom": "1.75rem",
                  width: "98.1%",
                  border: !props.state.regionError
                    ? "1px solid #707070"
                    : "1px solid #C32D3A",
                }}
                value={props.state.region}
                name="region"
                onChange={(value) => {
                  props.setFormRegion(value);
                  props.setFormRegionError("");
                  return value;
                }}
                onBlur={(value) => {
                  setFocusedField("");
                  validateInput("region", value);
                }}
                onFocus={() => {
                  setFocusedField("region");
                }}
                options={[
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["help.text.region"]
                      ),
                    ],
                    value: "",
                    disabled: true,
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["region.option.Riyadh.text"]
                      ),
                    ],
                    value: "RD",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["region.option.Eastern.text"]
                      ),
                    ],
                    value: "ER",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["region.option.Asir.text"]
                      ),
                    ],
                    value: "AI",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["region.option.Jazan.text"]
                      ),
                    ],
                    value: "JA",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["region.option.Medina.text"]
                      ),
                    ],
                    value: "MN",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["region.option.Al-Qassim.text"]
                      ),
                    ],
                    value: "AS",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["region.option.Tabuk.text"]
                      ),
                    ],
                    value: "TU",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["region.option.Ha'il.text"]
                      ),
                    ],
                    value: "HI",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["region.option.Najran.text"]
                      ),
                    ],
                    value: "NA",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["region.option.Al-Jawf.text"]
                      ),
                    ],
                    value: "AW",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["region.option.Al-Bahah.text"]
                      ),
                    ],
                    value: "AA",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "region.option.Northern Borders.text"
                        ]
                      ),
                    ],
                    value: "NB",
                  },
                ]}
              />
              <p
                style={{
                  "font-size": "0.75rem",
                  "margin-top":
                    (!(focusedField == "region") &&
                      props.state.regionError &&
                      "-1.4rem") ||
                    "",
                  "margin-bottom": "2rem",
                  color: "#C32D3A",
                }}
              >
                {!(focusedField == "region") && props.state.regionError}
              </p>
              <FormGroup
                name="city"
                value={props.state.city}
                handleChange={(e) => {
                  let value = e.target.value;
                  if (value.startsWith(" ")) {
                    value = value.trim();
                  }
                  props.setFormCity(value);
                  props.setFormCityError("");
                  return value;
                }}
                handleBlur={(e) => {
                  setFocusedField("");
                  validateInput(e.target.name, e.target.value);
                }}
                handleFocus={() => {
                  setFocusedField("city");
                }}
                errorMessage={
                  (!(focusedField == "city") && props.state.cityError) || ""
                }
                helpText={[
                  formatMessage(registrationFormMessages["help.text.city"]),
                ]}
                floatingLabel={formatMessage(
                  registrationFormMessages["registration.city.label"]
                )}
              />
              <FormGroup
                name="address_line"
                value={props.state.address_line}
                handleChange={(e) => {
                  let value = e.target.value;
                  if (value.startsWith(" ")) {
                    value = value.trim();
                  }
                  props.setFormAddressLine(value);
                  return value;
                }}
                handleBlur={(e) => {
                  setFocusedField("");
                }}
                handleFocus={() => {
                  setFocusedField("city");
                }}
                helpText={[
                  formatMessage(
                    registrationFormMessages["help.text.address_line"]
                  ),
                ]}
                floatingLabel={formatMessage(
                  registrationFormMessages["registration.address_line.label"]
                )}
              />
            </>
          )}
          {props.state.form == 5 && (
            <>
              <h6>
                {formatMessage(
                  registrationFormMessages[
                    "registration.level_of_education.label"
                  ]
                )}
                :
              </h6>
              <InputSelect
                style={{
                  "margin-top": "-1.75rem",
                  "margin-bottom": "1.75rem",
                  width: "98.1%",
                  border: !props.state.level_of_educationError
                    ? "1px solid #707070"
                    : "1px solid #C32D3A",
                }}
                value={props.state.level_of_education}
                name="level_of_education"
                onBlur={(value) => {
                  setFocusedField("");
                  validateInput("level_of_education", value);
                }}
                onChange={(value) => {
                  props.setFormLevelOfEducation(value);
                  props.setFormLevelOfEducationError("");
                  return value;
                }}
                onFocus={() => {
                  setFocusedField("level_of_education");
                }}
                options={[
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["help.text.level_of_education"]
                      ),
                    ],
                    value: "",
                    disabled: true,
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "education.option.Middle School.text"
                        ]
                      ),
                    ],
                    value: "MS",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "education.option.High School.text"
                        ]
                      ),
                    ],
                    value: "HS",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "education.option.Diploma.text"
                        ]
                      ),
                    ],
                    value: "DM",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "education.option.Bachelor.text"
                        ]
                      ),
                    ],
                    value: "BS",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["education.option.Master.text"]
                      ),
                    ],
                    value: "MR",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["education.option.Ph.D..text"]
                      ),
                    ],
                    value: "PH",
                  },
                ]}
              />
              <p
                style={{
                  "font-size": "0.75rem",
                  "margin-top":
                    (!(focusedField == "level_of_education") &&
                      props.state.level_of_educationError &&
                      "-1.4rem") ||
                    "",
                  "margin-bottom": "2rem",
                  color: "#C32D3A",
                }}
              >
                {!(focusedField == "level_of_education") &&
                  props.state.level_of_educationError}
              </p>
              <h6>
                {formatMessage(
                  registrationFormMessages[
                    "registration.english_language_level.label"
                  ]
                )}
                :
              </h6>
              <InputSelect
                style={{
                  "margin-top": "-1.75rem",
                  "margin-bottom": "1.75rem",
                  width: "98.1%",
                  border: !props.state.english_language_levelError
                    ? "1px solid #707070"
                    : "1px solid #C32D3A",
                }}
                value={props.state.english_language_level}
                name="english_language_level"
                onBlur={(value) => {
                  setFocusedField("");
                  validateInput("english_language_level", value);
                }}
                onChange={(value) => {
                  props.setFormEnglishLanguageLevel(value);
                  props.setFormEnglishLanguageLevelError("");
                  return value;
                }}
                onFocus={() => {
                  setFocusedField("english_language_level");
                }}
                options={[
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "help.text.english_language_level"
                        ]
                      ),
                    ],
                    value: "",
                    disabled: true,
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "english_language_level.option.0.text"
                        ]
                      ),
                    ],
                    value: "0",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "english_language_level.option.1.text"
                        ]
                      ),
                    ],
                    value: "1",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "english_language_level.option.2.text"
                        ]
                      ),
                    ],
                    value: "2",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "english_language_level.option.3.text"
                        ]
                      ),
                    ],
                    value: "3",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "english_language_level.option.4.text"
                        ]
                      ),
                    ],
                    value: "4",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "english_language_level.option.5.text"
                        ]
                      ),
                    ],
                    value: "5",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "english_language_level.option.6.text"
                        ]
                      ),
                    ],
                    value: "6",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "english_language_level.option.7.text"
                        ]
                      ),
                    ],
                    value: "7",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "english_language_level.option.8.text"
                        ]
                      ),
                    ],
                    value: "8",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "english_language_level.option.9.text"
                        ]
                      ),
                    ],
                    value: "9",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "english_language_level.option.10.text"
                        ]
                      ),
                    ],
                    value: "10",
                  },
                ]}
              />
              <p
                style={{
                  "font-size": "0.75rem",
                  "margin-top":
                    (!(focusedField == "english_language_level") &&
                      props.state.english_language_levelError &&
                      "-1.4rem") ||
                    "",
                  "margin-bottom": "2rem",
                  color: "#C32D3A",
                }}
              >
                {!(focusedField == "english_language_level") &&
                  props.state.english_language_levelError}
              </p>
            </>
          )}
          {props.state.form == 6 && (
            <>
              <h6>
                {formatMessage(
                  registrationFormMessages[
                    "registration.employment_status.label"
                  ]
                )}
                :
              </h6>
              <InputSelect
                style={{
                  "margin-top": "-1.75rem",
                  "margin-bottom": "1.75rem",
                  width: "98.1%",
                  border: !props.state.employment_statusError
                    ? "1px solid #707070"
                    : "1px solid #C32D3A",
                }}
                value={props.state.employment_status}
                name="employment_status"
                onBlur={(value) => {
                  setFocusedField("");
                  validateInput("employment_status", value);
                }}
                onChange={(value) => {
                  props.setFormEmploymentStatus(value);
                  props.setFormEmploymentStatusError("");
                  return value;
                }}
                onFocus={() => {
                  setFocusedField("employment_status");
                }}
                options={[
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages["help.text.employment_status"]
                      ),
                    ],
                    value: "",
                    disabled: true,
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "employment_status.option.Public industry.text"
                        ]
                      ),
                    ],
                    value: "PU",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "employment_status.option.Private industry.text"
                        ]
                      ),
                    ],
                    value: "PR",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "employment_status.option.Job seeker.text"
                        ]
                      ),
                    ],
                    value: "JS",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "employment_status.option.Student.text"
                        ]
                      ),
                    ],
                    value: "ST",
                  },
                ]}
              />
              <p
                style={{
                  "font-size": "0.75rem",
                  "margin-top":
                    (!(focusedField == "employment_status") &&
                      props.state.employment_statusError &&
                      "-1.4rem") ||
                    "",
                  "margin-bottom": "2rem",
                  color: "#C32D3A",
                }}
              >
                {!(focusedField == "employment_status") &&
                  props.state.employment_statusError}
              </p>
              <h6>
                {formatMessage(
                  registrationFormMessages[
                    "registration.work_experience_level.label"
                  ]
                )}
                :
              </h6>
              <InputSelect
                style={{
                  "margin-top": "-1.75rem",
                  "margin-bottom": "1.75rem",
                  width: "98.1%",
                  border: !props.state.work_experience_levelError
                    ? "1px solid #707070"
                    : "1px solid #C32D3A",
                }}
                value={props.state.work_experience_level}
                name="work_experience_level"
                onBlur={(value) => {
                  setFocusedField("");
                  validateInput("work_experience_level", value);
                }}
                onChange={(value) => {
                  props.setFormWorkExperienceLevel(value);
                  props.setFormWorkExperienceLevelError("");
                  return value;
                }}
                onFocus={() => {
                  setFocusedField("work_experience_level");
                }}
                options={[
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "help.text.work_experience_level"
                        ]
                      ),
                    ],
                    value: "",
                    disabled: true,
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "work_experience_level.option.Junior level (0-2) years.text"
                        ]
                      ),
                    ],
                    value: "JL",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "work_experience_level.option.Middle level (3-4) years.text"
                        ]
                      ),
                    ],
                    value: "ML",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "work_experience_level.option.Senior level (5-10) years.text"
                        ]
                      ),
                    ],
                    value: "SL",
                  },
                  {
                    label: [
                      formatMessage(
                        registrationFormMessages[
                          "work_experience_level.option.Expert (+ 10 years).text"
                        ]
                      ),
                    ],
                    value: "EL",
                  },
                ]}
              />
              <p
                style={{
                  "font-size": "0.75rem",
                  "margin-top":
                    (!(focusedField == "work_experience_level") &&
                      props.state.work_experience_levelError &&
                      "-1.4rem") ||
                    "",
                  "margin-bottom": "2rem",
                  color: "#C32D3A",
                }}
              >
                {!(focusedField == "work_experience_level") &&
                  props.state.work_experience_levelError}
              </p>
              <FormGroup
                name="job_title"
                value={props.state.job_title}
                handleChange={(e) => {
                  let value = e.target.value;
                  if (value.length > 63) {
                    value = value.substring(0, value.length - 1);
                  }
                  if (value.startsWith(" ")) {
                    value = value.trim();
                  }
                  props.setFormJobTitle(value);
                  props.setFormJobTitleError("");
                  return value;
                }}
                handleBlur={(e) => {
                  setFocusedField("");
                  validateInput(e.target.name, e.target.value);
                }}
                handleFocus={() => {
                  setFocusedField("job_title");
                }}
                errorMessage={
                  (!(focusedField == "job_title") &&
                    props.state.job_titleError) ||
                  ""
                }
                helpText={[
                  formatMessage(
                    registrationFormMessages["help.text.job_title"]
                  ),
                ]}
                floatingLabel={formatMessage(
                  registrationFormMessages["registration.job_title.label"]
                )}
              />
              <FormCheck
                name="terms_and_conditions"
                value={props.state.terms_and_conditions}
                defaultChecked
                type="checkbox"
                inline={true}
                style={{"font-size": "1rem"}}
                onChange={(e) => {
                  let value = e.target.value;
                  props.setTermsAndConditions(value);
                  return value;
                }}
                label={[
                  formatMessage(registrationFormMessages['registration.terms.and.conditions.policy.checkbox.label1']),
                  " ",
                  <a href='https://courses.sdaia.academy/privacy-policy/' target='_blank'>{formatMessage(registrationFormMessages['registration.terms.and.conditions.policy.checkbox.label2'])}</a>,
                  "."
                ]}
              />
            </>
          )}
          {props.state.form == 7 && (
            <>
              <FormGroup
                name="activation_code"
                value={props.state.activation_code}
                handleChange={(e) => {
                  const value = e.target.value;
                  props.setFormActivationCode(value);
                  props.setFormActivationCodeError("");
                  return value;
                }}
                handleBlur={(e) => {
                  setFocusedField("");
                  validateInput(e.target.name, e.target.value);
                }}
                handleFocus={() => {
                  setFocusedField("activation_code");
                }}
                errorMessage={
                  (!(focusedField == "activation_code") &&
                    props.state.activation_codeError) ||
                  ""
                }
                helpText={[
                  formatMessage(messages["help.text.activation_code"]),
                ]}
                floatingLabel={formatMessage(
                  messages["nafath.user.activation_code.label"]
                )}
              />
            </>
          )}
          {(props.state.form == 3 ||
            props.state.form == 4 ||
            props.state.form == 5 ||
            props.state.form == 6) && (
            <StatefulButton
              id="back-register-user"
              name="back-register-user"
              type="submit"
              variant="brand"
              className="mr-4 mt-4 mb-4"
              labels={{
                default: formatMessage(
                  registrationFormMessages["back.account.creation.free.button"]
                ),
                pending: "",
              }}
              onClick={(e) => {
                e.preventDefault();
                setFocusedField("");
                props.setFormNumber(props.state.form - 1);
              }}
              onMouseDown={(e) => e.preventDefault()}
            />
          )}
          {props.state.form > 1 && (
            <StatefulButton
              name="complete-nafath-registration"
              id="complete-nafath-registration"
              className={"nafath-authenticate-button"}
              variant="brand"
              state={
                (registrationBtnClicked &&
                  props.state.form == 7 &&
                  "pending") ||
                "default"
              }
              labels={{
                default:
                  (props.state.form == 7 &&
                    formatMessage(
                      messages["complete.nafath.registration.button"]
                    )) ||
                  formatMessage(
                    registrationFormMessages[
                      "proceed.account.creation.free.button"
                    ]
                  ),
                pending: "",
              }}
              onClick={(e) => {
                e.preventDefault();
                setFocusedField("");
                handleNafathRegistration();
              }}
              onMouseDown={(e) => e.preventDefault()}
            />
          )}
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
  person: PropTypes.shape({}),
  // Actions
  authenticateUserIdFromNafath: PropTypes.func.isRequired,
  checkUserRequestStatus: PropTypes.func.isRequired,
  handleNafathUserRegistration: PropTypes.func.isRequired,
  setNafathUserRegistrationError: PropTypes.func.isRequired,
  setNafathUserIdAuthenticationError: PropTypes.func.isRequired,
  emptyState: PropTypes.func.isRequired,
  setFormNumber: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  authenticateUserIdFromNafath,
  checkUserRequestStatus,
  handleNafathUserRegistration,
  setNafathUserRegistrationError,
  setNafathUserIdAuthenticationError,
  emptyState,
  setFormNumber,
  setFormName,
  setFormNameError,
  setFormEmail,
  setFormEmailError,
  setFormUsername,
  setFormUsernameError,
  setFormActivationCode,
  setFormActivationCodeError,
  setFormPhoneNumber,
  setFormPhoneNumberError,
  setFormLinkedInAccount,
  setFormGender,
  setFormGenderError,
  setFormDateOfBirth,
  setFormDateOfBirthError,
  setFormRegion,
  setFormRegionError,
  setFormCity,
  setFormCityError,
  setFormAddressLine,
  setFormLevelOfEducation,
  setFormLevelOfEducationError,
  setFormEnglishLanguageLevel,
  setFormEnglishLanguageLevelError,
  setFormWorkExperienceLevel,
  setFormWorkExperienceLevelError,
  setFormEmploymentStatus,
  setFormEmploymentStatusError,
  setFormJobTitle,
  setFormJobTitleError,
  setTermsAndConditions,
})(NafathAuthenticationPage);
