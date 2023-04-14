import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Text from './Text';
import * as Colors from '../config/colors';

/* =============================================================================
<HomeHeader />
============================================================================= */
const HomeHeader = () => {
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);

  return (
    <>
      <Text h1 center style={styles.titleTxt1}>Lista</Text>
      <Text h2 center style={styles.titleTxt2}>App</Text>
    </>
  );
};

const getStyles = (insets) => StyleSheet.create({
  titleTxt1: {
    paddingTop: insets.top + 29,
    color: Colors.primary,
  },
  titleTxt2: {
    marginTop: -30,
    marginBottom: 35,
    marginLeft: '30%',
  },
})

/* Export
============================================================================= */
export default HomeHeader;
