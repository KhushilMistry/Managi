import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tab, Tabs, Button, Modal } from 'react-bootstrap'
import { Redirect } from 'react-router-dom'
import './team.scss'
import { fetchTeam, addTeamMember } from '../../actions'
var _ = require('lodash');

class Team extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userModal: false,
      email: '',
      error: '',
      leaveModal: false
    }
  }

  componentWillMount = () => {
    if (!this.props.currrentTeam) {
      let currentTeam
      _.forEach(this.props.teams, element => {
        if (element.name === this.props.match.params.team) {
          currentTeam = element
        }
      })
      this.props.fetchTeam(currentTeam)
    }
  }

  showModal = () => {
    this.setState({
      userModal: true
    })
  }

  handleClose = () => {
    this.setState({
      userModal: false,
      error: '',
      email: ''
    })
  }

  changeState = (event) => {
    let newState = this.state
    newState[event.target.name] = event.target.value
    this.setState(newState)
  }

  addTeam = () => {
    if (this.state.email === '') {
      this.setState({
        error: 'Fill all the details.'
      })
    }
    else {
      let users = this.props.currentTeam.users;
      let bool = false;
      _.forEach(users, user => {
        if (user.Email === this.state.email) {
          bool = true;
        }
      })
      if (bool) {
        this.setState({
          error: 'Email already exsists.'
        })
      }
      _.forEach(this.props.allUsers, user => {
        if (user.Email === this.state.email) {
          bool = true
        }
      })
      if (!bool) {
        this.setState({
          error: 'Email does not exsist.'
        })
      }
      else {
        let team = this.props.currentTeam
        let user
        _.forEach(this.props.allUsers, element => {
          if (element.Email === this.state.email) {
            user = element
          }
        })
        user.teams = user.teams || []
        user.teams.push(team.name)
        team.users.push(user)
        this.props.addTeamMember(user, team)
      }
    }
  }

  leaveTeam = () => {
    let user = this.props.user;
    user.teams = user.teams.filter(e => e !== this.props.currentTeam.name);
    let currentTeam = this.props.currentTeam;
    currentTeam.users = currentTeam.users.filter(e => e.id !== this.props.user.id);
    this.props.addTeamMember(user, currentTeam)
    this.props.history.push('/dashboard')
    this.handleLeaveClose();
  }

  showModalDanger = () => {
    this.setState({
      leaveModal: true
    })
  }

  handleLeaveClose = () => {
    this.setState({
      leaveModal: false
    })
  }

  render() {
    if(!this.props.user.teams || !this.props.user.teams.includes(this.props.match.params.team)){
      return <Redirect to="/dashboard" />
    }
    return (
      <div>
        <h3 className="teamNameHeading">{this.props.match.params.team}</h3>
        <Tabs className="tabName" defaultActiveKey={1}>
          <Tab eventKey={1} title="Details">
            <div>
              {
                this.props.currentTeam !== '' &&
                <div>
                  <p className="detailsText"><b>Details</b> : {this.props.currentTeam.details}</p>
                  <h3>Users</h3>
                  <hr />
                  <Button bsStyle="primary" onClick={this.showModal} className="userButtons">Add User</Button>
                  <Button bsStyle="danger" onClick={this.showModalDanger} className="userButtons">Leave Team</Button>
                  <div>
                    {
                      _.map(this.props.allUsers, (user, key) => {
                        if (user.teams.includes(this.props.currentTeam.name)) {
                          return <div className="teamTile" key={key}>
                            <p><b>Name</b> : {user.Name}</p>
                            <p className="teamDetails"><b>Email</b> : {user.Email}</p>
                          </div>
                        }
                      })
                    }
                  </div>
                </div>
              }
              <Modal show={this.state.userModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <input className="login-input" type="email" placeholder="Email" name="email"
                    onChange={(event) => this.changeState(event)}
                    value={this.state.email}
                  />
                  <p class="errorMsg">{this.state.error}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.handleClose}>Close</Button>
                  <Button bsStyle="primary" onClick={this.addTeam}>Add</Button>
                </Modal.Footer>
              </Modal>
              <Modal show={this.state.leaveModal} onHide={this.handleLeaveClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Leave Team</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <p>{'Are you sure you want to leave the team ?'}</p>
                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.handleLeaveClose}>Close</Button>
                  <Button bsStyle="danger" onClick={this.leaveTeam}>Leave</Button>
                </Modal.Footer>
              </Modal>
            </div>
          </Tab>
          <Tab eventKey={2} title="Kanban Diagram">
            Tab 2 content
          </Tab>
          <Tab className="tabName" eventKey={3} title="Gantt chart">
            Tab 3 content
          </Tab>
          <Tab className="tabName" eventKey={4} title="Budget Tracker">
            Tab 3 content
          </Tab>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = ({ loginStates }) => ({
  user: loginStates.user,
  loading: loginStates.loading,
  allUsers: loginStates.users,
  currentTeam: loginStates.currrentTeam,
  teams: loginStates.teams
})

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchTeam,
  addTeamMember
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Team)
