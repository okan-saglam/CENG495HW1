import api from './api';

export const getReviewsByItem = async (itemId) => {
  const response = await api.get(`/reviews/item/${itemId}`);
  return response.data;
};

export const getUserReviewForItem = async (itemId) => {
  try {
    const response = await api.get(`/reviews/user/item/${itemId}`);
    return response.data;
  } catch (error) {
    // Return null if no review exists
    if (error.response && error.response.status === 404) {
      return null;
    }
    throw error;
  }
};

export const addOrUpdateReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const getUserReviews = async () => {
  const response = await api.get('/reviews/user');
  return response.data;
};

export default {
  getReviewsByItem,
  getUserReviewForItem,
  addOrUpdateReview,
  getUserReviews
};