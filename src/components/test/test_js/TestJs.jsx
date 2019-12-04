import React            from 'react'
import {Route, Switch}  from 'react-router'
import ClientForm       from './ClientForm'
import RegistrationForm from './RegistrationForm'
import PaymentForm      from './PaymentForm'
import CompanyForm      from './CompanyForm'

const TestJS = () => {

  return (
    <>
      <Switch>
        <Route
                    path={'/examples/test-js/company'}
                    component={CompanyForm}
        />
        <Route
                    path={'/examples/test-js/client'}
                    component={ClientForm}
        />
        <Route
                    path={'/examples/test-js/registration'}
                    component={RegistrationForm}
        />
        <Route
                    path={'/examples/test-js/payment'}
                    component={PaymentForm}
        />
      </Switch>
    </>
  )
}

export default TestJS
