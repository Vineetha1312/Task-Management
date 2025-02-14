import {createStore, applyMiddleware, compose} from 'redux';
import {thunk} from'redux-thunk';
import logger from'redux-logger';
import {rootReducer} from './rootReducer';

const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ )|| compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk, logger)))