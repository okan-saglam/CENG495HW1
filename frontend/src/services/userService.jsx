import api from './api';

export const registerUser = async (userData) => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const loginUser = async (username, password) => {
  const response = await api.post('/users/login', { username, password });
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/users/create', userData);
  return response.data;
};

export const removeUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export default {
  registerUser,
  loginUser,
  getAllUsers,
  createUser,
  removeUser
};