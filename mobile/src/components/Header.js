import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.headerText}>Welcome to My Mobile App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    padding: 15,
    backgroundColor: 'darkblue',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default Header;
