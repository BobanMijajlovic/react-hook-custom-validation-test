import React from 'react'
import {
  IWithValidationProps,
  withValidation
}            from '../../import-validation'

interface IBasicInputValidationProps<T> extends IWithValidationProps<T>{
  label : string,
  helperText ? : string;
}

const BasicInputValidation : <T extends any>(props : IBasicInputValidationProps<T>) =>
React.ReactElement<IBasicInputValidationProps<T>> = ({error,helperText,label,inputRef,...rest}) => {
  return (
    <div className= "form-group">
      <label className={error ? 'custom-label text-danger' : 'custom-label'}>{label}</label>
      <input
             className={`form-control ${error ? 'is-invalid' : ''}`}
             type="text"
             ref = {inputRef}
             {
                 ...rest
             }

      />
      { error ?  <small className="invalid-feedback custom-helper">{error}</small>  :
        (helperText ? <small className="custom-helper text-muted">{helperText}</small> : <small>&nbsp;</small>)
      }
    </div>
  )
}

export  default  withValidation(BasicInputValidation)

