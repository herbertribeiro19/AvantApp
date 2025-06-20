import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    RefreshControl,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { ClientCard } from '../components/common/ClientCard';
import { ClientModal } from '../components/common/ClientModal';
import { clientService } from '../services/clientService';
import { Client } from '../types/api';
import Header from '../components/common/Header';

export const HomeScreen: React.FC = () => {
    const { colors } = useTheme();
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [searching, setSearching] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const findMissingLetter = (name: string): string => {
        const alphabet = 'abcdefghijklmnopqrstuvwxyz';
        const normalizedName = name.toLowerCase().replace(/[^a-z]/g, '');

        // Encontra a primeira letra do alfabeto que não está presente no nome
        for (let i = 0; i < alphabet.length; i++) {
            if (!normalizedName.includes(alphabet[i])) {
                return alphabet[i].toUpperCase();
            }
        }
        // Se todas as letras estão presentes, retorna '-'
        return '-';
    };

    const loadClients = async (searchParams?: { name?: string; email?: string }) => {
        try {
            setSearching(true);
            const data = await clientService.getClients(searchParams);
            setClients(data);
        } catch (error: any) {
            console.error('Erro ao carregar clientes:', error);
            let errorMessage = 'Erro ao carregar clientes';
            if (error.response?.status === 401) {
                errorMessage = 'Sessão expirada. Faça login novamente.';
            }
            Alert.alert('Erro', errorMessage);
        } finally {
            setLoading(false);
            setSearching(false);
        }
    };

    useEffect(() => {
        loadClients();
    }, []);

    const handleSearch = (text: string) => {
        setSearchText(text);

        if (text.trim()) {
            const searchParams: { name?: string; email?: string } = {};

            if (text.includes('@')) {
                searchParams.email = text;
            } else {
                searchParams.name = text;
            }

            loadClients(searchParams);
        } else {
            loadClients();
        }
    };

    const handleClientPress = (client: Client) => {
        setSelectedClient(client);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedClient(null);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadClients();
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.scrollView}>
                <Header />

                <Text style={[styles.title, { color: colors.text.primary }]}>
                    Clients
                </Text>

                <View>
                    <Input
                        placeholder="Search by name or email..."
                        value={searchText}
                        onChangeText={handleSearch}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>


                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                            Loading clients...
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        style={styles.clientsContainer}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[colors.primary]}
                                tintColor={colors.primary}
                            />
                        }
                    >
                        {searching && (
                            <View style={styles.searchingContainer}>
                                <ActivityIndicator size="small" color={colors.primary} />
                                <Text style={[styles.searchingText, { color: colors.text.secondary }]}>
                                    Searching...
                                </Text>
                            </View>
                        )}

                        {clients.length === 0 ? (
                            <Card style={styles.emptyCard}>
                                <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                                    {searchText ? 'No clients found for your search.' : 'No clients registered yet.'}
                                </Text>
                            </Card>
                        ) : (
                            clients.map((client) => (
                                <ClientCard
                                    key={client.id}
                                    client={client}
                                    missingLetter={findMissingLetter(client.name)}
                                    onPress={() => handleClientPress(client)}
                                />
                            ))
                        )}
                    </ScrollView>
                )}
            </View>

            <ClientModal
                visible={modalVisible}
                client={selectedClient}
                onClose={handleCloseModal}
            />
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 16,
    },
    header: {
        marginBottom: 24,
        marginLeft: 6,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 4,
    },
    titleContainer: {
        alignItems: 'center',
        marginVertical: -10,
    },
    headerTitle1: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 16,
        padding: 8,
        borderRadius: 80,
    },
    headerTitle2: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        padding: 10,
    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: -10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
        marginLeft: 10,
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    searchingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginBottom: 12,
    },
    searchingText: {
        marginLeft: 8,
        fontSize: 14,
    },
    clientsContainer: {
        flex: 1,
    },
    emptyCard: {
        alignItems: 'center',
        padding: 32,
    },
    emptyText: {
        fontSize: 16,
        textAlign: 'center',
    },
}); 