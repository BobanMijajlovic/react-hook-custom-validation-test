import React, {
  useEffect,
  useState
}                       from 'react'
import {
  Button,
  Grid,
  Typography,
  withStyles
}                       from '@material-ui/core'
import {Add}            from '@material-ui/icons'
import {IWithStyles}    from '../components/interface'
import {IClientModel}   from '../../../test/Models'
import AddressComponent from './AddressComponent'
import cx               from 'classnames'
import {
  button,
  dangerColor
}                       from '../../assets/globalClasses'

import {
  IFieldsRefs,
  minLength,
  required,
  useValidation
}                                  from '../import-validation'
import MaterialTextFieldValidation from '../components/material-ui/MaterialTextFieldValidation'
import Error                       from '../components/Error'
import {
  isAlphanumeric,
  isLength
}                                  from 'validator'
import * as _                      from 'lodash'

const style : any = {
  root: {
    position: 'relative',
    padding: '2rem !important',
    maxWidth: '1000px',
    border: '1px solid #eee',
    margin: 'auto'
  },
  addAddressButton: {
    position: 'absolute',
    top: 20,
    right: 10
  },
  gridClass: {
    position: 'relative',
    padding: '10px 15px'
  },
  typography: {
    position: 'relative',
    textAlign: 'center',
    margin: '10px 0px 20px',
    fontSize: '1.75rem'
  },
  typographyError: {
    color: dangerColor
  },
  gridButton: {
    margin: '30px auto 0px',
    textAlign: 'center'
  },
  button: button,

}

const ClientForm = ({classes} : IWithStyles) => {

  const validation = useValidation({
    initialData: {} as IClientModel
  })

  const [focusElement , setFocusElement] : [IFieldsRefs, (r : IFieldsRefs) => void] = useState({} as IFieldsRefs)

  useEffect(() => {
    if (focusElement.ref && focusElement.ref.current && focusElement.ref.current.focus) {
      focusElement.ref.current.focus()
    }
  }, [focusElement])

  useEffect(() => {
    /** Our focusElement state always have some object only on the start that object is empty */
    if (focusElement.ref) {
      return
    }
    /** we want to make focus on the first input field at the start */
    const refData = validation.getFieldRef('firstName')
    if (refData && refData.ref) {
      setFocusElement({...refData})
    }
  },[setFocusElement,focusElement,validation])

  const typographyClass = cx({
    [classes.typography]: classes.typography,
    [classes.typographyError]: false
  })

  const resetHandler = (data : boolean) => {
    validation.resetValidations(data)
  }

  const submitHandler = async () => {
    const {error, data, validations, refs} = await validation.validate()
    if (error) {
      const fieldRef : IFieldsRefs | undefined = refs.find(({field}) => _.get(validations, `validations.${field}.error`))
      fieldRef && setFocusElement({...fieldRef as IFieldsRefs})
    }
  }

  const addAddressHandler = async () => {
    const {data,refs} = await validation.addArrayData('address', {})
    const str = `address[${data.address.length - 1}].street`
    const fieldRef : IFieldsRefs | undefined = refs.find(({field}) => field === str)
    fieldRef && setFocusElement({...fieldRef as IFieldsRefs})
  }

  const setDataHandler = () => {
    validation.setState({
      firstName: 'Boban',
      lastName: 'Mijajlovic',
      address: [
        {
          street: 'Alekse Santica 2b/14',
          zip: '37000',
          city: 'Krusevac',
          state: 'Serbia'
        }
      ]
    })
  }

  const ERROR = React.useMemo(() => {
    return (
      <div style={{display: 'flex', flexDirection: 'column', position: 'absolute', top: '10px'}}>
        {validation.errorModel ? <Error message={'validation model error'}/> : <></>}
        {validation.errorGlobal ? <Error message={`global: ${validation.errorGlobal}`}/> : <></>}
      </div>
    )
  }, [validation.errorModel, validation.errorGlobal])

  return (
    <div>
      <Grid container className={classes.root}>
        {ERROR}
        <Grid item md={12}>
          <Typography className={typographyClass}>CLIENT FORM</Typography>
          <span className={classes.addAddressButton}>
            <Button
                  color={'primary'}
                  variant="outlined"
                  onClick={addAddressHandler}
            >
              <Add/> Address
            </Button>
          </span>
        </Grid>

        <Grid item md={6} className={classes.gridClass}>
          <MaterialTextFieldValidation
                        label={'First name'}
                        helperText={'enter first name'}
                        validation={{
                          useValidation: validation,
                          model: 'firstName',
                          rule: {
                            required,
                            minLength: minLength({
                              min: 2
                            }),
                            useValidator: [
                              {
                                validator: isAlphanumeric
                              },
                              {
                                validator:isLength,
                                params: {
                                  min: 5
                                }
                              }
                            ]
                          }

                        }}
          />
        </Grid>
        <Grid item md={6} className={classes.gridClass}>
          <MaterialTextFieldValidation
                        label={'Last name'}
                        helperText={'enter last name'}
                        validation={{
                          useValidation: validation,
                          model: 'lastName',
                          rule: {
                            required,
                            minLength: minLength({
                              min: 2
                            })
                          }
                        }}
          />
        </Grid>

        {

          (validation.state as IClientModel).address && (validation.state as IClientModel).address.map((x, key : number) => {
            return (
              <AddressComponent
                                useValidation={validation}
                                fieldParentName={'address'}
                                key={key}
                                index={key}
              />
            )
          })
        }

        <Grid item md={12} className={classes.gridButton}>
          <Button className={classes.button} variant="outlined" color={'secondary'}
                            onClick={() => resetHandler(true)}>
                        RESET&DATA
          </Button>
          <Button className={classes.button} variant="outlined" color={'secondary'}
                            onClick={() => resetHandler(false)}>
                        RESET
          </Button>
          <Button className={classes.button} variant="outlined" color={'primary'} onClick={submitHandler}>
                        SUBMIT
          </Button>

          <Button className={classes.button} variant="outlined" color={'primary'} onClick={setDataHandler}>
                        SET DATA
          </Button>
          <Button className={classes.button} variant="outlined" color={'inherit'}
                            onClick={() => validation.setErrorGlobal('This is global error string')}>
                        GLOBAL ERR
          </Button>
          <Button className={classes.button} variant="outlined" color={'default'}
                            onClick={() => validation.setFieldError('firstName', 'Not valid!')}>
                        FIELD ERR
          </Button>
        </Grid>

      </Grid>
    </div>

  )
}

export default withStyles(style)(ClientForm)
