import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { DatePicker } from '../components/common/DatePicker';
import { ClientAutocomplete } from '../components/common/ClientAutocomplete';
import { clientService } from '../services/clientService';
import { salesService } from '../services/salesService';
import { Client, CreateSaleRequest } from '../types/api';
import Header from '../components/common/Header';

type TabType = 'client' | 'sale';

export const AddScreen: React.FC = () => {
    const { colors } = useTheme();
    const [activeTab, setActiveTab] = useState<TabType>('client');

    // Client form states
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [birthDateError, setBirthDateError] = useState('');
    const [clientLoading, setClientLoading] = useState(false);

    // Sale form states
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [clientSearch, setClientSearch] = useState('');
    const [clientSearchError, setClientSearchError] = useState('');
    const [saleValue, setSaleValue] = useState('');
    const [saleValueError, setSaleValueError] = useState('');
    const [saleDate, setSaleDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // YYYY-MM-DD
    });
    const [saleDateError, setSaleDateError] = useState('');
    const [saleDescription, setSaleDescription] = useState('');
    const [saleLoading, setSaleLoading] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const numbers = phone.replace(/\D/g, '');
        return numbers.length >= 10 && numbers.length <= 12;
    };

    const validateValue = (value: string) => {
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue > 0;
    };

    const clearClientErrors = () => {
        setNameError('');
        setEmailError('');
        setPhoneError('');
        setBirthDateError('');
    };

    const clearSaleErrors = () => {
        setClientSearchError('');
        setSaleValueError('');
        setSaleDateError('');
    };

    const handleCreateClient = async () => {
        clearClientErrors();
        let hasError = false;

        if (!name.trim()) {
            setNameError('Name is required');
            hasError = true;
        }

        if (!email.trim()) {
            setEmailError('Email is required');
            hasError = true;
        } else if (!validateEmail(email)) {
            setEmailError('Email invalid');
            hasError = true;
        }

        if (!phone.trim()) {
            setPhoneError('Phone is required');
            hasError = true;
        } else if (!validatePhone(phone)) {
            setPhoneError('Phone must have 10-12 digits');
            hasError = true;
        }

        if (!birthDate.trim()) {
            setBirthDateError('Birth Date is required');
            hasError = true;
        }

        if (hasError) return;

        setClientLoading(true);

        try {
            const clientData = {
                name: name.trim(),
                email: email.trim(),
                phone: phone.trim().replace(/\D/g, ''),
                birthDate: birthDate,
            };

            const newClient = await clientService.createClient(clientData);

            Alert.alert(
                'Success!',
                'Client created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setName('');
                            setEmail('');
                            setPhone('');
                            setBirthDate('');
                        }
                    }
                ]
            );

            console.log('Client created:', newClient);
        } catch (error: any) {
            console.error('Erro ao criar cliente:', error);

            let errorMessage = 'Erro ao criar cliente';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.status === 401) {
                errorMessage = 'Sessão expirada. Faça login novamente.';
            }

            Alert.alert('Erro', errorMessage);
        } finally {
            setClientLoading(false);
        }
    };

    const handleCreateSale = async () => {
        clearSaleErrors();
        let hasError = false;

        if (!selectedClient) {
            setClientSearchError('Please select a client');
            hasError = true;
        }

        if (!saleValue.trim()) {
            setSaleValueError('Sale value is required');
            hasError = true;
        } else if (!validateValue(saleValue)) {
            setSaleValueError('Please enter a valid value');
            hasError = true;
        }

        if (!saleDate.trim()) {
            setSaleDateError('Sale date is required');
            hasError = true;
        }

        if (hasError) return;

        setSaleLoading(true);

        try {
            const saleData: CreateSaleRequest = {
                client_id: selectedClient!.id,
                value: parseFloat(saleValue),
                date: saleDate + 'T12:00:00-03:00', // Timezone brasileiro (UTC-3)
                description: saleDescription.trim() || undefined,
            };

            const newSale = await salesService.createSale(saleData);

            Alert.alert(
                'Success!',
                'Sale created successfully!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setSelectedClient(null);
                            setClientSearch('');
                            setSaleValue('');
                            setSaleDate(() => {
                                const today = new Date();
                                const year = today.getFullYear();
                                const month = String(today.getMonth() + 1).padStart(2, '0');
                                const day = String(today.getDate()).padStart(2, '0');
                                return `${year}-${month}-${day}`;
                            });
                            setSaleDescription('');
                        }
                    }
                ]
            );

            console.log('Sale created:', newSale);
        } catch (error: any) {
            console.error('Erro ao criar venda:', error);

            let errorMessage = 'Erro ao criar venda';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.status === 401) {
                errorMessage = 'Sessão expirada. Faça login novamente.';
            }

            Alert.alert('Erro', errorMessage);
        } finally {
            setSaleLoading(false);
        }
    };

    const handleSelectClient = (client: Client) => {
        setSelectedClient(client);
        setClientSearchError('');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scrollView}>
                <Header />

                <Text style={[styles.title, { color: colors.text.primary }]}>
                    Add New
                </Text>

                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === 'client' && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => setActiveTab('client')}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === 'client' ? colors.text.primary : colors.text.secondary }
                        ]}>
                            Client
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.tab,
                            activeTab === 'sale' && { backgroundColor: colors.primary }
                        ]}
                        onPress={() => setActiveTab('sale')}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === 'sale' ? colors.text.primary : colors.text.secondary }
                        ]}>
                            Sale
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Client Form */}
                {activeTab === 'client' && (
                    <Card style={styles.formCard}>
                        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                            New Client
                        </Text>

                        <Input
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                            error={nameError}
                            autoCapitalize="none"
                        />

                        <Input
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            error={emailError}
                        />

                        <Input
                            placeholder="Phone"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            error={phoneError}
                            mask="phone"
                        />

                        <DatePicker
                            placeholder="Birth Date"
                            value={birthDate}
                            onChangeText={setBirthDate}
                            error={birthDateError}
                        />

                        <Button
                            title={clientLoading ? "Creating Client..." : "Create Client"}
                            onPress={handleCreateClient}
                            style={styles.submitButton}
                            disabled={clientLoading}
                        />
                    </Card>
                )}

                {/* Sale Form */}
                {activeTab === 'sale' && (
                    <Card style={styles.formCard}>
                        <Text style={[styles.cardTitle, { color: colors.text.primary }]}>
                            New Sale
                        </Text>

                        <ClientAutocomplete
                            value={clientSearch}
                            onChangeText={setClientSearch}
                            onSelectClient={handleSelectClient}
                            placeholder="Search for a client..."
                            error={clientSearchError}
                        />

                        <Input
                            placeholder="Sale Value"
                            value={saleValue}
                            onChangeText={setSaleValue}
                            keyboardType="numeric"
                            error={saleValueError}
                        />

                        <DatePicker
                            placeholder="Sale Date"
                            value={saleDate}
                            onChangeText={setSaleDate}
                            error={saleDateError}
                            title="Select Sale Date"
                            allowFutureDates={true}
                        />

                        <Input
                            placeholder="Description (optional)"
                            value={saleDescription}
                            onChangeText={setSaleDescription}
                            multiline
                            numberOfLines={3}
                            style={styles.descriptionInput}
                            autoCapitalize="none"
                        />

                        <Button
                            title={saleLoading ? "Creating Sale..." : "Create Sale"}
                            onPress={handleCreateSale}
                            style={styles.submitButton}
                            disabled={saleLoading}
                        />
                    </Card>
                )}
            </ScrollView>
        </SafeAreaView>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 4,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 6,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    formCard: {
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    submitButton: {
        marginTop: 16,
    },
    descriptionInput: {
        height: 100,
    },
    inputDate: {
        marginTop: 16,
        borderWidth: 0.5,
        borderColor: '#37383c',
        borderRadius: 10,
        padding: 10,
    },
});
