//  Get user
export const getUser = (state) => state.Auth.user;

//  Get error

export const getError = (state) => state.Auth.error;

//  Get loading

export const getLoading = (state) => state.Auth.loading;

//  Get Authenticated

export const getAuthenticated = (state) => !!getUser(state);
