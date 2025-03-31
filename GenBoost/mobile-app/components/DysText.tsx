import { Text, TextStyle, StyleProp, StyleSheet, TouchableOpacity } from "react-native";
import * as Speech from 'expo-speech';
import { useSound } from '@/contexts/SoundContext';

export const DysText = ({ children, style, numberOfLines }: { children?: React.ReactNode, style?: StyleProp<TextStyle>, numberOfLines?: number }) => {
	let toSpeak = '';
	if (typeof children === 'string') {
		toSpeak = children;
	} else {
		toSpeak = children?.toString() || '';
	}
	const { isSoundEnabled } = useSound();

	const handlePress = () => {
		if (toSpeak && isSoundEnabled) {
			Speech.speak(toSpeak, {
				language: 'fr',
				pitch: 1,
				rate: 0.8,
			});
		}
	};

	return (
		<Text>
			<TouchableOpacity onPress={handlePress}>
				<Text style={[styles.text, style]} numberOfLines={numberOfLines}>{children}</Text>
			</TouchableOpacity>
		</Text>
	);
};

const styles = StyleSheet.create({
	text: {
		lineHeight: 30,
		fontFamily: 'OpenDyslexic-Regular',
		borderRadius: 5
	},
});
