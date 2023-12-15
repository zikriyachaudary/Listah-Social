import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import Avatar from "../../Avatar";
import Text from "../../Text";
import View from "../../View";
import * as Colors from "../../../config/colors";
import LoadingImage from "../../LoadingImage";
import Touchable from "../../Touchable";
import { getProfile } from "../../../profile/redux/selectors";
import { connect } from "react-redux";
import { AppColors, hv, normalized } from "../../../util/AppConstant";
const PostInnerItems = ({ post, userPosts, profile }) => {
  const [showMore, setShowMore] = useState(false);
  const [showMoreChallengePost, setShowMoreChallengePost] = useState(false);

  const [postItems, setPostItems] = useState(
    userPosts.length > 3 ? userPosts.slice(0, 3) : userPosts
  );

  useEffect(() => {
    if (showMore) {
      setPostItems(userPosts);
    } else {
      setPostItems(userPosts.length > 3 ? userPosts.slice(0, 3) : userPosts);
    }
  }, [showMore]);
  return (
    <View>
      {postItems?.length >= 0 &&
        postItems?.map((item, index) => {
          return (
            <View horizontal style={styles.item} key={index}>
              {post?.isNumberShowInItems ? (
                <View style={styles.innerStyle}>
                  {post.isNumberShowInItems && (
                    <View style={styles.indexCounter}>
                      <Text sm bold style={{ color: AppColors.white.white }}>
                        {post.order && post.order == "1"
                          ? index === 0
                            ? 1
                            : index + 1
                          : userPosts?.length - index}
                      </Text>
                    </View>
                  )}

                  <Text
                    style={{
                      fontSize: normalized(12),
                      color: AppColors.black.black,
                      fontWeight: "500",
                      marginStart: normalized(10),
                    }}
                    adjustsFontSizeToFit={true}
                    numberOfLines={4}
                  >
                    {item.name || "--"}
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    fontSize: normalized(12),
                    color: AppColors.black.black,
                    fontWeight: "500",
                    marginHorizontal: normalized(10),
                    flex: 0.5,
                  }}
                  adjustsFontSizeToFit={true}
                  numberOfLines={4}
                >
                  {item.name || "--"}
                </Text>
              )}

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  flex: post?.isNumberShowInItems ? 0.5 : 1,
                }}
              >
                {item?.image ? (
                  <LoadingImage
                    source={{ uri: `${item?.image}` }}
                    style={{
                      width: normalized(50),
                      height: normalized(50),
                      borderRadius: 2,
                      borderWidth: 1.4,
                      borderColor: AppColors.blue.royalBlue,
                    }}
                  />
                ) : null}

                <Text center xs light style={styles.descriptionTxt}>
                  {item.description || "--"}
                </Text>
              </View>
            </View>
          );
        })}

      {userPosts.length > 3 && (
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <TouchableOpacity onPress={() => setShowMore(!showMore)}>
            <Text
              style={{
                marginTop: 10,
                fontSize: 12,
                fontFamily: "Poppins-SemiBold",
                color: Colors.primary,
              }}
            >
              {!showMore ? "Show More..." : "Show Less..."}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
const mapStateToProps = (state) => ({
  profile: getProfile(state),
});
export default connect(mapStateToProps)(PostInnerItems);

const styles = StyleSheet.create({
  item: {
    marginTop: hv(10),
    paddingHorizontal: normalized(10),
    paddingVertical: normalized(10),
    borderWidth: 1,
    borderColor: AppColors.black.dark,
    justifyContent: "space-between",
    alignItems: "center",
  },
  indexCounter: {
    width: normalized(25),
    height: normalized(25),
    borderRadius: 25 / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.grey.Analogous,
  },
  imgContainer: {
    marginHorizontal: 5,
  },
  userInfoContainer: {
    marginLeft: 15,
  },
  descriptionTxt: {
    flex: 1.5,
  },
  menuBtn: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  btn: {
    flex: 1,
    paddingHorizontal: 20,
    marginVertical: 20,
    alignItems: "center",
  },
  btnTxt: {
    marginTop: 5,
    marginLeft: 5,
  },
  btnActiveTxt: {
    marginLeft: 5,
    marginTop: 5,
    color: Colors.primary,
  },
  innerStyle: {
    flexDirection: "row",
    alignItems: "center",
    flex: 0.5,
  },
});
