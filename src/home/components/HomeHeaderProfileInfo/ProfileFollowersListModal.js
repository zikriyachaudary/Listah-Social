import React from 'react';
import Modal from 'react-native-modal';
import { StyleSheet } from 'react-native';

import { Card, Text } from '../../../common';
import ProfileFollowersListItem from './ProfileFollowersListItem';

/* =============================================================================
 ProfileFollowersListModal />
============================================================================= */
const ProfileFollowersListModal = ({
  visible,
  followers,
  onClose
}) => {
  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}>
      <Card style={styles.card}>
        {followers?.length > 0 ?
          followers?.map((id) => <ProfileFollowersListItem key={id} id={id} />)
          : <Text>You don't have any followers</Text>
        }
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
  },
});

/* Export
============================================================================= */
export default ProfileFollowersListModal;
