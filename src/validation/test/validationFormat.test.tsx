import React     from 'react'
import {mount}   from 'enzyme'
import {
  FORMAT_CURRENCY_STANDARD,
  FORMAT_RULE_CREDIT_CARD,
  FORMAT_RULE_DATE_MM_YY,
  FORMAT_RULE_PHONE,
  FORMAT_RULE_ZIP,
  useValidation,
  withValidation

}                from '../index'
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

const formTestingObject : any = {
  validation: undefined,
  inputZip: undefined,
  inputPhone: undefined,
  inputCard: undefined,
  inputExpDate: undefined,
  inputPayment: undefined
}

describe('make validation hook', () => {

  const Form = () => {
    formTestingObject.validation = useValidation()
    return ( <></> )
  }

  const setPropsToAll = () => {
    act( () => {
      formTestingObject.inputZip.setProps({
        validation:{
          useValidation: formTestingObject.validation,
          model: 'zip',
          format: {
            rule: FORMAT_RULE_ZIP,
            validationMessage: 'Zip is not correct'
          }
        }
      })

      formTestingObject.inputPhone.setProps({
        validation:{
          useValidation: formTestingObject.validation,
          model: 'phone',
          format: {
            rule: FORMAT_RULE_PHONE,
            validationMessage: 'Phone is not correct'
          }
        }
      })

      formTestingObject.inputCard.setProps({validation:{
        useValidation: formTestingObject.validation,
        model: 'card',
        format: {
          rule: FORMAT_RULE_CREDIT_CARD,
          validationMessage: 'Card is not correct'
        }
      }})

      formTestingObject.inputExpDate.setProps({validation:{
        useValidation: formTestingObject.validation,
        model: 'expDate',
        format: {
          rule: FORMAT_RULE_DATE_MM_YY,
          validationMessage: 'Exp date is not correct'
        }
      }})

      formTestingObject.inputPayment.setProps({validation:{
        useValidation: formTestingObject.validation,
        model: 'payment',
        format: {
          rule: FORMAT_CURRENCY_STANDARD,
          validationMessage: 'Payment is not correct'
        }
      }})
    })

    act(() => {
      /** refresh from one field is enough it is same validation object */
      formTestingObject.validation = formTestingObject.inputZip.props().validation.useValidation
    })

  }

  it('render ', () => {
    act(() => {
      mount(<Form/>)
    })

    act(() => {
      formTestingObject.inputZip = mount(<InputValidation
          validation={{
            useValidation: formTestingObject.validation,
            model: 'zip',
            format: {
              rule: FORMAT_RULE_ZIP,
              validationMessage: 'Zip is not correct'
            }
          }}
      />)

      formTestingObject.inputCard = mount(<InputValidation
          validation={{
            useValidation: formTestingObject.validation,
            model: 'card',
            format: {
              rule: FORMAT_RULE_CREDIT_CARD,
              validationMessage: 'Card is not correct'
            }
          }}
      />)

      formTestingObject.inputPhone = mount(<InputValidation
          validation={{
            useValidation: formTestingObject.validation,
            model: 'phone',
            format: {
              rule: FORMAT_RULE_PHONE,
              validationMessage: 'Phone is not correct'
            }
          }}
      />)

      formTestingObject.inputExpDate = mount(<InputValidation
          validation={{
            useValidation: formTestingObject.validation,
            model: 'expDate',
            format: {
              rule: FORMAT_RULE_DATE_MM_YY,
              validationMessage: 'Exp date is not correct'
            }
          }}
      />)

      formTestingObject.inputPayment = mount(<InputValidation
          validation={{
            useValidation: formTestingObject.validation,
            model: 'payment',
            format: {
              rule: FORMAT_CURRENCY_STANDARD,
              validationMessage: 'Payment is not correct'
            }
          }}
      />)
    })

    expect(formTestingObject.inputZip.length).toBe(1)
    const props = formTestingObject.inputZip.props()
    expect(props).toHaveProperty('validation')
    const {validation} = props
    expect(validation).toHaveProperty('useValidation')
    expect(validation).toHaveProperty('model','zip')
    expect(validation).toHaveProperty('format')
    const {rule} = validation.format
    expect(validation.format).toHaveProperty('rule')
    expect(rule).toEqual(FORMAT_RULE_ZIP)
    expect(validation.format).toHaveProperty('validationMessage','Zip is not correct')

  })

  it('format zip - letters', () => {
    act(() => {
      formTestingObject.inputZip.find('input').simulate('change',{target:{value:'t'}})
    })
    act(() => {
      formTestingObject.inputZip.find('input').simulate('blur')
    })

    setPropsToAll()

    const {getFieldValue,getFieldError} = formTestingObject.validation
    const error = getFieldError('zip')
    const value = getFieldValue('zip')
    expect(error).toBeString()
    expect(error).toBe('Zip is not correct')
    expect(value).toBe('     ')
    expect(value.length).toEqual(5)

  })

  it('format zip -3 number only', () => {
    act(() => {
      formTestingObject.inputZip.find('input').simulate('change',{target:{value:'123'}})
    })
    setPropsToAll()
    const {getFieldValue,getFieldError} = formTestingObject.validation
    const error = getFieldError('zip')
    const value = getFieldValue('zip')
    expect(error).toBeString()
    expect(error).toBe('Zip is not correct')
    expect(value).toBe('123  ')
    expect(value.length).toEqual(5)
  })

  it('format zip - 5 numbers', () => {
    act(() => {
      formTestingObject.inputZip.find('input').simulate('change',{target:{value:'12345'}})
    })
    setPropsToAll()
    const {getFieldValue,getFieldError} = formTestingObject.validation
    const error = getFieldError('zip')
    const value = getFieldValue('zip')
    expect(error).toBeFalsy()
    expect(value).toBe('12345')
    expect(value.length).toEqual(5)
  })

  it('format phone - not valid', () => {

    const props = formTestingObject.inputPhone.props()
    expect(props).toHaveProperty('validation')
    const {validation} = props

    expect(validation).toHaveProperty('useValidation')
    expect(validation).toHaveProperty('model','phone')
    expect(validation).toHaveProperty('format')
    const {rule} = validation.format
    expect(validation.format).toHaveProperty('rule')
    expect(rule).toEqual(FORMAT_RULE_PHONE)
    expect(validation.format).toHaveProperty('validationMessage','Phone is not correct')

    act(() => {
      formTestingObject.inputPhone.find('input').simulate('change',{target:{value:'123'}})
    })
    act(() => {
      formTestingObject.inputPhone.find('input').simulate('blur')
    })
    setPropsToAll()
    const {getFieldValue,getFieldError} = formTestingObject.validation
    const error = getFieldError('phone')
    const value = getFieldValue('phone')
    expect(error).toBeString()
    expect(error).toBe('Phone is not correct')

  })

  it('format phone - valid', () => {
    act(() => {
      formTestingObject.inputPhone.find('input').simulate('change',{target:{value:'123456789'}})
    })
    act(() => {
      formTestingObject.inputPhone.find('input').simulate('blur')
    })
    setPropsToAll()
    const {getFieldValue,getFieldError} = formTestingObject.validation
    const error = getFieldError('phone')
    const value = getFieldValue('phone')
    expect(error).toBeFalsy()
    expect(value).toBe('(123) 456-789')
  })

  it('format card - not valid', () => {

    const props = formTestingObject.inputCard.props()
    expect(props).toHaveProperty('validation')
    const {validation} = props

    expect(validation).toHaveProperty('useValidation')
    expect(validation).toHaveProperty('model','card')
    expect(validation).toHaveProperty('format')
    const {rule} = validation.format
    expect(validation.format).toHaveProperty('rule')
    expect(rule).toEqual(FORMAT_RULE_CREDIT_CARD)
    expect(validation.format).toHaveProperty('validationMessage','Card is not correct')

    act(() => {
      formTestingObject.inputCard.find('input').simulate('change',{target:{value:'123'}})
    })
    act(() => {
      formTestingObject.inputCard.find('input').simulate('blur')
    })
    setPropsToAll()
    const {getFieldError} = formTestingObject.validation
    const error = getFieldError('card')
    expect(error).toBeString()
    expect(error).toBe('Card is not correct')

  })

  it('format card - valid', () => {
    act(() => {
      formTestingObject.inputCard.find('input').simulate('change',{target:{value:'1234123412341234'}})
    })
    act(() => {
      formTestingObject.inputCard.find('input').simulate('blur')
    })
    setPropsToAll()
    const {getFieldValue,getFieldError} = formTestingObject.validation
    const error = getFieldError('card')
    const value = getFieldValue('card')
    expect(error).toBeFalsy()
    expect(value).toBeString()
    expect(value).toBe('1234 1234 1234 1234')
  })

  it('format exp date -not valid', () => {

    const props = formTestingObject.inputExpDate.props()
    expect(props).toHaveProperty('validation')
    const {validation} = props
    expect(validation).toHaveProperty('useValidation')
    expect(validation).toHaveProperty('model','expDate')
    expect(validation).toHaveProperty('format')
    const {rule} = validation.format
    expect(validation.format).toHaveProperty('rule')
    expect(rule).toEqual(FORMAT_RULE_DATE_MM_YY)
    expect(validation.format).toHaveProperty('validationMessage','Exp date is not correct')

    act(() => {
      formTestingObject.inputExpDate.find('input').simulate('change',{target:{value:'11'}})
    })

    act(() => {
      formTestingObject.inputExpDate.find('input').simulate('blur')
    })

    setPropsToAll()
    const {getFieldValue,getFieldError} = formTestingObject.validation
    const error = getFieldError('expDate')
    const value = getFieldValue('expDate')
    expect(error).toBeString()
    expect(error).toBe('Exp date is not correct')
    expect(value).toBe('11/  ')
  })

  it('format exp date - valid', () => {
    act(() => {
      formTestingObject.inputExpDate.find('input').simulate('change',{target:{value:'1122'}})
    })
    act(() => {
      formTestingObject.inputExpDate.find('input').simulate('blur')
    })
    setPropsToAll()
    const {getFieldValue,getFieldError} = formTestingObject.validation
    const error = getFieldError('expDate')
    const value = getFieldValue('expDate')
    expect(error).toBeFalsy()
    expect(value).toBeString()
    expect(value).toBe('11/22')
  })

  it('format payment - valid', () => {
    const props = formTestingObject.inputPayment.props()
    expect(props).toHaveProperty('validation')
    const {validation} = props
    expect(validation).toHaveProperty('useValidation')
    expect(validation).toHaveProperty('model','payment')
    expect(validation).toHaveProperty('format')
    const {rule} = validation.format
    expect(validation.format).toHaveProperty('rule')
    expect(rule).toEqual(FORMAT_CURRENCY_STANDARD)
    expect(validation.format).toHaveProperty('validationMessage','Payment is not correct')

    act(() => {
      formTestingObject.inputPayment.find('input').simulate('change',{target:{value:'1234'}})
    })

    act(() => {
      formTestingObject.inputPayment.find('input').simulate('blur')
    })

    setPropsToAll()
    const {getFieldValue,getFieldError} = formTestingObject.validation
    const error = getFieldError('payment')
    const value = getFieldValue('payment')
    expect(error).toBeFalsy()
    expect(value).toBe('1,234')

  })

})