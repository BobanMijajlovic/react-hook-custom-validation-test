import React, {RefObject} from 'react'

export type ValidationRulesNamesKey =
    'required'
    | 'minLength'
    | 'maxLength'
    | 'maxValue'
    | 'onlyNumbers'
    | 'notEmpty'
    | 'isEmail'
    | 'isValidRegex'
    | 'areTheSame'
    | 'formatInputRuleNumber'
    | 'useValidator'
    | 'customValidation'

/** Entry properties for useValidationForm hook */
export interface IUseValidationProps<T> {
  initialData ?: Partial<T>
}

export type IValidationFieldRules = {
  [key in ValidationRulesNamesKey] ?: ((params ?: any) => any)
}

export type IValidationModelRules<T,T1 = null, T2 = null, T3 = null,T4 = null, T5 = null, T6 = null, T7 = null> = {
  [key in keyof T] ?: IValidationFieldRules | IValidationModelRules<T1>  | IValidationModelRules<T2>   | IValidationModelRules<T3>
  | IValidationModelRules<T4>  | IValidationModelRules<T5> | IValidationModelRules<T6> | IValidationModelRules<T7>|any
}

export interface IFieldsRefs {
  field : string,
  ref : RefObject<any>
}

export type IValidationField = {
  error : boolean | string;
  dirty ? : boolean;
  validation : {
    [key in ValidationRulesNamesKey] ?: boolean | string
  }
}

export type IValidationSubModel<T> = {
  [key in keyof T] :  IValidationField| IValidationSubModel<any>
}

export type IValidationModel<T> = {
  validations : {
    [key in keyof T] :  IValidationField | IValidationSubModel<any>
  },
  error : boolean|string,
  global : boolean | string,
}

export interface IFormatCurrency {
  format : 'CURRENCY',
  decimalChar ? : ',' | '.'
  decimalPlace ? :  number
}

export interface IFormatNumberRule {
  format : string,
  mask ?: '*' | ' ' | '_',
  validSize ?: number
}

export interface IFormatRuleProps {
  rule : IFormatNumberRule | IFormatCurrency
  validate ?: boolean,
  validationMessage ?: string
}

export interface IPromiseValidationData<T> {
  error : boolean,
  data : T,
  validations : IValidationModel<T>
  refs : IFieldsRefs[]
}

export interface IRegisterFieldData {
  ref : React.Ref<any>,
  default ? : string
}

export interface IWithValidationProps<T> {
  inputRef ?: React.Ref<any>,
  error ? : string|boolean,
  onBlur ?: (event : React.FocusEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void,
  onChange ? : (event : React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void
  onFocus ?: (event : React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLSelectElement>) => void,
  onKeyDown ?: (event : React.KeyboardEvent<HTMLInputElement>) => void,
  value ?: string
  validation : {
    useValidation : IUseValidation<T>
    model : string
    defaultValue ?: string
    rule ?: IValidationFieldRules
    format ?: IFormatRuleProps
  }
}

export interface IUseValidation<T> {
  registerField : (field : string, data : IRegisterFieldData) => void,
  addValidationRule : (field : string, rule : IValidationFieldRules) => void
  /** @param field - name of the field in model like  person.address.city
   *  @return current value for the field or undefined
   */
  getFieldValue : (field : string) => string | undefined,
  addArrayData : (field : string, data : any) => Promise<IPromiseValidationData<T>>,
  removeArrayData : (field : string, index : number) => void
  /** @param field  name of the field in model like  person.address.zip
   *  @return error for that field ( string or true) or false if error not exists for field
   */
  getFieldError : (field : string) => string | undefined,

  getFieldRef : (field : string) => IFieldsRefs | undefined

  /**
   * @param field  path of the field in object ( firstName, person.address.zip)
   * @param value  value for the field
   * @param validate  flag that indicates should validate or not after settings ( default: true)
   */
  setFieldValue : (field : string, value : string, validate : boolean) => void,
  /**
   * @param field  path of the field in object ( firstName, person.address.zip)
   * @param error string error for this field.
   */
  setFieldError : (field : string, error : string) => void
  setErrorGlobal : (error : string | boolean) => void,
  onBlurField : (field : string, value ?: string) => void,
  validate : () => Promise<IPromiseValidationData<T>>,
  /** Reset all validation for model, all flags set to false, all field  set dirty: false */
  resetValidations : (clearData ?: boolean) => void,
  state : T
  setState : (data : any) => void

  /** Flag true|false that represent is there any error in validation in model, if one field or errorGlobal is set the this flag is true. */
  errorModel : boolean,
  /** value for error that is  set external ( setErrorGlobal ) and can be used to set error that can't be determine to belongs to any field */
  errorGlobal : boolean | string
}
