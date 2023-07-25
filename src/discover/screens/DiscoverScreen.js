import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import {
  Container,
  StackHeader,
  View,
  Text,
  PostDiscoveryItem,
  PostItem,
} from "../../common";
import DiscoverListEmpty from "../components/DiscoverListEmpty";
import NavSearch from "../../assets/icons/nav-search.svg";
import ChevronLeftIcon from "../../assets/icons/edit-chevron-left.svg";

import {
  getLikedPosts as selectLikedPosts,
  getPostsById,
} from "../redux/selectors";
import {
  getLikedPosts as getLikedPostsAction,
  refreshLikedPosts as refreshLikedPostsAction,
} from "../redux/actions";
import { blockUsers } from "../../home/redux/actions";

/* =============================================================================
<DiscoverScreen />
============================================================================= */
let reportPostItem = null;

const DiscoverScreen = ({ likedPosts, getLikedPosts, refreshLikedPosts }) => {
  const isFocused = useIsFocused();
  const [likePosts, setLikePost] = useState(likedPosts);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [reportPostModal, setReportPostModal] = useState(true);
  const navigation = useNavigation();
  const selector = useSelector((AppState) => AppState);
  const [searchPostVisible, setSearchPostVisible] = useState(false);
  const [filtersPost, setFiltersPost] = useState([]);
  const [searchTxt, setSearchTxt] = useState("");

  // GET_LIKED_POSTS
  useEffect(() => {
    if (isFocused) {
      getLikedPosts();
      // console.log("printLikedPosts - > " , JSON.stringify(selector))
    }
  }, [isFocused]);


  useEffect(()=>{
    setLikePost(likedPosts)
  }, [likedPosts])

  const _renderListEmptyComponent = () => (
    <View center flex>
      <Text sm>No Posts</Text>
    </View>
  );

  const _handleRefresh = () => {
    getLikedPosts();
  };

  const _handleEndReach = () => {
    refreshLikedPosts(likedPosts[likedPosts.length - 1]);
  };

  const _renderListHeaderComponent = () =>
    // <StackHeader title='Discover' left={<View />} />
    searchPostVisible ? (
      null
    ) : (
      <StackHeader
        title="Search"
        left={<View />}
        right={<NavSearch />}
        rightContainerStyle={{ justifyContent: "center" }}
        onRightPress={() => {
          setSearchPostVisible(true);
          console.log("rightClicked");
        }}
      />
    );

  const renderItem = ({ item, index }) => (
    <PostItem
      id={item}
      post={getPostsById(selector, { id: item })}
      postIndex={index}
      showIndex={toggleCheckBox}
      postRefresh={() => {
        console.log("called from like");
        _handleRefresh();
        // setLoaderVisible(true)
        // getMyUserHomePosts()
      }}
      postDel={() => {
        // getMyUserHomePosts()
        getLikedPosts();
      }}
      postReport={async (isReportCount) => {
        console.log("called");
        if (isReportCount == 2) {
          await blockUsers(item.author.userId);
          getLikedPosts();
        } else {
          reportPostItem = item;
          setReportPostModal(true);
          navigation.navigate("ReportPost", {
            post: item,
            isReportCount: isReportCount,
          });
        }
      }}
    />
  );

  return (
    <Container>
      {searchPostVisible ? (
      <SafeAreaView>
        <View style={styles.searchTopStyle}>
          <TouchableOpacity
            onPress={() => {
              console.log("pppppp")
              setFiltersPost([]);
              setSearchTxt("");
              setSearchPostVisible(!searchPostVisible);
            }}
          >
            <View
              style={{
                paddingHorizontal: 5,
              }}
            >
              <ChevronLeftIcon />
            </View>
          </TouchableOpacity>

          <TextInput
            style={{
              flex: 1,
              height: 40,
              fontSize: 16,
            }}
            placeholder="Search in post..."
            placeholderTextColor={"gray"}
            value={searchTxt}
            onChange={(txt) => {
              let usersFiltersPost = [];
              console.log("lllll ", likePosts)
              likePosts.forEach((object) => {
                const obj = getPostsById(selector, { id: object })
                console.log("printMObject - > " , obj)
                if (
                  obj.searchTxt &&
                  obj.searchTxt
                    .toLowerCase()
                    .includes(String(txt.nativeEvent.text).toLowerCase())
                ) {
                  usersFiltersPost.push(object);
                }
              });
              console.log("filter -- > ", usersFiltersPost);
              setFiltersPost(
                txt.nativeEvent.text == "" ? [] : usersFiltersPost
              );
              setSearchTxt(txt);
            }}
          />
        </View>
      </SafeAreaView>
    ) : null}
      <FlatList
        data={searchPostVisible ? filtersPost : likePosts}
        refreshing={false}
        renderItem={renderItem}
        keyExtractor={renderKeyExtractor}
        contentContainerStyle={styles.content}
        ListEmptyComponent={DiscoverListEmpty}
        ListHeaderComponent={_renderListHeaderComponent}
        onRefresh={_handleRefresh}
        onEndReached={_handleEndReach}
      />
    </Container>
  );
};

// const renderItem = ({ item }) => <PostDiscoveryItem id={item} discovery={true} />;
const renderKeyExtractor = (item) => `${item}`;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
  },
  searchTopStyle: {
    flexDirection: "row",
    height: 40,
    marginHorizontal: 18,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    alignItems: "center",
    paddingHorizontal: 12,
  },
});

const mapStateToProps = (state) => ({
  likedPosts: selectLikedPosts(state),
});

const mapDispatchToProps = {
  getLikedPosts: getLikedPostsAction,
  refreshLikedPosts: refreshLikedPostsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DiscoverScreen);
