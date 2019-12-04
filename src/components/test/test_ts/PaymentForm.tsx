import React, {
  useEffect,
  useState
}                                   from 'react'
import {
  FORMAT_CURRENCY_STANDARD,
  FORMAT_RULE_CREDIT_CARD,
  FORMAT_RULE_DATE_MM_YY,
  FORMAT_RULE_PHONE,
  IFieldsRefs,
  minLength,
  required,
  useValidation
}                                   from '../import-validation'
import {
  Button,
  Grid,
  Typography,
  withStyles
}                                   from '@material-ui/core'
import cx                           from 'classnames'
import {
  button,
  dangerColor
}                                   from '../../assets/globalClasses'
import {IWithStyles}                from '../components/interface'
import MaterialTextFieldValidation  from '../components/material-ui/MaterialTextFieldValidation'
import Error                        from '../components/Error'
import ChooseCreditCardRadioButtons from '../components/material-ui/ChooseCreditCardRadioButtons'
import {isIn}                       from 'validator'
import * as _                       from 'lodash'

const style : any = {
  root: {
    position: 'relative',
    padding: '2rem',
    width: '900px',
    border: '1px solid #eee',
    margin: 'auto'
  },
  typography: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: '1.75rem'
  },
  typographyError: {
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
  gridButton: {
    margin: '10px auto',
    textAlign: 'center'
  },
  button: button,
  form: {
    marginBottom: 15
  }
}

const PaymentForm = ({classes} : IWithStyles) => {

  const validation = useValidation({
    initialData: {
      cardInfo: {
        payment: '12000'
      }
    }
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
    const refData = validation.getFieldRef('contact.firstName')
    if (refData && refData.ref) {
      setFocusElement({...refData})
    }
  },[setFocusElement,focusElement,validation])

  const typographyClass = cx({
    [classes.typography]: classes.typography,
    [classes.typographyError]: validation.errorModel
  })

  const inputPropsPayment = React.useMemo(() => {
    return {
      style: {
        textAlign: 'right'
      }
    }
  }, [])

  const ERROR = React.useMemo(() => {
    return (
      <div style={{display: 'flex', flexDirection: 'column', position: 'absolute', top: '10px'}}>
        {validation.errorModel ? <Error message={'validation model error'}/> : <></>}
        {validation.errorGlobal ? <Error message={`global: ${validation.errorGlobal}`}/> : <></>}
      </div>
    )
  }, [validation.errorModel, validation.errorGlobal])

  const submitHandler = async () => {
    const {error,validations,refs} = await validation.validate()
    if (error) {
      const fieldRef : IFieldsRefs | undefined = refs.find(({field}) => _.get(validations, `validations.${field}.error`))
      fieldRef && setFocusElement({...fieldRef as IFieldsRefs})
    }
  }

  return (
    <div>
      <Grid className={classes.root}>
        {ERROR}
        <Typography className={typographyClass}>PAYMENT FORM</Typography>
        <div className={classes.form}>
          <Grid container>
            <Grid item md={5}>
              <Grid item md={12} className={classes.gridClass}>
                <MaterialTextFieldValidation
                                      helperText={'first name'}
                                      label={'FIRST NAME'}
                                      validation={{
                                        useValidation: validation,
                                        model: 'contact.firstName',
                                        rule: {
                                          required,
                                          minLength: minLength({min: 2})
                                        }
                                      }}
                />
              </Grid>
              <Grid item md={12} className={classes.gridClass}>
                <MaterialTextFieldValidation
                                      helperText={'last name'}
                                      label={'LAST NAME'}
                                      validation={{
                                        useValidation: validation,
                                        model: 'contact.lastName',
                                        rule: {
                                          required,
                                          minLength: minLength({min: 2})
                                        }
                                      }}
                />
              </Grid>
              <Grid item md={12} className={classes.gridClass}>
                <MaterialTextFieldValidation
                        helperText={'enter mobile phone'}
                        label={'MOBILE'}
                        validation={{
                          useValidation: validation,
                          model: 'contact.mobile',
                          rule: {
                            required
                          },
                          format: {
                            rule: FORMAT_RULE_PHONE,
                            validationMessage: 'Phone is not correct'
                          }
                        }}
                />
              </Grid>
            </Grid>
            <Grid container item md={7}>
              <Grid item md={12} className={classes.gridClass}>
                <MaterialTextFieldValidation
                                      helperText={'card number'}
                                      label={'CARD NUMBER'}
                                      validation={{
                                        useValidation: validation,
                                        model: 'cardInfo.cardNumber',
                                        rule: {
                                          required
                                        },
                                        format: {
                                          rule: FORMAT_RULE_CREDIT_CARD,
                                          validationMessage: 'Card number not valid'
                                        }
                                      }}
                />
              </Grid>
              <Grid item md={4} className={classes.gridClass}>
                <MaterialTextFieldValidation
                                      helperText={'card expiration'}
                                      label={'CARD EXP '}
                                      validation={{
                                        useValidation: validation,
                                        model: 'cardInfo.expDate',
                                        rule: {
                                          required
                                        },
                                        format: {
                                          rule: FORMAT_RULE_DATE_MM_YY
                                        }
                                      }}
                />
              </Grid>
              <Grid item md={4} className={classes.gridClass}>
                <MaterialTextFieldValidation
                                      helperText={'cvv'}
                                      label={'CVV'}
                                      validation={{
                                        useValidation: validation,
                                        model: 'cardInfo.cvv',
                                        rule: {
                                          required
                                        }
                                      }}
                />
              </Grid>
              <Grid item md={4} className={classes.gridClass}>
                <MaterialTextFieldValidation
                                      helperText={'payment'}
                                      label={'PAYMENT'}
                                      validation={{
                                        useValidation: validation,
                                        model: 'cardInfo.payment',
                                        defaultValue: '1000',
                                        rule: {
                                          required
                                        },
                                        format: {
                                          rule: {
                                            ...FORMAT_CURRENCY_STANDARD,
                                            ...{
                                              decimalPlace: 0
                                            }
                                          }
                                        }
                                      }}
                                      inputProps={inputPropsPayment}
                />
              </Grid>
              <Grid item md={12} className={classes.gridClass}>
                <ChooseCreditCardRadioButtons
                            validation={{
                              useValidation: validation,
                              model: 'cardInfo.type',
                              rule: {
                                useValidator:[
                                  {
                                    validator:isIn,
                                    params:[['visa','master','amex']]
                                  }
                                ]
                              }
                            }}
                />
              </Grid>
            </Grid>
            <Grid item md={12} className={classes.gridButton}>
              <Button className={classes.button} variant="outlined" color={'secondary'}
                                      onClick={() => validation.resetValidations(true)}>
                                  RESET&DATA
              </Button>
              <Button className={classes.button} variant="outlined" color={'secondary'}
                                      onClick={() => validation.resetValidations()}>
                                  RESET
              </Button>
              <Button className={classes.button} variant="outlined" color={'primary'}
                                      onClick={submitHandler}>
                                  SUBMIT
              </Button>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </div>

  )
}

export default withStyles(style)(PaymentForm)
