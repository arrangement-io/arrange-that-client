import React from 'react'

import {
  Router,
  Switch,
  Route
} from 'react-router-dom'

import createHistory from 'history/createBrowserHistory'

import Layout from 'layout'
import Arrange from 'views/arrange'

const history = createHistory()

const router = (
  <Router history={history}>
    <Layout>
      <Switch>
        <Route exact path='/arrangement' component={Arrange} />
      </Switch>
    </Layout>
  </Router>
)

export default router
