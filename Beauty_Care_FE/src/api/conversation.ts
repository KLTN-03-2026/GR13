import apiFetch from './config';

export async function createConversation(data: { userId: number; expertId: number; topic?: string }) {
  return apiFetch('/api/v1/conversation', { 
    method: 'POST', 
    body: JSON.stringify(data) 
  });
}

export async function getAllConversations() {
  return apiFetch('/api/v1/conversation', { method: 'GET' });
}

export async function getConversationsByUserId(userId: number) {
  return apiFetch(`/api/v1/conversation/user/${userId}`, { method: 'GET' });
}

export async function getConversationsByExpertId(expertId: number) {
  return apiFetch(`/api/v1/conversation/expert/${expertId}`, { method: 'GET' });
}

export async function getConversationById(id: number) {
  return apiFetch(`/api/v1/conversation/${id}`, { method: 'GET' });
}

export default { 
  createConversation, 
  getConversationsByUserId, 
  getConversationsByExpertId, 
  getConversationById 
};
