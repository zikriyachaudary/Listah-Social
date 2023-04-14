import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { Container, StackHeader, View, Text, PostDiscoveryItem, PostItem } from '../../common'
import DiscoverListEmpty from '../components/DiscoverListEmpty';

import { getLikedPosts as selectLikedPosts, getPostsById } from '../redux/selectors';
import {
  getLikedPosts as getLikedPostsAction,
  refreshLikedPosts as refreshLikedPostsAction,
} from '../redux/actions';
import { blockUsers } from '../../home/redux/actions';

/* =============================================================================
<DiscoverScreen />
============================================================================= */
let reportPostItem = null

const DiscoverScreen = ({ likedPosts, getLikedPosts, refreshLikedPosts }) => {
  const isFocused = useIsFocused();
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [reportPostModal, setReportPostModal] = useState(true)
  const navigation = useNavigation();
  const selector = useSelector((AppState) => AppState)

  // GET_LIKED_POSTS
  useEffect(() => {
    if (isFocused) {
      getLikedPosts();
      // console.log("printLikedPosts - > " , JSON.stringify(selector))
    }
  }, [isFocused]);

  const _renderListEmptyComponent = () => (
    <View center flex>
      <Text sm>No Posts</Text>
    </View >
  )

  const _handleRefresh = () => {
    getLikedPosts();
  };

  const _handleEndReach = () => {
    refreshLikedPosts(likedPosts[likedPosts.length - 1]);
  };

  const _renderListHeaderComponent = () => (
    <StackHeader title='Discover' left={<View />} />
  )

  
  const renderItem = ({ item, index }) =>
    <PostItem
      id={item}
      post={getPostsById(selector, {id: item})}
      postIndex={index}
      showIndex={toggleCheckBox}
      postRefresh={() => {
        console.log("called from like")
        _handleRefresh()
        // setLoaderVisible(true)
        // getMyUserHomePosts()
      }}
      postDel={() => {
        // getMyUserHomePosts()
        getLikedPosts();
      }}

      postReport={async (isReportCount) => {
        console.log("called")
        if (isReportCount == 2) {
          await blockUsers(item.author.userId)
          getLikedPosts();
        } else {
          reportPostItem = item
          setReportPostModal(true)
          navigation.navigate("ReportPost", {
            post: item,
            isReportCount: isReportCount
          })
        }
      }}

    />;

  return (
    <Container>
      <FlatList
        data={likedPosts}
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
const renderKeyExtractor = item => `${item}`;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
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
