import React, { useState, useMemo } from 'react';
import { Dimensions } from 'react-native';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  ButtonText,
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicatorWrapper,
  ActionsheetDragIndicator,
  ActionsheetItem,
  ActionsheetItemText,
  Heading,
} from '@gluestack-ui/themed';
import { LineChart } from 'react-native-chart-kit';
import { useDopamineStore, Activity } from '../../store/dopamineStore';
import { Ticker } from '../../components/Ticker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '../../components/GlassCard';

const screenWidth = Dimensions.get('window').width;

export default function BankScreen() {
  const { balance, activities, addTransaction, transactions, checkDailyReset } = useDopamineStore();
  const [showActionsheet, setShowActionsheet] = useState(false);
  const [actionType, setActionType] = useState<'EARN' | 'SPEND'>('EARN');

  React.useEffect(() => {
    checkDailyReset();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((a) =>
      actionType === 'EARN' ? a.amount > 0 : a.amount < 0
    );
  }, [activities, actionType]);

  const handlePress = async (type: 'EARN' | 'SPEND') => {
    if (type === 'EARN') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setActionType(type);
    setShowActionsheet(true);
  };

  const handleActivitySelect = (activity: Activity) => {
    addTransaction(activity.name, activity.amount);
    setShowActionsheet(false);
  };

  // Chart Data Logic
  const chartData = {
    labels: ['Now'],
    datasets: [
      {
        data: [balance],
        color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  if (transactions.length > 0) {
    const recent = transactions.slice(0, 6).reverse();
    let tempBal = balance;
    const balances = [];
    balances.push(tempBal);
    for (const t of transactions.slice(0, 5)) {
      tempBal -= t.amount;
      balances.push(tempBal);
    }
    chartData.datasets[0].data = balances.reverse();
    chartData.labels = balances.map(() => '');
  }

  return (
    <LinearGradient
      colors={['#1e1b4b', '#000000']} // Indigo-950 to Black
      style={{ flex: 1 }}
    >
      <Box flex={1} pt="$16" px="$4">
        <VStack space="4xl" flex={1}>
          {/* Header / Balance */}
          <VStack space="xs" alignItems="center" mt="$8">
            <Text color="$coolGray400" size="sm" fontFamily="SpaceMono" letterSpacing={2}>
              CURRENT BALANCE
            </Text>
            <Ticker value={balance} fontSize={64} />
          </VStack>

          {/* Chart */}
          <GlassCard>
            <Box alignItems="center" h={220} justifyContent="center">
              <LineChart
                data={chartData}
                width={screenWidth - 64} // Adjusted for GlassCard padding
                height={220}
                chartConfig={{
                  backgroundColor: 'transparent',
                  backgroundGradientFrom: 'transparent',
                  backgroundGradientTo: 'transparent',
                  backgroundGradientFromOpacity: 0,
                  backgroundGradientToOpacity: 0,
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(74, 222, 128, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '4',
                    strokeWidth: '2',
                    stroke: '#4ade80',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                withDots={true}
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={false}
                withHorizontalLabels={false}
              />
            </Box>
          </GlassCard>

          {/* Actions */}
          <HStack space="md" justifyContent="space-between" mt="auto" mb="$8">
            <Button
              flex={1}
              size="xl"
              variant="solid"
              action="negative"
              onPress={() => handlePress('SPEND')}
              bg="transparent"
              borderWidth={1}
              borderColor="$red500"
              sx={{
                ':active': {
                  bg: '$red500',
                  opacity: 0.8,
                },
              }}
              style={{ borderRadius: 30 }}
            >
              <ButtonText fontWeight="$bold" color="$red500">SPEND</ButtonText>
            </Button>
            <Button
              flex={1}
              size="xl"
              variant="solid"
              action="positive"
              onPress={() => handlePress('EARN')}
              bg="transparent"
              borderWidth={1}
              borderColor="$green500"
              sx={{
                ':active': {
                  bg: '$green500',
                  opacity: 0.8,
                },
              }}
              style={{ borderRadius: 30 }}
            >
              <ButtonText fontWeight="$bold" color="$green500">EARN</ButtonText>
            </Button>
          </HStack>
        </VStack>

        {/* Action Sheet */}
        <Actionsheet
          isOpen={showActionsheet}
          onClose={() => setShowActionsheet(false)}
          zIndex={999}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent bg="$coolGray900" zIndex={999}>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <Heading color="$white" p="$4">
              {actionType === 'EARN' ? 'Good Habits' : 'Bad Habits'}
            </Heading>
            {filteredActivities.map((activity) => (
              <ActionsheetItem
                key={activity.id}
                onPress={() => handleActivitySelect(activity)}
              >
                <ActionsheetItemText color="$white">
                  {activity.emoji} {activity.name}
                </ActionsheetItemText>
                <ActionsheetItemText
                  color={activity.amount > 0 ? '$green400' : '$red400'}
                  fontFamily="SpaceMono"
                >
                  {activity.amount > 0 ? '+' : ''}
                  {activity.amount}
                </ActionsheetItemText>
              </ActionsheetItem>
            ))}
          </ActionsheetContent>
        </Actionsheet>
      </Box>
    </LinearGradient>
  );
}
