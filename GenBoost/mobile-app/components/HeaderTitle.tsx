import { View, Text, StyleSheet } from 'react-native';

interface HeaderTitleProps {
  title: string;
}

export const HeaderTitle = ({ title }: HeaderTitleProps) => {
  return (
    <View style={styles.container}>
      {title.split('').map((letter, index) => (
        <Text
          key={index}
          style={[
            styles.letter,
            index === title.length - 1 && styles.edgeLetter,
            index === 0 && styles.edgeLetter,
          ]}
        >
          {letter}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  letter: {
    fontFamily: 'LinLibertine',
    fontSize: 20,
    color: '#54595d',
  },
  edgeLetter: {
    fontSize: 30, // Slightly larger for the 'S'
  },
}); 