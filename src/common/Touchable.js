import React from 'react';
import { StyleSheet, Pressable } from 'react-native';

/* =============================================================================
<Touchable />
============================================================================= */
const Touchable = ({
  style,
  flex,
  block,
  center,
  children,
  horizontal,
  ...props
}) => (
  <Pressable
    style={[
      flex && styles.flex,
      block && styles.block,
      center && styles.center,
      horizontal && styles.horizontal,
      style,
    ]}
    {...props}>
    {children}
  </Pressable>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  block: {
    width: '100%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

/* Export
============================================================================= */
export default Touchable;
