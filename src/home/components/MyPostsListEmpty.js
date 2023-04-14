import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '../../common';
import * as Colors from '../../config/colors';

import { getLoading } from '../redux/selectors';
import { useNavigation } from '@react-navigation/native';

/* =============================================================================
<MyPostsListEmpty />
============================================================================= */
const MyPostsListEmpty = ({ loading, route }) => {
  
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size='large' color={Colors.primary} />
      ) : (
        <Text sm center>You don't have posts</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginTop: 200,
    marginHorizontal: 30,
  },
});

const mapStateToProps = (state) => ({
  loading: getLoading(state),
});

export default connect(mapStateToProps)(MyPostsListEmpty);
