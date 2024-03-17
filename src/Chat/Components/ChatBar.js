import React from "react";
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import {
  AppColors,
  AppImages,
  darkModeColors,
  hv,
  isLargeWidth,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import { useSelector } from "react-redux";
import { Theme_Mode } from "../../util/Strings";

const ChatBar = (props) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  return (
    <View
      style={[
        styles.container,
        {
          alignItems: props?.value.length > 23 ? "flex-start" : "center",
          backgroundColor: props?.isDisable
            ? "#EFF3F7"
            : themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : lightModeColors.background,
        },
      ]}
    >
      <View
        style={{
          ...styles.messageCon,
          backgroundColor:
            themeType == Theme_Mode.isDark
              ? darkModeColors.background
              : lightModeColors.background,
        }}
      >
        <TextInput
          editable={!props?.isDisable}
          value={props?.value}
          onChangeText={props?.onChangeText}
          style={{
            ...styles.textInput,
            color:
              themeType == Theme_Mode.isDark
                ? darkModeColors.text
                : lightModeColors.text,
          }}
          placeholder={"Type Message"}
          placeholderTextColor={AppColors.black.lightBlack}
          multiline={true}
          textAlignVertical={"top"}
        />
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          activeOpacity={1}
          style={styles.inputBtn}
          onPress={() => {
            props?.onAttachmentPress();
          }}
        >
          <Image
            resizeMode="contain"
            source={AppImages.Chat.Attachment}
            style={{
              width: 14,
              height: 22,
              marginTop: 5,
              tintColor:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.sendBtn}
        onPress={() => {
          props?.onSendPress();
        }}
      >
        <Image
          source={AppImages.Chat.SendIcon}
          style={{ tintColor: AppColors.white.white }}
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalized(14),
    paddingVertical: hv(3),
    flexDirection: "row",
  },
  messageCon: {
    flexDirection: "row",
    padding: normalized(4),
    borderRadius: normalized(8),
    backgroundColor: AppColors.white.white,
    width: isLargeWidth ? normalized(300) : normalized(290),
    borderWidth: 1,
    borderColor: AppColors.white.simpleLight,
    alignItems: "center",
  },
  textInput: {
    paddingTop: hv(6),
    paddingBottom: hv(0),
    paddingHorizontal: normalized(5),
    width: normalized(200),
    fontSize: normalized(14),
    color: AppColors.black.black,
  },

  sendBtn: {
    backgroundColor: AppColors.blue.navy,
    padding: Platform.OS == "android" ? normalized(7) : normalized(5),
    borderRadius: normalized(6),
    marginStart: normalized(5),
  },
  inputBtn: {
    paddingHorizontal: normalized(5),
  },
  inputIcon: {
    resizeMode: "contain",
    height: normalized(18),
    width: normalized(18),
    borderRadius: 8,
    marginTop: 5,
  },
});

export default ChatBar;
