import React from 'react';
import Modal from 'react-native-modal';
import { StyleSheet } from 'react-native';

import { Text, Card, View, Touchable, PostCard, Content } from '../../common';
import CloseIcon from '../../assets/icons/edit-close-icon.svg';
import CheckIcon from '../../assets/icons/edit-check-icon.svg';

/* =============================================================================
 SuggestionModal />
============================================================================= */
const SuggestionModal = ({ visible, onClose }) => {
  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <Card style={styles.card}>
        <Content horizontalPadding={0}>
          <View horizontal style={styles.header}>
            <Touchable style={styles.closeBtn}>
              <CloseIcon stroke="#6d14c4" />
            </Touchable>
          </View>
          <PostCard showActions={false} />
        </Content>
        <View horizontal center>
          <Touchable style={styles.actionBtn}>
            <CloseIcon stroke="#6d14c4" />
          </Touchable>
          <Touchable style={styles.actionBtn}>
            <CheckIcon stroke="#6d14c4" />
          </Touchable>
        </View>
      </Card>
    </Modal>
  );
};


const styles = StyleSheet.create({
  modal: {
  },
  card: {
    height: 500,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    paddingVertical: 20,
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    left: 0,
  },
  actionBtn: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default SuggestionModal;
