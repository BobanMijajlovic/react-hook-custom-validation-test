import React from 'react'
import {
  IWithValidationProps,
  withValidation
}            from '../../import-validation'

interface ISelectValuesProps {
  label : string,
  value : string
}

interface IBasicSelectValidationProps<T> extends IWithValidationProps<T>{
  label : string,
  helpText ? : string,
  array  : [ISelectValuesProps]
}

const BasicSelectValidation : <T extends any>(props : IBasicSelectValidationProps<T>) =>
React.ReactElement<IBasicSelectValidationProps<T>> = ({value,error,helpText,label,onChange, onBlur,array}) => {
  return (
    <div className="form-group">
      <label className={error ? 'custom-label text-danger' : 'custom-label'}>{label}</label>
      <select
          className={`form-control ${error ? 'is-invalid' : ''}`}
          onChange ={onChange}
          onBlur ={onBlur}
          value = { value }
      >
        {
          array.map((x : ISelectValuesProps, index : number) => {
            return (
              <option key={index} value={x.value}>{x.label}</option>
            )
          })
        }
      </select>
      { error ?  <small className="invalid-feedback custom-helper">{error}</small>  :
        (helpText ? <small className="custom-helper text-muted">{helpText}</small> : <small>&nbsp;</small>)
      }
    </div>
  )
}

export default withValidation(BasicSelectValidation)
