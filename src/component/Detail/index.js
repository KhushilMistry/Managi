import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap'
import './detail.scss'
import { addTeam } from '../../actions'
var _ = require('lodash');

class Detail extends Component {

  constructor(props) {
    super(props);

    this.state = {
      show: false,
      details: '',
      name: ''
    }
  }

  showModal = () => {
    this.setState({
      show: true
    });
  }

  handleClose = () => {
    this.setState({
      show: false,
      details: '',
      name: '',
      error: ''
    });
  }

  addTeam = () => {
    if (this.state.name !== '' || this.state.details !== '') {
      let team = {
        users: [],
        name: this.state.name,
        details: this.state.details
      };
      let user = this.props.user;
      if (user.teams) {
        user.teams.push(this.state.name);
      }
      else {
        user.teams = [];
        user.teams.push(this.state.name);
      }
      team.users.push(user);
      this.props.addTeam(user, team);
      this.handleClose();
    }
    else {
      this.setState({
        error: 'Fill all the details.'
      });
    }
  }

  changeState = (event) => {
    let newState = this.state;
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  render() {
    return (
      <div>
        <h3>Details</h3>
        <hr />
        <p><span className="bulletText">Name</span> : {this.props.user.Name}</p>
        <p><span className="bulletText">Email</span> : {this.props.user.Email}</p>
        <p><span className="bulletText">Number</span> : {this.props.user.Number}</p>
        <p><span className="bulletText">Organization</span> : {this.props.user.Organization}</p>
        <h3>Teams</h3>
        <hr />
        <Button bsStyle="primary" onClick={this.showModal} className="addTeamButton">Add Team</Button>
        <div>
          {
            this.props.user.teams && this.props.user.teams.lengh !== 0 && _.map(this.props.teams, (team, key) => {
              if (this.props.user.teams.includes(team.name)) {
                return <div className="teamTile" key={key}>
                  <Link to={`/dashboard/${team.name}`} className="teamLink">
                    <p><span className="bulletText">Name</span> : {team.name}</p>
                    <p className="teamDetails"><span className="bulletText">Details</span> : {team.details}</p>
                  </Link>
                </div>
              }
            })
          }
        </div>
        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Team</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input className="login-input" placeholder="Name" name="name"
              onChange={(event) => this.changeState(event)}
              value={this.state.name}
            /><br />
            <input className="login-input" placeholder="Details" name="details"
              onChange={(event) => this.changeState(event)}
              value={this.state.details}
            /><br />
            <p class="errorMsg">{this.state.error}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleClose}>Close</Button>
            <Button bsStyle="primary" onClick={this.addTeam}>Add</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = ({ loginStates }) => ({
  user: loginStates.user,
  loading: loginStates.loading,
  teams: loginStates.teams,
  currrentTeam: loginStates.currrentTeam
})

const mapDispatchToProps = dispatch => bindActionCreators({
  addTeam
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Detail)
