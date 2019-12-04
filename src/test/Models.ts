export  type  IBasicModel = {}

export interface IAddressModel extends IBasicModel {
  id ?: number,
  street : string,
  zip : string,
  city : string,
  state ?: string
}

export interface IContactInfoModel extends IBasicModel {
  phone ?: string,
  email ?: string
}

export interface IPersonModel extends IBasicModel {
  firstName : string,
  lastName : string,
  contact : IContactInfoModel
}

export interface IClientModel {
  firstName : string,
  lastName : string,
  address : IAddressModel[]
}

export interface ICompanyModel {
  name : string,
  tin : string,
  type : string,
  address : IAddressModel,
  person : IPersonModel
}

export interface IRegistrationModel {
  email : string,
  password : string,
  confirmPassword : string
}

export interface IPaymentContactModel {
  firstName : string,
  lastName : string,
  mobile ?: string
}

export interface IPaymentStateModel {
  country : string,
  zipCode : string
}

export interface IPaymentCardModel {
  cardNumber : string,
  expDate : string,
  cvv : string,
  payment : string
}

export interface IPaymentModel {
  contact : IPaymentContactModel,
  cardInfo : IPaymentCardModel
}

export interface ICreditCardsModel {
  visa ?: boolean,
  masterCard ?: boolean
}

export interface ICardModel {
  quantity : string,
  cards : ICreditCardsModel
}

export interface IMaskedInputsModel {
  mobile : string,
  price : string,
  expDate : string,
  cardNumber : string
}
