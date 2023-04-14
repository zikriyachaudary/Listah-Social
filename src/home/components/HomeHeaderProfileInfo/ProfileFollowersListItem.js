import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';

import { Avatar, Text, View } from '../../../common';
import { getProfileById } from '../../../profile/redux/selectors';

/* =============================================================================
 ProfileFollowersListItem />
============================================================================= */
const ProfileFollowersListItem = ({ id, profile }) => {
  const [user, setUser] = useState();
  const username = user?.username;
  const profileImage = user?.profileImage;

  useEffect(() => {
    if (profile) {
      profile.then((res) => setUser(res));
    }
  }, [])

  if (!user) {
    return null
  }

  return (
    <View horizontal style={styles.container}>
      <Avatar url={{ uri: `${profileImage}` }} />
      <Text style={styles.txt}>{username}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
  },
  txt: {
    marginLeft: 10,
  }
});

const mapStateToProps = (state, { id }) => ({
  profile: getProfileById(state, { id }),
});

/* Export
============================================================================= */
export default connect(mapStateToProps)(ProfileFollowersListItem);
