import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import { Container, Content, Text, View } from "../../common";
import ProfileHeader from "../components/ProfileHeader";
import NameIcon from "../../assets/icons/edit-name-icon.svg";
import EditIcon from "../../assets/icons/edit-email-icon.svg";
import NotificationIcon from "../../assets/icons/nav-notification-icon.svg";

import ProfileIcon from "../../assets/icons/nav-profile-icon.svg";

import { getProfile as selectProfile } from "../redux/selectors";
import { getProfile as getProfileAction } from "../redux/actions";
import {
  deleteUserAccount,
  logout as logoutAction,
} from "../../auth/redux/actions";
import {
  AppColors,
  AppImages,
  darkModeColors,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import {
  setDraftPost,
  setIsAppLoader,
  setThemeType,
  setThreadList,
} from "../../redux/action/AppLogics";
import { getThemeType, saveUserDraftPost } from "../../util/helperFun";
import AlertModal from "../../common/AlertModal";
import { Routes } from "../../util/Route";
import { checkUserAccountRequestStatus } from "../../network/Services/ProfileServices";
import { RequestStatus, Theme_Mode, Theme_Types } from "../../util/Strings";
import useNotificationManger from "../../hooks/useNotificationManger";

/* =============================================================================
<ProfileScreen />
============================================================================= */
const ProfileScreen = ({ profile, getProfile, logout, deleteUserAccount }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const [reqBtnStatus, setReqBtnStatus] = useState(null);
  const isFocused = useIsFocused();
  const { checkNUpdateFCMToken } = useNotificationManger();
  const selector = useSelector((AppState) => AppState);
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
    if (isFocused && selector?.Auth?.user?.uid) {
      fetchReqStatus(selector?.Auth?.user?.uid);
    }
  }, [isFocused]);

  const _handleLogout = async () => {
    dispatch(setIsAppLoader(true));
    await checkNUpdateFCMToken({
      fcmToken: "",
      userId: selector?.Auth?.user?.uid,
    });
    await saveUserDraftPost([]);
    dispatch(setDraftPost([]));
    dispatch(setThreadList([]));
    logout();
    dispatch(setIsAppLoader(false));
    let themeType = await getThemeType();
    if (themeType) {
      dispatch(
        setThemeType(
          themeType === Theme_Types.appDarkMode ||
            themeType === Theme_Types.deviceDarkMode
            ? Theme_Mode.isDark
            : Theme_Mode.isLight
        )
      );
    }
  };

  const _deleteAccount = async () => {
    dispatch(setIsAppLoader(true));
    await checkNUpdateFCMToken({
      fcmToken: "",
      userId: selector?.Auth?.user?.uid,
    });
    dispatch(setDraftPost([]));
    dispatch(setThreadList([]));
    await saveUserDraftPost([]);
    deleteUserAccount();
    dispatch(setIsAppLoader(false));
    let themeType = await getThemeType();
    if (themeType) {
      dispatch(
        setThemeType(
          themeType === Theme_Types.appDarkMode ||
            themeType === Theme_Types.deviceDarkMode
            ? Theme_Mode.isDark
            : Theme_Mode.isLight
        )
      );
    }
  };
  const fetchReqStatus = async (id) => {
    await checkUserAccountRequestStatus(id, (res) => {
      setReqBtnStatus(res);
    });
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
      <ProfileHeader photoUrl={profileImage} />
      <Content
        contentContainerStyle={{
          ...styles.content,
          backgroundColor:
            themeType == Theme_Mode.isDark
              ? darkModeColors.background
              : lightModeColors.background,
        }}
        horizontalPadding={0}
      >
        <View horizontal style={styles.item}>
          <NameIcon />
          <View style={styles.itemInfoContainer}>
            <Text xs>User Name:</Text>
            <Text
              normal
              style={{
                color:
                  themeType == Theme_Mode.isDark
                    ? darkModeColors.text
                    : lightModeColors.text,
              }}
            >
              {username}
            </Text>
          </View>
        </View>
        <View horizontal style={styles.item}>
          <EditIcon />
          <View style={styles.itemInfoContainer}>
            <Text xs>Email:</Text>
            <Text
              normal
              style={{
                color:
                  themeType == Theme_Mode.isDark
                    ? darkModeColors.text
                    : lightModeColors.text,
              }}
            >
              {email}
            </Text>
          </View>
        </View>
        <View style={styles.simpleLine} />
        <TouchableOpacity
          style={{ ...styles.item, paddingVertical: normalized(5) }}
          activeOpacity={1}
          onPress={() => {
            navigation.navigate(Routes.Chat.chatList);
          }}
        >
          <Image
            source={AppImages.Chat.chat}
            style={{
              height: normalized(20),
              width: normalized(20),
              tintColor: AppColors.blue.navy,
            }}
          />
          <View style={styles.itemInfoContainer}>
            <Text
              normal
              style={{
                color:
                  themeType == Theme_Mode.isDark
                    ? darkModeColors.text
                    : lightModeColors.text,
              }}
            >
              {"Chat"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.item, paddingVertical: normalized(5) }}
          activeOpacity={1}
          onPress={() => {
            navigation.navigate("DraftPostListing");
          }}
        >
          <EditIcon />
          <View style={styles.itemInfoContainer}>
            <Text
              normal
              style={{
                color:
                  themeType == Theme_Mode.isDark
                    ? darkModeColors.text
                    : lightModeColors.text,
              }}
            >
              {"My Draft Post"}
            </Text>
          </View>
        </TouchableOpacity>
        {reqBtnStatus?.length > 0 ? (
          !selector?.DraftPost?.isAdmin ? (
            <TouchableOpacity
              style={{ ...styles.item, paddingVertical: normalized(5) }}
              activeOpacity={1}
              onPress={() => {
                if (
                  reqBtnStatus == RequestStatus.newReq ||
                  reqBtnStatus == RequestStatus.rejected
                ) {
                  navigation.navigate(Routes.Profile.requestForVerify);
                }
              }}
            >
              <NotificationIcon stroke={AppColors.blue.navy} />
              <View style={styles.itemInfoContainer}>
                <Text
                  normal
                  style={{
                    color:
                      themeType == Theme_Mode.isDark
                        ? darkModeColors.text
                        : lightModeColors.text,
                  }}
                >
                  {reqBtnStatus == RequestStatus.newReq ||
                  reqBtnStatus == RequestStatus.rejected
                    ? "Request for verified Account"
                    : reqBtnStatus == RequestStatus.pending
                    ? "Request Pending"
                    : reqBtnStatus == RequestStatus.accepted
                    ? "Request Accepted"
                    : ""}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View>
              <TouchableOpacity
                style={{ ...styles.item, paddingVertical: normalized(5) }}
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate(Routes.Profile.appUserList);
                }}
              >
                <ProfileIcon stroke={AppColors.blue.navy} />
                <View style={styles.itemInfoContainer}>
                  <Text
                    normal
                    style={{
                      color:
                        themeType == Theme_Mode.isDark
                          ? darkModeColors.text
                          : lightModeColors.text,
                    }}
                  >
                    {"App User"}
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ ...styles.item, paddingVertical: normalized(5) }}
                activeOpacity={1}
                onPress={() => {
                  navigation.navigate(Routes.Profile.userRequestList);
                }}
              >
                <NotificationIcon stroke={AppColors.blue.navy} />
                <View style={styles.itemInfoContainer}>
                  <Text
                    normal
                    style={{
                      color:
                        themeType == Theme_Mode.isDark
                          ? darkModeColors.text
                          : lightModeColors.text,
                    }}
                  >
                    {"User Requests"}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        ) : null}

        <TouchableOpacity
          style={{ ...styles.item, paddingVertical: normalized(5) }}
          activeOpacity={1}
          onPress={() => {
            navigation.navigate("SavePosts");
          }}
        >
          <Image source={AppImages.profile.savePosts} style={styles.icon} />
          <View style={styles.itemInfoContainer}>
            <Text
              normal
              style={{
                color:
                  themeType == Theme_Mode.isDark
                    ? darkModeColors.text
                    : lightModeColors.text,
              }}
            >
              {"Saved Posts"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ ...styles.item, paddingVertical: normalized(5) }}
          activeOpacity={1}
          onPress={() => {
            navigation.navigate(Routes.Profile.themeChanging);
          }}
        >
          <Image source={AppImages.profile.darkThemeIcon} style={styles.icon} />
          <View style={styles.itemInfoContainer}>
            <Text
              normal
              style={{
                color:
                  themeType == Theme_Mode.isDark
                    ? darkModeColors.text
                    : lightModeColors.text,
              }}
            >
              {"Theme"}
            </Text>
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
            <Text
              normal
              style={{
                color:
                  themeType == Theme_Mode.isDark
                    ? darkModeColors.text
                    : lightModeColors.text,
              }}
            >
              {"Logout"}
            </Text>
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
            <Text
              normal
              style={{
                color: AppColors.red.dark,
              }}
            >
              {"Delete Account"}
            </Text>
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
    paddingTop: normalized(40),
    paddingHorizontal: normalized(30),
    paddingBottom: 40,
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
