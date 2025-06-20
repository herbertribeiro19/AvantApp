import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface AuthContextData {
    isAuthenticated: boolean;
    token: string | null;
    user: any | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredToken();
    }, []);

    const loadStoredToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('@AvantApp:token');
            const storedUser = await AsyncStorage.getItem('@AvantApp:user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));

                // Configurar o token no header das requisições
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
        } catch (error) {
            console.error('Erro ao carregar token:', error);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const response = await api.post('/auth/authenticate', {
                email,
                password
            });

            const { token: authToken, user: userData } = response.data;

            // Salvar token e dados do usuário
            await AsyncStorage.setItem('@AvantApp:token', authToken);
            await AsyncStorage.setItem('@AvantApp:user', JSON.stringify(userData));

            // Configurar o token no header das requisições
            api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

            setToken(authToken);
            setUser(userData);
        } catch (error: any) {
            throw new Error(error.response?.data?.error || 'Erro ao fazer login');
        }
    };

    const signOut = async () => {
        try {
            // Remover token e dados do usuário
            await AsyncStorage.removeItem('@AvantApp:token');
            await AsyncStorage.removeItem('@AvantApp:user');

            // Remover token do header das requisições
            delete api.defaults.headers.common['Authorization'];

            setToken(null);
            setUser(null);
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!token,
            token,
            user,
            signIn,
            signOut,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}; 