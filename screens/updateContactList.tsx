import React from 'react';
import { Text } from 'react-native';
import ContactForm from '../components/ContactForm';

const UpdateContactList = (props: {navigation: any, route: any})=> {

    return <ContactForm navigation={props.navigation} route ={props.route} />

}

export default UpdateContactList