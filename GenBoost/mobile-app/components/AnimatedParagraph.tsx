import { StyleSheet, Text, Animated, ActivityIndicator, View } from "react-native";
import { useEffect, useRef } from "react";

interface AnimatedParagraphProps {
    children: React.ReactNode;
    isAnimating: boolean;
    style?: any;
    isLoading?: boolean;
}

interface AnimatedWordProps {
    word: string;
    color: string;
    duration: number;
    delay: number;
}

const AnimatedWord = ({ word, color, duration, delay }: AnimatedWordProps) => {
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Background color animation
        const animateBackground = () => {
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(animatedValue, {
                    toValue: 1,
                    duration: duration,
                    useNativeDriver: false,
                }),
                Animated.timing(animatedValue, {
                    toValue: 0,
                    duration: duration,
                    useNativeDriver: false,
                }),
            ]).start(() => animateBackground());
        };
        animateBackground();
    }, []);

    const backgroundColor = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['transparent', color],
    });

    return (
        <Animated.Text 
            style={[
                styles.text,
                { 
                    backgroundColor
                }
            ]}
        >
            {word}{' '}
        </Animated.Text>
    );
};

export default function AnimatedParagraph({ 
    children,
}: AnimatedParagraphProps) {
    if (!children) return null;
    
    const splitByWords = children.toString().split(' ');

    const opacityValue = useRef(new Animated.Value(1)).current;
    useEffect(() => {
        // Heartbeat opacity animation
        const animateHeartbeat = () => {
            Animated.sequence([
                // First beat
                Animated.timing(opacityValue, {
                    toValue: 0.2,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityValue, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                // Longer pause before next heartbeat
                Animated.delay(500),
            ]).start(() => animateHeartbeat());
        };
        animateHeartbeat();
    }, []);
    
    // Generate random colors for each word
    const getRandomColor = () => {
        const colors = [
            'rgba(234, 236, 240, 0.8)',  // Light gray with transparency
            'rgba(234, 236, 240, 0.6)',  // Lighter gray with more transparency
            'rgba(234, 236, 240, 0.4)',  // Very light gray with high transparency
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Generate random duration between 1.5 and 3 seconds
    const getRandomDuration = () => {
        return Math.random() * 200 + 500;
    };

    // Generate random delay between 0 and 1 second
    const getRandomDelay = () => {
        return Math.random() * 1000;
    };

    return (
        <View style={styles.wrapper}>
            <Text>
                <Animated.View style={[styles.container, { opacity: opacityValue }]}>
                    {splitByWords.map((word, index) => (
                        <AnimatedWord
                            key={index}
                            word={word}
                            color={getRandomColor()}
                            duration={getRandomDuration()}
                            delay={getRandomDelay()}
                        />
                    ))}
                </Animated.View>
            </Text>
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'relative',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        borderRadius: 6,
        overflow: 'hidden',
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
    },
}); 