import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Modal,
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../../hooks/useTheme';

interface DatePickerProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string;
    title?: string;
    allowFutureDates?: boolean;
    showBorder?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    value,
    onChangeText,
    placeholder = 'Select a date',
    error,
    title = 'Select Date',
    allowFutureDates = false,
    showBorder = true,
}) => {
    const { colors } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [tempDate, setTempDate] = useState(() => {
        if (value) {
            return new Date(value);
        }
        return new Date();
    });

    useEffect(() => {
        if (value) {
            setTempDate(new Date(value));
        } else {
            setTempDate(new Date());
        }
    }, [value]);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setTempDate(selectedDate);
        }
    };

    const handleConfirm = () => {
        // Formatar data de forma simples e direta
        const year = tempDate.getFullYear();
        const month = String(tempDate.getMonth() + 1).padStart(2, '0');
        const day = String(tempDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        onChangeText(formattedDate);
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
        if (value) {
            setTempDate(new Date(value));
        }
    };

    const showDatePicker = () => {
        setShowModal(true);
    };

    const formatDisplayDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.input,
                    {
                        borderColor: error ? colors.error : colors.border,
                        backgroundColor: colors.surface,
                        borderWidth: showBorder ? 1 : 0,
                    },
                    value && showBorder && { borderColor: colors.primary }
                ]}
                onPress={showDatePicker}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.text,
                        {
                            color: value ? colors.text.primary : colors.text.secondary
                        }
                    ]}
                >
                    {value ? formatDisplayDate(value) : placeholder}
                </Text>
            </TouchableOpacity>

            {error && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                    {error}
                </Text>
            )}

            <Modal
                visible={showModal}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCancel}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                            {title}
                        </Text>

                        <DateTimePicker
                            value={tempDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleDateChange}
                            maximumDate={allowFutureDates ? new Date(2050, 11, 31) : new Date()}
                            minimumDate={new Date(1990, 0, 1)}
                            style={styles.datePicker}
                            textColor={colors.text.primary}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={handleCancel}
                            >
                                <Text style={[styles.buttonText, { color: colors.text.secondary }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton, { backgroundColor: colors.primary }]}
                                onPress={handleConfirm}
                            >
                                <Text style={[styles.buttonText, { color: colors.text.primary }]}>
                                    Confirm
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
    },
    errorText: {
        fontSize: 12,
        marginTop: 4,
        marginLeft: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 20,
    },
    datePicker: {
        width: Platform.OS === 'ios' ? 300 : '100%',
        height: Platform.OS === 'ios' ? 200 : 50,
        color: '#eeeef0',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 8,
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#666',
    },
    confirmButton: {
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
}); 