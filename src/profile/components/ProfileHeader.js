import React from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar, Touchable, View } from "../../common";
import EditIcon from "../../assets/icons/edit-icon.svg";
import * as Colors from "../../config/colors";
import LoadingImage from "../../common/LoadingImage";
import { AppColors } from "../../util/AppConstant";
import { Theme_Mode } from "../../util/Strings";
import { useSelector } from "react-redux";

/* =============================================================================
<ProfileHeader />
============================================================================= */
const ProfileHeader = ({ photoUrl }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);

  const _handleEditPress = () => navigation.navigate("EditProfile");

  return (
    <LinearGradient
      end={{ x: 1, y: 0 }}
      start={{ x: 0, y: 0 }}
      style={styles.container}
      colors={[Colors.primary, "#894ebf", "#a87ecf"]}
    >
      <View horizontal style={styles.header}>
        <Touchable style={styles.editBtn} onPress={_handleEditPress}>
          <EditIcon />
        </Touchable>
      </View>
      <LoadingImage
        source={{ uri: `${photoUrl}` }}
        style={{
          width: 160,
          height: 160,
          borderRadius: 2,
          borderWidth: 1.4,
          borderRadius: 160 / 2,
          backgroundColor: Colors.outline,
          borderColor:
            themeType === Theme_Mode.isDark
              ? AppColors.white.white
              : AppColors.blue.royalBlue,
        }}
      />
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
      justifyContent: "flex-end",
    },
    editBtn: {
      paddingTop: insets.top + 10,
      paddingHorizontal: 25,
    },
  });

export default ProfileHeader;
