import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { signUp } from '../../actions'
import './signup.scss'
import Loader from '../Loader'

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      name: '',
      email: '',
      password: '',
      organization: '',
      number: ''
    };
  }

  changeState = (event) => {
    let newState = this.state;
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  check = () => {
    if (this.state.name === '' || this.state.password === '' || this.state.organization === '' || this.state.email === '') {
      return false;
    }
    else {
      return true;
    }

  }

  sign_Up = () => {
    if (!this.check()) {
      this.setState({
        error: 'Please, Fill all the details.'
      });
      return;
    }

    const query = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      number: this.state.number,
      organization: this.state.organization
    }

    this.props.signUp(query);
    this.setState({
      name: '',
      email: '',
      password: '',
      number: '',
      organization: '',
      error: ''
    });
  };

  render() {
    if (this.props.user !== '') {
      return <Redirect to='/dashboard' />
    }
    return (
      <div>
        {this.props.loading ? <Loader /> :
          <div className="login-box">
            <p className="login-heading">Sign Up</p>
            <input className="login-input" name='name' placeholder="Name" onChange={(event) => this.changeState(event)}
              value={this.state.name}
            /><br />
            <input className="login-input" name='email' placeholder="Email"
              onChange={(event) => this.changeState(event)}
              value={this.state.email}
            /><br />
            <input className="login-input" name='password' placeholder="Password" type="password"
              onChange={(event) => this.changeState(event)}
              value={this.state.password}
            /><br />
            <input className="login-input" name='number' placeholder="Mobile Number" type="number"
              onChange={(event) => this.changeState(event)}
              value={this.state.number}
            /><br />
            <input className="login-input" name='organization' placeholder="Organization"
              onChange={(event) => this.changeState(event)}
              value={this.state.organization}
            /><br />
            <button className="login-button" onClick={this.sign_Up}>Sign Up</button>
            {this.state.error !== '' ? <div className="error-message">{this.state.error}</div> :
              <div className="error-message">{this.props.error}</div>}
            <p className="login-text">Already Signed Up ? <Link className="login-link" to="/signin">Log in</Link></p>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = ({ loginStates }) => ({
  user: loginStates.user,
  loading: loginStates.loading,
  error: loginStates.error
})

const mapDispatchToProps = dispatch => bindActionCreators({
  signUp
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp)
