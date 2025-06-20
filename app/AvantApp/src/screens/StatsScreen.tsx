import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    Dimensions,
    RefreshControl,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { Card } from '../components/ui/Card';
import { salesService } from '../services/salesService';
import { DailyStats, ClientStats, WeeklyStats } from '../types/api';
import Header from '../components/common/Header';

const screenWidth = Dimensions.get('window').width;

export const StatsScreen: React.FC = () => {
    const { colors } = useTheme();
    const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
    const [clientStats, setClientStats] = useState<ClientStats | null>(null);
    const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    };

    const chartData = {
        labels: weeklyStats.length > 0 ? weeklyStats.map(stat => formatDate(stat.date)) : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        datasets: [
            {
                data: weeklyStats.length > 0 ? weeklyStats.map(stat => stat.total) : [0, 0, 0, 0, 0, 0, 0],
                color: (opacity = 1) => `rgba(119, 187, 65, ${opacity})`,
                strokeWidth: 2,
            },
        ],
    };

    const barChartData = {
        labels: weeklyStats.length > 0 ? weeklyStats.map(stat => formatDate(stat.date)) : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
        datasets: [
            {
                data: weeklyStats.length > 0 ? weeklyStats.map(stat => stat.total) : [0, 0, 0, 0, 0, 0, 0],
            },
        ],
    };

    const loadStats = async () => {
        try {
            setLoading(true);

            // Carrega estatísticas semanais
            const weeklyData = await salesService.getWeeklyStats();
            setWeeklyStats(weeklyData);

            // Carrega estatísticas diárias
            const dailyData = await salesService.getDailyStats(selectedDate);
            setDailyStats(dailyData);

            // Carrega estatísticas de clientes
            const clientData = await salesService.getClientStats();
            setClientStats(clientData);
        } catch (error: any) {
            console.error('Erro ao carregar estatísticas:', error);
            let errorMessage = 'Erro ao carregar estatísticas';
            if (error.response?.status === 401) {
                errorMessage = 'Sessão expirada. Faça login novamente.';
            }
            Alert.alert('Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            // Carrega estatísticas semanais
            const weeklyData = await salesService.getWeeklyStats();
            setWeeklyStats(weeklyData);

            // Carrega estatísticas diárias
            const dailyData = await salesService.getDailyStats(selectedDate);
            setDailyStats(dailyData);

            // Carrega estatísticas de clientes
            const clientData = await salesService.getClientStats();
            setClientStats(clientData);
        } catch (error: any) {
            console.error('Erro ao atualizar estatísticas:', error);
            let errorMessage = 'Erro ao atualizar estatísticas';
            if (error.response?.status === 401) {
                errorMessage = 'Sessão expirada. Faça login novamente.';
            }
            Alert.alert('Erro', errorMessage);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, [selectedDate]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <Header />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                        Loading statistics...
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                        titleColor={colors.text.secondary}
                    />
                }>
                <Header />

                <Text style={[styles.title, { color: colors.text.primary }]}>
                    Sales Statistics
                </Text>

                <Card style={styles.chartCard}>
                    <Text style={[styles.chartTitle, { color: colors.text.primary }]}>
                        Daily Sales Trend
                    </Text>
                    <LineChart
                        data={chartData}
                        width={screenWidth - 32}
                        height={220}
                        chartConfig={{
                            backgroundColor: colors.surface,
                            backgroundGradientFrom: colors.surface,
                            backgroundGradientTo: colors.surface,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(119, 187, 65, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(238, 238, 240, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                            propsForDots: {
                                r: '6',
                                strokeWidth: '2',
                                stroke: colors.primary,
                            },
                        }}
                        bezier
                        style={styles.chart}
                    />
                </Card>

                <Card style={styles.chartCard}>
                    <Text style={[styles.chartTitle, { color: colors.text.primary }]}>
                        Daily Sales Volume
                    </Text>
                    <BarChart
                        data={barChartData}
                        width={screenWidth - 40}
                        height={220}
                        yAxisLabel="$"
                        yAxisSuffix=""
                        chartConfig={{
                            backgroundColor: colors.surface,
                            backgroundGradientFrom: colors.surface,
                            backgroundGradientTo: colors.surface,
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(119, 187, 65, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(238, 238, 240, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                        }}
                        style={styles.chart}
                    />
                </Card>

                <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
                    Top Clients
                </Text>

                {clientStats?.highestVolume && (
                    <Card style={styles.statsCard}>
                        <View style={styles.statsHeader}>
                            <MaterialIcons
                                name="bar-chart"
                                size={24}
                                color={colors.primary}
                                style={styles.statsIcon}
                            />
                            <Text style={[styles.statsTitle, { color: colors.text.primary }]}>
                                Highest Volume
                            </Text>
                        </View>
                        <Text style={[styles.clientName, { color: colors.text.primary }]}>
                            {clientStats.highestVolume.client.name}
                        </Text>
                        <Text style={[styles.clientEmail, { color: colors.text.secondary }]}>
                            {clientStats.highestVolume.client.email}
                        </Text>
                        <Text style={[styles.statsValue, { color: colors.primary }]}>
                            {formatCurrency(clientStats.highestVolume.total_volume)}
                        </Text>
                    </Card>
                )}

                {clientStats?.highestAverage && (
                    <Card style={styles.statsCard}>
                        <View style={styles.statsHeader}>
                            <FontAwesome5
                                name="dollar-sign"
                                size={20}
                                color={colors.primary}
                                style={styles.statsIcon}
                            />
                            <Text style={[styles.statsTitle, { color: colors.text.primary }]}>
                                Highest Average
                            </Text>
                        </View>
                        <Text style={[styles.clientName, { color: colors.text.primary }]}>
                            {clientStats.highestAverage.client.name}
                        </Text>
                        <Text style={[styles.clientEmail, { color: colors.text.secondary }]}>
                            {clientStats.highestAverage.client.email}
                        </Text>
                        <Text style={[styles.statsValue, { color: colors.primary }]}>
                            {formatCurrency(clientStats.highestAverage.average_value)}
                        </Text>
                    </Card>
                )}

                {clientStats?.mostFrequent && (
                    <Card style={styles.statsCard}>
                        <View style={styles.statsHeader}>
                            <Ionicons
                                name="repeat"
                                size={22}
                                color={colors.primary}
                                style={styles.statsIcon}
                            />
                            <Text style={[styles.statsTitle, { color: colors.text.primary }]}>
                                Most Frequent
                            </Text>
                        </View>
                        <Text style={[styles.clientName, { color: colors.text.primary }]}>
                            {clientStats.mostFrequent.client.name}
                        </Text>
                        <Text style={[styles.clientEmail, { color: colors.text.secondary }]}>
                            {clientStats.mostFrequent.client.email}
                        </Text>
                        <Text style={[styles.statsValue, { color: colors.primary }]}>
                            {clientStats.mostFrequent.unique_days} days
                        </Text>
                    </Card>
                )}

                {dailyStats && (
                    <Card style={styles.summaryCard}>
                        <Text style={[styles.summaryTitle, { color: colors.text.primary }]}>
                            Today's Summary
                        </Text>
                        <Text style={[styles.summaryValue, { color: colors.primary }]}>
                            {formatCurrency(dailyStats.total)}
                        </Text>
                        <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>
                            Total Sales Today
                        </Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 16,
    },
    chartCard: {
        marginBottom: 16,
        alignItems: 'center',
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    statsCard: {
        marginBottom: 12,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    statsIcon: {
        marginRight: 8,
    },
    statsTitle: {
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    clientName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    clientEmail: {
        fontSize: 14,
        marginBottom: 8,
    },
    statsValue: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    summaryCard: {
        marginTop: 16,
        alignItems: 'center',
        padding: 24,
        marginBottom: 20,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    summaryValue: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    summaryLabel: {
        fontSize: 14,
    },
});