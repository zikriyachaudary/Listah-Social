import React from 'react';
import FastImage from 'react-native-fast-image'
import { ActivityIndicator, Image, StyleSheet, } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { View, Text, Touchable } from '../../common';
import CheckIcon from '../../assets/icons/edit-check-icon.svg';
import CloseIcon from '../../assets/icons/edit-close-icon.svg';
import * as Colors from '../../config/colors';

/* =============================================================================
<SuggestionApproveAdd />
============================================================================= */
const SuggestionApproveAdd = ({ change, postTitle, loading, onSubmit }) => {
  const navigation = useNavigation();
  const item = change?.item

  const _handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View>
      <View horizontal style={styles.infoContainer}>
        <Text bold>Suggestion Type: {change?.type}</Text>
        <Text bold>List Title: {postTitle}</Text>
      </View>
      <View horizontal style={styles.item}>
        <FastImage style={styles.img} source={{ uri: item?.image }} />
        <Text sm medium>{item?.name}</Text>
        <Text sm light>{item?.description}</Text>
      </View>
      <View horizontal center>
        {loading ? (
          <ActivityIndicator color={Colors.primary} size='small' />
        ) : (
          <Touchable style={styles.actionBtn} onPress={onSubmit}>
            <CheckIcon stroke="#6d14c4" />
          </Touchable>
        )}
        <Touchable style={styles.actionBtn} onPress={_handleGoBack}>
          <CloseIcon stroke="#6d14c4" />
        </Touchable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    justifyContent: 'space-between',
  },
  item: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#999',
    justifyContent: 'space-between',
  },
  img: {
    width: 66,
    height: 50,
    borderRadius: 55 / 2,
  },
  actionBtn: {
    margin: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default SuggestionApproveAdd;
