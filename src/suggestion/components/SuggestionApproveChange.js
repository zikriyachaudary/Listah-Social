import React from 'react';
import FastImage from 'react-native-fast-image'
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Image, StyleSheet, } from 'react-native';

import { View, Text, Touchable } from '../../common';
import CheckIcon from '../../assets/icons/edit-check-icon.svg';
import CloseIcon from '../../assets/icons/edit-close-icon.svg';
import * as Colors from '../../config/colors';

/* =============================================================================
<SuggestionApproveChange />
============================================================================= */
const SuggestionApproveChange = ({ change, postTitle, loading, onSubmit }) => {
  const navigation = useNavigation();
  const to = change?.to;
  const from = change?.from;
  const itemId = from?.id;

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
        <View style={styles.indexCounter}>
          <Text sm bold primary>{itemId === 0 ? 1 : itemId + 1}</Text>
        </View>
        <FastImage style={styles.img} source={{ uri: from?.image }} />
        <Text sm medium>{from?.name}</Text>
        <Text sm light>{from?.description}</Text>
      </View>
      <Text center bold style={styles.dividerTxt}>To</Text>
      <View horizontal style={styles.item}>
        <View style={styles.indexCounter}>
          <Text sm bold primary>{itemId === 0 ? 1 : itemId + 1}</Text>
        </View>
        <FastImage style={styles.img} source={{ uri: to?.image }} />
        <Text sm medium>{to?.name}</Text>
        <Text sm light>{to?.description}</Text>
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
    width: 55,
    height: 55,
    borderRadius: 55 / 2,
  },
  indexCounter: {
    width: 30,
    height: 30,
    borderWidth: 2,
    paddingTop: 2,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerTxt: {
    marginVertical: 20,
  },
  changeFieldContainer: {
    width: '100%',
    borderRadius: 20,
  },
  indexCounter: {
    width: 30,
    height: 30,
    borderWidth: 2,
    paddingTop: 2,
    marginRight: 5,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    marginTop: 0,
    marginHorizontal: 5,
  },
  input: {
    height: 40,
  },
  addBtn: {
    padding: 20,
    marginTop: 20,
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

export default SuggestionApproveChange;
