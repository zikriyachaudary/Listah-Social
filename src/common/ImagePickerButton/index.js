import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import View from '../View';
import Button from '../Button';
import ImagePickerModal from './ImagePickerModal';
import UploadIcon from '../../assets/icons/edit-upload-icon.svg';

import * as Colors from '../../config/colors';

/* =============================================================================
<ImagePickerButton />
============================================================================= */
const ImagePickerButton = ({ btnSize, title, onImageSelect, style }) => {
  const [modal, setModal] = useState(false);

  const _toggleModal = () => setModal((prevState) => !prevState);

  if (btnSize === 'small') {
    return (
      <View center style={[styles.imgBtnContainer, style]}>
        <Button
          style={styles.smallImgBtn}
          left={<UploadIcon />}
          onPress={_toggleModal}
        />
        <ImagePickerModal visible={modal} onClose={_toggleModal} onAdd={onImageSelect} />
      </View>
    )
  }

  return (
    <View center style={[styles.imgBtnContainer, style]}>
      <Button
        title={title ? title : 'Upload Picture'}
        style={styles.imgBtn}
        left={<UploadIcon />}
        btnTxtStyles={styles.imgBtnTxt}
        onPress={_toggleModal}
      />
      <ImagePickerModal visible={modal} onClose={_toggleModal} onAdd={onImageSelect} />
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
    backgroundColor: '#fff'
  },
  smallImgBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: '#fff',
    paddingRight: 0,
  },
  imgBtnTxt: {
    color: Colors.primary,
  },
})

export default ImagePickerButton;
