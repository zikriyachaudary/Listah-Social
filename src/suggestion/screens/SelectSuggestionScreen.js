import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Alert, StyleSheet } from 'react-native';

import {
  View,
  Text,
  Button,
  Content,
  Container,
  StackHeader,
  Touchable,
} from '../../common';
import * as Colors from '../../config/colors';

import { getPostsById as getHomePostById } from '../../home/redux/selectors';
import { getPostsById as getDiscoverPostById } from '../../discover/redux/selectors';

/* =============================================================================
<SelectSuggestionScreen />
============================================================================= */
const SelectSuggestionScreen = ({ mpost, navigation, route }) => {
  const post = route.params.post
  const [selected, setSelected] = useState();
  const items = post?.items;
  const authorId = post?.author?.userId;
  const postId = post?.id;
  const postTitle = post?.title;

  console.log("printPost - > " , post)

  const _handleSelect = (id) => setSelected(id);

  const _handleChangePress = () => {
    if (selected === 0 || selected) {
      const item = items.filter((i) => i?.id === selected)[0]
      navigation.navigate('SuggestionChange', { postId, postTitle, item, authorId })
    } else {
      Alert.alert('Please Select an Item');
    }

  };

  const _handleAddPress = () => navigation.navigate('SuggestionAdd', { postId, postTitle, authorId });

  const _handleDeletePress = () => {
    if (selected === 0 || selected) {
      const item = items.filter((i) => i?.id === selected)[0]
      navigation.navigate('SuggestionDelete', { postId, postTitle, item, authorId })
    } else {
      Alert.alert('Please Select an Item');
    }

  };

  return (
    <Container>
      <StackHeader title={`What would you like to${'\n'}suggest?`} />
      <Content>
        <View horizontal style={styles.header}>
          <Button style={{flex: 0.3, marginEnd: 5, paddingHorizontal : 2}} btnTxtStyles = {{fontSize: 11}} title='Change' onPress={_handleChangePress} />
          <Button  style={{flex: 0.3, marginHorizontal: 5, paddingHorizontal : 2}} btnTxtStyles = {{fontSize: 11}}  title='Add' onPress={_handleAddPress} />
          <Button style={{flex: 0.3, marginStart: 5, paddingHorizontal : 2}} btnTxtStyles = {{fontSize: 11}} title='Delete' onPress={_handleDeletePress} />
        </View>
        <View horizontal style={styles.itemsContainer}>
          {items.length && items.map((item) => (
            <Touchable
              key={item?.id}
              style={[styles.indexCounter, selected === item?.id && styles.itemCounterSelected]}
              onPress={() => _handleSelect(item?.id)}>
              <View style={styles.indexCounter}>
                <Text sm bold primary>{item?.id === 0 ? 1 : item?.id + 1}</Text>
              </View>
            </Touchable>
          ))}
        </View>
      </Content>
    </Container >
  );
};

const styles = StyleSheet.create({
  header: {
    marginVertical: 40,
    justifyContent: 'space-around',
  },
  itemsContainer: {
    justifyContent: 'space-around',
  },
  indexCounter: {
    width: 30,
    height: 30,
    borderWidth: 1,
    paddingTop: 2,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemCounterSelected: {
    marginBottom: 10,
    borderColor: Colors.primary,
  }
});

const mapStateToProps = (state, { route }) => {
  const { type, id } = route?.params;
  const mpost = type === 'home' ?
    getHomePostById(state, { id })
    : type === 'discovery'
      ? getDiscoverPostById(state, { id }) : {};

  return { mpost };
};

export default connect(mapStateToProps)(SelectSuggestionScreen);
