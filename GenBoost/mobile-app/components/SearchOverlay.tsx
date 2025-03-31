import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  Text,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';

interface SearchOverlayProps {
  onClose: () => void;
}

interface SearchResult {
  title: string;
  snippet: string;
}

export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*&srlimit=10`
      );
      const data = await response.json();
      setResults(data.query.search);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultPress = (title: string) => {
    router.push({
      pathname: '/article/[title]',
      params: { title }
    });
    onClose();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={() => handleSearch(searchQuery)} style={styles.searchButton}>
            <Entypo name="magnifying-glass" size={24} color="#a2a9b1" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher sur Wikipédys..."
            placeholderTextColor="#a2a9b1"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
        </View>
        
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Entypo name="cross" size={24} color="#54595d" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#54595d" style={styles.loader} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.resultItem}
              onPress={() => handleResultPress(item.title)}
            >
              <Text style={styles.resultTitle}>{item.title}</Text>
              <Text style={styles.resultSnippet} numberOfLines={2}>
                {item.snippet.replace(/<\/?[^>]+(>|$)/g, '')}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.resultsList}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eaecf0',
    backgroundColor: '#eaecf0',
    height: 55
  },
  closeButton: {
    padding: 5,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderColor: '#a2a9b1',
    borderWidth: 1.5,
    borderRadius: 2,
    color: '#a2a9b1',
  },
  searchInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    paddingLeft: 40,
  },
  searchButton: {
    padding: 5,
    position: 'absolute',
    left: 3,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsList: {
    padding: 15,
  },
  resultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eaecf0',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultSnippet: {
    fontSize: 14,
    color: '#666',
  },
}); 