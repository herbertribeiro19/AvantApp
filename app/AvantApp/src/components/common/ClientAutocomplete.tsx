import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { clientService } from '../../services/clientService';
import { Client } from '../../types/api';

interface ClientAutocompleteProps {
    value: string;
    onChangeText: (text: string) => void;
    onSelectClient: (client: Client) => void;
    placeholder?: string;
    error?: string;
}

export const ClientAutocomplete: React.FC<ClientAutocompleteProps> = ({
    value,
    onChangeText,
    onSelectClient,
    placeholder = 'Search for a client...',
    error,
}) => {
    const { colors } = useTheme();
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setLoading(true);
            const data = await clientService.getClients();
            setClients(data);
        } catch (error) {
            console.error('Erro ao carregar clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTextChange = (text: string) => {
        onChangeText(text);

        if (text.trim()) {
            const filtered = clients.filter(client =>
                client.name.toLowerCase().includes(text.toLowerCase()) ||
                client.email.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredClients(filtered);
            setShowDropdown(true);
        } else {
            setFilteredClients([]);
            setShowDropdown(false);
        }
    };

    const handleSelectClient = (client: Client) => {
        onChangeText(client.name);
        onSelectClient(client);
        setShowDropdown(false);
    };

    const formatPhone = (phone: string) => {
        if (!phone) return '';
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length <= 2) {
            return numbers;
        } else if (numbers.length <= 7) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        } else {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor: error ? colors.error : colors.border,
                        backgroundColor: colors.surface,
                        color: colors.text.primary,
                    },
                ]}
                placeholder={placeholder}
                placeholderTextColor={colors.text.secondary}
                value={value}
                onChangeText={handleTextChange}
                onFocus={() => {
                    if (value.trim()) {
                        setShowDropdown(true);
                    }
                }}
                onBlur={() => {
                    // Delay para permitir toque no dropdown
                    setTimeout(() => setShowDropdown(false), 200);
                }}
            />

            {error && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                    {error}
                </Text>
            )}

            {showDropdown && (
                <View style={[styles.dropdown, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={colors.primary} />
                            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                                Loading clients...
                            </Text>
                        </View>
                    ) : filteredClients.length > 0 ? (
                        <ScrollView style={styles.dropdownScroll} showsVerticalScrollIndicator={false}>
                            {filteredClients.map((client) => (
                                <TouchableOpacity
                                    key={client.id}
                                    style={styles.dropdownItem}
                                    onPress={() => handleSelectClient(client)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.clientInfo}>
                                        <Text style={[styles.clientName, { color: colors.text.primary }]}>
                                            {client.name}
                                        </Text>
                                        <Text style={[styles.clientEmail, { color: colors.text.secondary }]}>
                                            {client.email}
                                        </Text>
                                        {client.phone && (
                                            <Text style={[styles.clientPhone, { color: colors.text.secondary }]}>
                                                {formatPhone(client.phone)}
                                            </Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                                No clients found
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        zIndex: 1000,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    dropdown: {
        position: 'absolute',
        top: 52,
        left: 0,
        right: 0,
        maxHeight: 200,
        borderWidth: 1,
        borderRadius: 8,
        zIndex: 1001,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    dropdownScroll: {
        maxHeight: 200,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    clientInfo: {
        flex: 1,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    clientEmail: {
        fontSize: 14,
        marginBottom: 2,
    },
    clientPhone: {
        fontSize: 12,
    },
    loadingContainer: {
        padding: 16,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 8,
        fontSize: 14,
    },
    emptyContainer: {
        padding: 16,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
    },
}); 