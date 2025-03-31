import { View, TextInput, FlatList, Text, StyleSheet, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";

interface WikipediaSearchResult {
  title: string;
  snippet: string;
}

interface WikipediaArticle {
  title: string;
  content: string;
}

interface WikipediaSearchProps {
  onArticleSelect: (article: WikipediaArticle) => void;
}

export const WikipediaSearch = ({ onArticleSelect }: WikipediaSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WikipediaSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const searchWikipedia = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=5`
      );
      const data = await response.json();
      setSearchResults(data.query.search);
    } catch (error) {
      console.error("Error searching Wikipedia:", error);
    }
  };

  const fetchArticleContent = async (title: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://fr.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(title)}&format=json&origin=*`
      );
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0];
      const article = pages[pageId];
      
      onArticleSelect({
        title: article.title,
        content: article.extract
      });
    } catch (error) {
      console.error("Error fetching article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  useEffect(() => {
    searchWikipedia(debouncedSearchQuery);
  }, [debouncedSearchQuery]);

  const renderSearchResult = ({ item }: { item: WikipediaSearchResult }) => (
    <Pressable 
      style={styles.searchResult}
      onPress={() => {
        setSearchQuery("");
        setSearchResults([]);
        fetchArticleContent(item.title);
      }}
    >
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.snippet} numberOfLines={2}>
        {item.snippet.replace(/<[^>]*>/g, '')}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un article Wikipedia..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.title}
          style={styles.searchResults}
        />
      )}
      {isLoading && (
        <Text style={styles.loadingText}>Chargement de l'article...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 16,
    margin: 16
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  searchResults: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  searchResult: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  snippet: {
    fontSize: 14,
    color: '#666',
  },
  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
}); 