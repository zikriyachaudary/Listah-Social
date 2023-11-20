import React, { useState } from "react";
import { connect } from "react-redux";
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import FastImage from "react-native-fast-image";
import ImageResizer from "react-native-image-resizer";
import FireStore from "@react-native-firebase/storage";
import CheckBox from "@react-native-community/checkbox";

import {
  View,
  Button,
  Content,
  Container,
  TextInput,
  StackHeader,
  ImagePickerButton,
} from "../../common";
import ChevronLeftIcon from "../../assets/icons/edit-chevron-left.svg";

import { View as RNView } from "react-native";
import { register as registerAction } from "../redux/actions";
import * as Colors from "../../config/colors";

/* =============================================================================
<RegisterScreen />
============================================================================= */
const regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

const RegisterScreen = ({ register }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShhowModal] = useState(false);
  const disabled = !username || !email || !image || !password;
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

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
                console.log("clicked");
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

                  <RNView
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
                  </RNView>
                </RNView>
              </ScrollView>
            </TouchableOpacity>
          </RNView>
        </RNView>
      </Modal>
    );
  };

  return (
    <Container>
      <Content>
        <StackHeader />
        <View center style={styles.imgContainer}>
          {image ? (
            <FastImage source={image} style={styles.image} />
          ) : (
            <View style={styles.image} center>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  paddingHorizontal: 10,
                }}
              >
                No Image Uploaded Yet
              </Text>
            </View>
          )}
        </View>
        <TextInput
          value={username}
          onChange={setUsername}
          placeholder="User Name"
        />
        <TextInput value={email} onChange={setEmail} placeholder="Email" />
        <TextInput
          value={password}
          placeholder="Password"
          secureTextEntry={true}
          onChange={setPassword}
        />
        <ImagePickerButton onImageSelect={setImage} />
        <View>
          <Text
            style={{
              marginBottom: 20,
            }}
          >
            {"When you Register, you agree to "}
            <Text
              onPress={() => {
                setShhowModal(true);
              }}
              style={{
                textDecorationLine: "underline",
                fontWeight: "bold",
                color: "black",
              }}
            >
              {"Terms and Condition"}
            </Text>
            {" and acknowledge"}
          </Text>
        </View>
        <View center>
          <Button
            title="Sign up"
            loading={loading}
            disabled={disabled}
            onPress={_handleSubmit}
          />
        </View>

        {termsAndConditionModal()}
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  imgBtnContainer: {
    marginVertical: 20,
  },
  imgBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: "#fff",
  },
  imgBtnTxt: {
    color: Colors.primary,
  },
  imgContainer: {
    marginBottom: 20,
  },
  image: {
    width: 120,
    height: 120,
    backgroundColor: "#d1d1d1",
    borderRadius: 120 / 2,
  },
});

const mapDispatchToProps = {
  register: registerAction,
};

export default connect(null, mapDispatchToProps)(RegisterScreen);
