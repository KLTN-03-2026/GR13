import apiFetch, { API } from './config';

export async function createMessage(data: {
  conversation_id: number;
  sender_id: number;
  message_type?: 'text' | 'image' | 'file' | 'sticker';
  content: string;
}) {
  return apiFetch('/api/v1/message', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

export async function getMessagesByConversationId(conversationId: number) {
  return apiFetch(`/api/v1/message/conversation/${conversationId}`, { method: 'GET' });
}

export async function markAsRead(conversationId: number, userId: number) {
  return apiFetch(`/api/v1/message/conversation/${conversationId}/read`, {
    method: 'PUT',
    body: JSON.stringify({ userId }),
  });
}

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('image', file);
  
  // Important: Let Axios handle the Content-Type header to include the boundary
  const response = await API.post('/message/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
}

export default { createMessage, getMessagesByConversationId, uploadFile, markAsRead };
