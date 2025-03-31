import { View, StyleSheet, Text } from "react-native";
import { useState, useEffect } from "react";
import { api } from "@/infrastructure/Api";

import BoostedRhese from "./BoostedRhese";
import AnimatedParagraph from "./AnimatedParagraph";

export default function BoostedParagraph({ 
  children, 
}: { 
  children: React.ReactNode;
}) {
    const [boostedParagraph, setBoostedParagraph] = useState<Array<string>>([]);
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBoostedParagraph = async () => {
            setIsLoading(true);
            try {
                const boostedParagraph = await api.getBoostedParagraph(children?.toString() ?? "");
                setBoostedParagraph(boostedParagraph);
            } finally {
                setIsLoading(false);
            }
        }
        fetchBoostedParagraph();
    }, [children]);

    const handleRhesePress = (index: number) => {
        setHighlightedIndex(highlightedIndex === index ? null : index);
    };

    if (isLoading) {
        return (
            <AnimatedParagraph isAnimating={true}>
                {children}
            </AnimatedParagraph>
        );
    }

    return (
        <Text>
            <View style={styles.container}>
                {boostedParagraph.map((rhese, index) => (
                    <BoostedRhese 
                        key={index} 
                        isHighlighted={highlightedIndex === index}
                        onPress={() => handleRhesePress(index)}
                    >
                        {rhese}
                    </BoostedRhese>
                ))}
            </View>
        </Text>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
