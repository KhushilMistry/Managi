import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tab, Tabs, Button, Modal } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import './team.scss'
import { fetchTeam, addTeamMember, addBudget } from '../../actions'
import Progress from 'react-progressbar'
var _ = require('lodash');

class Team extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userModal: false,
      email: '',
      error: '',
      leaveModal: false,
      expModal: false,
      budgetModal: false,
      amount: 0,
      title: '',
      note: '',
      expAmount: 0
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

  handleExpClose = () => {
    this.setState({
      expModal: false,
      error: '',
      note: '',
      title: '',
      expAmount: 0
    })
  }

  openExpModal = () => {
    this.setState({
      expModal: true
    })
  }

  addExp = () => {
    if (!this.state.expAmount || this.state.expAmount <= 0 || this.state.note === '' || this.state.title === '') {
      this.setState({
        error: "Fill all the details."
      })
    }
    else {
      if (!this.props.currentTeam.budget || !this.props.currentTeam.budget.total || this.state.expAmount > this.props.currentTeam.budget.remaining) {
        this.setState({
          error: "You don't have sufficient budget."
        })
      }
      else {
        let budget = this.props.currentTeam.budget;
        budget.remaining = Number(budget.remaining) - Number(this.state.expAmount);
        budget.spent = Number(budget.spent) + Number(this.state.expAmount);
        budget.exp = this.props.currentTeam.budget.exp || [];
        let val = {
          amount: Number(this.state.expAmount),
          title: this.state.title,
          note: this.state.note
        }
        budget.exp.push(val);
        let updateBudgetTeam = this.props.currentTeam;
        updateBudgetTeam.budget = budget;
        this.props.addBudget(updateBudgetTeam);
        this.handleExpClose();
      }
    }
  }

  openBudgetModal = () => {
    this.setState({
      budgetModal: true
    })
  }

  handleBudgetClose = () => {
    this.setState({
      budgetModal: false,
      error: '',
      amount: 0
    })
  }

  editBudgetAmount = () => {
    if (this.state.amount <= 0) {
      this.setState({
        error: "Fill right details."
      })
    }
    else {
      if (this.props.currentTeam.budget && this.props.currentTeam.budget.spent >= this.state.amount) {
        this.setState({
          error: "You don't have sufficient budget."
        })
      }
      else {
        let budget = this.props.currentTeam.budget || {};
        budget.total = Number(this.state.amount);
        budget.remaining =  Number(this.props.currentTeam.budget && this.props.currentTeam.budget.spent ? this.state.amount - this.props.currentTeam.budget.spent : this.state.amount);
        budget.spent =  budget.spent || 0;
        console.log(this.state.amount, budget)
        let updateBudgetTeam = this.props.currentTeam;
        updateBudgetTeam.budget = budget;
        this.props.addBudget(updateBudgetTeam);
      }
    }
  }

  render() {

    if (!this.props.user.teams || !this.props.user.teams.includes(this.props.match.params.team)) {
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
                            <Link to={`/dashboard/profile/${user.id}`} className="teamLink">
                              <p><b>Name</b> : {user.Name}</p>
                              <p className="teamDetails"><b>Email</b> : {user.Email}</p>
                            </Link>
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
            <h3><b>Total Budget</b> : {this.props.currentTeam.budget ? this.props.currentTeam.budget.total : 0} Rs</h3>
            <h3><b>Remaining Budget</b> : {this.props.currentTeam.budget ? this.props.currentTeam.budget.remaining : 0} Rs</h3>
            <h3><b>Spent Budget</b> : {this.props.currentTeam.budget ? this.props.currentTeam.budget.spent : 0} Rs</h3>
            <Progress completed={this.props.currentTeam.budget ? this.props.currentTeam.budget.spent / this.props.currentTeam.budget.total * 100 : 0} color={'#5bc0de'} />
            <Button bsStyle="primary" className="userButtons" onClick={this.openBudgetModal}>Edit Budget</Button>
            <h3>Expenditure</h3>
            <hr />
            <Button bsStyle="primary" className="userButtons" onClick={this.openExpModal}>Add Expenditure</Button>
            <table>
              <tr>
                <th>No.</th>
                <th>Title</th>
                <th>Amount (in Rs.)</th>
                <th>Note</th>
              </tr>
              {
                this.props.currentTeam.budget && this.props.currentTeam.budget.exp && _.map(this.props.currentTeam.budget.exp, (element, key) => {
                  return <tr>
                    <td>{key + 1}</td>
                    <td>{element.title}</td>
                    <td>{element.amount}</td>
                    <td>{element.note}</td>
                  </tr>
                })
              }
            </table>
            <Modal show={this.state.expModal} onHide={this.handleExpClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add Expenditure</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input className="login-input" type="text" placeholder="Title" name="title"
                  onChange={(event) => this.changeState(event)}
                  value={this.state.title}
                />
                <input className="login-input" type="number" placeholder="Amount" name="expAmount"
                  onChange={(event) => this.changeState(event)}
                  value={this.state.expAmount}
                />
                <input className="login-input" type="text" placeholder="Note" name="note"
                  onChange={(event) => this.changeState(event)}
                  value={this.state.note}
                />
                <p class="errorMsg">{this.state.error}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleExpClose}>Close</Button>
                <Button bsStyle="primary" onClick={this.addExp}>Add</Button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.budgetModal} onHide={this.handleBudgetClose}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Budget</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input className="login-input" type="number" placeholder="Amount" name="amount"
                  onChange={(event) => this.changeState(event)}
                  value={this.state.amount}
                />
                <p class="errorMsg">{this.state.error}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleBudgetClose}>Close</Button>
                <Button bsStyle="primary" onClick={this.editBudgetAmount}>Edit</Button>
              </Modal.Footer>
            </Modal>
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
  addTeamMember,
  addBudget
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Team)
