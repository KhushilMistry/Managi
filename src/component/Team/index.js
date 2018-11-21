import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tab, Tabs, Button, Modal } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import Board from 'react-trello'
import './team.scss'
import { fetchTeam, addTeamMember, addBudget } from '../../actions'
import Progress from 'react-progressbar'
import moment from 'moment'
import ReactGantt, { GanttRow } from 'react-gantt'
var _ = require('lodash')

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
      expAmount: 0,
      cardAddModal: false,
      laneTitle: '',
      deleteLane: '',
      deleteLaneModal: false
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
        budget.remaining = Number(this.props.currentTeam.budget && this.props.currentTeam.budget.spent ? this.state.amount - this.props.currentTeam.budget.spent : this.state.amount);
        budget.spent = budget.spent || 0;
        let updateBudgetTeam = this.props.currentTeam;
        updateBudgetTeam.budget = budget;
        this.props.addBudget(updateBudgetTeam);
      }
    }
  }

  deleteExp = (key, element) => {
    let budget = this.props.currentTeam.budget;
    budget.remaining = Number(budget.remaining) + Number(element.amount)
    budget.spent = Number(budget.spent) - Number(element.amount)
    let newBudgetExp = _.filter(budget.exp, (elem, expKey) => {
      return key !== expKey
    })
    budget.exp = newBudgetExp
    let updateBudgetTeam = this.props.currentTeam;
    updateBudgetTeam.budget = budget;
    this.props.addBudget(updateBudgetTeam);
  }

  onDataChange = (newData) => {
    if (this.props.currentTeam.kanban && !_.isEqual(newData, this.props.currentTeam.kanban)) {
      let currentTeam = this.props.currentTeam;
      currentTeam.kanban = newData
      this.props.addBudget(currentTeam)
    }
    else if (!this.props.currentTeam.kanban) {
      let currentTeam = this.props.currentTeam;
      currentTeam.kanban = newData
      this.props.addBudget(currentTeam)
    }
  }

  handleLaneDragEnd = (laneId, newPosition) => {
    let currentTeam = this.props.currentTeam;
    let currentCanban = currentTeam.kanban;
    let swapElm = currentCanban.lanes[laneId]
    currentCanban.lanes[laneId] = currentCanban.lanes[newPosition]
    currentCanban.lanes[newPosition] = swapElm
    currentTeam.kanban = currentCanban
    this.props.addBudget(currentTeam)
  }

  deleteLane = () => {
    if (this.state.deleteLane === '') {
      this.setState({
        error: 'Please fill all the details.'
      })
    }
    else if (!this.props.currentTeam.kanban || !this.props.currentTeam.kanban.lanes) {
      this.setState({
        error: 'No Lane Exists.'
      })
    }
    else if (this.props.currentTeam.kanban.lanes) {
      let currentTeam = this.props.currentTeam
      let lanes = _.filter(currentTeam.kanban.lanes, (element) => {
        return element.title !== this.state.deleteLane
      })
      if (lanes.length === currentTeam.kanban.lanes.length) {
        this.setState({
          error: 'No such lane exists.'
        })
      }
      else {
        currentTeam.kanban.lanes = lanes;
        this.props.addBudget(currentTeam)
      }
    }
  }

  handleLaneClose = () => {
    this.setState({
      deleteLane: '',
      error: '',
      deleteLaneModal: false
    })
  }

  handleLaneOpen = () => {
    this.setState({
      deleteLaneModal: true
    })
  }


  render() {

    let dummyData = {
      lanes: []
    };

    const board = this.props.currentTeam.kanban ? this.props.currentTeam.kanban : dummyData;

    _.filter(board.lanes, element => {
      if (!element.cards) {
        element.cards = []
      }
      return element
    })
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
                  <p className="errorMsg">{this.state.error}</p>
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
            <Button bsStyle="danger" className="laneButton" onClick={this.handleLaneOpen}>Delete Lane</Button>
            <Board data={board}
              draggable
              editable
              canAddLanes
              onDataChange={(newdata) => {
                this.onDataChange(newdata)
              }}
              handleLaneDragEnd={(laneId, newPosition) => {
                this.handleLaneDragEnd(laneId, newPosition)
              }}
            />
          </Tab>
          <Tab className="tabName ganttChart" eventKey={3} title="Gantt chart">
            <ReactGantt
              templates={{
                myTasks: {
                  title: 'My Tasks',
                  steps: [
                    {
                      name: 'Task Phase One',
                      color: '#337ab7'
                    },
                    {
                      name: 'Task Phase Two',
                      color: '#d9534f'
                    }
                  ]
                }
              }}
              leftBound={moment().set({ hour: 0, date: 30, month: 5, year: 2016 }).toDate()}
              rightBound={moment().set({ hour: 0, date: 29, month: 8, year: 2016 }).toDate()}
            >
              <GanttRow
                title="Task 1"
                templateName="myTasks"
                steps={[
                  moment().set({ hour: 0, date: 1, month: 6, year: 2016 }).toDate(),
                  moment().set({ hour: 0, date: 4, month: 8, year: 2016 }).toDate(),
                  moment().set({ hour: 0, date: 17, month: 8, year: 2016 }).toDate()
                ]}
              />
              <GanttRow
                title="Task 1"
                templateName="myTasks"
                steps={[
                  moment().set({ hour: 0, date: 27, month: 2, year: 2016 }).toDate(),
                  moment().set({ hour: 0, date: 9, month: 7, year: 2016 }).toDate(),
                  moment().set({ hour: 0, date: 22, month: 7, year: 2016 }).toDate()
                ]}
              />
            </ReactGantt>
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
              <tbody>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Amount (in Rs.)</th>
                  <th>Note</th>
                  <th>Delete</th>
                </tr>
                {
                  this.props.currentTeam.budget && this.props.currentTeam.budget.exp && _.map(this.props.currentTeam.budget.exp, (element, key) => {
                    return <tr key={key}>
                      <td>{key + 1}</td>
                      <td>{element.title}</td>
                      <td>{element.amount}</td>
                      <td>{element.note}</td>
                      <td>
                        <Button bsStyle="danger" onClick={() => { this.deleteExp(key, element) }}>Delete</Button>
                      </td>
                    </tr>
                  })
                }
              </tbody>
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
                <p className="errorMsg">{this.state.error}</p>
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
                <p className="errorMsg">{this.state.error}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleBudgetClose}>Close</Button>
                <Button bsStyle="primary" onClick={this.editBudgetAmount}>Edit</Button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.deleteLaneModal} onHide={this.handleLaneClose}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Lane</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input className="login-input" type="text" placeholder="Title" name="deleteLane"
                  onChange={(event) => this.changeState(event)}
                  value={this.state.deleteLane}
                />
                <p className="errorMsg">{this.state.error}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.handleLaneClose}>Close</Button>
                <Button bsStyle="danger" onClick={this.deleteLane}>Delete</Button>
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
