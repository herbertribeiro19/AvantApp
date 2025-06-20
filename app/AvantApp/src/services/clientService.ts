import api from './api';
import { Client, CreateClientRequest } from '../types/api';

export const clientService = {
  async createClient(clientData: CreateClientRequest): Promise<Client> {
    const response = await api.post('/api/clients', clientData);
    return response.data;
  },

  async getClients(searchParams?: { name?: string; email?: string }): Promise<Client[]> {
    let url = '/api/clients';
    
    if (searchParams) {
      const params = new URLSearchParams();
      if (searchParams.name) params.append('name', searchParams.name);
      if (searchParams.email) params.append('email', searchParams.email);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    const response = await api.get(url);
    return response.data;
  },

  async getClient(id: number): Promise<Client> {
    const response = await api.get(`/api/clients/${id}`);
    return response.data;
  },

  async updateClient(id: number, clientData: Partial<CreateClientRequest>): Promise<Client> {
    const response = await api.put(`/api/clients/${id}`, clientData);
    return response.data;
  },

  async deleteClient(id: number): Promise<void> {
    await api.delete(`/api/clients/${id}`);
  },
}; 