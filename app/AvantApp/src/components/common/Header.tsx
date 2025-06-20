import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../hooks/useTheme';

export default function Header() {
    const { user } = useAuth();
    const { colors } = useTheme();

    const firstLetter = user?.name?.charAt(0).toUpperCase();

    return (
        <View style={styles.header}>
            <View style={styles.headerContainer}>
                <Text style={[styles.headerTitle1, { color: colors.text.primary, borderColor: colors.primary, borderWidth: 0.5 }]}>
                    {firstLetter}
                </Text>
            </View>
            <View style={styles.titleContainer}>
                <Text style={[styles.headerTitle2, { color: colors.text.primary }]}>
                    Hi, {user?.name || 'User'}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
});