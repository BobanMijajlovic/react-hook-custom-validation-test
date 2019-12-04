import React                       from 'react'
import {
  areTheSame,
  minLength,
  required,
  useValidation
}                                  from '../import-validation'
import cx                          from 'classnames'
import {
  Button,
  Grid,
  Typography,
  withStyles
}                                  from '@material-ui/core'
import {
  button,
  dangerColor,
  headerInfoStyle
}                                  from '../../assets/globalClasses'
import {IWithStyles}               from '../components/interface'
import MaterialTextFieldValidation from '../components/material-ui/MaterialTextFieldValidation'
import Error                       from '../components/Error'
import {isEmail}                   from 'validator'

const style : any = {
  root: {
    position: 'relative',
    padding: '2rem !important',
    maxWidth: '450px',
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
    padding: '5px 0px 5px',
    margin: '12px 0px 8px 0px'
  },
  gridClass: {
    padding: '10px 15px'
  },
  header: headerInfoStyle,
  gridButton: {
    margin: '20px auto 0px',
    textAlign: 'center'
  },
  button: button,
  inputRoot: {
    padding: 12
  }
}

const passwordRule = {
  required,
  minLength: minLength({
    message: 'Password must be at least 4 char long',
    min: 4
  }),
  customValidation: (value : string) => {
    if (!value) {
      return false
    }
    if (/[^a-z0-9#$@!+*%]/gi.exec(value)) {
      return 'Password must be in scope of A-Za-z0-9#$@!+*%'
    }

    if (!/[A-Z]/.exec(value)) {
      return 'Password must have at least one Upper case letter'
    }
    if (!/\d/.exec(value)) {
      return 'Password must have at least one number'
    }
    if (!/[a-z]/.exec(value)) {
      return 'Password must have at least one Small case letter'
    }
    return false
  },
  areTheSame: areTheSame({
    message: 'Password must match',
    field: 'confirmPassword'
  })
}

const RegistrationFrom = ({classes} : IWithStyles) => {

  const validation = useValidation()

  const handlerOnClick = async () => {
    const data = await validation.validate()
    console.log(data)
  }

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
        <Typography className={typographyClass}>REGISTRATION FORM</Typography>
        <Grid container className={classes.mainGridClass}>
          <Grid item md={12} className={classes.gridClass}>
            <MaterialTextFieldValidation
                            helperText={'enter email'}
                            label={'EMAIL'}
                            validation={{
                              useValidation: validation,
                              model: 'email',
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
          <Grid item md={12} className={classes.gridClass}>
            <MaterialTextFieldValidation
                            type={'password'}
                            helperText={'enter password'}
                            label={'PASSWORD'}
                            validation={{
                              useValidation: validation,
                              model: 'password',
                              rule: passwordRule
                            }}
            />
          </Grid>
          <Grid item md={12} className={classes.gridClass}>
            <MaterialTextFieldValidation
                            type={'password'}
                            helperText={'confirm password'}
                            label={'CONFIRM PASSWORD'}
                            validation={{
                              useValidation: validation,
                              model: 'confirmPassword',
                              rule: {
                                required,
                                areTheSame: areTheSame({
                                  message: 'Password must match',
                                  field: 'password'
                                })
                              }
                            }}
            />
          </Grid>
          <Grid item md={12} className={classes.gridButton}>
            <Button className={classes.button} variant="outlined" color={'primary'} onClick={handlerOnClick}>
                            SUBMIT
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(style)(RegistrationFrom)
