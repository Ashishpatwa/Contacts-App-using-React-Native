import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import {
  createTable,
  deleteContactDetails,
  getAllContacts,
  getDBConnection,
  insertContactDetails,
} from '../sqlite/dbManger';
import {ContactDetails} from '../sqlite/models/ContactDetails';
import {useIsFocused} from '@react-navigation/native';
import {SwipeListView} from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ContactList = (props: {navigation: any}) => {
  const [useContactDetails, setContactDetails] = useState<ContactDetails[]>([]);
  const isFocused = useIsFocused();
  const [useSearch, setSearch] = useState<ContactDetails[]>([]);

  const createDatabase = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const storedContactDetails = await getAllContacts(db);

      if (storedContactDetails.length) {
        setContactDetails(storedContactDetails);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  useEffect(() => {
    createDatabase();
  }, [isFocused]);

  const deleteContact = async (id: number) => {
    try {
      console.log(id);
      const db = await getDBConnection();
      await deleteContactDetails(db, id);
      createDatabase();
    } catch (error) {
      throw error;
    }
  };

  const searchContacts = (text: string) => {
    createDatabase();
    const searchContact = useContactDetails.filter(item => {
      return item.name.startsWith(text);
    });
    if (text.length > 0) {
      setSearch(searchContact);
    } else {
      setSearch([]);
      createDatabase();
    }
  };

  return (
    <View style={{flex: 1, padding: 6}}>
      <View style={styles.searchContainer}>
        <View style={styles.iconContainer}>
          <Icon
            name="account-search"
            size={32}
            style={{color: 'white', fontWeight: 500}}
          />
        </View>
        <TextInput
          style={styles.searchInput}
          onChangeText={text => searchContacts(text)}
          placeholder="Search"
        />
      </View>
      {useSearch.length ? (
        <SwipeListView
          data={useSearch}
          renderItem={({item}) => (
            <View style={styles.listContainer}>
              <View style={styles.imageContainer}>
                <Image source={{uri: item.image}} style={styles.imageStyle} />
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 24, fontWeight: 500, textAlign: 'left'}}>
                  {item.name}
                </Text>
                <Text style={{fontSize: 22, textAlign: 'left'}}>
                  {item.mobileNo}
                </Text>
              </View>
            </View>
          )}
          renderHiddenItem={({item}) => (
            <View style={styles.swipeContainer}>
              <TouchableOpacity
                style={styles.swipeEdit}
                onPress={() =>
                  props.navigation.navigate('Update List', {
                    id: item.id,
                    name: item.name,
                    mobileNo: item.mobileNo,
                    landlineNo: item.landlineNo,
                    isFavourite: item.isFavourite,
                    image: item.image,
                  })
                }>
                <Icon name="clipboard-edit-outline" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.swipeDelete}
                onPress={() => deleteContact(item.id)}>
                <Icon name="delete" size={30} color="white" />
              </TouchableOpacity>
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      ) : (
        <SwipeListView
          data={useContactDetails}
          renderItem={({item}) => (
            <View style={styles.listContainer}>
              <View style={styles.imageContainer}>
                <Image source={{uri: item.image}} style={styles.imageStyle} />
              </View>
              <View style={{flex: 1}}>
                <Text
                  style={{fontSize: 24, fontWeight: 500, textAlign: 'left'}}>
                  {item.name}
                </Text>
                <Text style={{fontSize: 22, textAlign: 'left'}}>
                  {item.mobileNo}
                </Text>
              </View>
            </View>
          )}
          renderHiddenItem={({item}) => (
            <View style={styles.swipeContainer}>
              <TouchableOpacity
                style={styles.swipeEdit}
                onPress={() =>
                  props.navigation.navigate('Update List', {
                    id: item.id,
                    name: item.name,
                    mobileNo: item.mobileNo,
                    landlineNo: item.landlineNo,
                    isFavourite: item.isFavourite,
                    image: item.image,
                  })
                }>
                <Icon name="clipboard-edit-outline" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.swipeDelete}
                onPress={() => deleteContact(item.id)}>
                <Icon name="delete" size={30} color="white" />
              </TouchableOpacity>
            </View>
          )}
          leftOpenValue={75}
          rightOpenValue={-75}
        />
      )}

      <TouchableOpacity
        style={styles.addButtonContainer}
        onPress={() => props.navigation.navigate('Create Contact List')}>
        <Text style={styles.addButtonStyle}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ContactList;

const styles = StyleSheet.create({
  searchInput: {
    flex: 1,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#e4e4e4',
    padding: 10,
    fontSize: 20,
    color: '#656565',
  },
  iconContainer: {
    backgroundColor: '#227feb',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flexBasis: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 20,
    marginTop: 6,
  },
  addButtonStyle: {
    fontSize: 45,
    height: '100%',
    paddingTop: 3,
    textAlign: 'center',
    color: 'white',
  },
  addButtonContainer: {
    backgroundColor: '#227feb',
    width: 70,
    height: 70,
    position: 'absolute',
    right: 40,
    borderRadius: 50,
    bottom: 80,
  },
  listContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#d0d7e0',
    marginBottom: 5,
  },
  imageContainer: {flexBasis: 110, alignItems: 'center'},
  imageStyle: {width: 55, height: 55, borderRadius: 50},
  swipeContainer: {
    flexDirection: 'row',
    width: 'auto',
    height: '80%',
    marginTop: 5,
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 50,
  },
  swipeEdit: {
    flex: 1,
    paddingLeft: 20,
    backgroundColor: '#227feb',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  swipeDelete: {
    flex: 1,
    paddingRight: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
