export const authReducer = (initialState, action) => {
  switch (action.type) {
    case 'REQUEST_LOGIN':
      return {
        loading: true
      };

    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        token: action.payload.token,
        loading: false
      };

    case 'LOGOUT':
      return {
        ...initialState,
        user: '',
        token: ''
      };

    case 'LOGIN_ERROR':
      return {
        ...initialState,
        loading: false,
        errorMessage: action.error
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};
