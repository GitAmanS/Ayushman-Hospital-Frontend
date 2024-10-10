import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';
import axios from 'axios';

const authProvider = async (type, params) => {
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    try {
      await axios.post('http://localhost:5000/admin/login', { username, password }, { withCredentials: true });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  }

  if (type === AUTH_LOGOUT) {
    try {
      await axios.post('http://localhost:5000/admin/logout', {}, { withCredentials: true });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  }

  if (type === AUTH_ERROR) {
    const { status } = params;
    if (status === 401 || status === 403) {
      return Promise.reject();
    }
    return Promise.resolve();
  }

  if (type === AUTH_CHECK) {
    try {
      await axios.get('http://localhost:5000/admin/check-session', { withCredentials: true });
      return Promise.resolve();
    } catch (error) {
      return Promise.reject();
    }
  }

  return Promise.resolve();
};

export default authProvider;
