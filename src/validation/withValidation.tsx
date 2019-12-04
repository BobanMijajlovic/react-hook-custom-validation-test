import React, {
  PropsWithChildren,
  SyntheticEvent
}                              from 'react'
import {FormatTextFieldNumber} from './format/FormatTextFieldNumber'
import {
  IFormatClassInterface,
  IFormatResult,
  isFormatRuleCurrency
} from './format/FormatBasic'
import {FormatCurrency}       from './format/FormatCurrency'
import {IWithValidationProps} from './interface'

interface IStateCaretPosition {
  f ?: (set ?: (r : IStateCaretPosition) => void) => void
}

const _caretGenerator = function *( data : IStateCaretPosition ) {
  yield data
}

type WithValidationProps<T> = PropsWithChildren<any> & IWithValidationProps<T>

const withValidation  = <T,> (WrappedComponent : React.ComponentType<WithValidationProps<T>>) : React.ComponentType<WithValidationProps<T>> =>
  class WithValidation extends React.Component<WithValidationProps<T>,IStateCaretPosition> {
    private readonly formatter : FormatCurrency | FormatTextFieldNumber | undefined
    private readonly inputRef : React.RefObject<HTMLInputElement>
    private caretPosition : Iterator< IStateCaretPosition | undefined>
    constructor (props : WithValidationProps<T>) {
      super(props)
      const  { validation } = this.props
      this.formatter = (() => {
        if (!validation.format) {
          return void(0)
        }
        if (isFormatRuleCurrency(validation.format.rule)) {
          return new FormatCurrency(validation.format)
        } else {
          return new FormatTextFieldNumber(validation.format)
        }
      })()
      this.inputRef = React.createRef()
      const emptyGenerator = function* () {

        yield  void(0)
      }
      this.caretPosition = emptyGenerator() as Iterator< IStateCaretPosition | undefined>
      this.state = {}
    }

    setCaretPosition = (event : SyntheticEvent, formatResult : IFormatResult) => {
      const {cursor} = formatResult
      if (cursor !== void(0) && event && event.target && (event.target as any).setSelectionRange) {
        this.setState({
          f: () => (event.target as HTMLInputElement).setSelectionRange(cursor as number, cursor as number)
        })
      }
    }
    onChangeHandler = (event : React.ChangeEvent<HTMLInputElement>) => {
      const  { validation, onChange } = this.props
      const {useValidation, model} = validation
      const {setFieldValue, getFieldValue} = useValidation
      let value = event.target.value
      event.persist()
      event.target.value = value
      const valuePrevious = getFieldValue(model) || ''
      if (this.formatter) {
        const data = this.formatter.onChangeHandler(event, valuePrevious)
        value = data.text as string
        if (value === valuePrevious) {
          onChange && onChange(event)
          this.setCaretPosition(event, {cursor: data.cursor})
          return
        }
        if (event.target && event.target.setSelectionRange) {
          this.caretPosition = _caretGenerator({ f: () => {
            event.target.setSelectionRange(data.cursor as number, data.cursor as number)
          }}) as Iterator< IStateCaretPosition | undefined>
        }

      }
      event.target.value = value
      setFieldValue(model, value)
      onChange && onChange(event)
    }

    onBlurHandler = (event : React.FocusEvent<HTMLInputElement>) => {
      const  { validation, onBlur } = this.props
      const {useValidation,model} = validation
      const {onBlurField,  getFieldValue} = useValidation
      const valueCurrent = getFieldValue(model) || ''
      event.persist()
      if (this.formatter) {
        const text : string = this.formatter.onBlurHandler(event, valueCurrent);
        (text !== valueCurrent) ? onBlurField(model, text) : onBlurField(model)
      } else {
        onBlurField(model)
      }
      onBlur && onBlur(event)
    }

    onFocusHandler = (event : React.FocusEvent<HTMLInputElement>) => {
      const  { validation, onFocus } = this.props
      const {useValidation,model} = validation
      const {setFieldValue,getFieldValue} = useValidation
      const valueCurrent = getFieldValue(model) || ''
      event.persist()
      if (this.formatter) {
        const formatResult = this.formatter.onFocusHandler(event, valueCurrent)
        this.setCaretPosition(event, formatResult)
        formatResult.text !== valueCurrent && setFieldValue(model, formatResult.text)
        this.setCaretPosition(event, formatResult)
      }
      onFocus && onFocus(event)
    }

    onKeyDownHandler = (event : React.KeyboardEvent<HTMLInputElement>) => {
      const  { validation, onKeyDown } = this.props
      event.persist()
      if (this.formatter) {
        const cursor = this.formatter.onKeyDownHandler(event, validation.useValidation.getFieldValue(validation.model) || '')
        if (cursor.cursor !== void(0)) {
          this.setCaretPosition(event, cursor)
          event.preventDefault()
        }
      }
      onKeyDown && onKeyDown(event)
    }

    onMouseUpHandler = (event : React.MouseEvent<HTMLInputElement>) => {
      const  { validation, onMouseUp } = this.props
      const valueCurrent = validation.useValidation.getFieldValue(validation.model) || ''
      event.persist()
      this.formatter && this.setCaretPosition(event, this.formatter.onMouseUp(event, valueCurrent))
      onMouseUp && onMouseUp(event)
    }

    shouldComponentUpdate (nextProps : Readonly<WithValidationProps<T>>, nextState : Readonly<{}>) : boolean {
      const  { validation,...rest } = this.props
      const {useValidation,model} = validation
      const {setFieldValue, getFieldValue, getFieldError} = useValidation
      const value = getFieldValue(model) || ''

      const {validation: nextValidation,...nextRest} = nextProps
      const {useValidation:nextUseValidation} = nextValidation
      const {getFieldValue: getFieldValueNext, getFieldError: getFieldErrorNext} = nextUseValidation
      const valueNext = getFieldValueNext(model) || ''

      const valueFormattedNext = (this.formatter && valueNext.length !== 0) ? this.formatter.format(valueNext) : valueNext

      if (valueNext !== valueFormattedNext) {
        setFieldValue(model, valueFormattedNext)
        return true
      }

      if (nextState !== this.state) {
        return true
      }

      if (value !==  valueNext || getFieldError(model) !== getFieldErrorNext(model)) {
        return true
      }

      const restKeys = Object.keys(rest)
      if (restKeys.length !== 0 || Object.keys(nextRest).length !== 0) {
        if (restKeys.length !== Object.keys(nextRest).length) {
          return true
        }
        const same = restKeys.every(x => {
          return nextRest[x] === rest[x]
        })
        if (!same) {
          return true
        }
      }
      return false
    }

    componentDidUpdate (prevProps : Readonly<WithValidationProps<T>>, prevState : Readonly<{}> ) : void {
      const data = this.caretPosition.next()
      data && !data.done && data.value && data.value.f &&  (data.value.f())
      this.state && this.state.f && this.state !== prevState &&   this.state.f()
    }

    componentDidMount () : void {
      const  { validation} = this.props
      const {useValidation, model, defaultValue} = validation
      const {addValidationRule, registerField } = useValidation
      registerField(model, {
        ref: this.inputRef,
        default: defaultValue
      })
      if (this.formatter && this.formatter.isValidation()) {
        const fn = (this.formatter as IFormatClassInterface).validateField
        addValidationRule(model, {formatInputRule: fn.bind(this.formatter)})
      }
      const {rule: validationRules} = validation
      if (validationRules) {
        addValidationRule(model, validationRules)
      }
    }

    public render () {
      const {
        validation,
        ...restProps
      } = this.props

      const {useValidation} = validation
      const {getFieldError, getFieldValue} = useValidation
      const errorString = getFieldError(validation.model)
      const value = getFieldValue(validation.model) || ''

      return (
        <WrappedComponent
            {
              ...restProps
            }
            inputRef={this.inputRef}
            onChange={this.onChangeHandler}
            onKeyDown={this.onKeyDownHandler}
            onBlur={this.onBlurHandler}
            onFocus={this.onFocusHandler}
            onMouseUp={this.onMouseUpHandler}
            error={errorString}
            value={value}
        />
      )
    }
  }

export default withValidation

