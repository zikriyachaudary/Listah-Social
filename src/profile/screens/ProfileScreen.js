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
import { AppColors, AppImages, normalized } from "../../util/AppConstant";
import { setDraftPost, setThreadList } from "../../redux/action/AppLogics";
import { saveUserDraftPost } from "../../util/helperFun";
import AlertModal from "../../common/AlertModal";
import { Routes } from "../../util/Route";
import { checkUserAccountRequestStatus } from "../../network/Services/ProfileServices";
import { RequestStatus } from "../../util/Strings";
import useNotificationManger from "../../hooks/useNotificationManger";
import AppLoader from "../../common/AppLoader";

/* =============================================================================
<ProfileScreen />
============================================================================= */
const ProfileScreen = ({ profile, getProfile, logout, deleteUserAccount }) => {
  const [reqBtnStatus, setReqBtnStatus] = useState(null);
  const isFocused = useIsFocused();
  const { checkNUpdateFCMToken } = useNotificationManger();
  const selector = useSelector((AppState) => AppState);
  const [alertModal, setAlertModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    // console.log("profileID -- > " , JSON.stringify(profile.userId))
  }, [isFocused]);

  const _handleLogout = async () => {
    setIsLoading(true);
    await checkNUpdateFCMToken({
      fcmToken: "",
      userId: selector?.Auth?.user?.uid,
    });
    await saveUserDraftPost([]);
    dispatch(setDraftPost([]));
    dispatch(setThreadList([]));
    logout();
    setIsLoading(false);
  };

  const _deleteAccount = async () => {
    setIsLoading(true);
    await checkNUpdateFCMToken({
      fcmToken: "",
      userId: selector?.Auth?.user?.uid,
    });
    dispatch(setDraftPost([]));
    dispatch(setThreadList([]));
    await saveUserDraftPost([]);
    deleteUserAccount();
    setIsLoading(false);
  };
  const fetchReqStatus = async (id) => {
    await checkUserAccountRequestStatus(id, (res) => {
      setReqBtnStatus(res);
    });
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
            <Text normal>{"Chat"}</Text>
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
            <Text normal>{"My Draft Post"}</Text>
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
                <Text normal>
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
                  <Text normal>{"App User"}</Text>
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
                  <Text normal>{"User Requests"}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        ) : null}

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
      {isLoading ? <AppLoader visisble={isLoading} /> : null}
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
