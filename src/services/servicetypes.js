export const base_url = () => {
  if (process.env.NODE_ENV !== 'production') {
    return process.env.REACT_APP_DEV_API_HOST
  } else {
    return process.env.REACT_APP_PROD_API_HOST
  }
}

// export const ARRANGEMENT = '/arrangement/aJDUX35L6'
export const ARRANGEMENT = '/arrangement'
export const EXPORT_ARRANGEMENT = '/arrangement'