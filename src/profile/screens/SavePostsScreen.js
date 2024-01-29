import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { PostItem, Container, StackHeader, Button } from "../../common";

import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as Colors from "../../config/colors";
import Text from "../../common/Text";
import { AppColors, AppImages, normalized } from "../../util/AppConstant";
import { blockUsers, getUserSavedPost } from "../../home/redux/actions";
import VideoPlayerModal from "../../common/VideoPlayerModal";

const SavePostsScreen = () => {
  const [openVideoModal, setOpenVideoModal] = useState("");
  const navigation = useNavigation();
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    getUsersSavedPosts();
  }, []);

  const getUsersSavedPosts = async () => {
    setLoaderVisible(true);
    let dataOfPost = await getUserSavedPost();
    setLoaderVisible(false);
    setSavedPosts(dataOfPost);
  };

  const getPostsByUserId = async () => {
    setLoaderVisible(true);
    let dataOfPost = await getUserSavedPost();
    setSavedPosts(dataOfPost);
    setLoaderVisible(false);
    // dispatch(startLoader(false));
  };
  const _handlePostsGet = () => {
    // if (userPosts) {
    // getPostsByUserId()
    // }
  };

  const renderItem = ({ item, index }) => {
    return (
      <PostItem
        id={item.id}
        post={item}
        postDel={() => {
          getPostsByUserId();
          route.params.refreshCall();
        }}
        openVideoModal={(uri) => {
          setOpenVideoModal(uri);
        }}
        postReport={async (isReportCount) => {
          if (isReportCount == 2) {
            await blockUsers(item.author.userId);
            navigation.goBack();
          } else {
            reportPostItem = item;
            // setReportPostModal(true)
            navigation.navigate("ReportPost", {
              post: item,
              isReportCount: isReportCount,
            });
          }
        }}
        postSaveTrigger={() => {
          getUsersSavedPosts();
        }}
      />
    );
  };

  return (
    <Container>
      <StackHeader title={"Saved Posts"} />

      {loaderVisible ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        savedPosts.length == 0 && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text sm center>
              You don't have any save posts
            </Text>
          </View>
        )
      )}

      {savedPosts.length > 0 && (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={savedPosts}
          refreshing={false}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            return item?.id;
          }}
          contentContainerStyle={styles.content}
          onEndReached={_handlePostsGet}
        />
      )}
      {openVideoModal ? (
        <VideoPlayerModal
          item={{ url: openVideoModal }}
          onClose={() => {
            setOpenVideoModal("");
          }}
        />
      ) : null}
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
  },
  container: {
    height: "100%",
    marginTop: 200,
    marginHorizontal: 30,
  },
  topPostsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    // width: 120,
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: Colors.primary,
    marginTop: 5,
    height: normalized(40),
  },
  btnTxtStyles: {
    fontSize: 12,
  },
  itemContainer: {
    maxHeight: 500,
    marginVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 6,
    paddingTop: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
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

export default SavePostsScreen;
