import React from "react";
// import FastImage from 'react-native-fast-image'
import { StyleSheet, Image } from "react-native";

import View from "./View";
import * as Colors from "../config/colors";

import UserIcon from "../assets/icons/nav-profile-icon.svg";

const Avatar = ({ size, style, url }) => {
  const styles = getStyles(size);

  if (!url || url?.uri === "undefined") {
    return (
      <View style={[styles.container, style]}>
        <UserIcon />
      </View>
    );
  }

  return <Image source={url} style={[styles.image, style]} />;
};

Avatar.defaultProps = {
  size: 55,
};

const getStyles = (size) =>
  StyleSheet.create({
    container: {
      width: size,
      height: size,
      marginVertical: 10,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: size / 2,
      backgroundColor: Colors.outline,
    },
    image: {
      width: size,
      height: size,
      marginVertical: 10,
      borderWidth: 1.4,
      borderColor: "yellow",
      borderRadius: size / 2,
      backgroundColor: Colors.outline,
    },
    alt: {
      fontSize: size / 2.5,
    },
  });

/* Export
============================================================================= */
export default Avatar;
