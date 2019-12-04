import React         from 'react'
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
}                       from '@material-ui/core'
import {IWithStyles}    from '../interface'
import {
  IWithValidationProps,
  withValidation
}                       from '../../import-validation'
import {TextFieldProps} from '@material-ui/core/TextField'
import {SelectProps}    from '@material-ui/core/Select'

interface ISelectValuesProps {
  label : string,
  value : string
}

interface ISelectProps {
  array : [ISelectValuesProps]
}

const MaterialSelectValidation : <T extends any>(props : TextFieldProps & SelectProps & ISelectProps & IWithValidationProps<T> & IWithStyles) =>
React.ReactElement<TextFieldProps & SelectProps & ISelectProps & IWithValidationProps<T> & IWithStyles> =
    ({value,helperText,label,inputRef, error,array, ...rest}) => {
      return (
        <FormControl variant="outlined" style={{width: '100%'}}>
          <InputLabel error={!!error} style={{background: 'white',padding: '0 5px'}} >{label}</InputLabel>
          <Select
                ref={inputRef}
                {...rest}
                error={!!error}
                fullWidth
                value={value}
          >
            {array.map((x : ISelectValuesProps, index : number) => {
              return (
                <MenuItem key={index} value={x.value}>
                  <span>{x.label} </span>
                </MenuItem>
              )
            })}
          </Select>

          {
            error ? (<FormHelperText error={!!error}> {error}</FormHelperText>) :
              ( helperText ? (<FormHelperText> {helperText}</FormHelperText>)  : (<FormHelperText>&nbsp;</FormHelperText>) )
          }
        </FormControl>
      )
    }

export default withValidation(MaterialSelectValidation)
