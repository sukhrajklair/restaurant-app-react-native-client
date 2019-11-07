import * as SecureStore from 'expo-secure-store';
import * as ActionTypes from './actionTypes';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.

const token =(async () => await SecureStore.getItemAsync('token'))();
const user = (async () => await SecureStore.getItemAsync('creds'))();
export const auth = (state = {
        isLoading: false,
        isAuthenticated: token? true : false,
        token: token,
        user: user,
        errMess: null
    }, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_REQUEST:
            return {...state,
                isLoading: true,
                isAuthenticated: false,
                user: action.creds
            };
        case ActionTypes.LOGIN_SUCCESS:
            return {...state,
                isLoading: false,
                isAuthenticated: true,
                errMess: '',
                token: action.token
            };
        case ActionTypes.LOGIN_FAILURE:
            return {...state,
                isLoading: false,
                isAuthenticated: false,
                errMess: action.message
            };
        case ActionTypes.LOGOUT_REQUEST:
            return {...state,
                isLoading: true,
                isAuthenticated: true
            };
        case ActionTypes.LOGOUT_SUCCESS:
            return {...state,
                isLoading: false,
                isAuthenticated: false,
                token: '',
                user: null
            };
        case ActionTypes.RESET_LOGIN:
            return {...state,
                errMess: null
            };
        default:
            return state
    }
}