import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';
import logger from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createBrowserHistory } from 'history';
import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import rootReducer from './reducers';
import './normalize.css';
import './tailwind.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const history = createBrowserHistory();

const defaultState = {
  auth: {
    loggedIn: false,
  }
};

const store = createStore(
  connectRouter(history)(rootReducer),
  defaultState,
  composeWithDevTools(
    applyMiddleware(
      routerMiddleware(history),
      reduxThunk,
      logger
    )
  )
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root'));

registerServiceWorker();
