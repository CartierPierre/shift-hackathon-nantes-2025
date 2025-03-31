import { useEffect, useState, useCallback } from "react";

let listToHighlight : ((index: string | null) => void)[] = [];

export default function useHighlighting(myId: string) {
    const [currentHighlightedId, setCurrentHighlightedId] = useState<string | null>(null);

    useEffect(() => {
        listToHighlight.push(setCurrentHighlightedId);
        return () => {
            listToHighlight = listToHighlight.filter(item => item !== setCurrentHighlightedId);
        };
    }, [setCurrentHighlightedId]);

    const pickMe = useCallback(() => {
        listToHighlight.forEach(item => item(myId));
    }, [listToHighlight, myId]);

    return { isHighlighted: currentHighlightedId === myId, pickMe };
}

