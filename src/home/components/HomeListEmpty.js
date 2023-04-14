import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { Text, View } from '../../common';
import * as Colors from '../../config/colors';

import { getLoading } from '../redux/selectors';

/* =============================================================================
<HomeListEmpty />
============================================================================= */
const HomeListEmpty = ({ loading }) => {
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size='large' color={Colors.primary} />
      ) : (
        <Text sm center>You don't have any followers. follow people to see there posts</Text>
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

export default connect(mapStateToProps)(HomeListEmpty);
