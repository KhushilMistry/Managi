import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Tab, Tabs, Button, Modal } from 'react-bootstrap'
import { Link, Redirect } from 'react-router-dom'
import Board from 'react-trello'
import moment from 'moment'
import ReactGantt, { GanttRow } from 'react-gantt'
import './team.scss'
import { fetchTeam, addTeamMember, addBudget } from '../../actions'
import Progress from 'react-progressbar'
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
      deleteLaneModal: false,
      leftBound: {
        hour: null,
        date: null,
        month: null,
        year: null
      },
      rightBound: {
        hour: null,
        date: null,
        month: null,
        year: null
      },
      leftBoundModal: false,
      rightBoundModal: false,
      ganttTaskModal: false,
      gantTaskTitle: '',
      state1: {
        hour: null,
        date: null,
        month: null,
        year: null
      },
      state2: {
        hour: null,
        date: null,
        month: null,
        year: null
      },
      state3: {
        hour: null,
        date: null,
        month: null,
        year: null
      },
      deleteTaskModal: false,
      deleteTaskName: ''
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

  changeBoundState = (event) => {
    if (Number(event.target.value) > 0) {
      let newState = this.state
      if (event.target.name.includes('rightBound')) {
        let val = event.target.name.split('.')
        newState['rightBound'][val[1]] = Number(event.target.value)
        this.setState(newState)
      }
      if (event.target.name.includes('leftBound')) {
        let val = event.target.name.split('.')
        newState['leftBound'][val[1]] = Number(event.target.value)
        this.setState(newState)
      }
    }
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

  changeLeftBound = () => {
    if (this.state.leftBound.hour > 0 && this.state.leftBound.hour < 24 &&
      this.state.leftBound.date > 0 && this.state.leftBound.hour <= 31 &&
      this.state.leftBound.month > 0 && this.state.leftBound.month <= 12 &&
      this.state.leftBound.year > 0) {
      let currentTeam = this.props.currentTeam
      currentTeam.gantt = currentTeam.gantt || {}
      currentTeam.gantt.leftBound = this.state.leftBound
      this.props.addBudget(currentTeam)
    }
    else {
      this.setState({
        error: 'Fill details correctly.'
      })
    }
  }

  boundModalClose = () => {
    this.setState({
      leftBoundModal: false,
      rightBoundModal: false,
      error: '',
      leftBound: {
        hour: null,
        month: null,
        year: null,
        date: null
      },
      rightBound: {
        hour: null,
        month: null,
        year: null,
        date: null
      }
    })
  }

  changeRightBound = () => {
    if (this.state.rightBound.hour > 0 && this.state.rightBound.hour <= 24 &&
      this.state.rightBound.date > 0 && this.state.rightBound.date <= 31 &&
      this.state.rightBound.month > 0 && this.state.rightBound.month <= 12 &&
      this.state.rightBound.year > 0) {
      let currentTeam = this.props.currentTeam
      currentTeam.gantt = currentTeam.gantt || {}
      currentTeam.gantt.rightBound = this.state.rightBound
      this.props.addBudget(currentTeam)
    }
    else {
      this.setState({
        error: 'Fill details correctly.'
      })
    }
  }

  ganttTaskModalClose = () => {
    this.setState({
      ganttTaskModal: false,
      gantTaskTitle: '',
      error: '',
      state1: {
        hour: null,
        date: null,
        month: null,
        year: null
      },
      state2: {
        hour: null,
        date: null,
        month: null,
        year: null
      },
      state3: {
        hour: null,
        date: null,
        month: null,
        year: null
      }
    })
  }

  addGanttTask = () => {
    if (this.state.state1.hour > 0 && this.state.state1.hour <= 24 &&
      this.state.state1.date > 0 && this.state.state1.date <= 31 &&
      this.state.state1.month > 0 && this.state.state1.month <= 12 &&
      this.state.state1.year > 0 &&
      this.state.state2.hour > 0 && this.state.state2.hour <= 24 &&
      this.state.state2.date > 0 && this.state.state2.date <= 31 &&
      this.state.state2.month > 0 && this.state.state2.month <= 12 &&
      this.state.state2.year > 0 &&
      this.state.state3.hour > 0 && this.state.state3.hour <= 24 &&
      this.state.state3.date > 0 && this.state.state3.date <= 31 &&
      this.state.state3.month > 0 && this.state.state3.month <= 12 &&
      this.state.state3.year > 0 && this.state.gantTaskTitle !== '') {
      let currentTeam = this.props.currentTeam
      currentTeam.gantt = currentTeam.gantt || {}
      currentTeam.gantt.tasks = currentTeam.gantt.tasks || []
      let element = {
        title: this.state.gantTaskTitle,
        steps: [
          { hour: this.state.state1.hour, date: this.state.state1.date, month: this.state.state1.month, year: this.state.state1.year },
          { hour: this.state.state2.hour, date: this.state.state2.date, month: this.state.state2.month, year: this.state.state2.year },
          { hour: this.state.state3.hour, date: this.state.state3.date, month: this.state.state3.month, year: this.state.state3.year }
        ]
      }
      currentTeam.gantt.tasks.push(element)
      this.props.addBudget(currentTeam)
    }
    else {
      this.setState({
        error: 'Fill details correctly.'
      })
    }
  }

  changeTaskState = (state, event) => {
    if (Number(event.target.value) > 0) {
      let newState = this.state
      newState[state][event.target.name] = Number(event.target.value)
      this.setState(newState)
    }
  }

  deleteTask = () => {
    if (!this.props.currentTeam.gantt && !this.props.currentTeam.gantt.tasks && this.state.deleteTaskName !== '') {
      this.setState({
        error: 'Fill all the details or No Task exists.'
      })
    }
    else {
      let currentTeam = this.props.currentTeam
      let newTasks = _.filter(currentTeam.gantt.tasks, element => {
        return element.title !== this.state.deleteTaskName
      })
      if (newTasks.length === currentTeam.gantt.tasks.length) {
        this.setState({
          error: 'No such Task exists.'
        })
      }
      else {
        currentTeam.gantt.tasks = newTasks
        this.props.addBudget(currentTeam)
      }
    }
  }

  deleteTaskClose = () => {
    this.setState({
      error: '',
      deleteTaskModal: false
    })
  }


  render() {

    let dummyData = {
      lanes: []
    };

    const taskContainer = {
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
    }

    const bound = {
      hour: 0,
      month: 0,
      year: 0,
      date: 0
    }

    const leftBound = this.props.currentTeam.gantt && this.props.currentTeam.gantt.leftBound ? this.props.currentTeam.gantt.leftBound : bound;
    const rightBound = this.props.currentTeam.gantt && this.props.currentTeam.gantt.rightBound ? this.props.currentTeam.gantt.rightBound : bound;

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
          <Tab className="tabName" eventKey={3} title="Gantt chart">
            <Button bsStyle="primary" className="laneButton" onClick={() => {
              this.setState({
                leftBoundModal: true
              })
            }}>Change Left Bound</Button>
            <Button bsStyle="primary" className="laneButton" onClick={() => {
              this.setState({
                rightBoundModal: true
              })
            }}>Change Right Bound</Button>
            <Button bsStyle="primary" className="laneButton" onClick={() => {
              this.setState({
                ganttTaskModal: true
              })
            }}>Add Task</Button>
            <Button bsStyle="danger" className="laneButton" onClick={() => {
              this.setState({
                deleteTaskModal: true
              })
            }}>Delete TasK</Button>
            <ReactGantt
              style={{
                marginTop: '10px'
              }}
              templates={taskContainer}
              leftBound={moment().set({ hour: leftBound.hour, date: leftBound.date, month: leftBound.month, year: leftBound.year }).toDate()}
              rightBound={moment().set({ hour: rightBound.hour, date: rightBound.date, month: rightBound.month, year: rightBound.year }).toDate()}
            >
              {this.props.currentTeam.gantt &&
                _.map(this.props.currentTeam.gantt.tasks || [], element => {
                  return <GanttRow
                    title={element.title}
                    templateName="myTasks"
                    steps={[
                      moment().set({ hour: element.steps[0].hour, date: element.steps[0].date, month: element.steps[0].month, year: element.steps[0].year }).toDate(),
                      moment().set({ hour: element.steps[1].hour, date: element.steps[1].date, month: element.steps[1].month, year: element.steps[1].year }).toDate(),
                      moment().set({ hour: element.steps[2].hour, date: element.steps[2].date, month: element.steps[2].month, year: element.steps[2].year }).toDate()
                    ]}
                  />
                })
              }
            </ReactGantt>
            <Modal show={this.state.leftBoundModal} onHide={this.boundModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Change Left Bound</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input className="login-input" type="number" placeholder="Hour" name="leftBound.hour"
                  onChange={(event) => this.changeBoundState(event)}
                  value={this.state.leftBound.hour}
                />
                <input className="login-input" type="number" placeholder="Date" name="leftBound.date"
                  onChange={(event) => this.changeBoundState(event)}
                  value={this.state.leftBound.date}
                />
                <input className="login-input" type="number" placeholder="Month" name="leftBound.month"
                  onChange={(event) => this.changeBoundState(event)}
                  value={this.state.rightBound.month}
                />
                <input className="login-input" type="number" placeholder="Year" name="leftBound.year"
                  onChange={(event) => this.changeBoundState(event)}
                  value={this.state.leftBound.year}
                />
                <p className="errorMsg">{this.state.error}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.boundModalClose}>Close</Button>
                <Button bsStyle="primary" onClick={this.changeLeftBound}>Change</Button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.rightBoundModal} onHide={this.boundModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Change Right Bound</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input className="login-input" type="number" placeholder="Hour" name="rightBound.hour"
                  onChange={(event) => this.changeBoundState(event)}
                  value={this.state.rightBound.hour}
                />
                <input className="login-input" type="number" placeholder="Date" name="rightBound.date"
                  onChange={(event) => this.changeBoundState(event)}
                  value={this.state.rightBound.date}
                />
                <input className="login-input" type="number" placeholder="Month" name="rightBound.month"
                  onChange={(event) => this.changeBoundState(event)}
                  value={this.state.rightBound.month}
                />
                <input className="login-input" type="number" placeholder="Year" name="rightBound.year"
                  onChange={(event) => this.changeBoundState(event)}
                  value={this.state.rightBound.year}
                />
                <p className="errorMsg">{this.state.error}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.boundModalClose}>Close</Button>
                <Button bsStyle="primary" onClick={this.changeRightBound}>Change</Button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.ganttTaskModal} onHide={this.ganttTaskModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>Add Gantt Task</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input className="login-input" type="text" placeholder="Title" name="gantTaskTitle"
                  onChange={(event) => this.changeState(event)}
                  value={this.state.gantTaskTitle}
                />
                <p>Starting of Phase 1</p>
                <input className="login-input" type="number" placeholder="Hour" name="hour"
                  onChange={(event) => this.changeTaskState('state1', event)}
                  value={this.state.state1.hour}
                />
                <input className="login-input" type="number" placeholder="Date" name="date"
                  onChange={(event) => this.changeTaskState('state1', event)}
                  value={this.state.state1.date}
                />
                <input className="login-input" type="number" placeholder="Month" name="month"
                  onChange={(event) => this.changeTaskState('state1', event)}
                  value={this.state.state1.month}
                />
                <input className="login-input" type="number" placeholder="Year" name="year"
                  onChange={(event) => this.changeTaskState('state1', event)}
                  value={this.state.state1.year}
                />
                <p>Starting of Phase 2</p>
                <input className="login-input" type="number" placeholder="Hour" name="hour"
                  onChange={(event) => this.changeTaskState('state2', event)}
                  value={this.state.state2.hour}
                />
                <input className="login-input" type="number" placeholder="Date" name="date"
                  onChange={(event) => this.changeTaskState('state2', event)}
                  value={this.state.state2.date}
                />
                <input className="login-input" type="number" placeholder="Month" name="month"
                  onChange={(event) => this.changeTaskState('state2', event)}
                  value={this.state.state2.month}
                />
                <input className="login-input" type="number" placeholder="Year" name="year"
                  onChange={(event) => this.changeTaskState('state2', event)}
                  value={this.state.state2.year}
                />
                <p>Ending of Task</p>
                <input className="login-input" type="number" placeholder="Hour" name="hour"
                  onChange={(event) => this.changeTaskState('state3', event)}
                  value={this.state.state3.hour}
                />
                <input className="login-input" type="number" placeholder="Date" name="date"
                  onChange={(event) => this.changeTaskState('state3', event)}
                  value={this.state.state3.date}
                />
                <input className="login-input" type="text" placeholder="Month" name="month"
                  onChange={(event) => this.changeTaskState('state3', event)}
                  value={this.state.state3.month}
                />
                <input className="login-input" type="number" placeholder="Year" name="year"
                  onChange={(event) => this.changeTaskState('state3', event)}
                  value={this.state.state3.year}
                />
                <p className="errorMsg">{this.state.error}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.ganttTaskModalClose}>Close</Button>
                <Button bsStyle="primary" onClick={this.addGanttTask}>Add</Button>
              </Modal.Footer>
            </Modal>
            <Modal show={this.state.deleteTaskModal} onHide={this.deleteTaskClose}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Tasks</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <input className="login-input" type="text" placeholder="Task Name" name="deleteTaskName"
                  onChange={(event) => this.changeState(event)}
                  value={this.state.deleteTaskName}
                />
                <p className="errorMsg">{this.state.error}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.deleteTaskClose}>Close</Button>
                <Button bsStyle="danger" onClick={this.deleteTask}>Delete</Button>
              </Modal.Footer>
            </Modal>
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
