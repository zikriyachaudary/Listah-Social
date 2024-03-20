import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { StyleSheet, TouchableWithoutFeedback } from "react-native";

import { Avatar, Text, View } from "../../../common";
import { getProfileById } from "../../../profile/redux/selectors";
import { Theme_Mode } from "../../../util/Strings";
import { darkModeColors, lightModeColors } from "../../../util/AppConstant";

/* =============================================================================
 ProfileFollowersListItem />
============================================================================= */
const ProfileFollowersListItem = ({ id, profile, onItemPress }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  const [user, setUser] = useState();
  const username = user?.username;
  const profileImage = user?.profileImage;

  useEffect(() => {
    if (profile) {
      profile.then((res) => setUser(res));
    }
  }, []);

  if (!user) {
    return null;
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log("onPressCall", user);
        onItemPress(user);
      }}
    >
      <View horizontal style={styles.container}>
        <Avatar url={{ uri: `${profileImage}` }} />
        <Text
          style={{
            ...styles.txt,
            color:
              themeType == Theme_Mode.isDark
                ? darkModeColors.text
                : lightModeColors.text,
          }}
        >
          {username}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  txt: {
    marginLeft: 10,
  },
});

const mapStateToProps = (state, { id }) => ({
  profile: getProfileById(state, { id }),
});

/* Export
============================================================================= */
export default connect(mapStateToProps)(ProfileFollowersListItem);
