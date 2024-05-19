/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import ContactList from './screens/contactList';
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import UpdateContactList from './screens/updateContactList';
import CreateContactList from './screens/createContactList';
import 'react-native-gesture-handler';
import {createDrawerNavigator} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Favourite from './screens/favourite';
import DrawerContent from './DrawerContent';
import {useCallback, useEffect, useState} from 'react';
import {createTable, getAllContacts, getDBConnection} from './sqlite/dbManger';
import {ContactDetails} from './sqlite/models/ContactDetails';

function StackNav() {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      initialRouteName="Contact List"
      screenOptions={{
        statusBarColor: '#227aeb',
        headerStyle: {
          backgroundColor: '#227aeb',
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="Contact List stack"
        component={ContactList}
        options={{
          headerLeft: () => {
            return (
              <Icon
                name="menu"
                size={30}
                color="white"
                onPress={() => navigation.dispatch(DrawerActions.openDrawer)}
              />
            );
          },
        }}
      />
      <Stack.Screen name="Update List" component={UpdateContactList} />
      <Stack.Screen name="Create Contact List" component={CreateContactList} />
      <Stack.Screen name="Favourite Contacts" component={Favourite} />
    </Stack.Navigator>
  );
}

function App() {
  const Drawer = createDrawerNavigator();
  return (
    <NavigationContainer>
      <Drawer.Navigator
        screenOptions={{headerShown: false}}
        drawerContent={props => <DrawerContent {...props} />}>
        <Drawer.Screen name="Contact List" component={StackNav} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
