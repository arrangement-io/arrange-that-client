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
        MuiToggleButton: {
            root: {
                
            }
        },
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
            }
        }
    },
});

export default mainTheme;
