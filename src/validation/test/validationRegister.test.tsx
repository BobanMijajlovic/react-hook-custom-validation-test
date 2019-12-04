import React from 'react'
import {
  mount
}                from 'enzyme'
import {
  useValidation,
  required,
  withValidation,
  minLength,
  areTheSame
} from '../index'
import {act}     from 'react-dom/test-utils'
import 'jest-extended'
import {isEmail} from 'validator'

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
  validation:  undefined,
  inputEmail: undefined,
  inputPassword: undefined,
  inputConfirmPassword: undefined
}

const messagePasswordMinLength =  'Password must be at least 4 char long'
const messagePasswordRange = 'Password must be in scope of A-Za-z0-9#$@!+*%'
const messagePasswordUpperCase = 'Password must have at least one Upper case letter'
const messagePasswordOneNumber = 'Password must have at least one number'
const messagePasswordOneSmallLetter = 'Password must have at least one Small case letter'
const messageAreTheSame =  'Password must match'

const passwordRule = {
  required,
  minLength: minLength({
    message: messagePasswordMinLength,
    min: 4
  }),
  customValidation: (value : string) => {
    if (!value) {
      return false
    }
    if (/[^a-z0-9#$@!+*%]/gi.exec(value)) {
      return messagePasswordRange
    }

    if (!/[A-Z]/.exec(value)) {
      return messagePasswordUpperCase
    }
    if (!/\d/.exec(value)) {
      return messagePasswordOneNumber
    }
    if (!/[a-z]/.exec(value)) {
      return messagePasswordOneSmallLetter
    }
    return false
  },
  areTheSame: areTheSame({
    message: messageAreTheSame,
    field: 'confirmPassword'
  })
}

describe('make validation hook', () => {
  const Form = () => {
    formTestingObject.validation = useValidation()
    return ( <></> )
  }

  const setPropsToAll = () => {
    act( () => {
      formTestingObject.inputEmail.setProps({validation:{
        useValidation: formTestingObject.validation,
        model: 'email'
      }})

      formTestingObject.inputPassword.setProps({validation:{
        useValidation: formTestingObject.validation,
        model: 'password'
      }})

      formTestingObject.inputConfirmPassword.setProps({validation:{
        useValidation: formTestingObject.validation,
        model: 'confirmPassword'
      }})
    })

    act(() => {
             /** refresh from one field is enough it is same validation object */
      formTestingObject.validation = formTestingObject.inputEmail.props().validation.useValidation
    })
  }

  it('render at first', () => {
    act(() => {
      mount(<Form/>)
    })

    act(() => {
      formTestingObject.inputEmail = mount(<InputValidation
               validation = {{
                 useValidation:formTestingObject.validation,
                 model: 'email',
                 rule: {
                   required,
                   useValidator: [
                     {
                       validator: isEmail,
                       message: 'Not valid email'
                     }
                   ]
                 }
               }}
      />)

      formTestingObject.inputPassword = mount(<InputValidation
                validation = {{
                  useValidation:formTestingObject.validation,
                  model: 'password',
                  rule: passwordRule
                }}
      />)

      formTestingObject.inputConfirmPassword = mount(<InputValidation
                validation = {{
                  useValidation:formTestingObject.validation,
                  model: 'confirmPassword',
                  rule:  {
                    required,
                    areTheSame: areTheSame({
                      message: messageAreTheSame,
                      field: 'password'
                    })
                  }
                }}
      />)
    })

    expect(formTestingObject.inputEmail.length).toBe(1)
    let props = formTestingObject.inputEmail.props()
    expect(props).toHaveProperty('validation')
    let {validation} = props
    expect(validation).toHaveProperty('model','email')
    expect(validation).toHaveProperty('rule')
    expect(validation).toHaveProperty('useValidation')
    setPropsToAll()
    props = formTestingObject.inputEmail.props()
    expect(props).toHaveProperty('validation')
    validation = props.validation
    expect(validation).toHaveProperty('useValidation')

    const {useValidation} = validation
    expect(useValidation).toHaveProperty('getFieldValue')
    expect(useValidation).toHaveProperty('getFieldError')
    const {getFieldValue, getFieldError} = useValidation

    const data = getFieldValue('email')
    const error = getFieldError('email')
    expect(data).toBeUndefined()
    expect(error).toBeFalse()
  })

  it('test onblur ', () => {
    act(() => {
      formTestingObject.inputEmail.find('input').simulate('blur')
    })
    setPropsToAll()
    const {getFieldError} = formTestingObject.validation
    const error = getFieldError('email')
    expect(error).toBeString()
    expect(error).toStartWith('Required')
  })

  it('put text - but not valid email ', () => {
    act(() => {
      formTestingObject.inputEmail.find('input').simulate('change',{target:{value:'boban.mijajlovic'}})
    })
    setPropsToAll()
    const {getFieldError} = formTestingObject.validation
    const error = getFieldError('email')
    expect(error).toBeString()
    expect(error).toBe('Not valid email')
  })

  it('put text - valid email ', () => {
    act(() => {
      formTestingObject.inputEmail.find('input').simulate('change',{target:{value:'boban.mijajlovic.rs@gmail.com'}})
    })
    setPropsToAll()
    const {getFieldError} = formTestingObject.validation
    const error = getFieldError('email')
    expect(error).toBeFalsy()
  })

  it('till now password&confirm must be clear', () => {
    const {getFieldError} = formTestingObject.validation
    let error = getFieldError('password')
    expect(error).toBeFalsy()

    error = getFieldError('confirmPassword')
    expect(error).toBeFalsy()
  })

  it('check blank on password', () => {
    act(() => {
      formTestingObject.inputPassword.find('input').simulate('blur')
      formTestingObject.inputPassword.find('input').simulate('change',{target:{ value: '              ' }})
    })
    setPropsToAll()
    const {getFieldError} = formTestingObject.validation
    const error = getFieldError('password')
    expect(error).toBeString()
    expect(error).toBe(messagePasswordRange)
  })

  it('check length on password', () => {
    act(() => {
      formTestingObject.inputPassword.find('input').simulate('change',{target:{ value: 'abc' }})
    })
    setPropsToAll()
    const {getFieldError} = formTestingObject.validation
    const error = getFieldError('password')
    expect(error).toBeString()
    expect(error).toBe(messagePasswordMinLength)
  })

  it('check UpperCase on password', () => {
    act(() => {
      formTestingObject.inputPassword.find('input').simulate('change',{target:{ value: 'abcdef' }})
    })
    setPropsToAll()
    const {getFieldError} = formTestingObject.validation
    const error = getFieldError('password')
    expect(error).toBeString()
    expect(error).toBe(messagePasswordUpperCase)
  })

  it('check Need One Number on password', () => {
    act(() => {
      formTestingObject.inputPassword.find('input').simulate('change',{target:{ value: 'abcdefA' }})
    })
    setPropsToAll()
    const {getFieldError} = formTestingObject.validation
    const error = getFieldError('password')
    expect(error).toBeString()
    expect(error).toBe(messagePasswordOneNumber)
  })

  it('check password must pass all', () => {
    act(() => {
      formTestingObject.inputPassword.find('input').simulate('change',{target:{ value: 'bobiA123#$' }})
    })
    setPropsToAll()
    const {getFieldError} = formTestingObject.validation
    const error = getFieldError('password')
    expect(error).toBeFalsy()
  })

  it('set confirm not same but not blur- must all be ok', () => {
    act(() => {
      formTestingObject.inputConfirmPassword.find('input').simulate('change',{target:{ value: 'bobiA124#$' }})
    })
    setPropsToAll()
    const {getFieldError} = formTestingObject.validation
    let error = getFieldError('confirmPassword')
    expect(error).toBeFalsy()
    error = getFieldError('password')
    expect(error).toBeFalsy()
  })

  it('blur both must be with error', () => {
    act(() => {
      formTestingObject.inputConfirmPassword.find('input').simulate('blur')
    })
    setPropsToAll()
    const {getFieldError,errorModel} = formTestingObject.validation
    let error = getFieldError('confirmPassword')
    expect(error).toBe(messageAreTheSame)
    error = getFieldError('password')
    expect(error).toBe(messageAreTheSame)
    expect(errorModel).toBeBoolean()
    expect(errorModel).toBeTruthy()
  })

  it('same no error', () => {
    act(() => {
      formTestingObject.inputConfirmPassword.find('input').simulate('change',{target:{ value: 'bobiA123#$' }})
    })
    setPropsToAll()
    const {getFieldError,errorModel} = formTestingObject.validation
    let error = getFieldError('confirmPassword')
    expect(error).toBeFalsy()
    error = getFieldError('password')
    expect(error).toBeFalsy()
    expect(errorModel).toBeBoolean()
    expect(errorModel).toBeFalsy()
  })

  it('validation all valid', async (done) => {
    await act(async () => {
      const {validate,errorGlobal,errorModel} = formTestingObject.validation
      const {error,data,validations,refs} =  await  validate()
      expect(error).toBeFalsy()
      expect(data.email).toBe('boban.mijajlovic.rs@gmail.com')
      expect(data.password).toBe('bobiA123#$')
      expect(data.confirmPassword).toBe('bobiA123#$')
      expect(validations.error).toBeFalsy()
      expect(errorGlobal).toBeBoolean()
      expect(errorGlobal).toBeFalsy()
      expect(errorModel).toBeBoolean()
      expect(errorModel).toBeFalsy()
      expect(refs).toBeArrayOfSize(3)
      done()
    })
  })

  it('validate with error on email', async (done) => {
    act(() => {
      formTestingObject.inputEmail.find('input').simulate('change',{target:{ value: 'notvalidpassword' }})
    })
    setPropsToAll()
    await act(async () => {
      const {validate,errorModel,getFieldError} = formTestingObject.validation
      const {error,validations} =  await  validate()
      expect(errorModel).toBeBoolean()
      expect(error).toBeTruthy()
      expect(validations.error).toBeTruthy()
      expect(getFieldError('email')).toBe('Not valid email')
      done()
    })
  })

  it('reset validations - keep data', (done) => {
    const {resetValidations} = formTestingObject.validation

    act( () => {
      resetValidations()
    })
    setPropsToAll()
    act(() => {
      const {getFieldValue,getFieldError,errorModel} = formTestingObject.validation
      expect(errorModel).toBeFalsy()
      expect(getFieldValue('email')).toBe('notvalidpassword')
      expect(getFieldValue('password')).toBe('bobiA123#$')
      expect(getFieldValue('confirmPassword')).toBe('bobiA123#$')
      expect(getFieldError('email')).toBeFalsy()
      expect(getFieldError('password')).toBeFalsy()
      expect(getFieldError('confirmPassword')).toBeFalsy()
      done()
    })
  })

  it('reset all', (done) => {
    act( () => {
      const {resetValidations} = formTestingObject.validation
      resetValidations(true)
    })
    setPropsToAll()
    act(() => {
      const {getFieldValue,getFieldError,errorModel} = formTestingObject.validation
      expect(errorModel).toBeFalsy()
      expect(getFieldValue('email')).toBeUndefined()
      expect(getFieldValue('password')).toBeUndefined()
      expect(getFieldValue('confirmPassword')).toBeUndefined()
      expect(getFieldError('email')).toBeFalsy()
      expect(getFieldError('password')).toBeFalsy()
      expect(getFieldError('confirmPassword')).toBeFalsy()
      done()
    })
  })
})
