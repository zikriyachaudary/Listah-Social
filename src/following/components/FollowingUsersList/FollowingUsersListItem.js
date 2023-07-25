import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';

import { Avatar, Button, Text, View } from '../../../common';

import { unFollowUser as unFollowUserAction } from '../../redux/actions';
import * as Colors from '../../../config/colors';
import LoadingImage from '../../../common/LoadingImage';

/* =============================================================================
<FollowingUsersListItem />
============================================================================= */
const FollowingUsersListItem = ({ user, unFollowUser }) => {
  const [loading, setLoading] = useState(false);
  const userId = user?.userId;
  const userName = user?.username;
  const userProfileImage = user?.profileImage;

  const _handleUnFollowPress = async () => {
    setLoading(true);
    await unFollowUser(userId);
    setLoading(false)
  };

  if (!user) {
    return null
  };

  

  return (
    <View horizontal style={styles.container}>
      <View horizontal>
        {/* <Avatar url={{ uri: `${userProfileImage}` }} /> */}
        <LoadingImage
            source={{ uri: `${userProfileImage}` }}
            style={{
              width: 68,
              height: 68,
              borderRadius: 2,
              marginVertical: 10,
              borderWidth: 1.4,
              borderRadius: 68 / 2,
              backgroundColor: Colors.outline,
              borderColor: "yellow",
            }}
          />
        <Text style={styles.userNameTxt}>{userName}</Text>
      </View>
      <Button
        title='Unfollow'
        loading={loading}
        style={styles.btn}
        btnTxtStyles={styles.btnTxtStyles}
        onPress={_handleUnFollowPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    justifyContent: 'space-between',
  },
  userNameTxt: {
    marginLeft: 10,
  },
  btn: {
    width: 120
  },
  btnTxtStyles: {
    fontSize: 12,
  }
});

const mapDispatchToProps = {
  unFollowUser: unFollowUserAction,
};

/* Export
============================================================================= */
export default connect(null, mapDispatchToProps)(FollowingUsersListItem);
