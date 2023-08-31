import React, { useState } from 'react';
import { connect } from 'react-redux';
import * as yup from 'yup';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image'
import { Formik, FieldArray } from 'formik';

import {
  Text,
  View,
  Button,
  Content,
  Container,
  TextInput,
  Touchable,
  StackHeader,
  ImagePickerButton,
} from '../../common'
import DeleteIcon from '../../assets/icons/edit-trash-icon.svg';
import AddIcon from '../../assets/icons/edit-plus-square.svg';

import { getPostsById } from '../redux/selectors';
import { updatePost as updatePostAction } from '../redux/actions';
import { useEffect } from 'react';

/* =============================================================================
<PostEditScreen />
============================================================================= */
const PostEditScreen = ({ navigation, mpost, updatePost, route }) => {
  const [loading, setLoading] = useState(false);
  const post = route.params.post

 
  const _handleAdd = (arrayHelpers) => {
    arrayHelpers.push({
      name: '',
      image: '',
      description: '',
    })
  };

  const _handleRemove = (arrayHelpers, index) => arrayHelpers.remove(index);

  const _handleSubmit = async (values) => {
    setLoading(true);
    await updatePost(values);
    setLoading(false);
    if (route.params.postRefresh) {
      route.params.postRefresh()
    }
    navigation.goBack();
  };

  return (
    <Container style={styles.content}>
      <StackHeader />
      <Formik initialValues={post} validationSchema={schema} onSubmit={_handleSubmit}>
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors }) => (
          <FieldArray name='items' render={(arrayHelpers) => (
            <Content contentContainerStyle={styles.content}>
              <View center>
                <TextInput
                  value={values.title}
                  onBlur={handleBlur('title')}
                  errorText={errors?.title}
                  onChangeText={handleChange('title')}
                  placeholder="What's your List Title..."
                />
                {values.items && values.items.length > 0 ? (
                  values.items.map((item, index) => (
                    <View horizontal key={index} style={styles.dynamicFieldContainer}>
                      {item?.image && typeof item?.image === 'object' ?
                        (
                          <FastImage style={styles.img} source={item?.image} />
                        ) : item?.image && typeof item?.image === 'string' ?
                          <FastImage style={styles.img} source={{ uri: `${item?.image}` }} />
                          : (
                            <View center>
                              <ImagePickerButton
                                btnSize='small'
                                style={styles.img}
                                onImageSelect={(img) => setFieldValue(`items.${index}.image`, img)}
                              />
                              {!item?.image ? (
                                <Text sm style={styles.errorText}>
                                  !Empty Field
                                </Text>
                              ) : null}
                            </View>
                          )}
                      <TextInput
                        value={item.name}
                        inputStyle={styles.input}
                        placeholder="Enter name..."
                        containerStyle={styles.inputContainer}
                        errorText={errors?.items && errors?.items[index] ? errors?.items[index].name : null}
                        onChange={handleChange(`items.${index}.name`)}
                      />
                      <TextInput
                        value={item.description}
                        inputStyle={styles.input}
                        placeholder="Enter description..."
                        containerStyle={styles.inputContainer}
                        errorText={errors?.items && errors?.items[index] ? errors?.items[index].description : null}
                        onChange={handleChange(`items.${index}.description`)}
                      />
                      <Touchable center style={styles.deleteBtn} onPress={() => _handleRemove(arrayHelpers, index)}>
                        <DeleteIcon />
                      </Touchable>
                    </View>
                  ))
                ) : null}
                <Touchable style={styles.addBtn} onPress={() => _handleAdd(arrayHelpers)}>
                  <AddIcon />
                </Touchable>
              </View>
              <View center>
                <Button
                  title='Upload'
                  loading={loading}
                  onPress={handleSubmit}
                />
              </View>
            </Content>
          )} />
        )}
      </Formik>
    </Container >
  );
};

const schema = yup.object().shape({
  title: yup.string()
    .required('!Empty Field'),
  items: yup.array().of(
    yup.object().shape({
      name: yup.string()
        .required('!Empty Field'),
      description: yup.string()
        .required('!Empty Field'),
    })
  ).nullable()
});


const styles = StyleSheet.create({
  dynamicFieldContainer: {
    width: '100%',
    alignItems: 'flex-start',
    borderRadius: 20,
    marginTop: 20,
  },
  content: {
    justifyContent: 'space-between',
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
  errorText: {
    color: '#6d14c4'
  },
  input: {
    height: 40,
  },
  addBtn: {
    padding: 20,
    marginTop: 20,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
    marginVertical: 0,
  },
  deleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});

const mapStateToProps = (state, { route }) => ({
  mpost: getPostsById(state, { id: route?.params?.id }),
});

const mapDispatchToProps = {
  updatePost: updatePostAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostEditScreen);
