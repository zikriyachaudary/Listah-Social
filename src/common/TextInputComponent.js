import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { AppColors, AppImages, normalized } from "../util/AppConstant";

const TextInputComponent = (props) => {
  const [secureEntry, setSecureEntry] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <View style={[{ marginVertical: normalized(5) }, props?.mainContainer]}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor:
              props?.value.length > 0 || props?.error?.length > 0 || isFocused
                ? "#6d14c4"
                : "darkgrey",
          },
          props.container,
        ]}
      >
        {props?.rightIcon ? (
          <Pressable>
            <Image
              source={props.rightIcon}
              resizeMode="contain"
              style={styles.rightIconStyle}
            />
          </Pressable>
        ) : null}

        <TextInput
          autoCapitalize={
            props?.autoCapitalize ? props?.autoCapitalize : "sentences"
          }
          placeholderTextColor={AppColors.grey.dark}
          placeholder={props?.placeholder}
          style={[styles.txtInput, props.textInputStyle]}
          multiline={props?.isMultiLine}
          value={props?.value?.toString()}
          onChangeText={(val) => {
            props.setValue(val);
          }}
          onBlur={() => setIsFocused(false)}
          onFocus={() => {
            setIsFocused(true);
          }}
          secureTextEntry={props?.isPassword && !secureEntry ? true : false}
          onSubmitEditing={props?.atSubmit}
          returnKeyType={props?.returnType ? props?.returnType : "done"}
          keyboardType={props?.padType ? props?.padType : "default"}
          scrollEnabled={props?.isMultiLine}
          maxLength={props?.maxLength ? props?.maxLength : 200}
          editable={props.isDisable ? false : true}
        />
        {props?.isPassword ? (
          <Pressable
            style={{ padding: 5 }}
            onPress={() => {
              setSecureEntry(!secureEntry);
            }}
          >
            <Image
              source={
                !secureEntry ? AppImages.Auth.closeEye : AppImages.Auth.eye
              }
              style={{
                width: normalized(20),
                height: normalized(20),
              }}
              resizeMode="contain"
            />
          </Pressable>
        ) : null}
      </View>

      {(props?.value.length == 0 && isFocused) || props?.error?.length > 0 ? (
        <Text
          style={{
            marginHorizontal: normalized(20),
            marginTop: normalized(3),
            color: AppColors.blue.navy,
          }}
        >
          {props?.error?.length > 0 ? props?.error : "!Empty Field"}
        </Text>
      ) : (
        <View style={{ marginVertical: normalized(10) }} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    height: normalized(56),
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#E2E3E4",
    borderRadius: normalized(12),
    alignItems: "center",
  },
  txtInput: {
    width: "90%",
    height: normalized(50),
    alignSelf: "center",
    borderRadius: normalized(12),
    paddingHorizontal: normalized(15),
    color: AppColors.black.black,
  },

  inputStyle: {
    textAlignVertical: "top",
    flex: 1,
    height: "100%",
    color: AppColors.black.black,
    fontSize: normalized(14),
  },
});
export default TextInputComponent;
