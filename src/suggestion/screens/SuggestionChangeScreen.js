import { connect, useSelector } from 'react-redux';
import React, { useState } from 'react';
import FastImage from 'react-native-fast-image'
import FireAuth from '@react-native-firebase/auth';
import { ActivityIndicator, Alert, Image, StyleSheet } from 'react-native';
import FireStorage from '@react-native-firebase/storage';

import {
  View,
  Text,
  Content,
  Container,
  StackHeader,
  TextInput,
  Touchable,
  ImagePickerButton,
} from '../../common';
import CheckIcon from '../../assets/icons/edit-check-icon.svg';
import * as Colors from '../../config/colors';

import { suggestPost as suggestPostAction } from '../redux/actions';
import useNotificationManger from '../../hooks/useNotificationManger';
import { Notification_Messages, Notification_Types } from '../../util/Strings';

/* =============================================================================
<SuggestionChangeScreen />
============================================================================= */
const SuggestionChangeScreen = ({ route, navigation, suggestPost }) => {
  const { item, postTitle, postId, authorId } = route?.params;
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const disabled = name || description || image;
  const { suggestionAtPost } = useNotificationManger();
  const selector = useSelector((AppState) => AppState);

  const _handleSubmit = async () => {
    if (disabled) {
      setLoading(true);
      console.log("enter -- > " )

      let uploadImgUrl = "";
      if (image?.fileName?.length > 0) {
        const storageRef = FireStorage()
          .ref("post_media")
          .child(image.fileName);
        await storageRef.putFile(image.uri);
        uploadImgUrl = await storageRef.getDownloadURL();
      }
      console.log("enter2 -- > " )

      const payload = {
        type: 'suggestion',
        change: {
          type: 'change',
          from: item,
          to: { name, description, image: uploadImgUrl }
        },
        postId,
        postTitle,
        sender: {
          userId: FireAuth().currentUser.uid,
          username: FireAuth().currentUser.displayName
        },
        authorId,
      };

      await suggestPost(payload, async() => {
        if (authorId != selector?.Auth?.user?.uid) {
          console.log("call sent -- > ")
          await suggestionAtPost({
            actionType: Notification_Types.suggestion,
            reciverId: authorId,
            extraData: { postId: postId },
            payload: payload
          }, Notification_Messages.changeSuggestion);
        }
        Alert.alert(
          'Suggestion Successful',
          'Your suggestion has been send',
          [
            { text: 'OK', onPress: () => navigation.navigate('HomeStack') }
          ],
        );
      });
    };
    setLoading(false);
  };

  return (
    <Container>
      <StackHeader title={`What would you like to${'\n'}suggest?`} />
      <Content>
        <View horizontal style={styles.item}>
          <View style={styles.indexCounter}>
            <Text sm bold primary>{item?.id === 0 ? 1 : item?.id + 1}</Text>
          </View>
          <FastImage style={styles.img} source={{ uri: item?.image }} />
          <Text sm medium>{item?.name}</Text>
          <Text sm light>{item?.description}</Text>
        </View>
        <Text center bold style={styles.dividerTxt}>To</Text>
        <View horizontal style={styles.changeFieldContainer}>
          {image ? (
            <FastImage style={styles.img} source={image} />
          ) : (
            <ImagePickerButton
              btnSize='small'
              onImageSelect={setImage}
            />
          )}
          <TextInput
            value={name}
            inputStyle={styles.input}
            placeholder="Enter name..."
            containerStyle={styles.inputContainer}
            onChange={setName}
          />
          <TextInput
            value={description}
            inputStyle={styles.input}
            placeholder="Enter description..."
            containerStyle={styles.inputContainer}
            onChange={setDescription}
          />
        </View>
        <View horizontal center>
          {loading ? (
            <ActivityIndicator color={Colors.primary} size='small' />
          ) : (
            <Touchable style={styles.actionBtn} onPress={_handleSubmit}>
              <CheckIcon stroke="#6d14c4" />
            </Touchable>
          )}
        </View>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  item: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#999',
    justifyContent: 'space-between',
  },
  img: {
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
  },
  indexCounter: {
    width: 30,
    height: 30,
    borderWidth: 2,
    paddingTop: 2,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerTxt: {
    marginVertical: 20,
  },
  changeFieldContainer: {
    width: '100%',
    borderRadius: 20,
  },
  indexCounter: {
    width: 30,
    height: 30,
    borderWidth: 2,
    paddingTop: 2,
    marginRight: 5,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    marginTop: 0,
    marginHorizontal: 5,
  },
  input: {
    height: 40,
  },
  addBtn: {
    padding: 20,
    marginTop: 20,
  },
  img: {
    width: 66,
    height: 50,
    borderRadius: 55 / 2,
  },
  actionBtn: {
    marginHorizontal: 60,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

const mapDispatchToProps = {
  suggestPost: suggestPostAction,
};

export default connect(null, mapDispatchToProps)(SuggestionChangeScreen);
