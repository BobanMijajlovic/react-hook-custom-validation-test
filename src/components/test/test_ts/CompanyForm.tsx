import React, {
  useEffect,
  useState
}                                  from 'react'
import {
  FORMAT_RULE_PHONE,
  FORMAT_RULE_ZIP,
  IFieldsRefs,
  minLength,
  required,
  useValidation
}                                  from '../import-validation'
import {
  Button,
  Grid,
  Typography,
  withStyles
}                                  from '@material-ui/core'
import {IWithStyles}               from '../components/interface'
import {
  button,
  dangerColor,
  headerInfoStyle
}                                  from '../../assets/globalClasses'
import cx                          from 'classnames'
import Error                       from '../components/Error'
import MaterialTextFieldValidation from '../components/material-ui/MaterialTextFieldValidation'
import {
  isAlphanumeric,
  isEmail,
  isIn
}                                  from 'validator'
import * as _                      from 'lodash'
import MaterialSelectValidation    from '../components/material-ui/MaterialSelectValidation'

const  companyTypes = [
  {
    'label': 'CHOOSE TYPE',
    'value':  '0'
  },
  {
    'label': 'SMALL',
    'value':  '1'
  },
  {
    'label': 'MEDIUM',
    'value':  '2'
  },
  {
    'label': 'BIG',
    'value':  '3'
  }
]

const style : any = {
  root: {
    position: 'relative',
    padding: '2rem',
    maxWidth: '1000px',
    border: '1px solid #eee',
    margin: 'auto'
  },
  header: headerInfoStyle,
  typography: {
    textAlign: 'center',
    margin: '10px auto',
    fontSize: '1.75rem'
  },
  typographyError:{
    color: dangerColor
  },
  mainGridClass: {
    position: 'relative',
    padding: '5px 0px 5px 0px',
    margin: '12px 0px 8px 0px'
  },
  gridClass: {
    padding: '10px 15px'
  },
  gridButton:{
    margin: '10px auto',
    textAlign: 'center'
  },
  button: button,
}

const CompanyForm =  ({classes} : IWithStyles) => {

  const validation = useValidation()

  const [focusElement , setFocusElement] : [IFieldsRefs, (r : IFieldsRefs) => void] = useState({} as IFieldsRefs)

  useEffect(() => {
    if (focusElement.ref && focusElement.ref.current) {
      console.log(focusElement.ref.current)
      focusElement.ref.current.focus()
    }
  }, [focusElement])

  useEffect(() => {
        /** Our focusElement state always have some object only on the start that object is empty */
    if (focusElement.ref) {
      return
    }
        /** we want to make focus on the first input field at the start */
    const refData = validation.getFieldRef('name')
    if (refData && refData.ref) {
      setFocusElement({...refData})
    }
  },[setFocusElement,focusElement,validation])

  const submitHandler = async () => {
    const {error,  validations, refs} = await validation.validate()
    if (error) {
      const fieldRef : IFieldsRefs | undefined = refs.find(({field}) => _.get(validations, `validations.${field}.error`))
      console.log(fieldRef)
      fieldRef && setFocusElement({...fieldRef as IFieldsRefs})
    }
  }

  const typographyClass = cx({
    [classes.typography] : classes.typography,
    [classes.typographyError] : validation.errorModel
  })

  const ERROR = React.useMemo( () => {
    return (
      <div style = {{display: 'flex', flexDirection: 'column', position: 'absolute', top: '10px'}}>
        { validation.errorModel ? <Error message={'validation model error'}/> : <></>}
        { validation.errorGlobal ? <Error message={`global: ${validation.errorGlobal}`}/> : <></>}
      </div>
    )
  }, [validation.errorModel,validation.errorGlobal])

  return (
    <div>
      <Grid container className={classes.root}>
        {ERROR}
        <Grid item md={12} className={classes.gridClass}>
          <Typography className={typographyClass} >COMPANY FORM</Typography>
        </Grid>

        <Grid item md={6} className={classes.gridClass}>
          <MaterialTextFieldValidation
                helperText={'enter company name'}
                label={'COMPANY NAME'}
                validation={{
                  useValidation: validation,
                  model: 'name',
                  rule: {
                    required,
                    minLength: minLength({min: 2})
                  }
                }}
          />
        </Grid>
        <Grid item md={3} className={classes.gridClass}>
          <MaterialTextFieldValidation
                helperText={'enter company tin'}
                label={'COMPANY TIN'}
                validation={{
                  useValidation: validation,
                  model: 'tin',
                  rule: {
                    required,
                    minLength: minLength({min: 10})
                  }
                }}
          />
        </Grid>
        <Grid item md={3} className={classes.gridClass}>
          <MaterialSelectValidation
              label={'COMPANY TYPE'}
              helperText={'choose company type'}
              array={companyTypes}
              validation={{
                useValidation: validation,
                model: 'type',
                defaultValue: '0',
                rule: {
                  useValidator:[
                    {
                      validator: isIn,
                      params: [['1','2','3']]
                    }
                  ]
                }
              }}
          />
        </Grid>

        <Grid container item md={12} className={classes.mainGridClass}>
          <span className={classes.header}>ADDRESS INFO</span>
          <Grid item md={5} className={classes.gridClass}>
            <MaterialTextFieldValidation
                  helperText={'enter street address'}
                  label={'STREET'}
                  validation={{
                    useValidation: validation,
                    model: 'address.street',
                    rule: {
                      required
                    }
                  }}
            />
          </Grid>

          <Grid item md={2} className={classes.gridClass}>
            <MaterialTextFieldValidation
                  helperText={'enter  zip'}
                  label={'ZIP'}
                  validation={{
                    useValidation: validation,
                    model: 'address.zip',
                    rule: {
                      required,
                      minLength: minLength({min: 5})
                    },
                    format:{
                      rule: FORMAT_RULE_ZIP,
                      validationMessage: 'ZIP is not valid'
                    }
                  }}
            />
          </Grid>

          <Grid item md={3} className={classes.gridClass}>
            <MaterialTextFieldValidation
                  helperText={'enter  city'}
                  label={'CITY'}
                  validation={{
                    useValidation: validation,
                    model: 'address.city',
                    rule: {
                      required,
                      minLength: minLength({min: 2})
                    },
                  }}
            />
          </Grid>

          <Grid item md={2} className={classes.gridClass}>
            <MaterialTextFieldValidation
                  helperText={'enter  state'}
                  label={'STATE'}
                  validation={{
                    useValidation: validation,
                    model: 'address.state',
                  }}
            />
          </Grid>
        </Grid>

        <Grid container className={classes.mainGridClass}>
          <span className={classes.header}>PERSONAL INFO</span>
          <Grid item md={6} className={classes.gridClass}>
            <MaterialTextFieldValidation
                  helperText={'enter first name'}
                  label={'FIRST NAME'}
                  validation={{
                    useValidation: validation,
                    model: 'person.firstName',
                    rule: {
                      required,
                      useValidator:[
                        {
                          validator: isAlphanumeric,
                          message: 'Only alpha numeric'
                        }
                      ]
                    }
                  }}
            />
          </Grid>

          <Grid item md={6} className={classes.gridClass}>
            <MaterialTextFieldValidation
                  helperText={'enter last name'}
                  label={'LAST NAME'}
                  validation={{
                    useValidation: validation,
                    model: 'person.lastName',
                    rule: {
                      required,
                      useValidator:[
                        {
                          validator: isAlphanumeric,
                          message: 'Only alpha numeric'
                        }
                      ]
                    }
                  }}
            />
          </Grid>

          <Grid item md={6} className={classes.gridClass}>
            <MaterialTextFieldValidation
                  helperText={'enter email'}
                  label={'EMAIL'}
                  validation={{
                    useValidation: validation,
                    model: 'contact.email',
                    rule: {
                      required,
                      useValidator: [
                        {
                          validator: isEmail,
                          message: 'Email is not valid'
                        }
                      ]
                    }
                  }}
            />
          </Grid>
          <Grid item md={6} className={classes.gridClass}>
            <MaterialTextFieldValidation
                  helperText={'enter mobile phone'}
                  label={'MOBILE'}
                  validation={{
                    useValidation: validation,
                    model: 'contact.phone',
                    rule: {
                      required
                    },
                    format:{
                      rule: FORMAT_RULE_PHONE,
                      validationMessage: 'Phone is not correct'
                    }
                  }}
            />
          </Grid>

        </Grid>

        <Grid item  md={12} className={classes.gridButton}>
          <Button className={classes.button} color={'primary'} variant={'outlined'} onClick = {submitHandler} >
            SUBMIT
          </Button>
          <Button className={classes.button} color={'inherit'} variant={'outlined'} onClick= {() => validation.resetValidations()} >
            RESET
          </Button>
          <Button className={classes.button} color={'secondary'} variant={'outlined'} onClick = {() => validation.setErrorGlobal('This is global error string')} >
            GLOBAL ERR
          </Button>
          <Button className={classes.button}  color={'default'} variant={'outlined'} onClick = {() => validation.setFieldError('address.zip','Zip not valid!')} >
            FIELD ERR
          </Button>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(style)(CompanyForm)
