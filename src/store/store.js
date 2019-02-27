import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from 'reducers/reducers'

const initialStore = {}

const store = createStore(
    rootReducer,
    initialStore,
    applyMiddleware(thunk)
)

export default store