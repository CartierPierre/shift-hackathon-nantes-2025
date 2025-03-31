import { StyleSheet } from "react-native";
import { DysText } from "./DysText";

export const Rhese = ({ rhese, color }: { rhese: string, color: number }) => {
  const backgroundColor = color === 0 ? styles.color1 : styles.color2;
  return <DysText style={[backgroundColor]}>{rhese} </DysText>;
};

const styles = StyleSheet.create({
  color1: {
    backgroundColor: 'white',
  },
  color2: {
    backgroundColor: '#f0f0f0',
  },
});

