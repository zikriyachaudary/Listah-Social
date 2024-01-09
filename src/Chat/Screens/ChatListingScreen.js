import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
} from "../../util/AppConstant";
import SingleChatComponent from "../Components/SingleChatComponent";
import { AppStyles } from "../../util/AppStyles";
import { setIsHideTabBar } from "../../redux/action/AppLogics";
import { filterListAndSorted } from "../../util/helperFun";
import CustomHeader from "../../common/CommonHeader";
import { Routes } from "../../util/Route";

const ChatListingScreen = ({ navigation, route }) => {
  const isFouced = useIsFocused();
  const threadList = useSelector(
    (AppState) => AppState.sliceReducer.threadList
  );
  const dispatch = useDispatch();
  const selector = useSelector((AppState) => AppState.Profile);
  const userData = selector?.profile;
  const [chatList, setChatList] = useState([]);
  useFocusEffect(() => {
    if (isFouced) {
      dispatch(setIsHideTabBar(true));
    }
    return () => {
      dispatch(setIsHideTabBar(false));
    };
  }, [isFouced]);
  useEffect(() => {
    let mList = filterListAndSorted(threadList);
    if (mList.length > 0) {
      setChatList(mList);
    }
  }, [threadList]);
  return (
    <View style={AppStyles.MainStyle}>
      <CustomHeader
        atBackPress={() => {
          navigation.goBack();
        }}
        isStatusBar={true}
        logo={AppImages.Common.appLogo}
        mainStyle={{ backgroundColor: AppColors.blue.royalBlue }}
      />
      <Text
        style={{
          fontSize: normalized(24),
          fontWeight: "600",
          color: AppColors.black.dark,
          margin: AppHorizontalMargin,
        }}
      >
        Messages
      </Text>
      {chatList?.length > 0 ? (
        <>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            data={chatList}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index }) => {
              let findedIndex = item.participants.findIndex(
                (value) => value.user == userData?.userId?.toString()
              );
              let otherUserIndex = item.participants.findIndex(
                (value) => value.user != userData?.userId
              );
              if (findedIndex != -1) {
                return (
                  <SingleChatComponent
                    otherUserIndex={otherUserIndex}
                    findedIndex={findedIndex}
                    obj={item}
                    name={item.participants[otherUserIndex].userName}
                    profileImage={
                      item.participants[otherUserIndex].userProfileImageUrl
                    }
                    msg={item.lastMessage}
                    item={item}
                    atPress={() => {
                      navigation.navigate(Routes.Chat.chatScreen, {
                        thread: item,
                        from: Routes.Chat.chatList,
                      });
                    }}
                  />
                );
              }
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    height: 300,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: AppColors.black.dark,
                      fontSize: normalized(16),
                    }}
                  >
                    No search result found
                  </Text>
                </View>
              );
            }}
          />
        </>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: normalized(30),
          }}
        >
          <Image source={AppImages.Chat.emptyChat} style={{ width: "80%" }} />
          <Text
            style={{
              textAlign: "center",
              color: AppColors.black.dark,
              fontSize: normalized(16),
              fontWeight: "400",
              marginTop: hv(30),
            }}
          >
            Welcome to inbox!
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: AppColors.grey.dark,
              fontSize: normalized(12),
              fontWeight: "400",
              marginVertical: hv(10),
            }}
          >
            Here you’ll find all private conversations between you and your
            Participant
          </Text>
        </View>
      )}
    </View>
  );
};
export default ChatListingScreen;
