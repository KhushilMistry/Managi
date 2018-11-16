import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { 
  signIn
} from '../../actions'
import './signin.scss'
import Loader from '../Loader'

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      email: '',
      password: ''
    };
  }

  changeState = (event) => {
    let newState = this.state;
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  check = () => {
    if (this.state.email === '' || this.state.password === '') {
      return false;
    }
    else {
      return true;
    }

  }

  sign_In = () => {

    if (!this.check()) {
      this.setState({
        error: 'Please, Fill all the details.'
      });
      return;
    }

    const query = {
      email: this.state.email,
      password: this.state.password
    }

    this.props.signIn(query);

    this.setState({
      name: '',
      email: '',
      password: '',
      number: '',
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
            <p className="login-heading">Log In</p>
            <input className="login-input" placeholder="Email" name="email"
              onChange={(event) => this.changeState(event)}
              value={this.state.email}
            /><br />
            <input className="login-input" placeholder="Password" name="password" type="password"
              onChange={(event) => this.changeState(event)}
              value={this.state.password}
            /><br />
            <button className="login-button" onClick={this.sign_In}>Log in</button>
            {
              this.state.error !== '' ? <div className="error-message">{this.state.error}</div> :
                <div className="error-message">{this.props.error}</div>
            }
            <p className="login-text">Already Signed In ? <Link className="login-link" to="/signup">Sign Up</Link></p>
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
  signIn
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn)
