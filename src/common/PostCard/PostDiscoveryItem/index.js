import React from 'react';
import { connect } from 'react-redux';
import { StyleSheet, ScrollView } from 'react-native';

import Card from '../../Card';
import Text from '../../Text';
import View from '../../View';
import Avatar from '../../Avatar';
import PostDiscoveryActions from './PostDiscoveryActions';
import PostDiscoveryItemHeader from './PostDiscoveryItemHeader';

import { getPostsById } from '../../../discover/redux/selectors';

/* =============================================================================
<PostDiscoveryItem />
============================================================================= */
const PostDiscoveryItem = ({ id, post }) => {
  const postItems = post?.items;

  if (!post) {
    return (
      <Card style={styles.container}>
        <PostDiscoveryItemHeader />
        <Text center>Post no longer available</Text>
      </Card>
    );
  };

  return (
    <ScrollView nestedScrollEnabled style={styles.container}>
      <PostDiscoveryItemHeader id={id} />
      {postItems?.length >= 0 && postItems?.map((item, index) => (
        <View horizontal style={styles.item} key={index}>
          <View style={styles.indexCounter}>
            <Text sm bold>{index === 0 ? 1 : index + 1}</Text>
          </View>
          <View style={styles.imgContainer}>
            <Avatar size={66} url={{ uri: `${item.image}` }} />
          </View>
          <Text flex center sm medium>{item.name || '--'}</Text>
          <Text center xs light style={styles.descriptionTxt} >{item.description || '--'}</Text>
        </View>
      ))}
      <PostDiscoveryActions id={id} />
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    maxHeight: 500,
    marginVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 6,
    paddingTop: 5,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,

    elevation: 16,
  },
  item: {
    marginTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#999',
    justifyContent: 'space-between',
  },
  indexCounter: {
    width: 30,
    height: 30,
    marginRight: 12,
    borderWidth: 2,
    paddingTop: 2,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgContainer: {
    marginRight: 5,
  },
  userInfoContainer: {
    marginLeft: 15,
  },
  descriptionTxt: {
    flex: 0.5,
  },
  menuBtn: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

const mapStateToProps = (state, { id }) => ({
  post: getPostsById(state, { id })
});

// eslint-disable-next-line max-len
const propsAreEqual = (prevProps, nextProps) => prevProps.id === nextProps.id
  && JSON.stringify(prevProps.post?.items) === JSON.stringify(nextProps?.post?.items);

/* Export
============================================================================= */
export default connect(mapStateToProps)(React.memo(PostDiscoveryItem, propsAreEqual));