import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';

import View from '../../../View';
import Text from '../../../Text';
import Avatar from '../../../Avatar';

import { getProfileById } from '../../../../profile/redux/selectors';

/* =============================================================================
 PostDiscoveryCommentItem />
============================================================================= */
const PostDiscoveryCommentItem = ({ text, profile }) => {
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
      <Avatar size={45} url={{ uri: `${profileImage}` }} />
      <View flex style={styles.txtContainer}>
        <Text sm>{username}</Text>
        <Text medium>{text}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'flex-start',
    backgroundColor: '#f1f1f1'
  },
  txtContainer: {
    marginLeft: 10,
  }
});

const mapStateToProps = (state, { author }) => ({
  profile: getProfileById(state, { id: author })
});
// eslint-disable-next-line max-len
const propsAreEqual = (prevProps, nextProps) => prevProps.text === nextProps.text
  && prevProps.author === nextProps.author
  && prevProps.profile.toString() === nextProps.profile.toString();

/* Export
============================================================================= */
export default connect(mapStateToProps)(React.memo(PostDiscoveryCommentItem, propsAreEqual));
