import React, { Component }  from 'react';
import { Route } from 'react-router-dom'
import SignIn from './component/SignIn'
import Home from './component/Home'

class Routes extends Component {
  render() {
    return (
      <div>
        <Route exact path="/" component={SignIn} />
        <Route exact path="/admin_event" component={Home} />
      </div>
    );
  }
}

export default Routes;
