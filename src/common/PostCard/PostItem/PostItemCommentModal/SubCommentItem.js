import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { connect, useSelector } from "react-redux";
import { getProfileById } from "../../../../profile/redux/selectors";
import Avatar from "../../../Avatar";
import Text from "../../../Text";
import {
  darkModeColors,
  lightModeColors,
  normalized,
} from "../../../../util/AppConstant";
import { Theme_Mode } from "../../../../util/Strings";

const SubCommentItem = ({ item, index, profile, author }) => {
  const [user, setUser] = useState();
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const username = user?.username;
  const profileImage = user?.profileImage;
  useEffect(() => {
    console.log("subComment - > ", item);
    if (profile) {
      profile.then((res) => {
        console.log("userVisible - > ", res);
        setUser(res);
      });
    }
  }, []);

  console.log("themeType-------", themeType);

  return (
    <View
      style={{
        marginEnd: 10,
        flexDirection: "row",
        justifyContent: "flex-end",
        marginStart: 40,
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <View
          style={{
            height: 25,
            width: 0.6,
            backgroundColor: "gray",
          }}
        />
        <View
          style={{
            height: 25,
            width: 15,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              height: 0.6,
              width: 15,
              backgroundColor: "gray",
            }}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          marginTop: 3,
        }}
      >
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <Avatar size={30} url={{ uri: `${profileImage}` }} />
            <View style={styles.txtContainer}>
              <Text
                medium
                style={{
                  fontSize: 13,
                  marginTop: 5,
                  color:
                    themeType == Theme_Mode.isDark
                      ? darkModeColors.text
                      : lightModeColors.text,
                }}
              >
                {username}
              </Text>
              <Text
                sm
                style={{
                  color:
                    themeType == Theme_Mode.isDark
                      ? darkModeColors.textAccent
                      : lightModeColors.textAccent,
                  maxWidth: normalized(250),
                }}
              >
                {item.text}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //   marginHorizontal: 10,
    //   marginTop: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: "flex-start",
    // backgroundColor: '#f1f1f1'
  },
  txtContainer: {
    marginLeft: 10,
  },
});

const mapStateToProps = (state, { author }) => ({
  profile: getProfileById(state, { id: author }),
});

export default connect(mapStateToProps)(React.memo(SubCommentItem));

export const ShowMoreSubCommentView = ({ onClick }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  return (
    <TouchableOpacity onPress={onClick}>
      <View
        style={{
          marginEnd: 10,
          flexDirection: "row",
          marginStart: 62,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {/* <View style={{
                        height: 25,
                        width: 0.6,
                        // backgroundColor: 'gray'

                    }} /> */}
          <View
            style={{
              height: 4,
              width: 15,
              justifyContent: "flex-end",
            }}
          >
            <View
              style={{
                height: 0.6,
                width: 25,
                backgroundColor: "gray",
              }}
            />
          </View>
          <Text
            medium
            style={{
              fontSize: 10,
              marginTop: -5,
              marginStart: 30,
              textDecorationLine: "underline",
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.textAccent
                  : lightModeColors.textAccent,
            }}
          >
            Show more replies
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
