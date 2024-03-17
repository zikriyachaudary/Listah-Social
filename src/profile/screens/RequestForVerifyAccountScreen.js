import React, { useState } from "react";
import { Button, Container, StackHeader } from "../../common";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import {
  AppColors,
  AppHorizontalMargin,
  darkModeColors,
  hv,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import { useDispatch, useSelector } from "react-redux";
import { RequestStatus, Theme_Mode } from "../../util/Strings";
import { updateUserReqStatus } from "../../network/Services/ProfileServices";
import { setIsAlertShow } from "../../redux/action/AppLogics";

const RequestForVerifyAccountScreen = (route) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const dispatch = useDispatch();
  const userData = useSelector((AppState) => AppState.Auth.user);
  const [isFocusedInput, setIsFocused] = useState(false);
  const [description, setDescription] = useState("");
  const [loader, setLoader] = useState(false);
  const submitReq = async () => {
    setLoader(true);
    let body = {
      userId: userData?.uid,
      email: userData?.email,
      image: userData?.photoURL,
      name: userData?.displayName,
      status: RequestStatus.pending,
      description: description,
    };
    await updateUserReqStatus(userData?.uid, body, (res) => {
      dispatch(
        setIsAlertShow({
          value: true,
          message: res?.message,
        })
      );
      setLoader(false);
      if (res?.status) {
        route?.navigation.goBack();
      }
    });
  };

  return (
    <Container
      style={{
        ...styles.content,
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : lightModeColors.background,
      }}
    >
      <StackHeader title={"Verify Request"} />
      <ScrollView
        style={{
          flex: 1,
          marginHorizontal: AppHorizontalMargin,
        }}
      >
        <TextInput
          multiline
          style={{
            ...styles.multiLineInput,
            borderColor: isFocusedInput ? "#6d14c4" : "darkgrey",
            color:
              themeType == Theme_Mode.isDark
                ? darkModeColors.text
                : lightModeColors.text,
          }}
          scrollEnabled={description?.length > 10 ? true : false}
          value={description}
          onChangeText={(value) => {
            setDescription(value);
          }}
          onBlur={() => setIsFocused(false)}
          onFocus={() => {
            setIsFocused(true);
          }}
          placeholder="write a description...."
          placeholderTextColor={AppColors.grey.dark}
          textAlignVertical={"top"}
        />
        {description.length == 0 && isFocusedInput ? (
          <Text
            style={{
              marginTop: normalized(3),
              color: AppColors.blue.navy,
            }}
          >
            !Empty Field
          </Text>
        ) : (
          <View style={{ marginVertical: normalized(10) }} />
        )}
        {description.length > 0 ? (
          <View center style={styles.btnContainer}>
            <Button
              loading={loader}
              title="Submit"
              onPress={() => {
                submitReq();
              }}
            />
          </View>
        ) : null}
      </ScrollView>
    </Container>
  );
};
const styles = StyleSheet.create({
  content: {
    justifyContent: "space-between",
  },
  btnContainer: {
    marginTop: 20,
    marginHorizontal: normalized(50),
  },
  emptyCont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTxt: {
    fontSize: 14,
    color: "black",
    fontWeight: "500",
  },
  multiLineInput: {
    height: 180,
    width: "100%",
    textAlignVertical: "top",
    borderRadius: normalized(10),
    borderWidth: 1,
    borderColor: AppColors.black.black,
    paddingHorizontal: normalized(15),
    paddingTop: hv(20),
    color: AppColors.black.black,
  },
});
export default RequestForVerifyAccountScreen;
