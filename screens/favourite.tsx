import React, {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SwipeListView} from 'react-native-swipe-list-view';
import {ContactDetails} from '../sqlite/models/ContactDetails';
import {
  createTable,
  getAllContacts,
  getAllFavouriteContacts,
  getDBConnection,
  removeFavourite,
} from '../sqlite/dbManger';
import {useIsFocused} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Favourite = (props: {navigation: any}) => {
  const [useFavouriteContact, setFavouriteContact] = useState<ContactDetails[]>(
    [],
  );
  const isFocused = useIsFocused();

  const createDatabase = useCallback(async () => {
    try {
      const db = await getDBConnection();
      await createTable(db);
      const storedContactDetails = await getAllFavouriteContacts(db);

      if (storedContactDetails.length) {
        setFavouriteContact(storedContactDetails);
      }
    } catch (error) {
      throw error;
    }
  }, []);

  useEffect(() => {
    createDatabase();
  }, [isFocused]);

  const removeFav = async (id: number) => {
    try {
      const db = await getDBConnection();
      await removeFavourite(db, id);
      createDatabase();
    } catch (error) {
      throw error;
    }
  };

  return (
    <View style={{flex: 1, padding: 6}}>
      <View style={styles.favContainer}>
        <Text style={{fontSize: 22, fontWeight: 500}}>My Favourite</Text>
      </View>
      <SwipeListView
        data={useFavouriteContact}
        renderItem={({item}) => (
          <View style={styles.listContainer}>
            <View style={styles.imageContainer}>
              <Image source={{uri: item.image}} style={styles.imageStyle} />
            </View>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 24, fontWeight: 500, textAlign: 'left'}}>
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
              onPress={() => removeFav(item.id)}
              style={styles.swipeDelete}>
              <Icon name="delete" size={30} color="white" />
            </TouchableOpacity>
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={-75}
        disableRightSwipe
      />
    </View>
  );
};

export default Favourite;

const styles = StyleSheet.create({
  favContainer: {
    justifyContent: 'center',
    padding: 10,
    height: 60,
    marginBottom: 8,
    marginTop: 6,
    backgroundColor: 'white',
    borderRadius: 10,
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
  swipeDelete: {
    flex: 1,
    paddingRight: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
