import React from 'react'
import {
  ACTION_CHANGE,
  ACTION_DELETE,
  ACTION_INSERT,
  FormatBasic,
  IFormatResult
}            from './FormatBasic'
import {
  IFormatNumberRule,
  IFormatRuleProps
}            from '../index'

export class FormatTextFieldNumber extends FormatBasic {

  private formatArray : string[]
  private firstEntry : number
  private lastEntry : number
  private realFormatSize : number
  private validSize : number
  private formatMask : string

  constructor (props : IFormatRuleProps) {
    super(props)
    this.realFormatSize = this.properties.rule.format.length
    this.formatArray = (this.properties.rule.format || '').split('')
    this.firstEntry = this.formatArray.findIndex(x => x === '#')
    this.lastEntry = this.formatArray.length - [...this.formatArray].reverse().findIndex(x => x === '#')
    this.formatMask = (this.properties.rule as IFormatNumberRule).mask as string
    this.validSize = Math.min(((this.properties.rule as IFormatNumberRule).validSize || this.lastEntry), this.lastEntry)

  }

  validateField (value : string) : string | boolean {
    if (!value) {
      return false
    }
    const index = this.formatArray.findIndex((x, index) =>
      (x !== '#') ? false : ((index >= this.validSize) ? false : !/\d/.exec(value.charAt(index))))
    return (index === -1) ? false : (this.properties.validationMessage ? this.properties.validationMessage : 'Format must be completed')
  }

  checkResultValidSize (value : string) {
    return (this.lastEntry === this.validSize || value.length < this.validSize) ? value : value.trim()
  }

    /** Function filter only data without mask */
  getValueNoMask (value : string) : string {
    value = value || ''
    return value.split('').reduce((acc : string[], x : string, index : number) => {
      if (index > this.formatArray.length) {
        /\d/.exec(x) && acc.push(x)
        return acc
      }
      const f = this.formatArray[index]
      if (f === '#') {
        /\d/.exec(x) && acc.push(x)
        return acc
      }
      f !== x && /\d/.exec(x) && acc.push(x)
      return acc
    }, [])
      .join('')
  }

  private getValidPosition (currentValue : string) {
    const result = this.formatArray.findIndex((x, index) =>
      index === this.lastEntry ?
        true :
        (x !== '#' ? false : !/\d/.exec(currentValue.length > index ? currentValue.charAt(index) : ' ')))
    return result === -1 ? this.formatArray.length : result
  }

  private goForwardValidPosition (position : number, currentValue : string) {
    while (position < this.lastEntry) {
      if (this.formatArray[position] === '#') {
        break
      }
      position++
    }
    return Math.min(this.getValidPosition(currentValue), position)
  }

  private goBackwardValidPosition (position : number) {
    while (position > this.firstEntry) {
      if (this.formatArray[position] === '#') {
        break
      }
      position--
    }
    return Math.max(position, this.firstEntry)
  }

  onKeyDownHandler (event : React.KeyboardEvent<HTMLInputElement>, currentValue : string) : IFormatResult {
    const {selectionStart} = (event.target as HTMLInputElement)
    switch (event.key) {
      default:
        return {} as IFormatResult
      case 'ArrowUp':
      case 'Home':
        return {cursor: this.firstEntry}
      case 'ArrowRight':
        return {cursor: this.goForwardValidPosition((selectionStart || 0) + 1, currentValue)}
      case 'ArrowLeft':
        return {cursor: this.goBackwardValidPosition((selectionStart || 0) - 1)}
      case 'ArrowDown':
      case 'End':
        return {cursor: this.getValidPosition(currentValue)}
    }
  }

  onFocusHandler (event : React.FocusEvent<HTMLInputElement>, currentValue : string) : IFormatResult {

    const text = this.formatArray.map((x, index) =>
      x !== '#' ? x : index >= currentValue.length ? this.formatMask : /\d/.exec(currentValue.charAt(index)) ? currentValue.charAt(index) : this.formatMask).join('')
    return {
      text,
      cursor: this.getValidPosition(text)
    }
  }

  onMouseUp (event : React.MouseEvent<HTMLInputElement>, valueCurrent : string) : IFormatResult {
    const {selectionStart, selectionEnd} = event.target as HTMLInputElement
    let pos = Math.max(selectionStart || 0, selectionEnd || 0, this.firstEntry)
    while (pos < this.formatArray.length && this.formatArray[pos] !== '#') {
      pos++
    }
    return {
      cursor: Math.min(this.getValidPosition(valueCurrent), pos)
    }
  }

  format (value : string) : string {
    const valueNoMask = this.getValueNoMask(value)
    let index = 0
    const result = this.formatArray.map(x =>
      (x !== '#') ? x : (index >= valueNoMask.length ? this.formatMask : valueNoMask.charAt(index++))).join('')
    return this.checkResultValidSize(result)
  }

  onChangeHandler (e : React.ChangeEvent<HTMLInputElement>, previousValue : string) : IFormatResult {

    const {value, selectionStart, selectionEnd} = e.target

    const valueNoMask = this.getValueNoMask(value)
    const valuePrevNoMask = this.getValueNoMask(previousValue)

    const action = value.length < previousValue.length ? ACTION_DELETE : (valuePrevNoMask.length < valueNoMask.length ? ACTION_INSERT : ACTION_CHANGE)

    let index = 0
    const result = this.formatArray.map(x =>
      (x !== '#') ? x : (index >= valueNoMask.length ? this.formatMask : valueNoMask.charAt(index++))).join('')

    const position = (() => {
      let pos = Math.max(selectionStart || 0, selectionEnd || 0, this.firstEntry)
      if (action === ACTION_INSERT) {
        while (pos < this.lastEntry && this.formatArray[pos] !== '#') {
          pos++
        }
        return Math.min(pos, this.getValidPosition(result))
      }
      if (action === ACTION_DELETE) {
        while (pos > this.firstEntry && this.formatArray[pos - 1] !== '#') {
          pos--
        }
        return Math.max(this.firstEntry, pos)
      }
            /* then it is change */
      pos = Math.max(pos, this.firstEntry)
      pos = Math.min(pos, this.getValidPosition(result))
      return pos
    })()

    return {
      text: this.checkResultValidSize(result),
      cursor: position
    }
  }
}

