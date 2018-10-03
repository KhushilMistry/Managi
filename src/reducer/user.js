const initialState = {
  loading: false,
  events: ''
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'LOADING_END':
      return {
        ...state,
        loading: false
      }

    case 'LOADING_START':
      return {
        ...state,
        loading: true
      }

    case 'ADD_EVENTS':
      return {
        ...state,
        events: action.events
      }

    default:
      return state
  }
}