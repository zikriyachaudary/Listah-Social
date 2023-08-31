import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image'
import { Pressable, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import View from './View';
import Text from './Text';
import * as Colors from '../config/colors';

import ChevronLeftIcon from '../assets/icons/edit-chevron-left.svg';
import AppLogoImg from '../assets/images/edit-app-logo.jpeg';

/* =============================================================================
<StackHeader />
============================================================================= */
const StackHeader = ({
  left,
  right,
  title,
  outlined,
  elevated,
  children,
  titleStyle,
  containerStyle,
  leftContainerStyle,
  rightContainerStyle,
  centerContainerStyle,
  onLeftPress,
  onRightPress,
  isHome = false
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const _handleLeftPress = () => {
    if (typeof onLeftPress === 'function') {
      onLeftPress();
    } else {
      navigation.goBack();
    }
  };

  const _handleRightPress = () => {
    if (typeof onRightPress === 'function') {
      onRightPress();
    }
  };

  const _renderLeft = () => {
    if (isHome) {
      return null
    }
    if (left) {
      return left;
    }
    return <ChevronLeftIcon />;
  };

  const _renderRight = () => {
    if (right) {
      return right;
    }
    return null;
  };

  const _renderCenter = () => {
    if (children) {
      return children;
    }
    if (title) {
      return (
        <Text style={[styles.title, titleStyle]} bold >
          {title}
        </Text>
      );
    }
    return (
      <FastImage style={styles.appLogoImg} source={AppLogoImg} />
    );
  };

  return (
    <View
      style={[
        styles.container,
        { height: !title ? insets.top + 120 : insets.top + 70, paddingTop: insets.top + 10 },
        outlined && styles.outlined,
        elevated && styles.elevated,
        containerStyle,
      ]}>
      <TouchableOpacity
        // style={[styles.left, { height: !title ? 110 : 0, width : 100 }, leftContainerStyle]}
        style = {{
          
          ...styles.left,
          ...leftContainerStyle,
        
        }}
        onPress={_handleLeftPress}>
        {_renderLeft()}
      </TouchableOpacity>
      <View style={[styles.center, centerContainerStyle]}>
        {_renderCenter()}
      </View>
      <Pressable
        style={[styles.right, { height: !title ? 110 : 0 }, rightContainerStyle]}
        onPress={_handleRightPress}>
        {_renderRight()}
      </Pressable>
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.black,
  },
  outlined: {
    borderBottomColor: Colors.outline,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  left: {
    flex: 1,
    paddingLeft: 15,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  center: {
    // flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 1,
    paddingRight: 15,
    paddingVertical: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    color: Colors.black,
    textAlign: 'center',
  },
  appLogoImg: {
    width: 100,
    height: 100,
  },
});

/* Export
  ============================================================================= */
export default StackHeader;
