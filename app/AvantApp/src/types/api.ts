export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
}

export interface Sale {
  id: number;
  client_id: number;
  value: number;
  date: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSaleRequest {
  client_id: number;
  value: number;
  date: string;
  description?: string;
}

export interface DailyStats {
  total: number;
}

export interface WeeklyStats {
  date: string;
  total: number;
}

export interface ClientStats {
  highestVolume: {
    client_id: number;
    total_volume: number;
    client: {
      name: string;
      email: string;
    };
  } | null;
  highestAverage: {
    client_id: number;
    average_value: number;
    client: {
      name: string;
      email: string;
    };
  } | null;
  mostFrequent: {
    client_id: number;
    unique_days: number;
    client: {
      name: string;
      email: string;
    };
  } | null;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
  };
  token: string;
}
