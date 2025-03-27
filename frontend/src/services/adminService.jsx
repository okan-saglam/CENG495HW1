import api from './api';

export const addItem = async (itemData) => {
  const response = await api.post('/items', itemData);
  return response.data;
};

export const removeItem = async (itemId) => {
  const response = await api.delete(`/items/${itemId}`);
  return response.data;
};

export default {
  addItem,
  removeItem
};