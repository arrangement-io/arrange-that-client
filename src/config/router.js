import React from 'react'

import {
  Router,
  Switch,
  Route
} from 'react-router-dom'

import createHistory from 'history/createBrowserHistory'

import Layout from 'layout'
import GoogleLoginPage from 'views/google-login'
import Arrange from 'views/arrange'
import AddArrange from 'views/addarrange'

const history = createHistory()

const router = (
  <Router history={history}>
    <Layout>
      <Switch>
        <Route exact path='/' component={GoogleLoginPage} />
        <Route exact path='/arrangement' component={Arrange} />
        <Route exact path='/addarrangement' component={AddArrange} />
      </Switch>
    </Layout>
  </Router>
)

export default router