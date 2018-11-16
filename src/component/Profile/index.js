import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './profile.scss'
var _ = require('lodash');

class Profile extends Component {
  render() {
    return (
      <div>
        <h3>Profile</h3>
        <hr />
        {
          _.map(this.props.users, element => {
            if (element.id === this.props.match.params.profile) {
              return <div>
                <p><b>Name</b> : {element.Name}</p>
                <p><b>Email</b> : {element.Email}</p>
                <p><b>Number</b> : {element.Number}</p>
                <p><b>Organization</b> : {element.Organization}</p>
              </div>
            }
          })
        }
      </div>
    )
  }
}

const mapStateToProps = ({ loginStates }) => ({
  users: loginStates.users
})

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile)
