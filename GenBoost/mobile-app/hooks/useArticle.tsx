import { api } from "@/infrastructure/Api";
import { useCallback, useEffect } from "react";

import { useState } from "react";

interface Articles {
    [key: string]: Article;
}

interface Article {
    title: string;
    content: string[];
}

let articleDatabase: Articles = {};

export default function useArticle(title: string) {
    const [article, setArticle] = useState<Article | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchArticle = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
              `https://fr.wikipedia.org/w/api.php?action=query&prop=extracts&titles=${encodeURIComponent(title)}&format=json&origin=*&formatversion=2&explaintext=1`
            );
            const data = await response.json();
            const pages = data.query.pages;
            const pageId = Object.keys(pages)[0];
            const articleData = pages[pageId];
            
            articleDatabase[title] = {
              title: articleData.title,
              content: (articleData.extract as string)
                .split('\n')
                .filter((line: string) => line.trim() !== '')
                .slice(0, 3)
            };
            setArticle(articleDatabase[title]);
          } catch (error) {
            console.error('Error fetching article:', error);
          } finally {
            setIsLoading(false);
          }
    }, [title]);

    useEffect(() => {
        if (articleDatabase[title] === undefined) {
            fetchArticle();
        } else {
            setArticle(articleDatabase[title]);
            setIsLoading(false);
        }
    }, [fetchArticle, title]);

    return { article, isLoading };
}
