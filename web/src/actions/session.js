import { reset } from 'redux-form';
import api from '../api';
import { fetchCameras } from './cameras';

function setCurrentUser(dispatch, response) {
  localStorage.setItem('token', JSON.stringify(response.access));
  localStorage.setItem('user', JSON.stringify(response.user));
  dispatch({ type: 'AUTHENTICATION_SUCCESS', response});
  dispatch(fetchCameras(response.user));
}

export function authenticate() {
  return (dispatch) => {
    dispatch({ type: 'AUTHENTICATION_REQUEST' });
    return api.post('/auth/token/refresh/')
      .then((response) => {
        setCurrentUser(dispatch, response);
      })
      .catch(() => {
        localStorage.removeItem('token');
        window.location = '/login';
      });
  };
}

export const unauthenticate = () => ({ type: 'AUTHENTICATION_FAILURE' });

export function login(data, router) {
  return dispatch => api.post('/auth/token/obtain/', data)
    .then((response) => {
      setCurrentUser(dispatch, response);
      dispatch(reset('login'));
      router.transitionTo('/');
    });
}

export function signup(data, router) {
  return dispatch => api.post('/users/register/', data)
    .then((response) => {
      setCurrentUser(dispatch, response);
      dispatch(reset('signup'));
      router.transitionTo('/');
    });
}

export function logout(router) {
  return dispatch => {
      localStorage.removeItem('token');
      dispatch({ type: 'LOGOUT' });
      router.transitionTo('/login');
    }
}
