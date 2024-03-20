import React from "react";
import { StyleSheet } from "react-native";
import Modal from "react-native-modal";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";

import Card from "../Card";
import Text from "../Text";
import Touchable from "../Touchable";
import GalleryIcon from "../../assets/icons/edit-gallery.svg";
import CameraIcon from "../../assets/icons/edit-camera.svg";
import { Theme_Mode } from "../../util/Strings";
import {
  AppColors,
  darkModeColors,
  lightModeColors,
} from "../../util/AppConstant";
import { useSelector } from "react-redux";

/* =============================================================================
<ImagePickerModal />
============================================================================= */
const ImagePickerModal = ({ visible, onClose, onAdd }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const _handleOpenCameraPress = async () => {
    try {
      const result = await launchCamera({
        mediaType: "photo",
        quality: 1,
        includeBase64: true,
      });

      onAdd(result?.assets[0]);
    } catch (e) {
      // TODO
    } finally {
      onClose();
    }
  };

  const _handleOpenGalleryPress = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: "photo",
        quality: 1,
        includeBase64: true,
      });

      onAdd(result?.assets[0]);
    } catch (e) {
      // TODO
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      style={{
        ...styles.container,
      }}
      isVisible={visible}
      backdropOpacity={0.2}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <Card
        style={{
          ...styles.card,
          backgroundColor:
            themeType == Theme_Mode.isDark
              ? darkModeColors.background
              : lightModeColors.background,
        }}
      >
        <Touchable
          android_ripple={{ color: "#999" }}
          horizontal
          style={styles.item}
          onPress={_handleOpenCameraPress}
        >
          <CameraIcon
            width={20}
            height={20}
            stroke={
              themeType == Theme_Mode.isDark
                ? darkModeColors.text
                : lightModeColors.text
            }
          />
          <Text
            style={{
              ...styles.txt,
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
          >
            Open Camera
          </Text>
        </Touchable>
        <Touchable
          android_ripple={{ color: "#999" }}
          horizontal
          style={styles.item}
          onPress={_handleOpenGalleryPress}
        >
          <GalleryIcon
            width={20}
            height={20}
            stroke={
              themeType == Theme_Mode.isDark
                ? darkModeColors.text
                : lightModeColors.text
            }
          />
          <Text
            style={{
              ...styles.txt,
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
          >
            Upload from gallery
          </Text>
        </Touchable>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: "flex-end",
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  txt: {
    marginLeft: 14,
  },
});

export default ImagePickerModal;
