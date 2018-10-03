import { databaseRef } from '../firebase'

export const add_event = (event) => {
  return dispatch => {
    dispatch({
      type: 'LOADING_START'
    })
    databaseRef.push(event).then(() => {
      const arr = []
      databaseRef.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const childData = childSnapshot.val()
          childData.key = childSnapshot.key
          arr.push(childData)
        })
      }).then(() => {
        dispatch({ type: 'ADD_EVENTS', events: arr })
        dispatch({ type: 'LOADING_END' })
      })
    })
  }
}

export const display_event = () => {
  return dispatch => {
    dispatch({
      type: 'LOADING_START'
    })
    const arr = []
    databaseRef.once('value', function (snapshot) {
      snapshot.forEach(function (childSnapshot) {
        const childData = childSnapshot.val()
        childData.key = childSnapshot.key
        arr.push(childData)
      })
    }).then(() => {
      dispatch({ type: 'ADD_EVENTS', events: arr })
      dispatch({ type: 'LOADING_END' })
    })
  }
}

export const delete_event = (event_key) => {
  return dispatch => {
    dispatch({
      type: 'LOADING_START'
    })
    databaseRef.child(event_key).remove().then(() => {
      const arr = []
      databaseRef.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const childData = childSnapshot.val()
          childData.key = childSnapshot.key
          arr.push(childData)
        })
      }).then(() => {
        dispatch({ type: 'ADD_EVENTS', events: arr })
        dispatch({ type: 'LOADING_END' })
      })
    })
  }
}

export const edit_event = (event_key, event) => {
  return dispatch => {
    dispatch({
      type: 'LOADING_START'
    })
    databaseRef.child(event_key).set(event).then(() => {
      const arr = []
      databaseRef.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          const childData = childSnapshot.val()
          childData.key = childSnapshot.key
          arr.push(childData)
        })
      }).then(() => {
        dispatch({ type: 'ADD_EVENTS', events: arr })
        dispatch({ type: 'LOADING_END' })
      })
    })
  }
}