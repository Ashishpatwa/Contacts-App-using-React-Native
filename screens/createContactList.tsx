import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createTable,
  getDBConnection,
  insertContactDetails,
} from '../sqlite/dbManger';
import ContactForm from '../components/ContactForm';

const CreateContactList = (props: {navigation: any}) => {
  return <ContactForm navigation={props.navigation} />;
};

export default CreateContactList;
