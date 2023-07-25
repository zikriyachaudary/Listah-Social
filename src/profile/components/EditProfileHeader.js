import React from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar, Touchable, View } from "../../common";
import ChevronIcon from "../../assets/icons/edit-chevron-left-white.svg";
import * as Colors from "../../config/colors";
import LoadingImage from "../../common/LoadingImage";

/* =============================================================================
<EditProfileHeader />
============================================================================= */
const EditProfileHeader = ({ photoUrl, photoUrlLocalUrl }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);

  const _handleBackPress = () => navigation.goBack();
  return (
    <LinearGradient
      end={{ x: 1, y: 0 }}
      start={{ x: 0, y: 0 }}
      style={styles.container}
      colors={[Colors.primary, "#894ebf", "#a87ecf"]}
    >
      <View horizontal style={styles.header}>
        <Touchable style={styles.backBtn} onPress={_handleBackPress}>
          <ChevronIcon />
        </Touchable>
      </View>
      {photoUrlLocalUrl ? (
        // <Avatar size={160} url={photoUrlLocalUrl} />
        <LoadingImage
          source={photoUrlLocalUrl}
          style={{
            width: 160,
            height: 160,
            borderRadius: 2,
            borderWidth: 1.4,
            marginVertical: 10,
            borderRadius: 160 / 2,
            backgroundColor: Colors.outline,
            borderColor: "yellow",
          }}
        />
      ) : (
        // <Avatar size={160} url={{ uri: `${photoUrl}` }} />
        <LoadingImage
          source={{ uri: `${photoUrl}` }}
          style={{
            width: 160,
            height: 160,
            borderRadius: 2,
            borderWidth: 1.4,
            marginVertical: 10,
            borderRadius: 160 / 2,
            backgroundColor: Colors.outline,
            borderColor: "yellow",
          }}
        />
      )}
    </LinearGradient>
  );
};

const getStyles = (insets) =>
  StyleSheet.create({
    container: {
      paddingBottom: 20,
      alignItems: "center",
      paddingHorizontal: 20,
      height: insets.top + 230,
      paddingTop: insets.top + 40,
      position: "relative",
      backgroundColor: Colors.primary,
      zIndex: 50,
    },
    header: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      justifyContent: "flex-start",
    },
    backBtn: {
      paddingTop: insets.top + 10,
      paddingHorizontal: 25,
    },
  });

export default EditProfileHeader;
