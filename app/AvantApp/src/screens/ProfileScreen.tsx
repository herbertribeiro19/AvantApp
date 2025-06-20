import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    Image,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const ProfileScreen: React.FC = () => {
    const { colors } = useTheme();
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
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
                    <Text style={[styles.title, { color: colors.text.primary }]}>
                        Profile
                    </Text>
                </View>

                <Card style={styles.profileCard}>
                    <Text style={[styles.profileName, { color: colors.text.primary }]}>
                        {user?.name || 'User'}
                    </Text>
                    <Text style={[styles.profileEmail, { color: colors.text.secondary }]}>
                        {user?.email || 'email@exemplo.com'}
                    </Text>
                </Card>

                <Button
                    title="Sign Out"
                    onPress={handleLogout}
                    variant="outline"
                    style={styles.logoutButton}
                />
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
    header: {
        marginBottom: 24,
        alignItems: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 0,
    },
    logo: {
        width: 120,
        height: 120,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
    },
    profileCard: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 12,
        alignItems: 'center',
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    profileEmail: {
        fontSize: 16,
    },
    logoutButton: {
        marginTop: 24,
    },
}); 