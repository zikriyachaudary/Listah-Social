import React from 'react';
import { StyleSheet } from 'react-native';
import Touchable from './Touchable';


/* =============================================================================
<Card />
============================================================================= */
const Card = ({ width, height, children, style, shadow, onPress }) => {
  const _style = {
    width,
    height,
  };

  return (
    <Touchable
      style={[styles.container, _style, style, shadow ? styles.shadow : null]} onPress={onPress}>
      {children}
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 10,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
});

export default Card;
