import React                                  from 'react'
import {button, dangerColor}                  from '../../assets/globalClasses'
import {
  FORMAT_CURRENCY_STANDARD,
  FORMAT_RULE_CREDIT_CARD,
  FORMAT_RULE_DATE_MM_YY,
  FORMAT_RULE_PHONE,
  minLength,
  required,
  useValidation
}                                             from '../import-validation'
import cx                                     from 'classnames'
import Error                                  from '../components/Error'
import {Button, Grid, Typography, withStyles} from '@material-ui/core'
import MaterialTextFieldValidation            from '../components/material-ui/MaterialTextFieldValidation'
// @ts-ignore

const style = {
  root: {
    position: 'relative',
    padding: '2rem',
    maxWidth: '900px',
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

const PaymentForm = ({classes}) => {

  const validation = useValidation()

  const typographyClass = cx({
    [classes.typography]: classes.typography,
    [classes.typographyError]: validation.errorModel
  })

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
      <Grid className={classes.root}>
        {ERROR}
        <Typography className={typographyClass}>PAYMENT FORM</Typography>
        <div className={classes.form}>
          <Grid container>
            <Grid item md={5}>
              <Grid container className={classes.mainGridClass}>
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
              </Grid>
            </Grid>
            <Grid item md={7}>
              <Grid container className={classes.mainGridClass}>
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
                                            rule: FORMAT_RULE_DATE_MM_YY,
                                            validationMessage: 'Date is not valid'
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
                                        inputProps={{
                                          style: {
                                            textAlign: 'right'
                                          }
                                        }}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container item md={12}>
              <Grid item md={5} className={classes.gridClass}>
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
              <Grid item md={7} className={classes.gridButton}>
                <Button className={classes.button} variant="outlined" color={'secondary'}
                                        onClick={() => validation.resetValidations()}>
                                    RESET
                </Button>
                <Button className={classes.button} variant="outlined" color={'primary'}
                                        onClick={validation.validate}>
                                    SUBMIT
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Grid>
    </div>
  )
}

export default withStyles(style)(PaymentForm)
