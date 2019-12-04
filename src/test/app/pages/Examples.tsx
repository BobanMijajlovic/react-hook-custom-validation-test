import React    from 'react'
import TestTs   from '../../../components/test/test_ts/TestTs'
import {
  BrowserRouter as Router,
  withRouter
}               from 'react-router-dom'
import LinkPath from '../../../components/test/components/LinkPath'

const Examples = () => {
  const [state,setState] = React.useState(false)

  const onClick = () => {
    setState(!state)
  }

  let docsNavContainer = 'docs-nav-container'
  if (state) {
    docsNavContainer += ' docs-slider-active' 
  }

  return (
    <div className={'example-main-wrapper wrapper'}>
      <Router>
        <div className={docsNavContainer}>
          <nav className='nav'>
            <div className='toggle-nav'>
              <div className="nav-wrapper wrapper">
                <div className="nav-breadcrumb wrapper">
                  <div className="nav-toggle" onClick={onClick}>
                    <div className="hamburger-menu">
                      <div className="line1"></div>
                      <div className="line2"></div>
                      <div className="line3"></div>
                    </div>
                  </div>
                  <h2><i>›</i><span>Examples</span></h2>
                </div>
                <div className="nav-groups">
                  <h4 className="nav-group-category-title">Examples</h4>
                  <ul>
                    <LinkPath path={'/examples/test-ts/company'} name={'Company Form'}/>
                    <LinkPath path={'/examples/test-ts/client'} name={'Client Form'}/>
                    <LinkPath path={'/examples/test-ts/payment'} name={'Payment Form'}/>
                    <LinkPath path={'/examples/test-ts/registration'} name={'Registration Form'}/>
                  </ul>
                </div>
              </div>
            </div>
          </nav>
        </div>
        <div className={'container main-container'}>
          <div className={'wrapper'}>
            <div className={'post'}>
              <TestTs/>
            </div>
          </div>
        </div>
      </Router>
    </div>
  )
}

export default withRouter(Examples)

