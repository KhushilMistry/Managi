import { databaseRef } from '../firebase'
var _ = require('lodash')

export const signIn = (query) => {
  return (dispatch) => {
    dispatch({ type: 'LOADING_START' })
    databaseRef.auth().signInWithEmailAndPassword(query.email, query.password).then((user) => {
      databaseRef.database().ref().child('Users').child(user.user.uid).once('value').then(function (snap) {
        const userValue = snap.val()
        const allTeamRef = databaseRef.database().ref().child('Teams')
        let allTeams = []
        let allUsers = []
        allTeamRef.once('value').then(function (snap) {
          const teamValue = snap.val()
          _.forEach(teamValue, element => {
            allTeams.push(element)
          })
        }).then(() => {
          databaseRef.database().ref().child('Users').once('value').then(function (snap) {
            const allUserValue = snap.val()
            _.forEach(allUserValue, element => {
              allUsers.push(element)
            })
          }).then(() => {
            dispatch({ type: 'ADD_USER', user: userValue, users: allUsers })
            dispatch({ type: 'ADD_TEAM', teams: allTeams })
            dispatch({ type: 'LOADING_END' })
            dispatch({ type: 'ERROR_CLEAR' })
          })
        })
      })
    }).catch(() => {
      dispatch({ type: 'ERROR', error: 'Wrong Password or Email.' })
      dispatch({ type: 'LOADING_END' })
    })
  };
}

export const signUp = (query) => {
  return (dispatch) => {
    dispatch({ type: 'LOADING_START' })
    databaseRef.auth().createUserWithEmailAndPassword(query.email, query.password).then((user) => {
      try {
        const itemsRef = databaseRef.database().ref().child('Users').child(user.user.uid)
        const userData = {
          id: user.user.uid,
          Name: query.name,
          Email: query.email,
          Number: query.number,
          Organization: query.organization
        }
        itemsRef.set(userData)
        itemsRef.once('value').then(function (snap) {
          const userValue = snap.val()
          const allTeamRef = databaseRef.database().ref().child('Teams');
          let allTeams = []
          let allUsers = []
          allTeamRef.once('value').then(function (snap) {
            const teamValue = snap.val()
            _.forEach(teamValue, element => {
              allTeams.push(element)
            })
          }).then(() => {
            databaseRef.database().ref().child('Users').once('value').then(function (snap) {
              const allUserValue = snap.val()
              _.forEach(allUserValue, element => {
                allUsers.push(element)
              })
            }).then(() => {
              dispatch({ type: 'ADD_USER', user: userValue, users: allUsers })
              dispatch({ type: 'ADD_TEAM', teams: allTeams })
              dispatch({ type: 'LOADING_END' })
              dispatch({ type: 'ERROR_CLEAR' })
            })
          })
        })
      }
      catch (e) {
        console.log(e)
      }
    }).catch((error) => {
      dispatch({ type: 'ERROR', error: 'Email Already Exists.' })
      dispatch({ type: 'LOADING_END' })
    });
  }
}

export const logout = () => {
  return (dispatch) => {
    databaseRef.auth().signOut()
    dispatch({ type: 'LOADING_START' })
    dispatch({ type: 'LOG_OUT' })
    dispatch({ type: 'LOADING_END' })
    dispatch({ type: 'ERROR_CLEAR' })
  }
}

export const addTeam = (user, team) => {
  return (dispatch) => {
    dispatch({ type: 'LOADING_START' })
    const itemsRef = databaseRef.database().ref().child('Users').child(user.id)
    itemsRef.set(user)
    const teamRef = databaseRef.database().ref().child('Teams').child(team.name)
    teamRef.set(team)
    const allTeamRef = databaseRef.database().ref().child('Teams')
    let allTeams = []
    let allUsers = []
    allTeamRef.once('value').then(function (snap) {
      const teamValue = snap.val()
      _.forEach(teamValue, element => {
        allTeams.push(element)
      })
    }).then(() => {
      databaseRef.database().ref().child('Users').once('value').then(function (snap) {
        const allUserValue = snap.val()
        _.forEach(allUserValue, element => {
          allUsers.push(element)
        })
      }).then(() => {
        dispatch({ type: 'ADD_USER', user: user, users: allUsers })
        dispatch({ type: 'ADD_TEAM', teams: allTeams })
        dispatch({ type: 'LOADING_END' })
        dispatch({ type: 'ERROR_CLEAR' })
      });
    });
  }
}

export const fetchTeam = (team) => {
  return (dispatch) => {
    dispatch({ type: 'LOADING_START' })
    dispatch({ type: 'ADD_CURRENT_TEAM', team: team })
    dispatch({ type: 'LOADING_END' })
  }
}

export const addTeamMember = (user, currentTeam) => {
  return (dispatch) => {
    dispatch({ type: 'LOADING_START' })
    databaseRef.database().ref().child('Teams').child(currentTeam.name).set(currentTeam)
    databaseRef.database().ref().child('Users').child(user.id).set(user)
    let allTeams = []
    let allUsers = []
    databaseRef.database().ref().child('Teams').once('value').then(function (snap) {
      const allTeamValue = snap.val()
      _.forEach(allTeamValue, element => {
        allTeams.push(element)
      });
    }).then(() => {
      databaseRef.database().ref().child('Users').once('value').then(function (snap) {
        const allUserValue = snap.val()
        _.forEach(allUserValue, element => {
          allUsers.push(element)
        })
      }).then(() => {
        dispatch({ type: 'ADD_USER', user: user, users: allUsers })
        dispatch({ type: 'ADD_CURRENT_TEAM', team: currentTeam })
        dispatch({ type: 'ADD_TEAM', teams: allTeams })
        dispatch({ type: 'LOADING_END' })
      });
    });
  }
}

export const addBudget = (team) => {
  return (dispatch) => {
    dispatch({ type: 'LOADING_START' })
    databaseRef.database().ref().child('Teams').child(team.name).set(team)
    let allTeams = []
    databaseRef.database().ref().child('Teams').once('value').then(function (snap) {
      const allTeamValue = snap.val()
      _.forEach(allTeamValue, element => {
        allTeams.push(element)
      });
    }).then(() => {
      dispatch({ type: 'ADD_CURRENT_TEAM', team: team })
      dispatch({ type: 'ADD_TEAM', teams: allTeams })
      dispatch({ type: 'LOADING_END' })
    });
  }
}