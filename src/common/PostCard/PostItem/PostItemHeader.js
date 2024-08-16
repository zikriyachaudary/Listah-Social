import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Modal,
  Image,
} from "react-native";
import FireAuth from "@react-native-firebase/auth";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Menu, MenuItem } from "react-native-material-menu";

// import Text from '../../Text';
import View from "../../View";
import Avatar from "../../Avatar";
import Touchable from "../../Touchable";
import MenuIcon from "../../../assets/icons/edit-menu-icon.svg";
import * as Colors from "../../../config/colors";

import { getPostsById } from "../../../home/redux/selectors";
import {
  deletePost as deletePostAction,
  savePostInDb,
} from "../../../home/redux/actions";
import LoadingImage from "../../LoadingImage";
import FastImage from "react-native-fast-image";
import {
  AppColors,
  AppImages,
  darkModeColors,
  normalized,
} from "../../../util/AppConstant";
import { useToast } from "react-native-toast-notifications";
import { Theme_Mode } from "../../../util/Strings";

/* =============================================================================
<PostItemHeader />
============================================================================= */
const PostItemHeader = ({
  id,
  deletePost,
  post,
  postDeleted,
  postRefresh,
  postReport,
  postIndex,
  showIndex,
  isChallenge = false,
  postSaveTrigger = null,
}) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const toast = useToast();

  const title = post?.title;
  const username = isChallenge
    ? post?.challenge.author?.username
    : post?.author?.username;
  const authorId = isChallenge
    ? post?.challenge?.author?.userId
    : post?.author?.userId
    ? post?.author?.userId
    : post?.author;
  const profileImage = isChallenge
    ? post?.challenge?.author?.profileImage
    : post?.author?.profileImage;

  const isAuthor = authorId === FireAuth().currentUser.uid;

  const _toggleMenu = () => setVisible((prev) => !prev);

  const _handleEditPress = () => {
    console.log("showPostttt - > ", JSON.stringify(post));
    navigation.navigate("DiscoverStack", {
      id: id,
      data: post,
      isEdit: true,
      from: "EditPost",
    });

    _toggleMenu();
  };

  const _savePost = async () => {
    setVisible(false);
    const data = await savePostInDb(post.id);

    toast.show(data);

    console.log("pppp ", postSaveTrigger());
    if (postSaveTrigger()) {
      postSaveTrigger();
    }
  };

  const _handleDeletePress = async () => {
    await deletePost(id);
    postDeleted();
  };

  const reportPost = (isReportCount) => {
    setVisible(false);
    postReport(isReportCount);
  };

  const blockUser = () => {
    // console.log("blockUserPost -- > ", post)
    setVisible(false);
    postReport(2);
  };
  const route = useRoute();
  return (
    <View
      horizontal
      style={{
        ...styles.header,
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : AppColors.white.white,
      }}
    >
      <TouchableOpacity
        disabled={post?.announcement}
        onPress={() => {
          let userId = isChallenge
            ? post?.challenge?.author?.userId
            : post?.author?.userId;
          if (
            username == post.author.username &&
            route.name == "MyPosts" &&
            !userId
          ) {
            return;
          }

          navigation.push("MyPosts", {
            userId: userId,
            username: username,
            refreshCall: postRefresh,
          });
        }}
      >
        <View horizontal>
          {showIndex && (
            <View style={styles.indexCounter}>
              <Text sm bold>
                {postIndex === 0 ? 1 : postIndex + 1}
              </Text>
            </View>
          )}
          {post?.announcement == true ? (
            <FastImage
              style={{
                width: 68,
                height: 68,
                borderRadius: 2,
                marginVertical: 10,
                borderWidth: 1.4,
                borderRadius: 68 / 2,
                backgroundColor: Colors.outline,
                borderColor:
                  themeType == Theme_Mode.isDark
                    ? AppColors.white.white
                    : AppColors.blue.royalBlue,
              }}
              source={AppImages.Common.listahIcon}
            />
          ) : (
            <View style={{ width: post.author?.verified ? 76 : 70 }}>
              <LoadingImage
                source={{ uri: `${profileImage}` }}
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: 2,
                  marginVertical: 10,
                  borderWidth: 1.4,
                  borderRadius: 68 / 2,
                  backgroundColor: Colors.outline,
                  borderColor:
                    themeType == Theme_Mode.isDark
                      ? AppColors.white.white
                      : AppColors.blue.royalBlue,
                }}
              />

              {post.author?.verified && (
                <FastImage
                  style={{
                    width: normalized(35),
                    height: normalized(35),
                    position: "absolute",
                    bottom: normalized(-5),
                    marginStart: normalized(45),
                    borderRadius: normalized(35 / 2),
                  }}
                  source={
                    themeType === Theme_Mode.isDark
                      ? AppImages.Common.aPlusIconDark
                      : AppImages.Common.aPlusIcon
                  }
                />
              )}
            </View>
          )}

          <View style={styles.userInfoContainer}>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 16,
                color:
                  themeType == Theme_Mode.isDark
                    ? AppColors.white.white
                    : darkModeColors.background,
                width: Dimensions.get("screen").width - 200,
              }}
              adjustsFontSizeToFit={true}
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text
              style={{
                color:
                  themeType == Theme_Mode.isDark
                    ? AppColors.white.white
                    : darkModeColors.background,
              }}
            >
              {post?.announcement == true ? "A-Listah" : username}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {!isChallenge && !post?.announcement && (
        <Menu
          visible={visible}
          style={{
            backgroundColor:
              themeType == Theme_Mode.isDark
                ? AppColors.black.black
                : AppColors.white.white,
          }}
          onRequestClose={_toggleMenu}
          anchor={
            <Touchable style={styles.menuBtn} onPress={_toggleMenu}>
              <MenuIcon
                stroke={
                  themeType == Theme_Mode.isDark
                    ? AppColors.white.white
                    : AppColors.black.black
                }
              />
            </Touchable>
          }
        >
          <>
            {isAuthor ? (
              <>
                <MenuItem
                  onPress={_savePost}
                  textStyle={{
                    color:
                      themeType == Theme_Mode.isDark
                        ? AppColors.white.white
                        : darkModeColors.background,
                  }}
                >
                  Save Post
                </MenuItem>
                <MenuItem
                  onPress={_handleEditPress}
                  textStyle={{
                    color:
                      themeType == Theme_Mode.isDark
                        ? AppColors.white.white
                        : darkModeColors.background,
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  onPress={_handleDeletePress}
                  textStyle={{
                    color:
                      themeType == Theme_Mode.isDark
                        ? AppColors.white.white
                        : darkModeColors.background,
                  }}
                >
                  Delete
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem
                  onPress={_savePost}
                  textStyle={{
                    color:
                      themeType == Theme_Mode.isDark
                        ? AppColors.white.white
                        : darkModeColors.background,
                  }}
                >
                  Save Post
                </MenuItem>
                <MenuItem
                  onPress={blockUser}
                  textStyle={{
                    color:
                      themeType == Theme_Mode.isDark
                        ? AppColors.white.white
                        : darkModeColors.background,
                  }}
                >
                  Block User
                </MenuItem>
                <MenuItem
                  onPress={() => reportPost(0)}
                  textStyle={{
                    color:
                      themeType == Theme_Mode.isDark
                        ? AppColors.white.white
                        : darkModeColors.background,
                  }}
                >
                  Report Post
                </MenuItem>
                <MenuItem
                  onPress={() => reportPost(1)}
                  textStyle={{
                    color:
                      themeType == Theme_Mode.isDark
                        ? AppColors.white.white
                        : darkModeColors.background,
                  }}
                >
                  Report User
                </MenuItem>
              </>
            )}
          </>
        </Menu>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  indexCounter: {
    width: 12,
    height: 20,
    marginRight: 12,
    // borderWidth: 2,
    paddingTop: 2,
    // borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    justifyContent: "space-between",
  },
  userInfoContainer: {
    marginLeft: 15,
  },
  menuBtn: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

const mapStateToProps = (state, { id }) => ({
  mpost: getPostsById(state, { id }),
});

const mapDispatchToProps = {
  deletePost: deletePostAction,
};

// eslint-disable-next-line max-len
const propsAreEqual = (prevProps, nextProps) =>
  prevProps.id === nextProps.id &&
  prevProps.post?.title === nextProps.post?.title &&
  prevProps.post?.author?.userId === nextProps.post?.author?.userId &&
  prevProps.post?.author?.username === nextProps.post?.author?.username &&
  prevProps.post?.author?.profileImage === nextProps.post?.author?.profileImage;

/* Export
============================================================================= */
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(PostItemHeader, propsAreEqual));
