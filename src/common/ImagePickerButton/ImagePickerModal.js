import React from 'react';
import { StyleSheet } from 'react-native';
import Modal from "react-native-modal";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import Card from '../Card';
import Text from '../Text';
import Touchable from '../Touchable';
import GalleryIcon from '../../assets/icons/edit-gallery.svg'
import CameraIcon from '../../assets/icons/edit-camera.svg'

/* =============================================================================
<ImagePickerModal />
============================================================================= */
const ImagePickerModal = ({ visible, onClose, onAdd }) => {

  const _handleOpenCameraPress = async () => {
    try {
      const result = await launchCamera({ mediaType: 'photo', quality: 1, includeBase64: true });

      onAdd(result?.assets[0])

    } catch (e) {
      // TODO
    } finally {
      onClose();
    }
  };

  const _handleOpenGalleryPress = async () => {
    try {
      const result = await launchImageLibrary({ mediaType: 'photo', quality: 1, includeBase64: true });;

      onAdd(result?.assets[0])

    } catch (e) {
      // TODO
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      style={styles.container}
      isVisible={visible}
      backdropOpacity={0.2}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <Card style={styles.card}>
        <Touchable android_ripple={{ color: '#999' }} horizontal style={styles.item} onPress={_handleOpenCameraPress}>
          <CameraIcon />
          <Text style={styles.txt}>Open Camera</Text>
        </Touchable>
        <Touchable android_ripple={{ color: '#999' }} horizontal style={styles.item} onPress={_handleOpenGalleryPress}>
          <GalleryIcon />
          <Text style={styles.txt}>Upload from gallery</Text>
        </Touchable>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  txt: {
    marginLeft: 14,
  }
});

export default ImagePickerModal;
