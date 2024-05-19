import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ContactDetails } from './sqlite/models/ContactDetails';

const DrawerContent = (props: { navigation:any}) => {


  const navigateToScreen = (name: string) => {
    props.navigation.navigate(name);
  };

  return (
    <View >
      <TouchableOpacity style={styles.item} onPress={() => navigateToScreen('Contact List')}>
        <Text style={{fontSize: 19}}>Contact List</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.item} onPress={() => navigateToScreen('Favourite Contacts')}>
        <Text style={{fontSize: 19}}>Favourite Contacts</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  
  item: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',

  },
});

export default DrawerContent;
