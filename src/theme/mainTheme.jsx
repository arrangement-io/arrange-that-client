import { createMuiTheme } from '@material-ui/core/styles';

const mainTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#0077CD',
        },
    },
    overrides: {
        MuiTypography: {
            body2: {
                fontSize: '0.75rem',
                fontWeight: '600',
            },
        },
    },
});

export default mainTheme;
