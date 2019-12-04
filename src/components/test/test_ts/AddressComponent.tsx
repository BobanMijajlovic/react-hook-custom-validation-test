import React                       from 'react'
import {
  Grid,
  withStyles
}                                  from '@material-ui/core'
import {Close}                     from '@material-ui/icons'
import {IWithStyles}               from '../components/interface'
import {
  dangerColor,
  headerInfoStyle
}                                  from '../../assets/globalClasses'
import {IAddressModel}             from '../../../test/Models'
import MaterialTextFieldValidation from '../components/material-ui/MaterialTextFieldValidation'
import {
  IUseValidation,
  minLength,
  required
}                                  from '../import-validation'

interface IContextValidationProps<T> extends IWithStyles {
  fieldParentName ?: string,
  useValidation : IUseValidation<T>
}

interface IAddressComponentProps<T> extends IContextValidationProps<T> {
  removeAddress ?: (key : string) => void,
  address ?: IAddressModel,
  index ?: number
}

const style : any = {
  root: {
    position: 'relative',
    margin: '15px auto 5px'
  },
  header: {
    ...headerInfoStyle,
    ...{
      top: -20,
    }
  },
  deleteAddress: {
    position: 'absolute',
    top: 25,
    right: -25,
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  },
  deleteIcon: {
    color: dangerColor,
    fontSize: 30,
    fontWeight: 'bold'
  },
  mainGridClass: {
    position: 'relative',
    padding: '5px 0px 5px',
    margin: '12px 0px 8px 0px'
  },
  gridClass: {
    padding: '10px 15px 0px'
  },
}

const AddressComponent = <T extends any>({classes, index, fieldParentName, useValidation} : IAddressComponentProps<T>) => {

  const removeAddress = () => {
    const {removeArrayData} = useValidation
    removeArrayData(fieldParentName as string, index as number)
  }

  const _fieldParentName = `${fieldParentName}[${index}]`

  return (
    <Grid container className={classes.root}>

      <span className={classes.deleteAddress} onClick={removeAddress}>
        <Close className={classes.deleteIcon}/>
      </span>

      <Grid item md={5} className={classes.gridClass}>
        <MaterialTextFieldValidation
                    label={'STREET'}
                    helperText={'enter street address'}
                    validation={{
                      useValidation: useValidation,
                      model: `${_fieldParentName}.street`,
                      rule: {
                        required,
                      }
                    }}
        />
      </Grid>

      <Grid item md={2} className={classes.gridClass}>
        <MaterialTextFieldValidation
                    helperText={'enter  zip'}
                    label={'ZIP'}
                    validation={{
                      useValidation: useValidation,
                      model: `${_fieldParentName}.zip`,
                      rule: {
                        required,
                        minLength: minLength({
                          message: 'Min 5 chars',
                          min: 5
                        })
                      }
                    }}
        />
      </Grid>

      <Grid item md={3} className={classes.gridClass}>
        <MaterialTextFieldValidation
                    helperText={'enter  city'}
                    label={'CITY'}
                    validation={{
                      useValidation: useValidation,
                      model: `${_fieldParentName}.city`,
                      rule: {
                        required
                      }

                    }}
        />

      </Grid>

      <Grid item md={2} className={classes.gridClass}>
        <MaterialTextFieldValidation
                    helperText={'enter  address'}
                    label={'STATE'}

                    validation={{
                      useValidation: useValidation,
                      model: `${_fieldParentName}.state`,
                      defaultValue: 'GA'
                    }}
        />
      </Grid>
    </Grid>
  )

}

export default withStyles(style)(AddressComponent)
