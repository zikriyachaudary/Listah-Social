import React from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { View } from '../../common'
import * as Colors from '../../config/colors';

import { getLoading } from '../redux/selectors';

/* =============================================================================
<HomeListFooter />
============================================================================= */
const HomeListFooter = ({ loading }) => {
  return (
    <View>
      {loading && (
        <ActivityIndicator size='small' color={Colors.primary} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
});

const mapStateToProps = (state) => ({
  loading: getLoading(state),
});

export default connect(mapStateToProps)(HomeListFooter);
