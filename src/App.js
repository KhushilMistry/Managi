import React, { Component }  from 'react'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router'
import store, { history } from './store/store'
import Routes from './routes'
import './App.scss'


class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <div>
            <Routes />
          </div>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
