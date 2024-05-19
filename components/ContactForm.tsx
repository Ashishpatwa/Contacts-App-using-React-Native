import React, {useEffect, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  getDBConnection,
  insertContactDetails,
  updateContactDetails,
} from '../sqlite/dbManger';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

const ContactForm = (props: any) => {
  const [useId, setId] = useState(0);
  const [useName, setName] = useState('');
  const [useMobileNo, setMobileNo] = useState('');
  const [useLandlineNo, setLandlineNo] = useState('');
  const [useIsFavourite, setIsFavourite] = useState(false);
  const [useFavouriteImg, setFavouriteImg] = useState('account-star-outline');
  const [imageSource, setImageSource] = useState<string>('');

  const [errName, setErrName] = useState('');
  const [errMobileNo, setErrMobileNo] = useState('');
  const [errLandlineNo, setErrLandlineNo] = useState('');
  const [erruseImage, setErrImage] = useState('');
  const [usevisible, setVisible] = useState(false);

  if (props.route) {
    const {id, name, mobileNo, landlineNo, isFavourite, image} =
      props.route.params;

    useEffect(() => {
      setId(id);
      setName(name);
      setMobileNo(String(mobileNo));
      setLandlineNo(String(landlineNo));
      setIsFavourite(isFavourite);
      setImageSource(image);

      if (isFavourite) {
        setFavouriteImg('account-star');
      } else {
        setFavouriteImg('account-star-outline');
      }
    }, []);
  }

  const changeFavouriteImg = () => {
    if (useFavouriteImg.match('account-star-outline')) {
      setFavouriteImg('account-star');
      setIsFavourite(true);
    } else {
      setFavouriteImg('account-star-outline');
      setIsFavourite(false);
    }
  };

  const openCamera = () => {
    setVisible(false);

    launchCamera({mediaType: 'photo', cameraType: 'front'}, (response: any) => {
      if (response?.didCancel) {
        console.log('User cancelled image picker');
      } else if (response?.errorMessage) {
        console.log('Error ', response.errorMessage);
        Alert.alert('Error while choosing a image.');
      } else if (
        response?.assets &&
        response.assets.length > 0 &&
        response.assets[0].uri
      )
        setImageSource(response.assets[0].uri);
    });
  };

  const openGallery = () => {
    setVisible(false);
    launchImageLibrary(
      {mediaType: 'photo'},
      (response: ImagePickerResponse) => {
        if (response?.didCancel) {
          console.log('User cancelled image picker');
        } else if (response?.errorMessage) {
          console.log('Error ', response.errorMessage);
          Alert.alert('Error while choosing a image.');
        } else if (
          response?.assets &&
          response.assets.length > 0 &&
          response.assets[0].uri
        ) {
          setImageSource(response.assets[0].uri);
        }
      },
    );
  };

  const chooseUploadImage = () => {
    setVisible(true);
  };

  const saveContactDetails = async (operation: string) => {
    let nameError = '';
    let mobileNoError = '';
    let landlineNoError = '';
    let imageError = '';

    {
      !imageSource ? (imageError = 'Please select image') : (imageError = '');
    }

    {
      !useName
        ? (nameError = 'Please enter a name')
        : !isNaN(parseInt(useName))
        ? (nameError = 'Please enter a string')
        : (nameError = '');
    }

    {
      !useMobileNo
        ? (mobileNoError = 'Please fill Mobile No')
        : isNaN(parseInt(useMobileNo))
        ? (mobileNoError = 'Please enter a value')
        : useMobileNo.length < 10 || useMobileNo.length > 10
        ? (mobileNoError = 'Enter a valid number')
        : (mobileNoError = '');
    }

    {
      !useLandlineNo
        ? (landlineNoError = 'Please fill Landline No')
        : isNaN(parseInt(useLandlineNo))
        ? (landlineNoError = 'Please enter a number')
        : useLandlineNo.length < 10 || useLandlineNo.length > 10
        ? (landlineNoError = 'Enter a valid number')
        : (landlineNoError = '');
    }

    setErrName(nameError);
    setErrMobileNo(mobileNoError);
    setErrLandlineNo(landlineNoError);
    setErrImage(imageError);

    if (!nameError && !mobileNoError && !landlineNoError && !imageError) {
      setName('');
      setMobileNo('');
      setLandlineNo('');
      setImageSource('');

      const payload = {
        id: useId,
        name: useName,
        image: imageSource,
        mobileNo: parseInt(useMobileNo),
        landlineNo: parseInt(useLandlineNo),
        isFavourite: useIsFavourite,
      };
      const db = await getDBConnection();

      if (operation.match('create')) {
        await insertContactDetails(db, payload);
        props.navigation.goBack();
      } else {
        await updateContactDetails(db, payload);

        props.navigation.goBack();
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.favouriteContainer}>
        <Text style={styles.favContent}>Adds your Favourites </Text>

        <TouchableOpacity style={{flexBasis: 60}} onPress={changeFavouriteImg}>
          <Icon name={useFavouriteImg} size={32} />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {!imageSource ? (
          <View style={styles.dummyImageContainer}>
            <Image
              source={require('../assets/man.png')}
              style={styles.dummyImageStyle}
            />
          </View>
        ) : (
          <Image source={{uri: imageSource}} style={styles.imageStyle} />
        )}

        <TouchableOpacity
          style={styles.uploadIconStyle}
          onPress={chooseUploadImage}>
          <Icon name="camera-outline" size={32} style={{color: 'gray'}} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={usevisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          Alert.alert('Model has been closed');
          setVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            onPress={openGallery}
            style={styles.openGalleryStyle}>
            <Icon name="folder-image" size={60} color="#f04e4eeb" />
            <Text style={{color: 'black', fontSize: 20}}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={openCamera} style={styles.openCameraStyle}>
            <Icon name="camera" size={60} color="gray" />
            <Text style={{color: 'black', fontSize: 20}}>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 24, fontWeight: 600}}>x</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {erruseImage ? (
        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            color: 'red',
            marginTop: -25,
            marginBottom: 5,
          }}>
          {erruseImage}
        </Text>
      ) : null}

      <View style={styles.row}>
        <Text style={styles.labelStyle}>Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputStyle}
            value={useName}
            onChangeText={text => setName(text)}
            placeholder="Enter a Name"
          />
          {errName ? <Text style={styles.errorMessage}>{errName}</Text> : null}
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.labelStyle}>Mobile No</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputStyle}
            value={useMobileNo}
            onChangeText={text => setMobileNo(text)}
            keyboardType="numeric"
            placeholder="Enter a Mobile No"
          />
          {errMobileNo ? (
            <Text style={styles.errorMessage}>{errMobileNo}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.labelStyle}>Landline No</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputStyle}
            value={useLandlineNo}
            onChangeText={text => setLandlineNo(text)}
            keyboardType="numeric"
            placeholder="Enter a Landline No"
          />
          {errLandlineNo ? (
            <Text style={styles.errorMessage}>{errLandlineNo}</Text>
          ) : null}
        </View>
      </View>
      {!props.route ? (
        <TouchableOpacity
          onPress={() => saveContactDetails('create')}
          style={{
            backgroundColor: '#2f7fe1e8',
            borderRadius: 10,
            marginTop: 40,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '500',
              padding: 9,
              textAlign: 'center',
            }}>
            {' '}
            Save{' '}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => saveContactDetails('update')}
          style={{
            backgroundColor: '#2f7fe1e8',
            borderRadius: 10,
            marginTop: 40,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 20,
              fontWeight: '500',
              padding: 9,
              textAlign: 'center',
            }}>
            {' '}
            Update Contact{' '}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  openCameraStyle: {
    flexBasis: 150,
    paddingTop: 22,
    alignItems: 'center',
  },
  openGalleryStyle: {
    flexBasis: 150,
    alignItems: 'center',
    paddingTop: 22,
  },
  modalContainer: {
    width: '100%',
    height: 150,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'row',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  uploadIconStyle: {
    flexBasis: 60,
    position: 'absolute',
    bottom: 14,
    left: '60%',
  },
  imageStyle: {
    width: 130,
    height: 130,
    borderRadius: 63,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'gray',
  },
  dummyImageStyle: {
    width: 100,
    height: 100,
    position: 'relative',
  },
  dummyImageContainer: {
    borderWidth: 2,
    borderColor: 'gray',
    padding: 13,
    borderRadius: 63,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  favContent: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  favouriteContainer: {
    paddingBottom: 18,
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 35,
    paddingTop: 5,
  },
  container: {
    height: '97%',
    paddingLeft: 14,
    paddingRight: 10,
    paddingTop: 20,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  inputContainer: {
    height: 45,
    flex: 1.2,
  },
  labelStyle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '500',
  },
  inputStyle: {
    fontSize: 18,
    borderColor: 'grey',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  errorMessage: {
    color: 'red',
    fontSize: 17,
    paddingLeft: 0,
    paddingTop: 2,
  },
});

export default ContactForm;
