import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: 'black',
    },
    camera: {
      flex: 1,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      borderColor: 'white',
      borderWidth: 2,
      margin: 50,
      borderRadius: 20,
    },
    topRightIcon: {
      position: 'absolute',
      top: 50,
      right: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 20,
      padding: 8,
    },
    resultCard: {
      backgroundColor: '#fff',
      padding: 16,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    foodInfoRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    foodIcon: {
      width: 40,
      height: 40,
      marginRight: 12,
    },
    resultText: {
      fontWeight: 'bold',
      fontSize: 16,
      color: '#222',
    },
    resultSubtext: {
      fontSize: 13,
      color: '#777',
    },
})