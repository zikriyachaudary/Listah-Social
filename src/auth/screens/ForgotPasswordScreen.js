import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { connect } from "react-redux";

import { Button, StackHeader } from "../../common";

import { forgotPassword as forgotPasswordAction } from "../redux/actions";
import { getLoading } from "../redux/selectors";
import { AppStyles } from "../../util/AppStyles";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  EmailValidator,
  hv,
  normalized,
} from "../../util/AppConstant";
import TextInputComponent from "../../common/TextInputComponent";

/* =============================================================================
<ForgotPasswordScreen />
============================================================================= */
const ForgotPasswordScreen = ({ loading, forgotPassword, navigation }) => {
  const [email, setEmail] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");

  const _handleForgotPassword = () => {
    let emailValid = EmailValidator(email);
    if (email == "") {
      setEmailErrorMsg("Please enter email");
    } else if (!emailValid) {
      setEmailErrorMsg("Please enter valid email");
    }
    if (email == "" || !emailValid) {
      return;
    }
    if (email) {
      forgotPassword(email, () => navigation.goBack());
    }
  };

  return (
    <View style={AppStyles.MainStyle}>
      <StackHeader
        title=" "
        left={
          <Image
            source={AppImages.Auth.backIcon}
            style={{ tintColor: AppColors.blue.navy }}
          />
        }
        onLeftPress={() => {
          navigation.goBack();
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? hv(35) : hv(30)}
      >
        <ScrollView
          style={styles.containerStyle}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.childContainer}>
            <Image source={AppImages.Common.appLogo} style={styles.logoStyle} />
            <Text style={styles.topDesTxt}>
              Enter your email to reset your password
            </Text>
            <TextInputComponent
              value={email}
              container={styles.inputMainCont}
              setValue={(val) => {
                setEmailErrorMsg("");
                setEmail(val);
              }}
              placeholder="Email"
              error={emailErrorMsg}
            />
            <View style={{ marginVertical: hv(50) }}>
              <Button
                title="Submit"
                loading={loading}
                onPress={_handleForgotPassword}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  btn: {
    marginTop: 20,
  },
  containerStyle: {
    flex: 1,
    marginHorizontal: AppHorizontalMargin,
  },
  childContainer: {
    flex: 1,
    justifyContent: "center",
  },
  logoStyle: {
    height: normalized(110),
    width: normalized(120),
    alignSelf: "center",
  },
  topDesTxt: {
    color: "#8391A1",
    fontSize: normalized(13),
    marginTop: normalized(10),
    marginBottom: normalized(30),
    alignSelf: "center",
  },
  inputMainCont: {
    width: "92%",
  },
  secondCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: normalized(30),
    marginHorizontal: AppHorizontalMargin,
  },

  signInWithTxt: {
    marginVertical: normalized(30),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: AppHorizontalMargin,
  },
  simpleLine: {
    height: normalized(0.4),
    backgroundColor: "#8391A1",
    width: normalized(110),
  },
  signInTxt: {
    fontSize: normalized(13),
    color: "#8391A1",
    marginHorizontal: normalized(15),
  },
});

const mapStateToProps = (state) => ({
  loading: getLoading(state),
});

const mapDispatchToProps = {
  forgotPassword: forgotPasswordAction,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPasswordScreen);
