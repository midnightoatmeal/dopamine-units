import React from 'react';
import { FlatList } from 'react-native';
import {
    Box,
    Text,
    VStack,
    HStack,
    Heading,
    Input,
    InputField,
} from '@gluestack-ui/themed';
import { useDopamineStore, Activity } from '../../store/dopamineStore';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../../components/GlassCard';

export default function ConfigScreen() {
    const { activities, updateActivity } = useDopamineStore();

    const handleAmountChange = (id: string, text: string) => {
        const amount = parseInt(text, 10);
        if (!isNaN(amount)) {
            updateActivity(id, { amount });
        }
    };

    const renderItem = ({ item }: { item: Activity }) => (
        <Box mb="$3">
            <GlassCard style={{ padding: 12 }}>
                <HStack justifyContent="space-between" alignItems="center">
                    <HStack space="md" alignItems="center">
                        <Text fontSize="$2xl">{item.emoji}</Text>
                        <Text color="$white" fontWeight="$bold" fontSize="$md">
                            {item.name}
                        </Text>
                    </HStack>
                    <Box width={80}>
                        <Input
                            variant="outline"
                            size="sm"
                            borderColor="rgba(255,255,255,0.2)"
                            bg="rgba(0,0,0,0.3)"
                        >
                            <InputField
                                color="$white"
                                keyboardType="numeric"
                                defaultValue={item.amount.toString()}
                                onChangeText={(text) => handleAmountChange(item.id, text)}
                                textAlign="right"
                                fontFamily="SpaceMono"
                            />
                        </Input>
                    </Box>
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
                    Configuration
                </Heading>
                <Text color="$coolGray400" mb="$6">
                    Edit the cost of your habits.
                </Text>
                <FlatList
                    data={activities}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            </Box>
        </LinearGradient>
    );
}
