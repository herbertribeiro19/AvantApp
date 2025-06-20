import api from './api';
import { Sale, CreateSaleRequest, DailyStats, ClientStats, WeeklyStats } from '../types/api';

export const salesService = {
  async createSale(saleData: CreateSaleRequest): Promise<Sale> {
    const response = await api.post('/api/sales', saleData);
    return response.data;
  },

  async getDailyStats(date: string): Promise<DailyStats> {
    const response = await api.get(`/api/sales/daily-stats?date=${date}`);
    return response.data;
  },

  async getWeeklyStats(): Promise<WeeklyStats[]> {
    const response = await api.get('/api/sales/weekly-stats');
    return response.data;
  },

  async getClientStats(): Promise<ClientStats> {
    const response = await api.get('/api/sales/client-stats');
    return response.data;
  },
}; 