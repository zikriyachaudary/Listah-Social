import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { PostItem, Container, StackHeader } from '../../common'
import MyPostsListEmpty from '../components/MyPostsListEmpty';

import { getMyPosts } from '../redux/selectors';
import {
  blockUsers,
  getHomePosts as getHomePostsAction,
  getPostsByID,
  refreshHomePosts as refreshHomePostsAction,
} from '../redux/actions';
import { getProfile } from '../../profile/redux/selectors';
import { constants, startLoader } from '../redux/constants'
import * as Colors from '../../config/colors';
import { ScrollView } from 'react-native-gesture-handler';
import FireAuth from '@react-native-firebase/auth';
import Text from '../../common/Text';
// import View from '../../common/View';
// import Avatar from '../../common/Avatar';
// import Touchable from '../../common/Touchable';

/* =============================================================================
<MyPostsScreen />

============================================================================= */
const MyPostsScreen = ({ posts, profile, refreshHomePosts, route }) => {
  const isFocused = useIsFocused();
  const [userPosts, setUserPosts] = useState([])
  const [loaderVisible, setLoaderVisible] = useState(true)
  const navigation = useNavigation();

  // GET POSTS
  useEffect(() => {
    if (isFocused) {
      // getHomePosts();
      setLoaderVisible(true)
      getPostsByUserId()
    }

  }, [isFocused]);

  const getPostsByUserId = async () => {
    const totalPosts = await getPostsByID(route.params.userId)
    setUserPosts(totalPosts)
    setLoaderVisible(false)
    // dispatch(startLoader(false));
  }
  const _handlePostsGet = () => {
    if (userPosts) {
      // getPostsByUserId()
    }
  };

  const renderItem = ({ item, index }) => {
    console.log("mInnnn ", index)
    return (
      <PostItem
        id={item.id}
        post={item}
        postDel={() => {
          getPostsByUserId()
          route.params.refreshCall()
        }}
        postReport={async (isReportCount) => {
          console.log("reportClick")
          if (isReportCount == 2) {
            await blockUsers(item.author.userId)
            navigation.goBack()
          } else {
            reportPostItem = item
            // setReportPostModal(true)
            navigation.navigate("ReportPost", {
              post: item,
              isReportCount: isReportCount
            })
          }
        }} />
    )
  };

  return (
    <Container>
      <StackHeader title={route.params.userId == profile.userId ? 'My Posts' : route.params.username + ' Posts'} />
      {
        loaderVisible ?
          <View style={styles.container}>
            <ActivityIndicator size='large' color={Colors.primary} />
          </View>
          : userPosts.length == 0 && <Text sm center>You don't have posts</Text>
      }
      {
        userPosts.length > 0 &&
        <FlatList
          data={userPosts}
          refreshing={false}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            return item.id;
          }}
          contentContainerStyle={styles.content}
          onEndReached={_handlePostsGet}
        />
      }

    </Container>
  );


};

const renderKeyExtractor = item => `${item}`;


const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
  },
  container: {
    height: '100%',
    marginTop: 200,
    marginHorizontal: 30,
  },

  itemContainer: {
    maxHeight: 500,
    marginVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 6,
    paddingTop: 5,
    backgroundColor: '#fff',
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
    justifyContent: 'space-between',
  },
  userInfoContainer: {
    marginLeft: 15,
  },
  menuBtn: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

const mapStateToProps = (state) => ({
  posts: getMyPosts(state),
  profile: getProfile(state),
});


export default connect(mapStateToProps)(MyPostsScreen);
