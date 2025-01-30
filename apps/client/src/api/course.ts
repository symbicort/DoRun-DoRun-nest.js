import { api } from "./axios";

export const setCourseLevelAPI = async (level: string) => {
  console.log('level??', level)
  console.log('type of lelvle', typeof(level))
  try {
    const response = await api.post(
      '/course',
      { course: level },
      { withCredentials: true }
    );
    console.log('response course', response)
  } catch (error) {
    console.error('Error setting course level:', error);
    throw error;
  }
};