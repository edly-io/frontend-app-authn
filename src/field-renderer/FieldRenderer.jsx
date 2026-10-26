import React from 'react';

import { Form, Icon } from '@openedx/paragon';
import { ExpandMore } from '@openedx/paragon/icons';
import PropTypes from 'prop-types';

import PasswordField from '../common-components/PasswordField';

const FormFieldRenderer = (props) => {
  let formField = null;
  const {
    className, errorMessage, fieldData, labelAbove, onChangeHandler, isRequired, placeholder, readOnly, value,
  } = props;
  // Label above the input (two-step registration) instead of Paragon's floating label.
  const labelProps = labelAbove ? { placeholder } : { floatingLabel: fieldData.label };
  const aboveLabel = labelAbove ? <Form.Label>{fieldData.label}</Form.Label> : null;

  const handleFocus = (e) => {
    if (props.handleFocus) { props.handleFocus(e); }
  };

  const handleOnBlur = (e) => {
    if (props.handleBlur) { props.handleBlur(e); }
  };

  switch (fieldData.type) {
    case 'select': {
      if (!fieldData.options) {
        return null;
      }
      formField = (
        <Form.Group controlId={fieldData.name} isInvalid={!!(isRequired && errorMessage)}>
          {aboveLabel}
          <Form.Control
            className={className}
            as="select"
            name={fieldData.name}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            trailingElement={<Icon src={ExpandMore} />}
            floatingLabel={labelProps.floatingLabel}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          >
            <option key="default" value="">{labelAbove ? placeholder : fieldData.label}</option>
            {fieldData.options.map(option => (
              <option className="data-hj-suppress" key={option[0]} value={option[0]}>{option[1]}</option>
            ))}
          </Form.Control>
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    case 'textarea': {
      formField = (
        <Form.Group controlId={fieldData.name} isInvalid={!!(isRequired && errorMessage)}>
          <Form.Control
            className={className}
            as="textarea"
            name={fieldData.name}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            floatingLabel={fieldData.label}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          />
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    case 'date':
    case 'text': {
      formField = (
        <Form.Group controlId={fieldData.name} isInvalid={!!(isRequired && errorMessage)}>
          {aboveLabel}
          <Form.Control
            className={className}
            name={fieldData.name}
            type={fieldData.type === 'date' ? 'date' : undefined}
            readOnly={readOnly}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            {...labelProps}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          />
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    case 'checkbox': {
      formField = (
        <Form.Group isInvalid={!!(isRequired && errorMessage)}>
          <Form.Checkbox
            className={className}
            id={fieldData.name}
            checked={!!value}
            name={fieldData.name}
            value={value}
            aria-invalid={isRequired && Boolean(errorMessage)}
            onChange={(e) => onChangeHandler(e)}
            onBlur={handleOnBlur}
            onFocus={handleFocus}
          >
            {fieldData.label}
          </Form.Checkbox>
          {isRequired && errorMessage && (
            <Form.Control.Feedback id={`${fieldData.name}-error`} type="invalid" className="form-text-size" hasIcon={false}>
              {errorMessage}
            </Form.Control.Feedback>
          )}
        </Form.Group>
      );
      break;
    }
    case 'password': {
      formField = (
        <PasswordField
          name={fieldData.name}
          value={value}
          errorMessage={errorMessage}
          floatingLabel={fieldData.label}
          labelAbove={labelAbove}
          placeholder={placeholder}
          handleChange={(e) => onChangeHandler(e)}
          handleBlur={handleOnBlur}
          showRequirements={false}
          showScreenReaderText={false}
        />
      );
      break;
    }
    default:
      break;
  }

  return formField;
};
FormFieldRenderer.defaultProps = {
  className: '',
  value: '',
  handleBlur: null,
  handleFocus: null,
  errorMessage: '',
  isRequired: false,
  labelAbove: false,
  placeholder: undefined,
  readOnly: false,
};

FormFieldRenderer.propTypes = {
  className: PropTypes.string,
  fieldData: PropTypes.shape({
    type: PropTypes.string,
    label: PropTypes.string,
    name: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  }).isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  handleBlur: PropTypes.func,
  handleFocus: PropTypes.func,
  errorMessage: PropTypes.string,
  isRequired: PropTypes.bool,
  labelAbove: PropTypes.bool,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool,
  ]),
};

export default FormFieldRenderer;
