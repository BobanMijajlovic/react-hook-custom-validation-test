import React            from 'react'
import {withStyles}     from '@material-ui/core'
import {TextFieldProps} from '@material-ui/core/TextField'
import {IWithStyles}    from '../interface'
import {
  IWithValidationProps,
  withValidation
}                       from '../../import-validation'

import Radio            from '@material-ui/core/Radio'
import RadioGroup       from '@material-ui/core/RadioGroup'
import FormHelperText   from '@material-ui/core/FormHelperText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import amex             from '../../../assets/images/amex.jpg'
import master           from '../../../assets/images/mastercard.jpg'
import visa             from '../../../assets/images/visa.jpg'

const CardImg = (props : any) => {
  const {image,name} = props
  return (
    <div>
      <img src={image} alt={name} width="40px" height="auto"  />
    </div>
  )
}

const style : any = {
  item: {
    display: 'inline-block',
    width: '26%'
  },
  helpText: {
    textAlign: 'center'
  }

}

const Component : <T extends object> (props : IWithValidationProps<T> & IWithStyles) =>
React.ReactElement<TextFieldProps & IWithValidationProps<T> & IWithStyles> =
    ({ classes, error, value,onChange}) => {

      return (
        <RadioGroup  value={value} onChange={onChange} style={{width:'100%', textAlign:'center'}} >
          <div>
            <FormControlLabel value="amex"    control={<Radio />} label={<CardImg image={amex} name={'amex'}/>}  className={classes.item} />
            <FormControlLabel value="master"    control={<Radio />} label={<CardImg image={master} name={'master'}/>}   className={classes.item}/>
            <FormControlLabel value="visa"    control={<Radio />} label={<CardImg image={visa} name={'visa'} />}   className={classes.item}  />
          </div>
          <FormHelperText className={classes.helpText} error ={!!error }>Choose card type your are using</FormHelperText>
        </RadioGroup>

      )
    }
export default  withStyles(style)(withValidation(Component))
