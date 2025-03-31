import { View, StyleSheet, ScrollView, Text, Pressable } from "react-native";
import { useFonts } from 'expo-font';

export default function Index() {
  useFonts({
    'LinLibertine': require('../assets/fonts/LinLibertine_R.ttf'),
    'linLibertineBold': require('../assets/fonts/LinLibertine_RB.ttf'),
  });

  return (
    <View style={styles.container}>
      <ScrollView style={styles.welcomeContainer}>
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>Bienvenue sur Wikipedys</Text>
          <Text style={styles.welcomeSubtitle}>L'encyclopédie libre adaptée pour la dyslexie</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>À propos de Wikipedys</Text>
            <Text style={styles.infoText}>
              Wikipedys est une version adaptée de Wikipédia, spécialement conçue pour les personnes atteintes de dyslexie. 
              Notre mission est de rendre le savoir accessible à tous, en utilisant des polices et des formats de texte 
              optimisés pour la lecture.
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Fonctionnalités principales</Text>
            <Text style={styles.featureItem}>• Police de caractères adaptée à la dyslexie</Text>
            <Text style={styles.featureItem}>• Mise en page optimisée pour la lecture</Text>
            <Text style={styles.featureItem}>• Contenu de Wikipédia en français</Text>
            <Text style={styles.featureItem}>• Interface simple et intuitive</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  welcomeContainer: {
    flex: 1,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  wikiLogo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'LinLibertine',
  },
  welcomeContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: '#666666',
    marginBottom: 24,
    textAlign: 'center',
  },
  searchContainer: {
    width: '100%',
    marginBottom: 32,
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333333',
  },
  featuresContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
  },
});
