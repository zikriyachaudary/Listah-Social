import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { connect } from "react-redux";
import { Button } from "../../common";
import { getLoading } from "../redux/selectors";
import { login as loginAction } from "../redux/actions";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  EmailValidator,
  colorsList,
  hv,
  normalized,
} from "../../util/AppConstant";
import { AppStyles } from "../../util/AppStyles";
import TextInputComponent from "../../common/TextInputComponent";
import CustomSwitch from "../../common/CustomSwitch";

/* =============================================================================
<LoginScreen />
============================================================================= */

const regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const LoginScreen = ({ navigation, loading, login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRemember, setIsRemember] = useState(false);
  const disabled = !email || !password;
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passErroMsg, setPasswordErrorMsg] = useState("");

  const _handleRegisterPress = () => {
    navigation.navigate("Register");
  };

  const _handleForgotPasswordPress = () => {
    navigation.navigate("ForgotPassword");
  };
  const checkValidation = () => {
    let emailValid = EmailValidator(email);
    if (email == "") {
      setEmailErrorMsg("Please enter email");
    } else if (!emailValid) {
      setEmailErrorMsg("Please enter valid email");
    }
    if (password == "") {
      setPasswordErrorMsg("Please enter password");
    }
    if (email == "" || !emailValid || password == "") {
      return;
    }
    _handleSubmit();
  };
  const _handleSubmit = () => {
    if (!disabled) {
      if (regex.test(password)) {
        console.log("passMatch ", password);
        login(email, password);
      } else {
        console.log("notpassMatch ", password);
        Alert.alert(
          "Password must contain the following:",
          "- One upper letter\n- One special character\n- One number"
        );
      }

      //
    }
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
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
              Log in to continue your journey.
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
            <TextInputComponent
              value={password}
              showLastIcon={true}
              showFirstIcon={true}
              container={styles.inputMainCont}
              setValue={(val) => {
                setPasswordErrorMsg("");
                setPassword(val);
              }}
              placeholder="Password"
              error={passErroMsg}
              secureEntry={true}
            />

            <View style={styles.secondCont}>
              <View style={styles.switchCon}>
                <CustomSwitch
                  value={isRemember}
                  onToggle={(val) => {
                    setIsRemember(val);
                  }}
                />
                <Text style={styles.remembTxt}>Remember Me</Text>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  _handleForgotPasswordPress();
                }}
              >
                <Text style={styles.forgetPasTxt}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <Button
              loading={loading}
              title="Sign in"
              onPress={checkValidation}
            />

            <Text style={styles.bottomTxt}>
              Don’t have an account?{" "}
              <Text
                onPress={() => {
                  _handleRegisterPress();
                }}
                style={styles.signUpBtn}
              >
                {" "}
                Sign up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};
const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    marginHorizontal: AppHorizontalMargin,
  },
  childContainer: {
    flex: 1,
    justifyContent: "center",
  },
  logoStyle: {
    marginTop: hv(30),
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
  switchCon: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  remembTxt: {
    marginStart: normalized(10),
    fontSize: normalized(12),
    color: AppColors.black.black,
  },
  forgetPasTxt: {
    fontSize: normalized(14),
    color: AppColors.black.black,
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

  socialCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: AppHorizontalMargin,
    alignSelf: "center",
  },
  bottomTxt: {
    fontSize: normalized(13),
    color: AppColors.black.black,
    alignSelf: "center",
    marginTop: normalized(80),
  },
  signUpBtn: {
    fontSize: normalized(13),
    color: AppColors.blue.navy,
    alignSelf: "center",
    marginTop: normalized(90),
  },
});

const mapStateToProps = (state) => ({
  loading: getLoading(state),
});

const mapDispatchToProps = {
  login: loginAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
