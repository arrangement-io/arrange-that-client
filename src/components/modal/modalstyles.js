export default {
  // Prevent page scrolling when modal is open.
  '@global': {
    'body': { overflow: 'hidden' },
  },
  
  // The modal wrapper: absolute positioning,
  // 100% of the browser window height and width.
  modalOverlay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'fixed',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: '9999',
    opacity: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
    animation: 'show .5s ease',
  },
  
  // Fade-in open animation
  '@keyframes show': {
    '0%': {
      display: 'none',
      opacity: 0,
    },
    '1%': {
      display: 'flex',
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },

  // The modal window: a empty div, vertical and horizontal cenetered.
  modal: {
    width: '100%',
    backgroundColor: '#fff',
    boxShadow: [0, 0, '0.625rem', 'rgba(0, 0, 0, 0.2)'],

    '@media (min-width: 576px)': {
      width: '32rem',
    },
  },

  // The close button: absolute positioning on top left of the
  // browser window, white background square with a gray X.
  closeButton: {
    position: 'fixed',
    top: 0,
    right: 0,
    background: '#fff',
    width: '2.5rem',
    height: '2.5rem',
    padding: 0,
    border: 0,
    cursor: 'pointer',
    outline: 0,
    boxShadow: [0, 0, '0.625rem', 'rgba(0, 0, 0, 0.2)'],

    '&:before, &:after': {
      content: '""',
      position: 'absolute',
      top: '1.2rem',
      left: '0.25rem',
      width: '2rem',
      height: '0.1rem',
      backgroundColor: '#888',
    },

    '&:before': { transform: 'rotate(45deg)' },
    '&:after': { transform: 'rotate(-45deg)' },

    '&:hover:before, &:hover:after': {
      backgroundColor: '#444',
    },
  },
};