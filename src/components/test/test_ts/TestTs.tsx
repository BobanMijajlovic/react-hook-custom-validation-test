import React            from 'react'
import RegistrationForm from './RegistrationForm'
import ClientForm       from './ClientForm'
import PaymentForm      from './PaymentForm'
import {
  Redirect,
  Route,
  Switch
} from 'react-router'
import CompanyForm      from './CompanyForm'

const TestTs = () => {
  return (
    <Switch>
      <Route
          path={'/examples/test-ts/company'}
          component={CompanyForm}
      />
      <Route
          path={'/examples/test-ts/client'}
          component={ClientForm}
      />
      <Route
          path={'/examples/test-ts/registration'}
          component={RegistrationForm}
      />
      <Route
          path={'/examples/test-ts/payment'}
          component={PaymentForm}
      />

      <Route  path={'/examples'} >
        <Redirect to={'/examples/test-ts/registration'} />
      </Route>
    </Switch>
  )
}
export default TestTs
