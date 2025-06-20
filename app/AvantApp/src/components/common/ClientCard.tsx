import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Client } from '../../types/api';

interface ClientCardProps {
    client: Client;
    onPress?: () => void;
    missingLetter?: string;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onPress, missingLetter }) => {
    const { colors } = useTheme();

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };

    const formatPhone = (phone: string) => {
        if (!phone) return 'N/A';
        // Aplica a máscara de telefone se não estiver formatada
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
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.surface }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {missingLetter && (
                <View style={[styles.missingLetterBadge, {
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary + '40'
                }]}>
                    <Text style={[styles.missingLetterText, { color: colors.primary }]}>
                        {missingLetter}
                    </Text>
                </View>
            )}

            <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.avatarText, { color: colors.text.primary }]}>
                        {client.name?.charAt(0).toUpperCase() || '?'}
                    </Text>
                </View>
                <View style={styles.info}>
                    <Text style={[styles.name, { color: colors.text.primary }]}>
                        {client.name}
                    </Text>
                    <Text style={[styles.email, { color: colors.text.secondary }]}>
                        {client.email}
                    </Text>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                        Phone:
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                        {formatPhone(client.phone || '')}
                    </Text>
                </View>

                <View style={styles.detailItem}>
                    <Text style={[styles.detailLabel, { color: colors.text.secondary }]}>
                        Birth Date:
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text.primary }]}>
                        {formatDate(client.birthDate || '')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    email: {
        fontSize: 14,
    },
    details: {
        gap: 8,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        flex: 1,
        textAlign: 'right',
    },
    missingLetterBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    missingLetterText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
}); 