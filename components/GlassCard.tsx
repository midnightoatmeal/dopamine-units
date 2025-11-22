import React from 'react';
import { ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Box } from '@gluestack-ui/themed';

interface GlassCardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
    children,
    style,
    intensity = 20,
}) => {
    return (
        <Box
            style={[styles.container, style]}
            overflow="hidden" // Needed for BlurView to respect borderRadius
        >
            <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
            <Box
                style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Very subtle overlay
                    flex: 1,
                    padding: 16,
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        backgroundColor: 'transparent',
    },
});
