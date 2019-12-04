import React                                  from 'react'
import {Button, Grid, Typography, withStyles} from '@material-ui/core'
import {Add}                                  from '@material-ui/icons'
import {minLength, required, useValidation}   from '../import-validation'
import {button, dangerColor}                  from '../../assets/globalClasses'
import cx                                     from 'classnames'
import Error                                  from '../components/Error'
import MaterialTextFieldValidation            from '../components/material-ui/MaterialTextFieldValidation'
import AddressComponent                       from '../test_ts/AddressComponent'
// @ts-ignore

const style = {
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

const ClientForm = ({classes}) => {

  const validation = useValidation()

  const typographyClass = cx({
    [classes.typography]: classes.typography,
    [classes.typographyError]: false
  })

  const resetHandler = (data) => {
    validation.resetValidations(data)
  }

  const submitHandler = async () => {
    const {error, data, validations, refs} = await validation.validate()
    console.log(error, data, validations, refs)
  }

  const addAddressHandler = async () => {
    const data = await validation.addArrayData('address', {})
    console.log(data)
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
                            })
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

          (validation.state).address && (validation.state).address.map((x, key) => {
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
