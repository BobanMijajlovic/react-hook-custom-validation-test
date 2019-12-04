export const DEFAULT_MESSAGE_REQUIRED = 'Required Field'
export const DEFAULT_MESSAGE_MAX_VALUE = 'Max value is {max}'
export const DEFAULT_MESSAGE_MIN_LENGTH = 'Min length is {min}'
export const DEFAULT_MESSAGE_NOT_EMPTY = 'Field can be empty'
export const DEFAULT_MESSAGE_ONLY_NUMBERS = 'Only numbers'
export const DEFAULT_MESSAGE_REGEX = 'Regex not passed'
export const DEFAULT_MESSAGE_NOT_SAME = 'Fields must match'

export const FUN_NAME_SAME_VALUES = 'areTheSame'

export interface IValidatorParams {
  message ?: string
}

type backType = string | boolean

const isDefined = (value : any) => {
  return value !== void 0 && value !== null && value !== ''
}

export const required = ({message} : IValidatorParams = {}) => (value : any) : backType => {
  return !isDefined(value) ? message || DEFAULT_MESSAGE_REQUIRED : false
}

export const notEmpty = ({message} : IValidatorParams = {}) => (value : number | string) : backType => {
  if (!isDefined(value)) {
    return false
  }
  if (typeof value === 'number') {
    value = `${value}`
  }
  return value.trim().length !== 0 ? false : (message || DEFAULT_MESSAGE_NOT_EMPTY)
}

/** *  Validation min length **/
export interface IValidatorMinLength extends IValidatorParams {
  min : number
}

export const minLength = ({message, min} : IValidatorMinLength) => (value ?: string | number) : backType => {
  if (!isDefined(value)) {
    return false
  }
  if (typeof value === 'number') {
    value = `${value}`
  }
  return (value as string).length >= min ? false : (message ? message : DEFAULT_MESSAGE_MIN_LENGTH.replace(/{min}/g, `${min}`))
}

/** Check if string consists only numbers as characters */
export const onlyNumbers = ({message} : IValidatorParams = {}) => (value ?: string) : backType => {
  if (!isDefined(value)) {
    return false
  }
  return /^\d+$/.exec(value as string) ? false : (message ? message : DEFAULT_MESSAGE_ONLY_NUMBERS)
}

/** *  Validation max value **/
export interface IValidatorMaxValue extends IValidatorParams {
  max : number
}

export const maxValue = ({message, max} : IValidatorMaxValue) => (value ?: number | string) : backType => {
    /** only check valid values , not NaN, not string that are not represents number */
  if (!isDefined(value)) {
    return false
  }
  value = +(value as (string | number))
  if (isNaN(value)) {
    return false
  }
  return value <= max ? false : (message ? message : DEFAULT_MESSAGE_MAX_VALUE.replace(/{max}/g, `${max}`))
}

export interface IValidatorRegularExpression extends IValidatorParams {
  regex : RegExp
}

/** check string passing regular expresion state */
export const checkRegex = ({message, regex} : IValidatorRegularExpression) => (value ?: string) : backType => {
  return !isDefined(value) ? false : (regex.exec(value as string) ? false : (message ? message : DEFAULT_MESSAGE_REGEX))
}

export interface IValidatorAreTheSame extends IValidatorParams {
  field : string
}

export interface IAreTheSame {
  field : string,
  check : (value ?: string, valueSecond ?: string) => boolean | string
}

export const areTheSame = ({message, field} : IValidatorAreTheSame) => () : IAreTheSame => {
  const same = (value ?: string, valueSecond ?: string) : backType => {
    if (!isDefined(value) || !isDefined(valueSecond)) {
      return false
    }
    return value === valueSecond ? false : (message ? message : DEFAULT_MESSAGE_NOT_SAME)
  }
  return {
    field: field,
    check: same
  }
}
