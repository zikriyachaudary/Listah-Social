import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ImageResizer from "react-native-image-resizer";
import FireStore from "@react-native-firebase/storage";
import CheckBox from "@react-native-community/checkbox";

import ChevronLeftIcon from "../../assets/icons/edit-chevron-left.svg";

import { View as RNView } from "react-native";
import { register as registerAction } from "../redux/actions";
import { AppStyles } from "../../util/AppStyles";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  EmailValidator,
  hv,
  normalized,
} from "../../util/AppConstant";
import { Button, ImagePickerButton, StackHeader } from "../../common";
import ImagePickerModal from "../../common/ImagePickerButton/ImagePickerModal";
import FastImage from "react-native-fast-image";
import TextInputComponent from "../../common/TextInputComponent";

/* =============================================================================
<RegisterScreen />
============================================================================= */
const regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const RegisterScreen = ({ register, navigation }) => {
  const [modal, setModal] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShhowModal] = useState(false);
  const disabled = !username || !email || !image || !password;
  const [userNameError, setUserNameError] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [passErroMsg, setPasswordErrorMsg] = useState("");
  const [imageError, setImageError] = useState("");
  const [toggleCheckBoxError, setToggleCheckBoxError] = useState("");
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const checkValidation = () => {
    let emailValid = EmailValidator(email);
    if (username == "") {
      setUserNameError("Please enter User Name");
    }
    if (email == "") {
      setEmailErrorMsg("Please enter email");
    } else if (!emailValid) {
      setEmailErrorMsg("Please enter valid email");
    }
    if (password == "") {
      setPasswordErrorMsg("Please enter password");
    }
    if (!toggleCheckBox) {
      setToggleCheckBoxError("Please accept Term & Conditions");
    }
    if (!image) {
      setImageError("Please select you profile!");
    }
    if (
      email == "" ||
      !emailValid ||
      password == "" ||
      username == "" ||
      !toggleCheckBox ||
      !image
    ) {
      return;
    }
    _handleSubmit();
  };
  const _handleSubmit = async () => {
    if (!toggleCheckBox) {
      Alert.alert("Please accept terms and condition");
      return;
    }
    if (!disabled) {
      if (regex.test(password)) {
        setLoading(true);
        const compressedImage = await ImageResizer.createResizedImage(
          image.uri,
          1000,
          1000,
          "PNG",
          100,
          0
        );
        const storageRef = FireStore()
          .ref("profile_pics")
          .child(image.fileName);
        await storageRef.putFile(compressedImage.uri);
        const uploadImgUrl = await storageRef.getDownloadURL();
        register({
          email,
          password,
          username,
          profileImage: uploadImgUrl,
        });
        setLoading(false);
      } else {
        Alert.alert(
          "Password must contain the following:",
          "- One upper letter\n- One special character\n- One number"
        );
      }
    }
  };

  const termsAndConditionModal = () => {
    return (
      <Modal
        visible={showModal}
        onRequestClose={() => {
          setShhowModal(false);
        }}
      >
        <RNView
          style={{
            flex: 1,
          }}
        >
          <SafeAreaView />
          <RNView
            style={{
              margin: 25,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setToggleCheckBox(!toggleCheckBox);
                setShhowModal(false);
              }}
            >
              <ChevronLeftIcon />

              <ScrollView>
                <RNView>
                  <Text
                    style={{
                      marginVertical: 25,
                    }}
                  >
                    {
                      "Terms and Condition\n\nWelcome to Listah!\nI accept all these terms and condition.\nThese terms and conditions outline the rules and regulations for the use of Listah.\nNo objectionable content will be tolerated.\nBy using this app we assume you accept these terms and conditions. Do not continue to use Listah if you do not agree to take all of the terms and conditions stated on this page. The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: Client, You and Your refers to you, the person log on this website and compliant to the Company’s terms and conditions. The Company, Ourselves, We, Our and Us, refers to our Company. Party, Parties, or Us, refers to both the Client and ourselves. All terms refer to the offer, acceptance and consideration of payment necessary to undertake the process of our assistance to the Client in the most appropriate manner for the express purpose of meeting the Client’s needs in respect of provision of the Company’s stated services, in accordance with and subject to, prevailing law of Netherlands. Any use of the above terminology or other words in the singular, plural, capitalization and/or he/she or they, are taken as interchangeable and therefore as referring to same. Our Terms and Conditions were created with the help of the App Terms and Conditions Generator from App-Privacy-Policy.com"
                    }
                  </Text>

                  {/* <RNView
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <CheckBox
                      value={toggleCheckBox}
                      onValueChange={(newValue) => {
                        setShhowModal(false);
                        console.log("showNewValue - > ", newValue);
                        setToggleCheckBox(newValue);
                      }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        marginStart: 15,
                      }}
                    >
                      Agree
                    </Text>
                  </RNView> */}
                </RNView>
              </ScrollView>
            </TouchableOpacity>
          </RNView>
        </RNView>
      </Modal>
    );
  };

  return (
    <View style={AppStyles.MainStyle}>
      <StackHeader
        title="Create Account"
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
          <View style={{ alignSelf: "center" }}>
            {image ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setModal(true);
                }}
              >
                <FastImage source={image} style={styles.imageCont} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.imageCont}
                activeOpacity={1}
                onPress={() => {
                  setModal(true);
                }}
              >
                <Image
                  source={AppImages.Auth.Camera}
                  resizeMode="contain"
                  style={{
                    height: "30%",
                    width: "30%",
                  }}
                />
              </TouchableOpacity>
            )}
            <Text style={styles.uploadTxt}>Upload Profile</Text>
          </View>
          {imageError?.length > 0 && !image ? (
            <Text
              style={{
                marginHorizontal: normalized(20),
                color: AppColors.blue.navy,
                marginBottom: hv(10),
                alignSelf: "center",
              }}
            >
              {imageError}
            </Text>
          ) : null}
          <TextInputComponent
            value={username}
            container={styles.inputMainCont}
            setValue={(val) => {
              setUsername(val);
            }}
            placeholder="User Name"
            error={userNameError}
          />
          <TextInputComponent
            value={email}
            container={styles.inputMainCont}
            setValue={(val) => {
              setEmail(val);
            }}
            placeholder="Email"
            error={emailErrorMsg}
          />
          <TextInputComponent
            value={password}
            isPassword={true}
            container={styles.inputMainCont}
            setValue={(val) => {
              setPassword(val);
            }}
            placeholder="Password"
            error={passErroMsg}
          />
          <View style={styles.termCont}>
            <TouchableWithoutFeedback
              onPress={() => setToggleCheckBox(!toggleCheckBox)}
            >
              <CheckBox
                value={toggleCheckBox}
                onValueChange={(newValue) => {
                  setShhowModal(false);
                  setToggleCheckBoxError("");
                  setToggleCheckBox(newValue);
                }}
              />
            </TouchableWithoutFeedback>
            <Text style={styles.termsTxt}>
              Yes I agree to{" "}
              <Text
                style={{ ...styles.termsTxt, color: AppColors.blue.navy }}
                onPress={() => {
                  setShhowModal(true);
                }}
              >
                terms & conditions{" "}
              </Text>
            </Text>
          </View>
          {toggleCheckBoxError?.length > 0 ? (
            <Text
              style={{
                marginHorizontal: normalized(20),
                marginTop: normalized(3),
                color: AppColors.blue.navy,
                marginBottom: hv(10),
              }}
            >
              {toggleCheckBoxError}
            </Text>
          ) : (
            <View style={{ marginVertical: normalized(10) }} />
          )}
          <Button title="Sign up" loading={loading} onPress={checkValidation} />
          <Text style={styles.bottomTxt}>
            Already have an account?{" "}
            <Text
              onPress={() => {
                navigation.navigate("Login");
              }}
              style={styles.signUpBtn}
            >
              {" "}
              Sign in
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
      {termsAndConditionModal()}
      {modal ? (
        <ImagePickerModal
          visible={modal}
          onClose={() => {
            setModal(!modal);
          }}
          onAdd={(img) => {
            setImage(img);
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    flex: 1,
    marginHorizontal: AppHorizontalMargin,
  },
  imageCont: {
    backgroundColor: "#959595",
    height: normalized(120),
    width: normalized(120),
    borderRadius: normalized(120 / 2),
    justifyContent: "center",
    alignItems: "center",
  },
  uploadTxt: {
    fontSize: normalized(14),
    color: "#8391A1",
    alignSelf: "center",
    marginTop: normalized(10),
  },
  inputMainCont: {
    width: "92%",
  },
  bottomTxt: {
    fontSize: normalized(13),
    color: AppColors.black.black,
    alignSelf: "center",
    marginVertical: normalized(20),
  },
  signUpBtn: {
    fontSize: normalized(13),
    color: AppColors.blue.navy,
    alignSelf: "center",
    marginVertical: normalized(20),
  },
  termCont: {
    flexDirection: "row",
    // justifyContent: 'center',
    alignItems: "center",
    marginTop: normalized(20),
    marginStart: normalized(10),
  },
  checkCont: {
    borderRadius: normalized(5),
    height: normalized(20),
    width: normalized(20),
    borderWidth: 1,
    borderColor: "#E4DFDF",
    justifyContent: "center",
    alignItems: "center",
  },
  termsTxt: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    marginStart: normalized(5),
  },
  socialCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
    alignSelf: "center",
  },
});

const mapDispatchToProps = {
  register: registerAction,
};

export default connect(null, mapDispatchToProps)(RegisterScreen);
