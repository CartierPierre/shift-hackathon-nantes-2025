import { Text, StyleSheet, TouchableOpacity } from "react-native";
import * as Speech from 'expo-speech';
import { useId } from "react";
import { useSound } from '@/contexts/SoundContext';

import useHighlighting from "@/hooks/useHighlighting";
import BoostedDefinition from "@/components/BoostedDefinition";

export default function BoostedRhese({ 
    children, 
}: { 
    children: React.ReactNode, 
    isHighlighted?: boolean,
    onPress?: () => void 
}) {
    const id = useId();
    const { isHighlighted, pickMe } = useHighlighting(id);
    const { isSoundEnabled } = useSound();
    
    const textWithoutLinks = children?.toString().replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
    const handlePress = () => {
        if (isSoundEnabled) {
            Speech.speak(textWithoutLinks || '', {
                language: 'fr',
                pitch: 1,
                rate: 1,
            });
        }
        pickMe();
    };

    const boostedDefinitions = splitText(children?.toString() || '');

    return (
        <Text>
            <TouchableOpacity onPress={handlePress}>
                <Text style={[styles.paragraph, isHighlighted && styles.highlighted]}>
                    {boostedDefinitions.map(({ text, definition }, index) => (
                        <RheseText key={index} text={text} definition={definition} isHighlighted={isHighlighted} />
                    ))}
                </Text>
            </TouchableOpacity>
        </Text>
    )
}

function RheseText({ text, definition }: { text: string, definition: string | null, isHighlighted: boolean }) {
    if (definition) {
        return (
            <BoostedDefinition style={[styles.defined]} definition={definition}>{text}</BoostedDefinition>
        )
    }
    return (
        <Text>{text}</Text>
    )
}

interface BoostedDefinition {
    text: string,
    definition: string | null,
}

function splitText(text: string): BoostedDefinition[] {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: BoostedDefinition[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add plain text before the definition if any
        if (match.index > lastIndex) {
            parts.push({
                text: text.slice(lastIndex, match.index),
                definition: null
            });
        }
        
        // Add the definition
        parts.push({
            text: match[1],
            definition: match[2]
        });
        
        lastIndex = regex.lastIndex;
    }
    
    // Add remaining plain text if any
    if (lastIndex < text.length) {
        parts.push({
            text: text.slice(lastIndex),
            definition: null
        });
    }
    
    return parts;
}

const styles = StyleSheet.create({
    paragraph: {
        fontSize: 22,
        lineHeight: 48,
        letterSpacing: 2,
        padding: 4,
    },
    highlighted: {
        backgroundColor: 'rgba(255, 182, 193, 0.3)', // Soft pink with transparency
        borderRadius: 4,
    },
    defined: {
        textDecorationLine: 'underline',
    }
})