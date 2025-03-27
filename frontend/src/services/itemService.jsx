import api from './api';

export const getItems = async () => {
  const response = await api.get('/items');
  return response.data;
};

export const getItemById = async (id) => {
  const response = await api.get(`/items/${id}`);
  return response.data;
};

export const getItemsByCategory = async (category) => {
  const response = await api.get(`/items/category/${category}`);
  return response.data;
};

export default {
  getItems,
  getItemById,
  getItemsByCategory
};