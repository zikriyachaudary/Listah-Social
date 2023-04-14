import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { ActivityIndicator, AppState, Dimensions, Platform, StyleSheet, TextInput, TouchableOpacity, View, Image, FlatList, SafeAreaView } from 'react-native';
// import { FlatList } from 'react-native-gesture-handler';
import { useIsFocused, useNavigation } from '@react-navigation/native';

import { PostItem, Container, Text, Button } from '../../common';
import HomeListHeader from '../components/HomeListHeader';
import HomeListEmpty from '../components/HomeListEmpty';
import ListFooter from '../components/ListFooter';

import { getPosts as selectPosts } from '../redux/selectors';
import { getProfile as getProfileAction } from '../../profile/redux/actions';
import {
  blockUsers,
  getHomePosts as getHomePostsAction,
  getMyHomePosts,
  refreshHomePosts as refreshHomePostsAction,
} from '../redux/actions';
import { useState } from 'react';
import * as Colors from '../../config/colors';
import Modal, { ReactNativeModal } from "react-native-modal";
import { RadioGroup } from 'react-native-radio-buttons-group';
import CheckBox from '@react-native-community/checkbox';
import { getLoginUserNotificationCount } from '../../notification/redux/actions';


let reportPostItem = null
/* =============================================================================
<HomeScreen />
============================================================================= */
let allHomePosts = []
let lastSelectedId = "1"
const HomeScreen = ({ posts, getHomePosts, refreshHomePosts, getProfile }) => {
  const isFocused = useIsFocused();
  const [loaderVisible, setLoaderVisible] = useState(true)

  const dispatch = useDispatch()
  const [refreshing, setRefreshing] = useState(false)
  const navigation = useNavigation();
  const [radioButtons, setRadioButtons] = useState([
    {
      id: '1', // acts as primary key, should be unique and non-empty string
      label: 'Ascending List',
      value: 'ascendinglist',
      borderColor: "#6d14c4",
      selected: true
    },
    {
      id: '2',
      label: 'Descending List',
      value: 'descendinglist',
      borderColor: "#6d14c4"

    }
  ]);
  const [reportPostModal, setReportPostModal] = useState(true)
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const selector = useSelector((AppState) => AppState)
  // GET POSTS
  const [isFilterPopup, setIsFilterPopup] = useState(false)
  const [homePosts, setHomePosts] = useState([])

  const [reportText, setReportTxt] = useState("")
  useEffect(() => {
    console.log("callllllllll 0 ", selector.Home.updateHomeData)
    setLoaderVisible(true)
    getMyUserHomePosts()
    // getHomePosts();
    getProfile();
  }, [selector.Home.updateHomeData]);


 

  const getMyUserHomePosts = async () => {
    const mHomePosts = await getMyHomePosts()
    allHomePosts = mHomePosts
    setHomePosts(mHomePosts)
    setRefreshing(false)
    setLoaderVisible(false)

    // applyFilterOnList(allHomePosts)
    // setTimeout(() => {
    //   setLoaderVisible(false)
    // }, 500)

  }

  // const applyFilterOnList = (mHomePosts) => {
  //   const filterArray = radioButtons.filter((item) => item.selected)
  //   setHomePosts([])
  //   setTimeout(() => {
  //     if (filterArray.length > 0) {
  //       // console.log("filterId - > ", filterArray[0].id, allHomePosts[0])
  //       if (filterArray[0].id == "1") {
  //         setHomePosts(mHomePosts.reverse())
  //       } else {
  //         setHomePosts(mHomePosts.reverse())
  //       }
  //     } else {
  //       setHomePosts(mHomePosts)
  //     }
  //     setLoaderVisible(false)
  //     setRefreshing(false)

  //   },400)

  // }

  const _handlePostsGet = () => {
    if (posts) {
      // refreshHomePosts(posts[posts.length - 1]);
    }
  };



  const _handleRefresh = () => {
    console.log("callinf -- > ")
    setRefreshing(true)
    getMyUserHomePosts()
    // getHomePosts();
  }

  const renderItem = ({ item, index }) =>
    <PostItem
      id={item.id}
      post={item}
      postIndex={index}
      showIndex={toggleCheckBox}
      postRefresh={() => {
        setLoaderVisible(true)
        getMyUserHomePosts()
      }}
      postDel={() => {
        getMyUserHomePosts()
      }}

      postReport={async (isReportCount) => {
        console.log("called")
        if (isReportCount == 2) {
          await blockUsers(item.author.userId)
          getMyUserHomePosts()
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


  // const ReportPostModal = () => {
  //   return (

  //     <Modal
  //       isVisible={reportPostModal}
  //       deviceWidth={Dimensions.get("window").width}
  //       deviceHeight={Dimensions.get("window").height}
  //       onRequestClose={() => {
  //         console.log("called11")
  //         setReportTxt("")
  //         setReportPostModal(false)
  //       }}
  //       // onBackdropPress={() =>{ 
  //       //   setReportTxt("")
  //       //   setReportPostModal(false)
  //       // }}
  //       backdropOpacity={0.2}

  //     >
  //       <View style={styles.modalStyle}>
  //         <View style={{
  //           margin: 30,
  //           justifyContent: "center",
  //           alignItems: "center"
  //         }}>
  //           <Text style={{
  //             fontSize: 18,
  //             color: "black"
  //           }}>Reason for reporting this post?</Text>

  //           <View style={{
  //             borderColor: "gray",
  //             borderWidth: 1,
  //             width: "100%",
  //             marginVertical: 20,
  //             borderRadius: 5,
  //           }}>
  //             <TextInput
  //               style={{
  //                 padding: 20,
  //                 fontSize: 16
  //               }}
  //               placeholder={"Please add reason..."}
  //               onChangeText={(text) => {
  //                 setReportTxt(text)
  //               }}
  //             />
  //           </View>
  //         </View>
  //       </View>
  //     </Modal>
  //   )
  // }

  const emptyComponent = () => {
    return (
      <View style={styles.container}>

        {loaderVisible ? (
          <ActivityIndicator size='large' color={Colors.primary} />
        ) : (
          homePosts.length == 0 && <Text sm center>Nothing to show yet</Text>

          // homePosts.length == 0 && <Text sm center>You don't have any followers. follow people to see there posts</Text>
        )}
      </View>
    )
  }

  const onPressRadioButton = (radioButtonsArray) => {
    console.log("radiooooooo ", radioButtonsArray)
    setRadioButtons(radioButtonsArray);
  }

  const WrapperComponent = () => {
    return (
      <ReactNativeModal
        isVisible={isFilterPopup}
        onBackdropPress={() => {
          setIsFilterPopup(!isFilterPopup)
        }}>
        <View style={{ flex: 0.3, backgroundColor: "white", alignItems: "flex-start", paddingVertical: 20 }}>

          <Text style={{
            width: "100%",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
            color: "#6d14c4"

          }}>Filters</Text>
          <RadioGroup
            radioButtons={radioButtons}
            onPress={onPressRadioButton}
            layout='row'
            containerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 25
            }}
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 18,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CheckBox
              value={toggleCheckBox}
              tintColor="#6d14c4"
              onCheckColor="#6d14c4"
              onTintColor="#6d14c4"
              lineWidth={2}
              style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
              boxType={"circle"}
              onValueChange={(newValue) => {
                // setShhowModal(false)
                console.log("showNewValue - > ", newValue)
                setToggleCheckBox(newValue)
              }}
            />
            <Text style={{
              fontSize: 14,
              marginStart: 5,
              color: "black",
            }}>Numbered List</Text>
          </View>

          <View style={{
            width: "100%",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}>
            <Button
              title='Submit'
              onPress={() => {

                setIsFilterPopup(false)
                const filterArray = radioButtons.filter((item) => item.selected)
                if (filterArray.length > 0) {
                  if (lastSelectedId != filterArray[0].id) {
                    setLoaderVisible(true)
                    console.log("lastSelectedId - > ", lastSelectedId)
                    applyFilterOnList(allHomePosts)
                  } else {
                    setHomePosts([])
                    setLoaderVisible(true)
                    setTimeout(() => {
                      setLoaderVisible(false)
                      setHomePosts(allHomePosts)
                    }, 400)
                  }
                }
              }}
            />
          </View>
        </View>
      </ReactNativeModal>
    );
  }


  return (
    <SafeAreaView>
      <FlatList
        data={homePosts}
        refreshing={refreshing}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          return item.id;
        }}
        contentContainerStyle={styles.content}
        ListHeaderComponent={() => {
          return (
            <HomeListHeader
              postRefresh={() => {
                console.log("fetchUpdateData -- > ")
                getMyUserHomePosts()
              }}
              filterClick={() => {
                console.log("tap -- > ")
                const filterArray = radioButtons.filter((item) => item.selected)
                if (filterArray.length > 0)
                  lastSelectedId = filterArray[0].id
                setIsFilterPopup(!isFilterPopup)
              }} />
          )
        }}
        ListEmptyComponent={emptyComponent}
        ListFooterComponent={ListFooter}
        onEndReached={_handlePostsGet}
        onRefresh={_handleRefresh}
      />

      {/* <WrapperComponent /> */}
    </SafeAreaView>
  );
};

const renderKeyExtractor = item => `${item}`;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginTop: 200,
    marginHorizontal: 30,
  },
  modalStyle: {

    backgroundColor: "white",
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingVertical : 10,
    zIndex: 0,
  },
});

const mapStateToProps = (state) => ({
  posts: selectPosts(state),
});

const mapDispatchToProps = {
  getProfile: getProfileAction,
  refreshHomePosts: refreshHomePostsAction,
  getHomePosts: getHomePostsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
