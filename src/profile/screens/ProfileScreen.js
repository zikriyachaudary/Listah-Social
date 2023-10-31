import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { Container, Content, Text, View } from "../../common";
import ProfileHeader from "../components/ProfileHeader";
import NameIcon from "../../assets/icons/edit-name-icon.svg";
import EditIcon from "../../assets/icons/edit-email-icon.svg";
import { getProfile as selectProfile } from "../redux/selectors";
import { getProfile as getProfileAction } from "../redux/actions";
import {
  deleteUserAccount,
  logout as logoutAction,
} from "../../auth/redux/actions";
import { AppColors, AppImages, normalized } from "../../util/AppConstant";
import { setDraftPost } from "../../redux/action/AppLogics";
import { saveUserDraftPost } from "../../util/helperFun";
import AlertModal from "../../common/AlertModal";

/* =============================================================================
<ProfileScreen />
============================================================================= */
const ProfileScreen = ({ profile, getProfile, logout, deleteUserAccount }) => {
  const isFocused = useIsFocused();
  const [alertModal, setAlertModal] = useState(false);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const email = profile?.email;
  const profileImage = profile?.profileImage;
  const username = profile?.username;

  // GET PROFILE
  useEffect(() => {
    if (isFocused) {
      getProfile();
    }
    // console.log("profileID -- > " , JSON.stringify(profile.userId))
  }, [isFocused]);

  const _handleLogout = async () => {
    dispatch(setDraftPost([]));
    await saveUserDraftPost([]);
    logout();
  };

  const _deleteAccount = async () => {
    dispatch(setDraftPost([]));
    await saveUserDraftPost([]);
    deleteUserAccount();
  };

  return (
    <Container>
      <ProfileHeader photoUrl={profileImage} />
      <Content contentContainerStyle={styles.content}>
        <View horizontal style={styles.item}>
          <NameIcon />
          <View style={styles.itemInfoContainer}>
            <Text xs>User Name:</Text>
            <Text normal>{username}</Text>
          </View>
        </View>
        <View horizontal style={styles.item}>
          <EditIcon />
          <View style={styles.itemInfoContainer}>
            <Text xs>Email:</Text>
            <Text normal>{email}</Text>
          </View>
        </View>
        <View style={styles.simpleLine} />
        <TouchableOpacity
          style={{ ...styles.item, paddingVertical: normalized(5) }}
          activeOpacity={1}
          onPress={() => {
            navigation.navigate("DraftPostListing");
          }}
        >
          <EditIcon />
          <View style={styles.itemInfoContainer}>
            <Text normal>{"My Draft Post"}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.item, paddingVertical: normalized(5) }}
          activeOpacity={1}
          onPress={() => {
            _handleLogout();
          }}
        >
          <Image source={AppImages.profile.logout} style={styles.icon} />
          <View style={styles.itemInfoContainer}>
            <Text normal>{"Logout"}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ ...styles.item, paddingVertical: normalized(5) }}
          activeOpacity={1}
          onPress={() => {
            setAlertModal(true);
          }}
        >
          <Image source={AppImages.profile.delete} style={styles.icon} />

          <View style={styles.itemInfoContainer}>
            <Text normal>{"Delete Account"}</Text>
          </View>
        </TouchableOpacity>
      </Content>
      {alertModal ? (
        <AlertModal
          visible={alertModal}
          multipleBtn={true}
          atLeftBtn={() => {
            setAlertModal(false);
          }}
          leftBtnLabel={"No"}
          rightBtnLabel={"Yes"}
          onPress={() => {
            _deleteAccount();
          }}
          message={"Are you sure, you want to delete your Account?"}
        />
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: normalized(40),
    paddingHorizontal: normalized(20),
  },
  item: {
    flexDirection: "row",
    marginVertical: normalized(5),
  },
  itemInfoContainer: {
    marginLeft: normalized(20),
  },
  btnContainer: {
    marginBottom: 20,
  },
  simpleLine: {
    height: normalized(1),
    backgroundColor: AppColors.grey.dark,
    width: "100%",
    marginVertical: normalized(10),
  },
  icon: {
    height: normalized(25),
    width: normalized(25),
  },
});

const mapStateToProps = (state) => ({
  profile: selectProfile(state),
});

const mapDispatchToProps = {
  logout: logoutAction,
  deleteUserAccount: deleteUserAccount,
  getProfile: getProfileAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
