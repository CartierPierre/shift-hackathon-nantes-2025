import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import { useAssets } from 'expo-asset';
import { Image } from "expo-image";
import useArticle from '@/hooks/useArticle';

export default function Article() {
  const { title } = useLocalSearchParams<{ title: string }>();
  const { article, isLoading } = useArticle(title);

  const [assets] = useAssets([
    require('@/assets/images/icon_1.png'),
  ]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (!article) {
    return (
      <View style={styles.container}>
        <Text>Article non trouvé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <ScrollView style={styles.articleContainer}>
      <Text style={styles.title}>{article.title}</Text>
      <View style={[styles.separator, {marginBottom: 16}]} />
      {article.content.map((paragraph, index) => (
        <WikiParagraph key={index}>{paragraph}</WikiParagraph>
      ))}
    </ScrollView>
    
    <View style={styles.bottomBar}>
        <Link href={`/article/boosted/${title}`} asChild>
            <Image source={assets?.[0]} style={styles.icon} tintColor="#808080" />
        </Link>
      </View>
    </View>
  );
}

function WikiParagraph({children}: {children: React.ReactNode}) {
  if (children?.toString().match(/^={2} /)) {
    const clearTitle = children?.toString().replace(/=*/gi, '');
    return (<>
      <Text style={styles.title2}>
        {clearTitle}
      </Text>
      <View style={styles.separator} />
    </>
    )
  }
  if (children?.toString().match(/^===/)) {
    const clearTitle = children?.toString().replace(/=*/gi, '');
    return (
      <Text style={styles.title3}>
        {clearTitle}
      </Text>
    )
  }
  return (
    <Text style={styles.paragraph}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  articleContainer: {
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontFamily: 'LinLibertine',
    paddingTop: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 16,
  },
  title2: {
    fontSize: 28,
    fontFamily: 'LinLibertine',
  },
  title3: {
    fontSize: 21,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: '#ccc',
    backgroundColor: '#eaecf0',
    padding: 2,
    height: 50,
    paddingHorizontal: 16,
  },
  icon: {
    width: 35,
    height: 35,
  },
}); 