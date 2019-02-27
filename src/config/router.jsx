import React from 'react'

import {
    Router,
    Switch,
    Route
} from 'react-router-dom'

import createHistory from 'history/createBrowserHistory'

import Layout from 'layout'
import GoogleLoginPage from 'views/google-login/google-login'
import Arrangement from 'views/arrangement/arrangement'
import AddArrangement from 'views/addarrangement/addarrangement'
import AllArrangements from 'views/allArrangements/allArrangements'

const history = createHistory()

const router = (
    <Router history={history}>
        <Layout>
            <Switch>
                <Route exact path='/' component={GoogleLoginPage} />
                <Route exact path='/arrangement/:arrangement_id' component={Arrangement} />
                <Route exact path='/addarrangement' component={AddArrangement} />
                <Route exact path='/all_arrangements' component={AllArrangements} />
            </Switch>
        </Layout>
    </Router>
)

export default router