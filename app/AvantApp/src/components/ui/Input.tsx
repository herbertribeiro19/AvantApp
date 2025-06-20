import React from 'react';
import {
    TextInput,
    View,
    Text,
    StyleSheet,
    TextInputProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    mask?: 'phone';
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    style,
    mask,
    onChangeText,
    value,
    ...props
}) => {
    const { colors } = useTheme();

    const applyPhoneMask = (text: string) => {
        // Remove todos os caracteres não numéricos
        const numbers = text.replace(/\D/g, '');

        // Limita a 12 dígitos
        const limitedNumbers = numbers.slice(0, 12);

        // Aplica a máscara (XX) XXXXX-XXXX
        if (limitedNumbers.length <= 2) {
            return limitedNumbers;
        } else if (limitedNumbers.length <= 7) {
            return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
        } else {
            return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
        }
    };

    const handleChangeText = (text: string) => {
        if (mask === 'phone') {
            const maskedText = applyPhoneMask(text);
            onChangeText?.(maskedText);
        } else {
            onChangeText?.(text);
        }
    };

    return (
        <View style={styles.container}>
            {label && (
                <Text style={[styles.label, { color: colors.text.secondary }]}>
                    {label}
                </Text>
            )}
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.surface,
                        borderColor: error ? colors.error : colors.border,
                        color: colors.text.primary,
                    },
                    style,
                ]}
                placeholderTextColor={colors.text.secondary}
                onChangeText={handleChangeText}
                value={value}
                {...props}
            />
            {error && (
                <Text style={[styles.error, { color: colors.error }]}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    error: {
        fontSize: 12,
        marginTop: 4,
    },
});
