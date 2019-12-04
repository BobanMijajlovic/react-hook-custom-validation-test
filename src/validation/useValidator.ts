import React, {
  useEffect,
  useMemo,
  useReducer,
  useRef
}             from 'react'
import * as _ from 'lodash'
import {
  IReducerValidationState,
  IValidationActionPromise,
  IValidationReducerAction,
  reducerActionFunctions,
  validationReducer
}             from './validatorReducer'
import {
  IFieldsRefs,
  IPromiseValidationData,
  IRegisterFieldData,
  IUseValidation,
  IUseValidationProps,
  IValidationFieldRules,
  IValidationModel,
} from './interface'

const emptyGenerator = function* () {
  yield  void(0)
}

const _promiseState = <T>(stateReducer : IReducerValidationState<T>) : IPromiseValidationData<T> => {

  return {
    error: !!stateReducer.validation.error,
    data: {...stateReducer.data},
    validations: {...stateReducer.validation},
    refs: [...stateReducer.refFields]
  }
}

export const useValidation = <T>(props ?: IUseValidationProps<T>) : IUseValidation<T> => {

  const initialDataRef = useRef(props ? props.initialData : {})
  const initialReducer : any = useMemo(() => (() => {
    return {
      validation: {
        global: false,
        error: false,
        validations: {}
      } as IValidationModel<T>,
      data: initialDataRef.current,
      rules: {},
      keys: [],
      refFields: [],
      actions: emptyGenerator(),
      history: [],
      defaults: {}
    }
  })(), [])

  const reducer = useMemo(() => validationReducer<T>(), [])
  const [state, dispatch] : [IReducerValidationState<T>, (s : IValidationReducerAction) => void] = useReducer(reducer, initialReducer as IReducerValidationState<T>)

  useEffect(() => {
   // console.log('state effect ', state)
  })

  useEffect(() => {
    let result = state.actions.next()
    while (result && !result.done && result.value) {

      switch (result.value.action) {
        case 'validate':
          result.value.resolve(_promiseState(state))
          break
        case 'addToArray':
          result.value.resolve(_promiseState(state))
          break
      }
      result = state.actions.next()
    }
  },)

  const validate = React.useCallback(() : Promise<IPromiseValidationData<T>> => {
    return new Promise((resolve) => {
      const data : IValidationActionPromise = {
        action: 'validate',
        resolve
      }
      dispatch(reducerActionFunctions.actionValidationValidate(data))
    })
  }, [dispatch])

  const addArrayData = React.useCallback((field : string, data : any) : Promise<IPromiseValidationData<T>> => {
    return new Promise((resolve) => {
      const _data : IValidationActionPromise = {
        action: 'addToArray',
        resolve: resolve,
        data: data
      }
      dispatch(reducerActionFunctions.actionAddArrayData(field, _data))
    })
  }, [dispatch])

  return {

    addValidationRule: React.useCallback((field : string, rule : IValidationFieldRules) : void => dispatch(reducerActionFunctions.actionValidationAddModelRule(field, rule)), [dispatch]),
    registerField: React.useCallback((field : string, data : IRegisterFieldData) : void => dispatch(reducerActionFunctions.actionRegisterFieldOfModel(field, data)), [dispatch]),

    addArrayData,

    removeArrayData: React.useCallback((field : string, index : number) : void => {
      dispatch(reducerActionFunctions.actionRemoveArrayData(field, index))
    }, [dispatch]),

    getFieldValue: React.useCallback((field : string) : string | undefined => _.get(state.data, field), [state]),
    setFieldValue: React.useCallback((field : string, value : any, validate : boolean = true) : void => dispatch(reducerActionFunctions.actionValidationSetFieldValue(field, value, validate)), [dispatch]),
    setFieldError: React.useCallback((field : string, error : string) : void => dispatch(reducerActionFunctions.actionValidationSetFieldError(field, error)), [dispatch]),

    getFieldRef: React.useCallback( (field : string) : IFieldsRefs | undefined => state.refFields.find(data => data.field === field),[state]),

    onBlurField: React.useCallback((field : string, value ?: string) : void => dispatch(reducerActionFunctions.actionValidationBlurField(field, value)), [dispatch]),

    getFieldError: React.useCallback((field : string) : string | undefined => _.get(state.validation, `validations.${field}.error`), [state]),
    setErrorGlobal: React.useCallback((error : string | boolean) : void => dispatch(reducerActionFunctions.actionValidationSetGlobalError(error)), [dispatch]),

    resetValidations: React.useCallback((resetData : boolean = false) : void => dispatch(reducerActionFunctions.actionValidationReset(resetData)), [dispatch]),

    validate,

    state: state.data,
    setState: React.useCallback((data : any) : void => dispatch(reducerActionFunctions.actionSetData(data)), [dispatch]),

    errorModel: !!state.validation.error,
    errorGlobal: state.validation.global
  }
}
