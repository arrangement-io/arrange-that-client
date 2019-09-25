import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Typography, Badge } from '@material-ui/core';
import { colors, defaultColor } from 'utils/colorConstants';

/**
 * <GenderClass gender={"M"/"F"/""} clazz={"Three letter string"} color={"color"} >
 */

const styles = () => ({
    classWrapper: {
        minWidth: '27px',
    },
    genderClazzWrapper: {
        marginLeft: '-6px',
        marginRight: '-10px',
    },
});

const styledBy = (property, mapping) => (props) => {
    const color = props[property];
    if (color in mapping) {
        return mapping[props[property]][500];
    }
    return defaultColor[500];
};

const StyledBadge = withStyles({
    color: {
        background: styledBy('background', colors),
        transform: 'scale(.8) translate(50%, -50%)',
        borderRadius: '4px',
        borderWidth: '1px',
        borderColor: 'red',
        fontSize: '.875rem',
        fontWeight: 'bold',
        padding: '0px',
    },
    default: {
        background: 'none',
        transform: 'scale(.8) translate(50%, -50%)',
        borderRadius: '4px',
        borderWidth: '1px',
        borderColor: 'black',
        borderStyle: 'solid',
        color: 'black',
        fontSize: '.875rem',
        fontWeight: 'bold',
        padding: '0px',
    },
})(({ classes, ...other }) => {
    if (other.background in colors) {
        return (<Badge classes={{ badge: classes.color }} {...other} color="secondary" ></Badge>);
    }
    return (<Badge classes={{ badge: classes.default }} {...other} color="secondary" ></Badge>);
});

const GenderClass = (props) => {
    const {
        gender,
        clazz,
        color,
        classes,
    } = props;

    // if (gender || clazz || color) {
    // Capitalize Gender and make sure that it is either "M" "F" or ""
    const genderCaps = gender ? gender.toUpperCase() : '';

    // Get first 2 letters of clazz if available, if nothing then null character
    const clazz2 = clazz ? clazz.substring(0, 2) : '\x00';

    return (
        <div className={classes.genderClazzWrapper}>
            <div>
                <StyledBadge badgeContent={genderCaps} background={color} />
            </div>
            <div>
                <Typography className={classes.clazzWrapper} variant="body2">
                    {clazz2}
                </Typography>
            </div>
        </div>);
};

GenderClass.propTypes = {
    gender: PropTypes.string,
    clazz: PropTypes.string,
    color: PropTypes.string,
};

export default withStyles(styles)(React.memo(GenderClass));
