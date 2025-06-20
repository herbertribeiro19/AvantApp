import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'medium',
    style,
    ...props
}) => {
    const { colors } = useTheme();

    const getButtonStyle = () => {
        const baseStyle = [styles.button, styles[size]];

        switch (variant) {
            case 'primary':
                return StyleSheet.flatten([...baseStyle, { backgroundColor: colors.primary }]);
            case 'secondary':
                return StyleSheet.flatten([...baseStyle, { backgroundColor: colors.secondary }]);
            case 'outline':
                return StyleSheet.flatten([
                    ...baseStyle,
                    {
                        backgroundColor: 'transparent',
                        borderWidth: 1,
                        borderColor: colors.primary,
                    },
                ]);
            default:
                return StyleSheet.flatten([...baseStyle, { backgroundColor: colors.primary }]);
        }
    };

    const getTextStyle = () => {
        const baseStyle = [styles.text, styles[`${size}Text` as keyof typeof styles]];

        if (variant === 'outline') {
            return StyleSheet.flatten([...baseStyle, { color: colors.primary }]);
        }

        return StyleSheet.flatten([...baseStyle, { color: colors.text.primary }]);
    };

    return (
        <TouchableOpacity style={[getButtonStyle(), style]} {...props}>
            <Text style={getTextStyle()}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    medium: {
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    large: {
        paddingVertical: 16,
        paddingHorizontal: 32,
    },
    text: {
        fontWeight: '600',
    },
    smallText: {
        fontSize: 14,
    },
    mediumText: {
        fontSize: 16,
    },
    largeText: {
        fontSize: 18,
    },
});
