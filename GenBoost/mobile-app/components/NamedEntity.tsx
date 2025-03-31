import { Text, Pressable, View, StyleSheet, Animated } from "react-native";
import { NamedEntity as NamedEntityType } from "@/domain/Api";
import * as Speech from 'expo-speech';
import { useState, useEffect, useRef } from "react";
import { DysText } from "./DysText";

// Helper function to split text into chunks of max 45 characters
const splitTextIntoChunks = (text: string, maxChunkLength: number = 45): string[] => {
	if (text.length <= maxChunkLength) return [text];
	
	const chunks: string[] = [];
	let currentChunk = '';
	
	const words = text.split(' ');
	for (const word of words) {
		if ((currentChunk + ' ' + word).length > maxChunkLength) {
			if (currentChunk) chunks.push(currentChunk.trim());
			currentChunk = word;
		} else {
			currentChunk += (currentChunk ? ' ' : '') + word;
		}
	}
	
	if (currentChunk) chunks.push(currentChunk.trim());
	return chunks;
};

const SpeakableText = ({ text, children }: { text: string; children: React.ReactNode }) => {
	const [showTooltip, setShowTooltip] = useState(false);
	const fadeAnim = useRef(new Animated.Value(0)).current;

	const handlePress = () => {
		Speech.speak(text, {
			language: 'fr',
			pitch: 1,
			rate: 1,
		});
		setShowTooltip(true);
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 200,
			useNativeDriver: true,
		}).start();
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
			}, 5000);
		}
		return () => {
			if (timeout) clearTimeout(timeout);
		};
	}, [showTooltip]);

	return (
		<Pressable onPress={handlePress}>
			<View>
				{children}
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
							<DysText style={styles.tooltipText} numberOfLines={3}>{text}</DysText>
							<DysText style={styles.tooltipArrow} />
						</View>
					</Animated.View>
				)}
			</View>
		</Pressable>
	);
};

export const NamedEntity = ({ namedEntity }: { namedEntity: NamedEntityType }) => {
	const regex = /\[(.*?)\]\((.*?)\)/g;
	const matches = [];
	let match;
	
	while ((match = regex.exec(namedEntity.text)) !== null) {
		matches.push({
			text: match[0],
			startIndex: match.index,
			endIndex: match.index + match[0].length,
			content: match[1],
			explanation: match[2]
		});
	}

	// Sort matches by startIndex to process them in order
	matches.sort((a, b) => a.startIndex - b.startIndex);

	// Build the text with speakable elements
	let lastIndex = 0;
	const elements = [];

	for (const match of matches) {
		// Add text before the match
		if (match.startIndex > lastIndex) {
			const textBefore = namedEntity.text.slice(lastIndex, match.startIndex);
			const textChunks = splitTextIntoChunks(textBefore);
			textChunks.forEach((chunk, index) => {
				elements.push(
					<DysText key={`text-${lastIndex}-${index}`} style={styles.regularText}>
						{chunk}
					</DysText>
				);
			});
		}

		// Add the matched text with speech
		elements.push(
			<SpeakableText key={`speak-${match.startIndex}`} text={match.explanation}>
				<DysText numberOfLines={1} style={styles.highlightedText}>{match.content}</DysText>
			</SpeakableText>
		);

		lastIndex = match.endIndex;
	}

	// Add remaining text after last match
	if (lastIndex < namedEntity.text.length) {
		const remainingText = namedEntity.text.slice(lastIndex);
		const textChunks = splitTextIntoChunks(remainingText);
		textChunks.forEach((chunk, index) => {
			elements.push(
				<DysText key={`text-${lastIndex}-${index}`} style={styles.regularText}>
					{chunk}
				</DysText>
			);
		});
	}

	return <>{elements}</>;
};

const styles = StyleSheet.create({
	regularText: {
		fontSize: 16,
		lineHeight: 24,
	},
	highlightedText: {
		backgroundColor: '#e6f3ff',
		paddingHorizontal: 4,
		borderRadius: 2,
		fontSize: 16,
		lineHeight: 24,
	},
	tooltip: {
		position: 'absolute',
		zIndex: 1000,
		bottom: '100%',
		left: 0,
		marginBottom: 4,
		minWidth: 150,
		maxWidth: 300,
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
