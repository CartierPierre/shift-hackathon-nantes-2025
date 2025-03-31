import { Stack } from "expo-router";
import { HeaderTitle } from "@/components/HeaderTitle";
import Entypo from '@expo/vector-icons/Entypo';
import { useState } from 'react';
import { View, useWindowDimensions } from 'react-native';
import { SearchOverlay } from "@/components/SearchOverlay";
import { SoundProvider } from '@/contexts/SoundContext';

export default function RootLayout() {
  const title = "WIKIPEDYS";
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const { width } = useWindowDimensions();
  
  return (
    <SoundProvider>
      <View style={{ flex: 1, width: width > 600 ? 600 : '100%', alignSelf: 'center' }}>
        <Stack screenOptions={{
          title: title,
          headerTitle: () => <HeaderTitle title={title} />,
          headerStyle: {
            backgroundColor: '#eaecf0',
            height: 55
          },
          headerTitleStyle: {
            fontFamily: 'LinLibertine',
            fontSize: 30,
          },
          contentStyle: {
            backgroundColor: 'white'
          },
          headerRight: () => (
            <Entypo 
              name="magnifying-glass" 
              size={24} 
              color="#54595d" 
              style={{ marginRight: 15 }}
              onPress={() => setIsSearchVisible(true)}
            />
          )
        }} />
        {isSearchVisible && (
          <SearchOverlay onClose={() => setIsSearchVisible(false)} />
        )}
      </View>
    </SoundProvider>
  );
}
