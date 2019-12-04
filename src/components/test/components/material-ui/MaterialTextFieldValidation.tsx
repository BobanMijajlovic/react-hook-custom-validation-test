import React            from 'react'
import {TextField}      from '@material-ui/core'
import {TextFieldProps} from '@material-ui/core/TextField'
import {IWithStyles}    from '../interface'
import {
  IWithValidationProps,
  withValidation
}                       from '../../import-validation'

const MaterialTextFieldValidation : <T extends object> (props : TextFieldProps & IWithValidationProps<T> & IWithStyles) =>
React.ReactElement<TextFieldProps & IWithValidationProps<T> & IWithStyles> =
    ({helperText, error, inputProps, ...rest}) => {
      return (
        <TextField
                {...rest}
                error={!!error}
                variant={'outlined'}
                fullWidth
                helperText={error ? error : helperText}
                inputProps={{
                  ...inputProps,
                }}
        />
      )
    }
export default withValidation(MaterialTextFieldValidation)
