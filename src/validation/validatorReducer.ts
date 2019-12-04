import React  from 'react'
import * as _ from 'lodash'
import {
  FUN_NAME_SAME_VALUES,
  IAreTheSame
}                            from './validations'
import {
  IFieldsRefs,
  IPromiseValidationData,
  IRegisterFieldData,
  IValidationField,
  IValidationFieldRules,
  IValidationModel,
  IValidationModelRules
}                            from './interface'

enum VALIDATION_ACTIONS {
  addValidationRule = 'VALIDATION_ADD_NEW_RULE',
  registerFieldModel = 'VALIDATION_ASSIGN_FIELD',
  setFieldValue = 'STATE_SET_FIELD_VALUE',
  setFieldError = 'STATE_SET_FIELD_ERROR',
  setGlobalError = 'STATE_SET_GLOBAL_ERROR',
  onBlurFieldValue = 'STATE_ON_BLUR_FIELD',
  resetValidation = 'STATE_RESET_VALIDATION',
  validateValidation = 'STATE_VALIDATE_VALIDATION',
  setFieldNoValidation = 'STATE_SET_FIELD_NO_CHECK',
  addDataArray = 'STATE_ADD_DATA_ARRAY',
  setData = 'STATE_SET_DATA',
  removeDataArray = 'STATE_REMOVE_DATA_ARRAY'
}

export interface IValidationActionPromise<T = any> {
  action : 'validate' | 'addToArray',
  resolve : (value ?: IPromiseValidationData<T>) => void
  data ?: any
}

interface INextAction {
  action : string
  data : any
}

export interface IReducerValidationState<T> {
  validation : IValidationModel<T>
  defaults : Partial<T>
  data : T,
  rules : IValidationModelRules<T>
  keys : string[]
  refFields : IFieldsRefs[],
  actions : Iterator<IValidationActionPromise<any> | undefined>
  history : INextAction[]
}

export const VALIDATION_PART = 'validation.validations'

export interface IValidationReducerAction {
  type : VALIDATION_ACTIONS,
  payload : {
    field ?: string,
    data ?: string | IValidationFieldRules | React.Ref<any> | boolean | IValidationActionPromise | number | IRegisterFieldData
  }
}

const _actionValidationRule = (type : VALIDATION_ACTIONS, field ?: string, rule ?: React.Ref<any> | string | boolean | number | IValidationFieldRules | IValidationActionPromise | IRegisterFieldData) : IValidationReducerAction => {
  return {
    type: type,
    payload: {
      field: field,
      data: rule
    }
  }
}

const actionValidationAddModelRule = (field : string, rule : IValidationFieldRules) : IValidationReducerAction => _actionValidationRule(VALIDATION_ACTIONS.addValidationRule, field, rule)
const actionRegisterFieldOfModel = (field : string, data : IRegisterFieldData) : IValidationReducerAction => _actionValidationRule(VALIDATION_ACTIONS.registerFieldModel, field, data)
const actionValidationSetFieldValue = (field : string, value : any, validate : boolean) : IValidationReducerAction => {
  return validate ? _actionValidationRule(VALIDATION_ACTIONS.setFieldValue, field, value) : _actionValidationRule(VALIDATION_ACTIONS.setFieldNoValidation, field, value)
}
const actionValidationSetFieldError = (field : string, value : string) : IValidationReducerAction => _actionValidationRule(VALIDATION_ACTIONS.setFieldError, field, value)
const actionValidationBlurField = (field : string, value ?: string) : IValidationReducerAction => _actionValidationRule(VALIDATION_ACTIONS.onBlurFieldValue, field, value)
const actionValidationSetGlobalError = (value : string | boolean) : IValidationReducerAction => _actionValidationRule(VALIDATION_ACTIONS.setGlobalError, void(0), value)
const actionValidationReset = (resetData : boolean) : IValidationReducerAction => _actionValidationRule(VALIDATION_ACTIONS.resetValidation, void(0), resetData)
const actionValidationValidate = (data : IValidationActionPromise) : IValidationReducerAction => _actionValidationRule(VALIDATION_ACTIONS.validateValidation, void(0), data)
const actionAddArrayData = (field : string, data : IValidationActionPromise) : IValidationReducerAction => _actionValidationRule(VALIDATION_ACTIONS.addDataArray, field, data)
const actionRemoveArrayData = (field : string, index : number) : IValidationReducerAction => _actionValidationRule(VALIDATION_ACTIONS.removeDataArray, field, index)
const actionSetData = (data : any) : IValidationReducerAction => _actionValidationRule(VALIDATION_ACTIONS.setData, void(0), data)

export const reducerActionFunctions = {
  actionRegisterFieldOfModel,
  actionValidationAddModelRule,
  actionValidationSetFieldValue,
  actionValidationBlurField,
  actionValidationSetFieldError,
  actionValidationSetGlobalError,
  actionValidationReset,
  actionValidationValidate,
  actionAddArrayData,
  actionRemoveArrayData,
  actionSetData
}

const _getKeyPathForCompareField = (key : string, field : string) : string => {
  const path = key.split('.')
  path.pop()
  path.push(field)
  return path.join('.')
}

const _fnCheckModelErrors = <T>(state : IReducerValidationState<T>) : boolean => !state.keys.every(key => !_.get(state, `${VALIDATION_PART}.${key}.error`))

const _fnCheckValidationOfFieldAreTheSame = <T>(state : IReducerValidationState<T>, key : string, keyCompare : string) : IValidationField => {
  const fieldRule : IValidationField = _.get(state, `${VALIDATION_PART}.${keyCompare}`)
  const value = _.get(state, `data.${keyCompare}`)
  return Object.keys(fieldRule.validation).reduce((acc, fName) => {
    const fn = _.get(state.rules, key)[fName]
    return fName === FUN_NAME_SAME_VALUES ? Object.assign(acc, {[fName]: fn().check(value, _.get(state, `data.${key}`))}) : (fn ? Object.assign(acc, {[fName]: fn(value)}) : acc)
  }, {} as IValidationField)
}

const _fnCheckValidationField = <T>(state : IReducerValidationState<T>, key : string) : IValidationField => {
  const fieldRule : IValidationField = _.get(state, `${VALIDATION_PART}.${key}`)
  const value = _.get(state, `data.${key}`)
  let error = true
  return Object.keys(fieldRule.validation).reduce((acc, fName) => {
    const fn = _.get(state.rules, key)[fName]
    if (fName === FUN_NAME_SAME_VALUES) {
      const {field, check} : IAreTheSame = fn()
      return Object.assign(acc, {[fName]: check(value, _.get(state, `data.${_getKeyPathForCompareField(key, field)}`))})
    }
    if (!error) {
      return acc
    } /** one error found break checking */
    const result  = fn ? fn(value) : void(0)
    fn && result && (error = false)
    return fn ? Object.assign(acc, {[fName]: result}) : acc
  }, {} as IValidationField)
}

const _fnValidateField = <T>(state : IReducerValidationState<T>, key : string, dirty : boolean = false) : IReducerValidationState<T> => {
  const fieldRule : IValidationField = _.get(state, `${VALIDATION_PART}.${key}`)
  if (!fieldRule || (!dirty && !fieldRule.dirty)) {
    return state
  }
  const obj : IValidationField = _fnCheckValidationField(state, key)
  state = _.merge({}, state, _.set({}, `${VALIDATION_PART}.${key}`, {
    error: Object.values(obj).find(x => !!x) || false,
    dirty: true,
    validation: obj
  }))
    /** are the same has special checking */
  if (!Object.keys(fieldRule.validation).every(x => x !== FUN_NAME_SAME_VALUES)) {
    const fn = _.get(state.rules, key)[FUN_NAME_SAME_VALUES]
    const {field} : IAreTheSame = fn()
    const _key = _getKeyPathForCompareField(key, field)
    const _field : IValidationField = _.get(state, `${VALIDATION_PART}.${_key}`)
    if (_field && _field.dirty) {
      const obj : IValidationField = _fnCheckValidationOfFieldAreTheSame(state, key, _key)
      state = _.merge({}, state, _.set({}, `${VALIDATION_PART}.${_key}`, {
        error: Object.values(obj).find(x => !!x) || false,
        dirty: true,
        validation: obj
      }))
    }
  }
  state.validation.error = _fnCheckModelErrors(state)
  return state
}

const validate = <T>(state : IReducerValidationState<T>, omitDirty = false) => {

  state = _.merge({}, state, {
    validation: state.keys.reduce((acc : IValidationModel<T>, key : string) => {
      const fieldRule : IValidationField = _.get(state, `${VALIDATION_PART}.${key}`)
      if (omitDirty && !fieldRule.dirty) {
        return acc
      }
      const obj : IValidationField = _fnCheckValidationField(state, key)
      return _.merge({}, acc, _.set({}, `validations.${key}`, {
        error: Object.values(obj).find(x => !!x) || false,
        dirty: true,
        validation: obj
      }))
    }, {...state.validation})
  })

  state.validation.error = _fnCheckModelErrors(state)
  return state
}

const _actionGenerator = function* (data : IValidationActionPromise[]) {
  yield* data
}

const _getGeneratorData = (data : IValidationActionPromise, actions : Iterator<IValidationActionPromise<any> | undefined>) => {
  const array = []
  let act = actions.next()
  while (act.value) {
    array.push(act.value)
    act = actions.next()
  }
  array.push({
    action: data.action,
    resolve: data.resolve,
  })
  return array
}

export const validationReducer = <T>() => {

  return (state : IReducerValidationState<T>, action : IValidationReducerAction) : IReducerValidationState<T> => {

  //  console.log('action', action)

    if (state.history.length !== 0) {
      state = state.history.reduce((st, value) => {

        switch (value.action) {
          default:
            return st
          case 'nextAction':
            return {
              ...st,
              ...{actions: _actionGenerator(_getGeneratorData(value.data as IValidationActionPromise, state.actions))}
            }
        }
      }, {
        ...state,
        ...{
          history: []
        }
      })
    }

    switch (action.type) {

      case VALIDATION_ACTIONS.validateValidation:
        return _.merge({}, validate(state), {
          actions: _actionGenerator(_getGeneratorData(action.payload.data as IValidationActionPromise, state.actions))
        })

      case VALIDATION_ACTIONS.setData:
        return _.merge({}, state, {
          data: action.payload.data
        })

      case VALIDATION_ACTIONS.resetValidation:
        return (() => {
          state = {
            ...state,
            ...{
              data: action.payload.data ? state.refFields.reduce((data : any, ref) => {
                return _.merge({}, data, _.set({}, ref.field, _.get(state.defaults, ref.field)))
              }, {}) : {...state.data}
            }
          }
          return _.merge({}, state, {
            validation: state.keys.reduce((accObj : IValidationModel<T>, key : string) => _.merge({}, accObj, _.set({}, `validations.${key}`, {
              dirty: false,
              error: false,
              validations: Object.keys(_.get(state, `${VALIDATION_PART}.${key}.validation`)).reduce((acc, key) => Object.assign(acc, {[key]: false}), {})
            })), {
              error: false,
              global: false,
              validations: {}
            } as IValidationModel<T>)
          })
        })()

      case VALIDATION_ACTIONS.setFieldNoValidation:
        return _.merge({}, state, _.set({}, `data.${action.payload.field as string}`, action.payload.data))

      case VALIDATION_ACTIONS.setGlobalError:
        return _.merge({}, state, {validation: {global: action.payload.data}})

      case VALIDATION_ACTIONS.setFieldError:
        return _.merge({}, state, _.set({validation: {error: true}}, `${VALIDATION_PART}.${action.payload.field as string}.error`, action.payload.data))

      case VALIDATION_ACTIONS.onBlurFieldValue:
      case VALIDATION_ACTIONS.setFieldValue:
        return _fnValidateField(_.merge({}, state, _.set({}, `data.${action.payload.field as string}`, action.payload.data)), action.payload.field as string, action.type === VALIDATION_ACTIONS.onBlurFieldValue)

      case VALIDATION_ACTIONS.addDataArray:
        return (() => {
          const arr = _.get(state, `data.${action.payload.field as string}`)
          const data = (action.payload.data as IValidationActionPromise).data

          return Array.isArray(arr) ? _.merge({}, state, _.set({}, `data.${action.payload.field as string}`, [...arr, data]), {
            history: [...state.history, {
              action: 'nextAction',
              data: action.payload.data
            }]
          })
            : _.merge({}, state, _.set({}, `data.${action.payload.field as string}`, [data]), {
              history: [...state.history, {
                action: 'nextAction',
                data: action.payload.data
              }]
            })

        })()

      case VALIDATION_ACTIONS.removeDataArray:
        return validate((() => {
          let arr = _.get(state, `data.${action.payload.field as string}`)
          const index : number = action.payload.data as number
          if (!Array.isArray(arr) || arr.length <= index) {
            return state
          }
          const str = `${action.payload.field}[${index}]`
          const dataObject = _.set({...(state.data as any)}, `${action.payload.field as string}`, [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)])

                    /** remove data from rules */
          arr = _.get(state, `rules.${action.payload.field as string}`)
          const rulesObject = (Array.isArray(arr) && arr.length > index) ? _.set({...(state.rules)}, `${action.payload.field as string}`, [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)])
            : {...state.rules}

                    /** remove from validation */
          arr = _.get(state, `validation.validations.${action.payload.field as string}`)
          const validation = _.set({...(state.validation as any)}, `validations.${action.payload.field as string}`, [...arr.slice(0, index), ...arr.slice(index + 1, arr.length)])

          const regex = new RegExp(`^(${action.payload.field})\\[(\\d+)\\].(.*)`, 'g')
          const arrayRef = state.refFields.filter(x => !x.field.startsWith(str)).map(x => {
            regex.lastIndex = 0
            const res = regex.exec(x.field)
            if (!res || !Array.isArray(res) || res.length < 4) {
              return x
            }
            const ind : number = +res[2]
            return ind < index ? x : {
              ...x,
              ...{
                field: `${res[1]}[${ind - 1}].${res[3]}`
              }
            }
          })
          const arrayKeys = state.keys.filter(key => !key.startsWith(str)).map(key => {
            regex.lastIndex = 0
            const res = regex.exec(key)
            if (!res || !Array.isArray(res) || res.length < 4) {
              return key
            }
            const ind : number = +res[2]
            return ind < index ? key : `${res[1]}[${ind - 1}].${res[3]}`
          })

          return {
            ...state,
            ...{
              data: dataObject,
              validation: validation,
              rules: rulesObject,
              refFields: arrayRef,
              keys: arrayKeys
            }
          }
        })(), true)

      case VALIDATION_ACTIONS.addValidationRule:  /** add validation , add rule for validation and add keys */
        return Object.keys(action.payload.data as IValidationFieldRules).reduce((acc, x : string) => {

          if (x === 'useValidator') {
            const arrayValidations = _.get(action.payload.data, x)
            if (!Array.isArray(arrayValidations)) {
              throw Error('Developer error: useValidator must be array, check manual- validations')
            }
            const useValidRule =  arrayValidations.reduce((completeRule,obj) => {
              const validatorFn = _.get(obj,'validator')
              if (!validatorFn || typeof validatorFn !== 'function') {
                throw Error('Developer Error: validator attribute must be valid function')
              }
              const args = ((param) => {
                if (_.isNil(param)) {
                  return [] 
                }
                return Array.isArray(param) ? param : [param]
              })(_.get(obj,'params'))
              const fn = (value : any) => {
                const _message = `${validatorFn.name} not passed`
                return  (validatorFn(value || '',...args) ? false : (obj.message ? obj.message : _message))
              }

              return {
                rules:{
                  ...completeRule.rules,
                  ...{
                    [`useValidator.${validatorFn.name}`]: fn
                  }
                },
                validation: {
                  ...completeRule.validation,
                  ...{
                    [`useValidator.${validatorFn.name}`]: false
                  }
                }
              }
            },{
              validation:{},
              rules:{}
            })

            return _.merge({},acc,
               _.set({}, `validation.validations.${action.payload.field}`, {
                 error: false,
                 dirty: false,
                 validation: {
                   ...useValidRule.validation
                 }
               }),
                _.set({}, `rules.${action.payload.field}`, {
                  ...useValidRule.rules
                }))
          }
          const fn = _.get(action.payload.data, x)
          const isNotDeclared = typeof fn() === 'function'
          return _.merge({}, acc,
                        _.set({}, `validation.validations.${action.payload.field}`, {
                          error: false,
                          dirty: false,
                          validation: {
                            [x]: false
                          }
                        }),
                        _.set({}, `rules.${action.payload.field}.${x}`, isNotDeclared ? fn() : fn))
        }, state.keys.findIndex((x : string) => x === action.payload.field) !== -1 ? state : {
          ...state,
          ...{
            keys: [...state.keys, action.payload.field as string]
          }
        })

      case VALIDATION_ACTIONS.registerFieldModel: /** set field to void(0) if not exists in initial state and put ref for  later actions like focus */
        return (() => {
          const field : string = action.payload.field as string
          const data : IRegisterFieldData = action.payload.data as IRegisterFieldData
          _.isNil(_.get(state, `data.${field}`)) && (state = _.merge({}, state, _.set({}, `data.${field}`, data.default)))
          state = _.merge({}, state, _.set({}, `defaults.${field}`, data.default))
                    /** remove old field ref  if exists */
          const index = state.refFields.findIndex((x : IFieldsRefs) => x.field === field)
          index !== -1 && (state.refFields.splice(index, 1))

          return {
            ...state,
            refFields: [...state.refFields, {
              field: field,
              ref: data.ref
            } as IFieldsRefs]
          }
        })()
      default:
        return {...state}
    }
  }
}

