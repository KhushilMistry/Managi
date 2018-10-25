import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  display_event
} from '../../actions'
import './signin.scss'
import Loader from '../Loader'

const events = ['Cricket', 'Football', 'Basketball', 'Badminton', 'Carrom', 'Chess', 'Volleyball', 'Lawn Tennis', 'Table Tennis', 'Youth Run', 'Fun Events'];

class SignIn extends Component {

  constructor(props) {
    super(props);

    this.columns = [{
      title: 'Sports',
      dataIndex: 'sports',
      key: 'sports',
    }, {
      title: 'Teams',
      dataIndex: 'teams',
      key: 'teams',
    }, {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    }, {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    }, {
      title: 'Venue',
      dataIndex: 'venue',
      key: 'venue',
    }, {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    }]

    this.state = {
      selectEvent: ''
    };
  }

  componentDidMount = () => {
    this.props.display_event();
  }

  changeEvent = (event) => {
    this.setState({
      selectEvent: event.target.value
    })
  }

  render() {
    return (
      this.props.loading ? <Loader /> :
        <div>
          <h1 className="h1-text-center">Schedule</h1>
          <p className="adminSelect"> Select Event : <select name="event"
            onChange={(event) => this.changeEvent(event)}
            value={this.state.selectEvent}>
            <option value="">All Events</option>
            {
              events.map((value, key) => {
                return <option key={key} value={value}>{value}</option>
              })
            }
          </select>
          </p>
          {this.props.display_event !== '' && <div className="tableContainer">
            <table>
              <tr>
                <th>Sports</th>
                <th>Teams</th>
                <th>Date</th>
                <th>Time</th>
                <th>Venue</th>
                <th>Type</th>
              </tr>
              {
                this.props.events !== '' && this.props.events.map((event, index) => {
                  if (this.state.selectEvent === '' || event.sports.includes(this.state.selectEvent)) {
                    return <tr key={index}>
                      <td>{event.sports}</td>
                      <td>{event.teams}</td>
                      <td>{event.date}</td>
                      <td>{event.time}</td>
                      <td>{event.venue}</td>
                      <td>{event.type}</td>
                    </tr>
                  }
                })
              }
            </table>
          </div>}
        </div>
    );
  }
}
const mapStateToProps = ({ user }) => ({
  loading: user.loading,
  events: user.events
})

const mapDispatchToProps = dispatch => bindActionCreators({
  display_event
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn)
