import { api } from "./axios";

export const getReviewsAPI = async () => {
  try {
    const response = await api.get('/room/getRooms');
    return response.data;
  } catch (error) {
    console.error('Reviews fetch error:', error);
    throw error;
  }
};
