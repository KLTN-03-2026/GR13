import apiFetch from './config';

export async function createMessage(data: { 
  conversation_id: number; 
  sender_id: number; 
  message_type?: 'text' | 'image'; 
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

export default { createMessage, getMessagesByConversationId };
