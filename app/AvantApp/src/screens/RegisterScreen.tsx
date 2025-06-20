import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Image,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import api from '../services/api';

export const RegisterScreen: React.FC = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateForm = () => {
        let isValid = true;

        // Validar nome
        if (!name.trim()) {
            setNameError('Name is required');
            isValid = false;
        } else {
            setNameError('');
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            setEmailError('E-mail invalid');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Validar senha
        if (password.length < 4) {
            setPasswordError('The password must be at least 4 characters');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleRegister = async () => {
        try {
            if (!validateForm()) {
                return;
            }
            setLoading(true);

            const response = await api.post('/auth/register', {
                name,
                email,
                password
            });

            Alert.alert(
                'Success!',
                'Account created successfully! Login to continue.',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login')
                    }
                ]
            );

        } catch (error: any) {
            let errorMessage = 'Error creating account. Try again.';

            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            Alert.alert('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/AvantAppLogo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                </View>
                <Card style={styles.statsCard}>
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        Register
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                        Create your account on Avant App
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
                        error={emailError}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        error={passwordError}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                    <Button
                        title={loading ? "Registering..." : "Register"}
                        onPress={handleRegister}
                        disabled={loading}
                        style={styles.registerButton}
                    />
                    <Button
                        title="I already have an account"
                        onPress={() => navigation.navigate('Login')}
                        variant="outline"
                        style={styles.loginButton}
                    />
                </Card>
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
    imageContainer: {
        alignItems: 'center',
        marginVertical: 0,
    },
    logo: {
        width: 180,
        height: 180,
        marginBottom: -10,
    },
    header: {
        marginBottom: 0,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        marginBottom: 26,
    },
    statsCard: {
        marginBottom: 16,
        paddingVertical: 30,
    },
    clientsCard: {
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
    },
    cardText: {
        fontSize: 16,
    },
    registerButton: {
        marginTop: 24,
    },
    loginButton: {
        marginTop: 12,
    }
});
