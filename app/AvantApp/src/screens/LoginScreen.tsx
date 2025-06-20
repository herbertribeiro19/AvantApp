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
import { useAuth } from '../contexts/AuthContext';

export const LoginScreen: React.FC = () => {
    const { colors } = useTheme();
    const { signIn } = useAuth();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateForm = () => {
        let isValid = true;

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim() || !emailRegex.test(email)) {
            setEmailError('E-mail invalid');
            isValid = false;
        } else {
            setEmailError('');
        }

        return isValid;
    };

    const handleLogin = async () => {
        try {
            if (!validateForm()) {
                return;
            }
            setLoading(true);

            await signIn(email, password);

        } catch (error: any) {
            Alert.alert('Error', error.message || 'Error to sign in. Try again.');
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
                            source={require('../../assets/AvantAppLogo.png')} // Ajuste o caminho conforme sua estrutura
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>
                </View>
                <Card style={styles.statsCard}>
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        Login
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                        Put your credentials to use the Avant App
                    </Text>
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
                        title={loading ? "Signing in..." : "Login"}
                        onPress={handleLogin}
                        disabled={loading}
                        style={styles.loginButton}
                    />
                    <Button
                        title="I don't have an account"
                        onPress={() => navigation.navigate('Register')}
                        variant="outline"
                        style={styles.registerButton}
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
    },
    header: {
        marginBottom: 24,
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
    loginButton: {
        marginTop: 24,
    },
    registerButton: {
        marginTop: 12,
    }
});
