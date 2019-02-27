import React from 'react'
import PropTypes from 'prop-types'

import Header from 'containers/header/header'
import { Grid } from '@material-ui/core';

const Default = props => {
    const { children } = props

    return (
        <Grid container spacing={24}>
            <Grid item xs={12}>
                <Header />
            </Grid>
            <Grid item xs={12}>
                {children}
            </Grid>
        </Grid>
    )
}

Default.propTypes = {
    children: PropTypes.node.isRequired
}

export default Default