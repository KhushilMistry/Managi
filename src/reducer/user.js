const initialState = {
  user: '',
  loading: false,
  error: '',
  teams: [],
  users: [],
  currrentTeam: ''
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

    case 'ADD_USER':
      return {
        ...state,
        user: action.user,
        users: action.users
      }

    case 'LOG_OUT':
      return {
        ...state,
        user: '',
        teams: []
      }

    case 'ERROR':
      return {
        ...state,
        error: action.error
      }

    case 'ERROR_CLEAR':
      return {
        ...state,
        error: ''
      }

    case 'ADD_TEAM':
      return {
        ...state,
        teams: action.teams
      }

    case 'ADD_CURRENT_TEAM':
      return {
        ...state,
        currrentTeam: action.team
      }

    default:
      return state
  }
}