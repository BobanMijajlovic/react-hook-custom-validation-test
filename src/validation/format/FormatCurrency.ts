import React from 'react'
import {
  ACTION_CHANGE,
  ACTION_DELETE,
  ACTION_INSERT,
  FormatBasic,
  IFormatResult
}            from './FormatBasic'
import {
  IFormatCurrency,
  IFormatRuleProps
}            from '../index'

export class FormatCurrency extends FormatBasic {

  private rule : IFormatCurrency
  private decimalDelimiter : string
  private thousandDelimiter : string
  private decimalPlaces : number

  constructor (props : IFormatRuleProps) {
    super(props)
    this.rule = props.rule as IFormatCurrency
    this.decimalDelimiter = this.rule.decimalChar || '.'
    this.thousandDelimiter = (this.decimalDelimiter === '.') ? ',' : '.'
    this.decimalPlaces = (() => {
      if (this.rule.decimalPlace === void(0)) {
        return 0
      }
      const places = +this.rule.decimalPlace
      return Math.floor(places < 0 || places > 10 ? 0 : places)
    })()
  }

  _formValue (value : string) : string {
    const {array, decimal} = value.split('').reduce((acc : any, x : string, index : number) => {
      if (/\d/.exec(x)) {
        acc.array.push(x)
        return acc
      }
      if (x === this.decimalDelimiter && this.decimalPlaces > 0) {
        acc.decimal = acc.array.length
      }
      return acc
    }, {
      array: [],
      decimal: -1
    })
    if (decimal > -1) {
      array.splice(decimal, 0, this.decimalDelimiter)
      if (decimal === 0) {
        array.unshift('0')
      }
    }
    let text = array.join('')
    text = text.replace(/^0+(\d.*)/, '$1')
    return text
  }

  format ( value : string) : string {
    if (!value) {
      return value
    }
    let text = this._formValue(value)

    if (this.decimalPlaces < 1) {
      return text.split(/(?=(?:\d{3})+(?:$))/g).join(this.thousandDelimiter)
    }

    const arr = text.split(this.decimalDelimiter)
    if (arr.length === 1) {
      arr.push('0')
    }
    while (arr[1].length < this.decimalPlaces) {
      arr[1] += '0'
    }

    text = arr.map((s : string, index : number) => index === 0 ? s.split(/(?=(?:\d{3})+(?:$))/g).join(this.thousandDelimiter) : s.substring(0, this.decimalPlaces))
      .join(this.decimalDelimiter)
    return text
  }

  onBlurHandler (event : React.FocusEvent<HTMLInputElement>, currentValue : string) : string {
    return this.format(currentValue)
  }

  onChangeHandler (event : React.ChangeEvent<HTMLInputElement>, previousValue : string) : IFormatResult {
    const {value, selectionStart, selectionEnd} = event.target || ''

    let text = this._formValue(value)

    text = text.split(this.decimalDelimiter)
      .map((s : string, index : number) => index === 0 ? s.split(/(?=(?:\d{3})+(?:$))/g).join(this.thousandDelimiter) : s.substring(0, this.decimalPlaces))
      .join(this.decimalDelimiter)

    const action = value.length < previousValue.length ? ACTION_DELETE : (text.length > previousValue.length ? ACTION_INSERT : ACTION_CHANGE)
    const position = (() => {
      const pos = Math.max(selectionStart || 0, selectionEnd || 0)
      if (action === ACTION_CHANGE) {
        return text === previousValue ? pos - 1 : pos
      }

      if (action === ACTION_DELETE) {
        const numDelete = previousValue.length - value.length
        const numLess = previousValue.length - text.length
        return pos - (numLess - numDelete)
      }

      const numChangeReal = value.length - previousValue.length
      const numChangeAfter = text.length - previousValue.length
      return pos + (numChangeAfter - numChangeReal)
    })()

    return {
      text: text,
      cursor: position
    }
  }

}

