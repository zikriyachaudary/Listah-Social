import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '../../common';
import * as Colors from '../../config/colors';

import { getLoading } from '../redux/selectors';

/* =============================================================================
<DiscoverListEmpty />
============================================================================= */
const DiscoverListEmpty = ({ loading }) => {
  return (
    <View style={styles.container} center>
      {loading ? (
        <ActivityIndicator size='large' color={Colors.primary} />
      ) : (
        <Text sm center>No posts available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    marginTop: -100,
    marginHorizontal: 30,
  },
});

const mapStateToProps = (state) => ({
  loading: getLoading(state),
});

export default connect(mapStateToProps)(DiscoverListEmpty);
