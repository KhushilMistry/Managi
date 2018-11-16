import React, { Component } from 'react';
import { Route } from 'react-router-dom'
import SignIn from './component/SignIn'
import SignUp from './component/SignUp'
import Home from './component/Home'

class Routes extends Component {
  render() {
    return (
      <div>
        <Route exact path="/signin" component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/dashboard" component={Home} />
      </div>
    );
  }
}

export default Routes;
