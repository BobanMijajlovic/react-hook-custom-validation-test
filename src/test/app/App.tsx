import React         from 'react'
import './assets/index.css'
import {
  BrowserRouter as Router,
  Redirect,
  withRouter
} from 'react-router-dom'

import {
  Route,
  Switch
}                    from 'react-router'
import Examples      from './pages/Examples'

const Pages = withRouter(({location} : any) => {
  let homeClass = ''
  if (location.pathname === '/') {
    homeClass = 'home-page' 
  }
  return (
    <div className={`nav-pusher ${homeClass}`}>
      <Switch>
        <Route
                    path={'/examples'}
                    component={Examples}
        />
        <Route  path={'/'} >
          <Redirect to={'/examples'} />
        </Route>
      </Switch>
    </div>
  )
})

export default () => {

  return (
    <div className="App">
      <Router>
        <Pages />
      </Router>
    </div>
  )
}

