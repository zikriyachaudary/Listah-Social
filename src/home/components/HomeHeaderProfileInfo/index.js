import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Text, Touchable, View } from '../../../common';
import ListIcon from '../../../assets/icons/edit-list-icon.svg';
import GlobeIcon from '../../../assets/icons/edit-globe-icon.svg';
import UsersIcon from '../../../assets/icons/edit-users-icon.svg';
import ProfileFollowersListModal from './ProfileFollowersListModal';

import { getProfile } from '../../../profile/redux/selectors';

/* =============================================================================
<HomeHeaderProfileInfo />
============================================================================= */
const HomeHeaderProfileInfo = ({ profile }) => {
  const navigation = useNavigation();
  const [followersModal, setFollowersModal] = useState(false);
  const followers = profile?.followers;
  const followings = profile?.followings;

  // useEffect(()=>{
  //   console.log("followersList - > " , JSON.stringify(followers))
  // }, [])
  const _toggleFollowersModal = () => setFollowersModal((prev) => !prev);

  const _handleFollowingPress = () => {
    navigation.navigate('FollowingStack');
  };

  const _handleMyPostedPress = () => {
    console.log("printProfile = > ", profile)
    navigation.navigate('MyPosts', { userId: profile.userId, username: profile.username });
  };

  return (
    <View horizontal style={styles.container}>
      <Touchable center style={styles.item} onPress={_handleMyPostedPress}>
        <ListIcon />
        <Text sm>My Posts</Text>
      </Touchable>
      <Touchable center style={styles.item} onPress={_toggleFollowersModal}>
        <UsersIcon />
        <Text sm>{`Followers: ${followers?.length || 0}`}</Text>
      </Touchable>
      <Touchable center style={styles.item} onPress={_handleFollowingPress}>
        <GlobeIcon />
        <Text sm>{`Following: ${followings?.length || 0} `}</Text>
      </Touchable>
      <ProfileFollowersListModal
        followers={followers}
        visible={followersModal}
        onClose={_toggleFollowersModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    paddingVertical: 10,
  },
});

const mapStateToProps = (state) => ({
  profile: getProfile(state),
});

export default connect(mapStateToProps)(HomeHeaderProfileInfo);
