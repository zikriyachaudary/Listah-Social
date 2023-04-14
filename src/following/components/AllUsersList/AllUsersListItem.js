import React, { useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { StyleSheet } from 'react-native';

import { Avatar, Button, Text, View } from '../../../common';

import { getUserFollowings } from '../../redux/selectors';
import {
  followUser as followUserAction,
  unFollowUser as unFollowUserAction,
} from '../../redux/actions';
import { updateHomeData } from '../../../home/redux/appLogics';

/* =============================================================================
<AllUsersListItem />
============================================================================= */
const AllUsersListItem = ({ user, userFollowings, unFollowUser, followUser }) => {
  const [loading, setLoading] = useState(false);
  const userId = user?.userId;
  const userName = user?.username;
  const userProfileImage = user?.profileImage;
  const dispatch = useDispatch()
  const selector = useSelector((AppState) => AppState)
  const isFollowed = userFollowings?.find((user) => user?.userId === userId);

  const _handleFollowPress = async () => {
    setLoading(true);
    await followUser(userId);
    dispatch(updateHomeData(!selector.Home.updateHomeData))

    setLoading(false)
  };

  const _handleUnFollowPress = async () => {
    // if (isFollowed) {
    setLoading(true);
    await unFollowUser(userId);
    dispatch(updateHomeData(!selector.Home.updateHomeData))
    setLoading(false)
    // }
  };

  if (!user) {
    return null;
  };

  return (
    <View horizontal style={styles.container}>
      <View horizontal>
        <Avatar url={{ uri: `${userProfileImage}` }} />
        <Text style={styles.userNameText} numberOfLines={2}>{userName}</Text>
      </View>
      {isFollowed ? (
        <Button
          title='Unfollow'
          style={styles.btn}
          loading={loading}
          btnTxtStyles={styles.btnTxtStyles}
          onPress={_handleUnFollowPress}
        />
      ) : (
        <Button
          title='Follow'
          style={styles.btn}
          loading={loading}
          btnTxtStyles={styles.btnTxtStyles}
          onPress={_handleFollowPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    justifyContent: 'space-between',
  },
  userNameText: {
    marginLeft: 10,
    width : "45%", flexWrap: 'wrap'
  },
  btn: {
    width: 120
  },
  btnTxtStyles: {
    fontSize: 12,
  },
});

const mapStateToProps = (state) => ({
  userFollowings: getUserFollowings(state),
});

const mapDispatchToProps = {
  followUser: followUserAction,
  unFollowUser: unFollowUserAction,
};

/* Export
============================================================================= */
export default connect(mapStateToProps, mapDispatchToProps)(AllUsersListItem);
