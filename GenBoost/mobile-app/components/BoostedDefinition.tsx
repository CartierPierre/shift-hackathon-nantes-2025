import { StyleProp, Text, TextStyle, View, Pressable, Animated, StyleSheet } from "react-native";
import { useEffect, useRef, useState } from "react";
import * as Speech from 'expo-speech';
import { useSound } from '@/contexts/SoundContext';

export default function BoostedDefinition({ children, style, definition }: { children: React.ReactNode, style?: StyleProp<TextStyle>, definition: string }) {
    const [showTooltip, setShowTooltip] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const { isSoundEnabled } = useSound();

    const handlePress = (event: any) => {
        // Prevent event from propagating to parent elements
        event.stopPropagation();

        setShowTooltip(true);
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
        
        // Speak the definition only if sound is enabled
        if (isSoundEnabled) {
            Speech.speak(definition, {
                language: 'fr',
                pitch: 1,
                rate: 0.9,
            });
        }
    };

    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (showTooltip) {
            timeout = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start(() => setShowTooltip(false));
            }, Math.max(3000, definition.length * 100));
        }
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [showTooltip]);

    return (
        <Pressable onPress={handlePress}>
            <View>
                <Text style={style}>{children}</Text>
                {showTooltip && (
                    <Animated.View 
                        style={[
                            styles.tooltip,
                            {
                                opacity: fadeAnim,
                                transform: [{
                                    translateY: fadeAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [10, 0]
                                    })
                                }]
                            }
                        ]}
                    >
                        <View style={styles.tooltipContent}>
                            <Text style={styles.tooltipText}>{definition}</Text>
                            <View style={styles.tooltipArrow} />
                        </View>
                    </Animated.View>
                )}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    tooltip: {
        position: 'absolute',
        zIndex: 1000,
        bottom: '100%',
        left: 0,
        marginBottom: 4,
        minWidth: 150,
        maxWidth: 600,
    },
    tooltipContent: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        padding: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        alignSelf: 'flex-start',
    },
    tooltipText: {
        color: 'white',
        fontSize: 14,
        lineHeight: 20,
    },
    tooltipArrow: {
        position: 'absolute',
        bottom: -6,
        left: 20,
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: 'rgba(0, 0, 0, 0.85)',
    },
});

