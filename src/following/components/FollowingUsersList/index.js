import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';

import { Text, View } from '../../../common';
import FollowingUsersListItem from './FollowingUsersListItem';
import * as Colors from '../../../config/colors';


import { getLoading, getUserFollowings as selectUserFollowings } from '../../redux/selectors';

/* =============================================================================
<FollowingUsersList />
============================================================================= */
const FollowingUsersList = ({ userFollowings, loading }) => {
  const _renderListEmptyComponent = () => (
    <View center style={styles.emptyComponentContainer}>
      {loading ? (
        <ActivityIndicator size='large' color={Colors.primary} />
      ) : (
        <Text>No Followers</Text>
      )}
    </View>
  );

  return (
    <FlatList
      data={userFollowings}
      refreshing={false}
      renderItem={renderItem}
      keyExtractor={renderKeyExtractor}
      contentContainerStyle={styles.content}
      ListEmptyComponent={_renderListEmptyComponent}
    />
  );
};

const renderKeyExtractor = item => `${item?.userId}`;
const renderItem = ({ item, i }) => <FollowingUsersListItem key={i} user={item} />;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
  },
  emptyComponentContainer: {
    height: '100%',
  },
});

const mapStateToProps = (state) => ({
  userFollowings: selectUserFollowings(state),
  loading: getLoading(state),
});

/* Export
============================================================================= */
export default connect(mapStateToProps)(FollowingUsersList);
