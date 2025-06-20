import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Client } from '../../types/api';

interface ClientModalProps {
    visible: boolean;
    client: Client | null;
    onClose: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({
    visible,
    client,
    onClose,
}) => {
    const { colors } = useTheme();

    if (!client) return null;

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatPhone = (phone: string) => {
        if (!phone) return 'N/A';
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length <= 2) {
            return numbers;
        } else if (numbers.length <= 7) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
        } else {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        }
    };

    const calculateAge = (birthDate: string) => {
        if (!birthDate) return 'N/A';
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return `${age} years old`;
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                    <View style={styles.header}>
                        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                            <Text style={[styles.avatarText, { color: colors.text.primary }]}>
                                {client.name?.charAt(0).toUpperCase() || '?'}
                            </Text>
                        </View>
                        <View style={styles.headerInfo}>
                            <Text style={[styles.clientName, { color: colors.text.primary }]}>
                                {client.name}
                            </Text>
                            <Text style={[styles.clientEmail, { color: colors.text.secondary }]}>
                                {client.email}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.closeButton, { backgroundColor: colors.border }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.closeButtonText, { color: colors.text.primary }]}>
                                ✕
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.infoSection}>
                            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                                Contact Information
                            </Text>

                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                                    Phone:
                                </Text>
                                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                                    {formatPhone(client.phone || '')}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                                    Email:
                                </Text>
                                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                                    {client.email}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                                Personal Information
                            </Text>

                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                                    Birth Date:
                                </Text>
                                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                                    {formatDate(client.birthDate || '')}
                                </Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={[styles.infoLabel, { color: colors.text.secondary }]}>
                                    Age:
                                </Text>
                                <Text style={[styles.infoValue, { color: colors.text.primary }]}>
                                    {calculateAge(client.birthDate || '')}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.footerButton, { backgroundColor: colors.primary }]}
                            onPress={onClose}
                        >
                            <Text style={[styles.footerButtonText, { color: colors.text.primary }]}>
                                Close
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        borderRadius: 16,
        overflow: 'hidden',
        height: '52%',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerInfo: {
        flex: 1,
    },
    clientName: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 2,
    },
    clientEmail: {
        fontSize: 14,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    infoSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    infoLabel: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    infoValue: {
        fontSize: 14,
        flex: 2,
        textAlign: 'right',
    },
    footer: {
        padding: 20,
    },
    footerButton: {
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    footerButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
}); 