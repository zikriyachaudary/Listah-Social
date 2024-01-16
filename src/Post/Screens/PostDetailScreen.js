import React, { useLayoutEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import CustomHeader from "../../common/CommonHeader";
import { AppStyles } from "../../util/AppStyles";
import { AppColors, AppImages, normalized } from "../../util/AppConstant";
import useNotificationManger from "../../hooks/useNotificationManger";
import { PostItem } from "../../common";
import { blockUsers } from "../../home/redux/actions";

const PostDetailScreen = (props) => {
  const { fetchPostDetail } = useNotificationManger();
  const postId = props?.route?.params?.postId;
  const [post, setPost] = useState(null);
  useLayoutEffect(() => {
    if (postId) {
      fetchPostDetail(postId, (atRes) => {
        if (atRes?.length > 0) {
          setPost(atRes);
        }
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
      ) : (
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
      )}
    </View>
  );
};

export default PostDetailScreen;
