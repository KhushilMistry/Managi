import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Table, Button, Modal } from 'antd'
import Loader from '../Loader'

import {
  add_event,
  display_event,
  delete_event,
  edit_event
} from '../../actions'
import './home.scss'

const renderForm = [{
  title: 'Sports',
  dataIndex: 'sports',
  key: 'sports',
}, {
  title: 'Team 1',
  dataIndex: 'team1',
  key: 'team1',
}, {
  title: 'Team 2',
  dataIndex: 'team2',
  key: 'team2',
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

class Home extends Component {

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
    }, {
      title: '',
      dataIndex: 'key',
      key: 'key',
      render: (text, record) => <div>
        <Button className="tableButton" onClick={() => this.editTable(record.key)} type="primary" ghost>Edit</Button>
        <Button className="tableButton" onClick={() => this.deleteTable(record.key)} type="danger" ghost>Delete</Button>
      </div>
    }]

    this.state = {
      home: true,
      form: false,
      isEdit: false,
      sports: '',
      team1: '',
      team2: '',
      date: '',
      time: '',
      venue: '',
      type: '',
      error: '',
      key: '',
      modal: false
    };
  }

  componentDidMount = () => {
    this.props.display_event();
  }

  updateInputValue = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }


  deleteTable = (key) => {
    this.setState({
      key: key,
      modal: true
    })
  }

  editTable = (key) => {
    this.props.events.forEach((element) => {
      if (key === element.key) {
        let teamArr = element.teams.split(" ")
        this.setState({
          sports: element.sports,
          team1: teamArr[0],
          team2: teamArr[2],
          date: element.date,
          time: element.time,
          venue: element.venue,
          type: element.type,
          home: false,
          key : key,
          form: true,
          isEdit: true
        })
      }
    })
  }

  handleOk = () => {
    this.props.delete_event(this.state.key)
    this.setState({
      key: '',
      modal: false
    })
  }

  handleCancel = () => {
    this.setState({
      key: '',
      modal: false
    })
  }

  setDefault = () => {
    this.setState({
      sports: '',
      team1: '',
      team2: '',
      date: '',
      time: '',
      venue: '',
      type: '',
      error: '',
      key : '',
      home: true,
      form: false,
      isEdit: false
    })
  }

  submit = () => {
    if (this.state.sport === '' ||
      this.state.team1 === '' ||
      this.state.team2 === '' ||
      this.state.date === '' ||
      this.state.time === '' ||
      this.state.venue === '' ||
      this.state.type === ''
    ) {
      this.setState({
        error: 'Fill all the details.'
      })
    }
    else {
      if (this.state.isEdit === true) {
        let event = {
          sports: this.state.sports,
          teams: this.state.team1 + ' vs ' + this.state.team2,
          date: this.state.date,
          time: this.state.time,
          venue: this.state.venue,
          type: this.state.type
        };
        this.props.edit_event(this.state.key, event)
        this.setDefault()
      }
      else {
        let event = {
          sports: this.state.sports,
          teams: this.state.team1 + ' vs ' + this.state.team2,
          date: this.state.date,
          time: this.state.time,
          venue: this.state.venue,
          type: this.state.type
        }
        this.props.add_event(event);
        this.setDefault()
      }
    }
  }

  render() {
    return (
      this.props.loading ? <Loader /> :
        <div>
          <div className="buttonContainer">
            <Button onClick={() => {
              this.setState({
                home: true,
                form: false,
                isEdit: false
              })
            }} className="button">Home</Button>
            <Button onClick={() => {
              this.setState({
                home: false,
                form: true,
                isEdit: false
              })
            }}
              className="button">Form</Button>
          </div>
          {this.state.home &&
            <div className="tableContainer">
              <Table dataSource={this.props.events} columns={this.columns} bordered={true} pagination={false} />
            </div>
          }
          {this.state.form &&
            <div className="formContainer">
              {
                renderForm.map((val) => {
                  return <div key={val.key}>
                    <span className="labelName">{val.title}</span>
                    <input value={this.state[val.key]} id={val.key} onChange={this.updateInputValue} /><br /><br />
                  </div>
                })
              }
              <Button onClick={this.submit} type="primary">Add</Button>
              <p className="error">{this.state.error}</p>
            </div>
          }
          <Modal
            title="Delete Modal"
            visible={this.state.modal}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <p>Are you sure you want to delete this event ?</p>
          </Modal>
        </div>
    )
  }
}
const mapStateToProps = ({ user }) => ({
  loading: user.loading,
  events: user.events
})

const mapDispatchToProps = dispatch => bindActionCreators({
  add_event,
  display_event,
  delete_event,
  edit_event
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
