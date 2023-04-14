import React, { useState } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import FireAuth from '@react-native-firebase/auth';
import { StyleSheet, FlatList, Alert } from 'react-native';

import Card from '../../../Card';
import Text from '../../../Text';
import View from '../../../View';
import Touchable from '../../../Touchable';
import TextInput from '../../../TextInput';
import PostDiscoveryCommentItem from './PostDiscoveryCommentItem';
import ChevronLeftIcon from '../../../../assets/icons/edit-chevron-left.svg';

import { getPostsById } from '../../../../discover/redux/selectors';
import { postComment as postCommentAction } from '../../../../home/redux/actions';

/* =============================================================================
 PostDiscoveryCommentModal />
============================================================================= */
const PostDiscoveryCommentModal = ({
  post,
  visible,
  onClose,
  postComment,
}) => {
  const [comments, setComments] = useState(post?.comments || []);
  const [text, setText] = useState('');

  const _handleComment = async () => {
    try {
      if (text) {
        const payload = {
          text,
          id: Date.now(),
          postId: post?.id,
          author: FireAuth().currentUser.uid,
        };
        await postComment(payload);

        setComments((prevState) => [...prevState, payload]);
      }
    } catch (e) {
      Alert.alert('Something went wrong please try later')
    }
    setText('')
  };

  const renderListEmptyComponent = () => (
    <View center style={styles.emptyListContainer}>
      <Text>No Comments Yet</Text>
    </View>
  );


  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Touchable style={styles.headerBackBtn} onPress={onClose}>
            <ChevronLeftIcon />
          </Touchable>
        </View>
        <FlatList
          refreshing={false}
          data={comments}
          renderItem={renderItem}
          keyExtractor={renderKeyExtractor}
          ListEmptyComponent={renderListEmptyComponent}
          contentContainerStyle={styles.contentContainer}
        />
        <TextInput
          value={text}
          onChange={setText}
          containerStyle={styles.inputContainer}
          placeholder='Type a comment...'
          onSubmitEditing={_handleComment}
        />
      </Card>
    </Modal>
  );
};

const renderKeyExtractor = item => `${item.id}`;
const renderItem = ({ item }) => (
  <PostDiscoveryCommentItem key={item.id} text={item?.text} author={item?.author} />
);

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
  },
  card: {
    zIndex: 5,
    height: '100%',
    borderWidth: 1,
    borderColor: '#999',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    width: '100%',
  },
  headerBackBtn: {
    width: 50,
    height: 50,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyListContainer: {
    height: '100%',
  },
  inputContainer: {
    marginTop: 0,
  }
});

const mapStateToProps = (state, { id }) => ({
  post: getPostsById(state, { id }),
});

const mapDispatchToProps = {
  postComment: postCommentAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostDiscoveryCommentModal);
