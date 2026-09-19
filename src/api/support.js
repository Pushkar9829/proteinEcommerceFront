import client from './client';

export const contact = (body) => client.post('/support/contact', body);
export const callback = (body) => client.post('/support/callback', body);
export const myTickets = () => client.get('/support/tickets');
export const createTicket = (body) => client.post('/support/tickets', body);
export const getTicket = (id) => client.get(`/support/tickets/${id}`);
export const replyTicket = (id, body) => client.post(`/support/tickets/${id}/reply`, { body });
export const inbox = () => client.get('/notifications/inbox');
export const myReturns = () => client.get('/returns');
export const requestReturn = (body) => client.post('/returns', body);
