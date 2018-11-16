import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Switch, Route, Link, Redirect } from 'react-router-dom'
import { Navbar, Nav, NavItem, Glyphicon } from 'react-bootstrap'
import Loader from '../Loader'
import './home.scss'
import { logout } from '../../actions'
import Detail from '../Detail'
import Team from '../Team'
import Profile from '../Profile'

class Home extends Component {

  render() {
    if (this.props.user === '') {
      return <Redirect to='/signin' />
    }
    return (
      this.props.loading ? <Loader /> :
        <div>
          <Navbar inverse collapseOnSelect fluid className="navbarCustom">
            <Navbar.Header>
              <Navbar.Brand>
                <Link to='/dashboard' className="navbarHeader">Managi</Link>
              </Navbar.Brand>
              <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
              <Nav pullRight>
                <NavItem onClick={() => { this.props.logout() }} className="navbarLink" href="#">
                  Logout
                </NavItem>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <div className="divContainer">
            <div className="horizontalNav">
              <Link to='/dashboard' className="horizontalLink">
                <Glyphicon glyph="home" className="iconCenter" />
                <p>Dashboard</p>
              </Link>
            </div>
            <div className="horizontalContainer">
              <Switch>
                <Route exact path="/dashboard" component={Detail} />
                <Route exact path='/dashboard/profile/:profile' component={Profile} />
                <Route path='/dashboard/:team' component={Team} />
              </Switch>
            </div>
          </div>
        </div>
    )
  }
}

const mapStateToProps = ({ loginStates }) => ({
  user: loginStates.user,
  loading: loginStates.loading
})

const mapDispatchToProps = dispatch => bindActionCreators({
  logout
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
