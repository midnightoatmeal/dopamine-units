import React, { useEffect } from 'react';
import { TextInput, TextStyle, StyleProp } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    useDerivedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    Easing,
    interpolateColor,
} from 'react-native-reanimated';
import { Heading } from '@gluestack-ui/themed';

// Create an animated TextInput to update text without re-renders
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface TickerProps {
    value: number;
    fontSize?: number;
}

export const Ticker: React.FC<TickerProps> = ({ value, fontSize = 36 }) => {
    const animatedValue = useSharedValue(value);

    useEffect(() => {
        animatedValue.value = withTiming(value, { duration: 500, easing: Easing.out(Easing.quad) });
    }, [value]);

    const animatedProps = useAnimatedProps(() => {
        return {
            text: `${Math.round(animatedValue.value)} DU`,
        } as any;
    });

    // Derived value to check if we are in "danger zone"
    // We use the raw value prop for the logic trigger to be instant, 
    // or we could use animatedValue.value if we want it to kick in as it scrolls down.
    // Let's use the prop 'value' for the state switch to be responsive.
    const isLowBalance = value < 30;

    const colorStyle = useAnimatedStyle(() => {
        // Animate color transition
        const color = withTiming(isLowBalance ? '#ef4444' : '#ffffff', { duration: 300 }); // red-500 vs white

        // Glow effect
        const textShadowColor = isLowBalance ? '#ef4444' : '#4ade80'; // Red or Green glow
        const textShadowRadius = withTiming(isLowBalance ? 20 : 10, { duration: 300 });

        // Pulse effect for opacity when low
        const opacity = isLowBalance
            ? withRepeat(
                withSequence(
                    withTiming(0.5, { duration: 800 }),
                    withTiming(1, { duration: 800 })
                ),
                -1,
                true
            )
            : withTiming(1, { duration: 300 });

        return {
            color,
            opacity,
            textShadowColor,
            textShadowRadius,
            textShadowOffset: { width: 0, height: 0 },
        };
    });

    return (
        <AnimatedTextInput
            underlineColorAndroid="transparent"
            editable={false}
            value={`${value} DU`} // Fallback
            animatedProps={animatedProps}
            style={[
                {
                    fontFamily: 'SpaceMono',
                    fontSize: fontSize,
                    fontWeight: 'bold',
                    textAlign: 'center',
                },
                colorStyle,
            ]}
        />
    );
};
