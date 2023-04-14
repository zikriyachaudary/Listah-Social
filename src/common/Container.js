import React from 'react';
import { StyleSheet, View } from 'react-native';


/* =============================================================================
<Container />
============================================================================= */
const Container = ({ style, center, children, ...props }) => (
  <View style={[styles.container, center && styles.center, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* Export
============================================================================= */
export default Container;
