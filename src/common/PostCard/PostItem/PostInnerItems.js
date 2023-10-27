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
        postItems?.map((item, index) => (
          <View horizontal style={styles.item} key={index}>
            {post.isNumberShowInItems && (
              <View style={styles.indexCounter}>
                <Text sm bold>
                  {post.order && post.order == "1"
                    ? index === 0
                      ? 1
                      : index + 1
                    : userPosts?.length - index}
                </Text>
              </View>
            )}

            {item.image && (
              <View style={styles.imgContainer}>
                <LoadingImage
                  source={{ uri: `${item.image}` }}
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 2,
                    marginVertical: 10,
                    borderWidth: 1.4,
                    borderColor: "yellow",
                  }}
                />
                {/* <Avatar style={{ borderRadius: 2 }} size={58} url={{ uri: `${item.image}` }} /> */}
              </View>
            )}

            <Text
              style={{
                flex: 0.3,
                marginEnd: 8,
                fontSize: 12
              }}
              adjustsFontSizeToFit={true}
              numberOfLines={4}
              flex
              center
              sm
              medium
            >
              {item.name  || "--"}
            </Text>
            <Text center xs light style={styles.descriptionTxt}>
              {item.description || "--"}
            </Text>
          </View>
        ))}

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
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: "#999",
    justifyContent: "space-between",
  },
  indexCounter: {
    width: 30,
    height: 30,
    marginRight: 12,
    borderWidth: 2,
    paddingTop: 2,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  imgContainer: {
    marginRight: 5,
    flex: 0.3,
  },
  userInfoContainer: {
    marginLeft: 15,
  },
  descriptionTxt: {
    flex: 0.5
  },
  menuBtn: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  btn: {
    flex: 1,
    paddingHorizontal: 20,
    marginVertical: 20,
    alignItems: 'center',
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
});
