import { api } from "../axios";

export const conversationAPI = async ({ id }: { id: string }) => {
  try {
    const response = await api.get('/message/getMessagesByRoomid', { params: { roomid: id } });
    return response.data;
  } catch (error) {
    console.error('Conversation fetch error', error);
    throw error;
  }
}
