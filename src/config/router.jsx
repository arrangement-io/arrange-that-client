import React from 'react'

import {Router, Switch, Route} from 'react-router-dom'
import PrivateRoute from 'config/privateRoute'

import createHistory from 'history/createBrowserHistory'

import Layout from 'layout'
import HomePage from 'views/homePage/homePage'
import Arrangement from 'views/arrangement/arrangement'
import AddArrangement from 'views/addArrangement/addArrangement'
import AllArrangements from 'views/allArrangements/allArrangements'

const history = createHistory()

const router = (
    <Router history={history}>
        <Layout>
            <Switch>
                <Route exact path='/' component={HomePage} />
                <PrivateRoute exact path='/arrangement/:arrangement_id' component={Arrangement} />
                <PrivateRoute exact path='/addarrangement' component={AddArrangement} />
                <PrivateRoute exact path='/all_arrangements' component={AllArrangements} />
            </Switch>
        </Layout>
    </Router>
)

export default router