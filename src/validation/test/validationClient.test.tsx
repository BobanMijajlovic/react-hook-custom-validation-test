import React     from 'react'
import {
  required,
  useValidation,
  withValidation
}                from '../index'
import {act}     from 'react-dom/test-utils'
import {mount}   from 'enzyme'
import {
  isAlpha,
  isAlphanumeric,
  isEmail,
  isLength
} from 'validator'

const Input = (props : any) => {
  const {error,inputRef, ...rest} = props

  return (
    <>
      <input
                {...rest}
                ref = {inputRef}

      />
      <span>{error ? 'error' : ''}</span>
    </>
  )
}
const InputValidation = withValidation(Input)

const formTestingObject : any =  {
  form: undefined,
  validation:  undefined,
  inputFirstName: undefined,
  inputLastName: undefined,
  address: []
}

describe('make validation hook', () => {
  const Form = () => {
    formTestingObject.validation = useValidation()
    return (<></>)
  }

  act(() => {
    formTestingObject.form =   mount(<Form/>)
  })

  act(() => {
    formTestingObject.inputFirstName = mount(<InputValidation
            validation = {{
              useValidation:formTestingObject.validation,
              model: 'firstName',
              rule: {
                required,
                useValidator: [
                  {
                    validator: isLength,
                    params: {min:4},
                    message: 'Must be at least 4 chars long'
                  },
                  {
                    validator: isAlphanumeric,
                    message: 'Must Be alpha numeric'
                  }
                ]
              }
            }}
    />)

    formTestingObject.inputLastName = mount(<InputValidation
            validation = {{
              useValidation:formTestingObject.validation,
              model: 'lastName',
              rule: {
                required,
                useValidator: [
                  {
                    validator: isLength,
                    params: {min:4},
                    message: 'Must be at least 4 chars long'
                  },
                  {
                    validator: isAlpha,
                    message: 'Must Be alpha'
                  }
                ]
              }
            }}
    />)
  })

  const refreshAll  = () => {
    act( () => {
      formTestingObject.inputFirstName.setProps({
        validation: {
          useValidation: formTestingObject.validation,
          model: 'firstName'
        }
      })
      formTestingObject.inputLastName.setProps({
        validation: {
          useValidation: formTestingObject.validation,
          model: 'lastName'
        }
      })
      formTestingObject.form.update()
    })

    if (formTestingObject.validation.state.address) {
      while (formTestingObject.address.length < formTestingObject.validation.state.address.length) {
        act(() => {
          formTestingObject.address.push(mount(<InputValidation
            validation={{
              useValidation: formTestingObject.validation,
              model: `address[${formTestingObject.address.length}].zip`,
              rule: {
                required,
                useValidator: [
                  {
                    validator: isLength,
                    params: {min: 5},
                    message: 'Must be at least 5 chars long'
                  }
                ]
              }
            }}/>))
        })

        act(() => {
          formTestingObject.form.update()
        })
      }
    }

    act(() => {
      formTestingObject.form.update()
    })

    formTestingObject.address.every(( x : any,index : number ) => {
      const inputZip = x
      inputZip.setProps({
        validation: {
          useValidation: formTestingObject.validation,
          model: `address[${index}].zip`,
        }
      })
      return true
    })

    act(() => {
      formTestingObject.form.update()
    })

  }

  it('check first initialization', () => {
    refreshAll()
    const { getFieldValue, getFieldError, getFieldRef } = formTestingObject.validation
    let object = getFieldRef('firstName')
    expect(object).toBeObject()
    expect(object).toContainKeys(['field','ref'])
    expect(object.field).toBe('firstName')

    object = getFieldRef('lastName')
    expect(object).toBeObject()
    expect(object).toContainKeys(['field','ref'])
    expect(object.field).toBe('lastName')

    expect(getFieldError('firstName')).toBeBoolean()
    expect(getFieldError('firstName')).toBeFalsy()

    expect(getFieldError('lastName')).toBeBoolean()
    expect(getFieldError('lastName')).toBeFalsy()

    expect(getFieldValue('firstName')).toBeUndefined()
    expect(getFieldValue('lastName')).toBeUndefined()
  })

  it('check set state', () => {
    act( () => {
      formTestingObject.validation.setState({
        firstName: 'Boban',
        lastName: 'Mijajlovic'
      })
    })
    refreshAll()
    const { getFieldValue, getFieldError } = formTestingObject.validation
    expect(getFieldValue('firstName')).toBe('Boban')
    expect(getFieldValue('lastName')).toBe('Mijajlovic')
    let error = getFieldError('firstName')
    expect(error).toBeBoolean()
    expect(error).toBeFalsy()

    error = getFieldError('lastName')
    expect(error).toBeBoolean()
    expect(error).toBeFalsy()
  })

  it('check set state - merge', () => {
    act( () => {
      formTestingObject.validation.setState({
        firstName: 'Tom'
      })
    })
    refreshAll()
    const { getFieldValue, getFieldError } = formTestingObject.validation
    expect(getFieldValue('firstName')).toBe('Tom')
    expect(getFieldValue('lastName')).toBe('Mijajlovic')
    let error = getFieldError('firstName')
    expect(error).toBeBoolean()
    expect(error).toBeFalsy()

    error = getFieldError('lastName')
    expect(error).toBeBoolean()
    expect(error).toBeFalsy()
  })

  it('check validation on blur', () => {
    act(() => {
      formTestingObject.inputFirstName.find('input').simulate('blur')
    })
    act(() => {
      formTestingObject.inputLastName.find('input').simulate('blur')
    })
    refreshAll()
    const { getFieldValue, getFieldError } = formTestingObject.validation
    expect(getFieldValue('firstName')).toBe('Tom')
    expect(getFieldValue('lastName')).toBe('Mijajlovic')
    let error = getFieldError('firstName')
    expect(error).toBe('Must be at least 4 chars long')
    error = getFieldError('lastName')
    expect(error).toBeBoolean()
    expect(error).toBeFalsy()
  })

  it('set state with address', () => {

    act(() => {
      formTestingObject.validation.resetValidations()
    })
    act( () => {
      formTestingObject.validation.setState({
        firstName: 'Boban',
        lastName: 'Mijajlovic',
        address: [{
          zip: '12345'
        }]
      })
    })

    refreshAll()
    const { getFieldValue, getFieldError } = formTestingObject.validation
    expect(getFieldValue('firstName')).toBe('Boban')
    expect(getFieldValue('lastName')).toBe('Mijajlovic')
    let error = getFieldError('firstName')
    expect(error).toBeBoolean()
    expect(error).toBeFalsy()

    error = getFieldError('lastName')
    expect(error).toBeBoolean()
    expect(error).toBeFalsy()

    expect(getFieldValue('address[0].zip')).toBe('12345')
    error = getFieldError('address[0].zip')
    expect(error).toBeBoolean()
    expect(error).toBeFalsy()
  })

  it('add data - should be 2',() => {
    act(() => {
      formTestingObject.validation.addArrayData('address',{zip: '98765'})
    })
    refreshAll()
    const { getFieldValue, getFieldError } = formTestingObject.validation
    expect(getFieldValue('address[0].zip')).toBe('12345')
    let error = getFieldError('address[0].zip')
    expect(error).toBeBoolean()
    expect(error).toBeFalsy()

    expect(getFieldValue('address[1].zip')).toBe('98765')
    error = getFieldError('address[1].zip')
    expect(error).toBeBoolean()
    expect(error).toBeFalsy()
  })

  it('validate - check structure with address', async (done) => {

    await act(async () => {
      const {error, data, validations} =  await  formTestingObject.validation.validate()
      expect(error).toBeFalsy()
      expect(validations.error).toBeFalsy()
      expect(data).toContainKeys(['firstName','lastName', 'address'])
      expect(data.address).toBeArrayOfSize(2)
      expect(data.firstName).toBe('Boban')
      expect(data.lastName).toBe('Mijajlovic')
      expect(data.address[0].zip).toBe('12345')
      expect(data.address[1].zip).toBe('98765')
      done()
    })
  })

  it('check error in array', () => {
    act(() => {
      formTestingObject.address[1].find('input').simulate('change',{target:{ value: '123' }})
    })
    refreshAll()
    const { getFieldValue, getFieldError, errorModel } = formTestingObject.validation
    expect(getFieldValue('address[1].zip')).toBe('123')
    expect(getFieldError('address[1].zip')).toBe('Must be at least 5 chars long')
    expect(errorModel).toBeBoolean()
    expect(errorModel).toBeTruthy()
  })

  it('clear just error', () => {
    act(() => {
      formTestingObject.validation.resetValidations()
    })
    refreshAll()
    const { getFieldValue, getFieldError, errorModel } = formTestingObject.validation
    expect(getFieldValue('address[1].zip')).toBe('123')
    expect(getFieldError('address[1].zip')).toBeBoolean()
    expect(getFieldError('address[1].zip')).toBeFalsy()
    expect(errorModel).toBeBoolean()
    expect(errorModel).toBeFalsy()
  })

  it('clear data', () => {
    act(() => {
      formTestingObject.validation.resetValidations(true)
    })
    refreshAll()
    const { getFieldValue } = formTestingObject.validation
    expect(getFieldValue('lastName')).toBeUndefined()
    expect(getFieldValue('firstName')).toBeUndefined()
    expect(getFieldValue('address[0].zip')).toBeUndefined()
    expect(getFieldValue('address[1].zip')).toBeUndefined()
  })

})
