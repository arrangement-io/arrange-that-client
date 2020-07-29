import { createMuiTheme } from '@material-ui/core/styles';

const mainTheme = createMuiTheme({
    palette: {
        primary: {
            main: '#0077CD',
        },
    },
    overrides: {
        MuiTypography: {
            button: {
                fontFamily: 'Montserrat',
                fontStyle: 'normal',
                fontWeight: 'normal',
                lineHeight: '20px',
                display: 'flex',
                alignItems: 'center',
                color: '#222222',
                textTransform: 'capitalize',
            },
        },
    },
});

export default mainTheme;
