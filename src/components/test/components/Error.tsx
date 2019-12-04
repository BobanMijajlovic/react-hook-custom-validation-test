import React                 from 'react'
import {FontAwesomeIcon}     from '@fortawesome/react-fontawesome'
import {faExclamationCircle} from '@fortawesome/free-solid-svg-icons'

export interface IErrorGlobalProps {
    message: string | boolean,
}

const Error = ({message}: IErrorGlobalProps) => {
    return (
        <div className="global-error">
            <FontAwesomeIcon style={{fontSize: 18, position: 'absolute', left: '4px'}} icon={faExclamationCircle}/>
            <div>{message}</div>
        </div>
    )
}

export default Error
