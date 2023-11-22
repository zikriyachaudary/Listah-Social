import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import FireAuth from "@react-native-firebase/auth";
import FireStorage from "@react-native-firebase/storage";
import { ActivityIndicator, Alert, Image, StyleSheet } from "react-native";

import {
  View,
  Content,
  Container,
  StackHeader,
  TextInput,
  Touchable,
  ImagePickerButton,
} from "../../common";
import CheckIcon from "../../assets/icons/edit-check-icon.svg";
import * as Colors from "../../config/colors";

import { suggestPost as suggestPostAction } from "../redux/actions";
import { Notification_Types } from "../../util/Strings";
import useNotificationManger from "../../hooks/useNotificationManger";

/* =============================================================================
<SuggestionAddScreen />
============================================================================= */
const SuggestionAddScreen = ({ route, navigation, suggestPost }) => {
  const selector = useSelector((AppState) => AppState);

  const { postId, postTitle, authorId } = route?.params;
  const { suggestionAtPost } = useNotificationManger();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const disabled = name || description || image;

  const _handleSubmit = async () => {
    if (disabled) {
      setLoading(true);
      let uploadImgUrl = "";
      if (image?.fileName?.length > 0) {
        const storageRef = FireStorage()
          .ref("post_media")
          .child(image.fileName);
        await storageRef.putFile(image.uri);
        uploadImgUrl = await storageRef.getDownloadURL();
      }

      const payload = {
        type: "suggestion",
        change: {
          type: "add",
          item: {
            name,
            description,
            image: uploadImgUrl,
          },
        },
        postId,
        postTitle,
        sender: FireAuth().currentUser.uid,
        authorId,
      };
      await suggestPost(payload, async () => {
        if (authorId != selector?.Auth?.user?.uid) {
          await suggestionAtPost({
            actionType: Notification_Types.suggestion,
            reciverId: authorId,
            extraData: { postId: postId },
          });
        }

        Alert.alert("Suggestion Successful", "Your suggestion has been send", [
          { text: "OK", onPress: () => navigation.navigate("HomeStack") },
        ]);
      });
    }
    setLoading(false);
  };

  return (
    <Container>
      <StackHeader title={`What would you like to${"\n"}suggest?`} />
      <Content>
        <View horizontal style={styles.changeFieldContainer}>
          {image ? (
            <FastImage style={styles.img} source={image} />
          ) : (
            <ImagePickerButton btnSize="small" onImageSelect={setImage} />
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
            <ActivityIndicator color={Colors.primary} size="small" />
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
  changeFieldContainer: {
    width: "100%",
    borderRadius: 20,
    marginTop: 50,
  },
  indexCounter: {
    width: 30,
    height: 30,
    borderWidth: 2,
    paddingTop: 2,
    marginRight: 5,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
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
    margin: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

const mapDispatchToProps = {
  suggestPost: suggestPostAction,
};

export default connect(null, mapDispatchToProps)(SuggestionAddScreen);
