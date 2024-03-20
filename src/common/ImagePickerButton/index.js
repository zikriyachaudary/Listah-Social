import React, { useState } from "react";
import { StyleSheet } from "react-native";

import View from "../View";
import Button from "../Button";
import ImagePickerModal from "./ImagePickerModal";
import UploadIcon from "../../assets/icons/edit-upload-icon.svg";

import * as Colors from "../../config/colors";
import { useSelector } from "react-redux";
import { Theme_Mode } from "../../util/Strings";
import {
  AppColors,
  darkModeColors,
  lightModeColors,
} from "../../util/AppConstant";

/* =============================================================================
<ImagePickerButton />
============================================================================= */
const ImagePickerButton = ({ btnSize, title, onImageSelect, style }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  const [modal, setModal] = useState(false);

  const _toggleModal = () => setModal((prevState) => !prevState);

  if (btnSize === "small") {
    return (
      <View center style={[styles.imgBtnContainer, style]}>
        <Button
          style={styles.smallImgBtn}
          left={<UploadIcon />}
          onPress={_toggleModal}
        />
        <ImagePickerModal
          visible={modal}
          onClose={_toggleModal}
          onAdd={onImageSelect}
        />
      </View>
    );
  }

  return (
    <View center style={[styles.imgBtnContainer, style]}>
      <Button
        title={title ? title : "Upload Picture"}
        style={{
          ...styles.imgBtn,
          backgroundColor:
            themeType == Theme_Mode.isDark ? AppColors.black.light : "#fff",
        }}
        left={<UploadIcon />}
        btnTxtStyles={styles.imgBtnTxt}
        onPress={_toggleModal}
      />
      <ImagePickerModal
        visible={modal}
        onClose={_toggleModal}
        onAdd={onImageSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  imgBtnContainer: {
    marginVertical: 20,
  },
  imgBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: "#fff",
  },
  smallImgBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: "#fff",
    paddingRight: 0,
  },
  imgBtnTxt: {
    color: Colors.primary,
  },
});

export default ImagePickerButton;
