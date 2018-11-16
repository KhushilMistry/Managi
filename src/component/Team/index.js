import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { Tab, Tabs } from 'react-bootstrap'
import './team.scss'
import { logout } from '../../actions'

class Team extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.allUsers);
    return (
      <div>
        <h3 className="teamNameHeading">{this.props.match.params.team}</h3>
        <Tabs className="tabName" defaultActiveKey={1}>
          <Tab eventKey={1} title="Details">
            Tab 1 content
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
  currentTeam: loginStates.currrentTeam
})

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Team)
