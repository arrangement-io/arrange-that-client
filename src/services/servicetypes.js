export const base_url = () => {
  if (process.env.NODE_ENV !== 'production') {
    return process.env.REACT_APP_DEV_API_HOST
  } else {
    return process.env.REACT_APP_PROD_API_HOST
  }
}
//test the arrangement_id a111EPQPQ
export const ARRANGEMENT = '/arrangement/a111EPQPQ'
