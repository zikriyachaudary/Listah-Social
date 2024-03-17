import React, { useState } from "react";
import { connect, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import FireAuth from "@react-native-firebase/auth";
import { ActivityIndicator, Alert, Image, StyleSheet } from "react-native";

import {
  View,
  Text,
  Content,
  Container,
  StackHeader,
  Touchable,
} from "../../common";
import CheckIcon from "../../assets/icons/edit-check-icon.svg";
import * as Colors from "../../config/colors";

import { suggestPost as suggestPostAction } from "../redux/actions";
import useNotificationManger from "../../hooks/useNotificationManger";
import {
  Notification_Messages,
  Notification_Types,
  Theme_Mode,
} from "../../util/Strings";
import { darkModeColors, lightModeColors } from "../../util/AppConstant";

/* =============================================================================
<SuggestionDeleteScreen />
============================================================================= */
const SuggestionDeleteScreen = ({ route, navigation, suggestPost }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  const { item, postTitle, postId, authorId } = route?.params;
  const [loading, setLoading] = useState(false);
  const { suggestionAtPost } = useNotificationManger();
  const selector = useSelector((AppState) => AppState);

  const _handleSubmit = async () => {
    if (item) {
      setLoading(true);
      const payload = {
        type: "suggestion",
        change: {
          type: "delete",
          item,
        },
        postId,
        postTitle,
        sender: {
          userId: FireAuth().currentUser.uid,
          username: FireAuth().currentUser.displayName,
        },
        authorId,
      };

      await suggestPost(payload, async () => {
        if (authorId != selector?.Auth?.user?.uid) {
          console.log("call sent -- > ");
          await suggestionAtPost(
            {
              actionType: Notification_Types.suggestion,
              reciverId: authorId,
              extraData: { postId: postId },
              payload: payload,
            },
            Notification_Messages.delSuggestion
          );
        }
        Alert.alert("Suggestion Successful", "Your suggestion has been send", [
          { text: "OK", onPress: () => navigation.navigate("HomeStack") },
        ]);
      });
    }
    setLoading(false);
  };

  return (
    <Container
      style={{
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : lightModeColors.background,
      }}
    >
      <StackHeader title={`What would you like to${"\n"}suggest?`} />
      <Content
        containerStyle={{
          backgroundColor:
            themeType == Theme_Mode.isDark
              ? darkModeColors.background
              : lightModeColors.background,
        }}
        contentContainerStyle={{
          backgroundColor:
            themeType == Theme_Mode.isDark
              ? darkModeColors.background
              : lightModeColors.background,
        }}
      >
        <View horizontal style={styles.item}>
          <View
            style={{
              ...styles.indexCounter,
              borderColor:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
          >
            <Text sm bold primary>
              {item?.id === 0 ? 1 : item?.id + 1}
            </Text>
          </View>
          <FastImage style={styles.img} source={{ uri: `${item?.image}` }} />
          <Text
            sm
            medium
            style={{
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
          >
            {item?.name}
          </Text>
          <Text
            sm
            light
            style={{
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
          >
            {item?.description}
          </Text>
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
  item: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: "#999",
    justifyContent: "space-between",
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
    alignItems: "center",
    justifyContent: "center",
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

export default connect(null, mapDispatchToProps)(SuggestionDeleteScreen);
