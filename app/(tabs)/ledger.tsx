import React from 'react';
import { FlatList } from 'react-native';
import { Box, Text, VStack, HStack, Heading } from '@gluestack-ui/themed';
import { useDopamineStore, Transaction } from '../../store/dopamineStore';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../../components/GlassCard';

export default function LedgerScreen() {
    const { transactions } = useDopamineStore();

    const renderItem = ({ item }: { item: Transaction }) => (
        <Box mb="$3">
            <GlassCard style={{ padding: 12 }}>
                <HStack justifyContent="space-between" alignItems="center">
                    <VStack>
                        <Text color="$white" fontWeight="$bold" fontSize="$md">
                            {item.title}
                        </Text>
                        <Text color="$coolGray400" fontSize="$xs">
                            {new Date(item.timestamp).toLocaleString()}
                        </Text>
                    </VStack>
                    <Text
                        color={item.amount > 0 ? '$green400' : '$red400'}
                        fontFamily="SpaceMono"
                        fontSize="$lg"
                        textShadowColor={item.amount > 0 ? '#4ade80' : '#ef4444'}
                        textShadowRadius={5}
                    >
                        {item.amount > 0 ? '+' : ''}
                        {item.amount}
                    </Text>
                </HStack>
            </GlassCard>
        </Box>
    );

    return (
        <LinearGradient
            colors={['#1e1b4b', '#000000']}
            style={{ flex: 1 }}
        >
            <Box flex={1} pt="$16" px="$4">
                <Heading color="$white" mb="$4" size="xl" letterSpacing={1}>
                    The Ledger
                </Heading>
                <FlatList
                    data={transactions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                    ListEmptyComponent={
                        <Box mt="$10" alignItems="center">
                            <GlassCard>
                                <Text color="$coolGray400" textAlign="center">No transactions yet.</Text>
                            </GlassCard>
                        </Box>
                    }
                />
            </Box>
        </LinearGradient>
    );
}
