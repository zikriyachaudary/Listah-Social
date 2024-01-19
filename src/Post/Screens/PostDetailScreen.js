import React, { useLayoutEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import CustomHeader from "../../common/CommonHeader";
import { AppStyles } from "../../util/AppStyles";
import { AppColors, AppImages, normalized } from "../../util/AppConstant";
import useNotificationManger from "../../hooks/useNotificationManger";
import { PostItem } from "../../common";
import { blockUsers } from "../../home/redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { setIsAppLoader } from "../../redux/action/AppLogics";

const PostDetailScreen = (props) => {
  const dispatch = useDispatch();
  const selector = useSelector((AppState) => AppState);
  const { fetchPostDetail } = useNotificationManger();
  const postId = props?.route?.params?.postId;
  const [post, setPost] = useState(null);

  useLayoutEffect(() => {
    if (postId) {
      dispatch(setIsAppLoader(true));
      fetchPostDetail(postId, (atRes) => {
        if (atRes?.length > 0) {
          setPost(atRes);
        }
        setTimeout(() => {
          dispatch(setIsAppLoader(false));
        }, 1500);
      });
    }
  }, []);
  return (
    <View style={AppStyles.MainStyle}>
      <CustomHeader
        atBackPress={() => {
          props?.navigation.goBack();
        }}
        isStatusBar={true}
        logo={AppImages.Common.appLogo}
        mainStyle={{ backgroundColor: AppColors.blue.royalBlue }}
      />
      {post?.length > 0 ? (
        <FlatList
          data={post}
          style={{
            backgroundColor: AppColors.white.lightSky,
            paddingHorizontal: 18,
            paddingVertical: normalized(10),
            zIndex: 0,
            flex: 1,
          }}
          keyExtractor={(item, index) => `${index}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => {
            return (
              <PostItem
                id={item?.id}
                post={item}
                postIndex={index}
                showIndex={false}
                postRefresh={() => {}}
                postDel={() => {}}
                postReport={async (isReportCount) => {
                  if (isReportCount == 2) {
                    await blockUsers(item?.author?.userId);
                    setTimeout(() => {
                      if (props?.navigation?.canGoBack()) {
                        props?.navigation.goBack();
                      }
                    }, 2000);
                  } else {
                    props?.navigation.navigate("ReportPost", {
                      post: item,
                      isReportCount: isReportCount,
                    });
                  }
                }}
              />
            );
          }}
        />
      ) : !selector?.sliceReducer?.isLoaderStart ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              color: AppColors.black.black,
              fontSize: normalized(16),
              fontWeight: "400",
            }}
          >
            Post not Found!
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default PostDetailScreen;
