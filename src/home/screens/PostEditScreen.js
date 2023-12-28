import React, { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";
import { Formik, FieldArray } from "formik";

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
} from "../../common";
import DeleteIcon from "../../assets/icons/edit-trash-icon.svg";
import AddIcon from "../../assets/icons/edit-plus-square.svg";

import { getPostsById } from "../redux/selectors";
import { updatePost as updatePostAction } from "../redux/actions";
import { useEffect } from "react";
import TextInputComponent from "../../common/TextInputComponent";
import { useIsFocused } from "@react-navigation/native";
import { AppHorizontalMargin } from "../../util/AppConstant";
import CustomDropDown from "../../common/CustomDropDown";
import { fetchPostData } from "../../network/Services/ProfileServices";

/* =============================================================================
<PostEditScreen />
============================================================================= */
const PostEditScreen = ({ navigation, updatePost, route }) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const selector = useSelector((AppState) => AppState);
  const [title, setTitle] = useState("");
  const [selectedcategory, setSelectedCategory] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const isFocused = useIsFocused();
  const [titleError, setTitleError] = useState("");
  const [initialValues, setInitialValues] = useState({
    items: route.params.post?.items,
  });

  const _handleAdd = (arrayHelpers) => {
    arrayHelpers.push({
      name: "",
      image: "",
      description: "",
    });
  };
  useEffect(() => {
    if (isFocused) {
      initialFun();
    }
  }, [isFocused]);
  const initialFun = async () => {
    let data = null;
    await fetchPostData(route.params.post?.id, (res) => {
      data = res;
    });
    if (data) {
      setSelectedCategory(data?.category ? data?.category : "");
      setTitle(data?.title);
      setInitialValues({
        items: data?.items,
      });
    }
  };
  const _handleRemove = (arrayHelpers, index) => arrayHelpers.remove(index);

  const _handleSubmit = async (values) => {
    if (selectedcategory == "") {
      setCategoryError("Please select Category");
      return;
    }
    let obj = {
      ...values,
      title: title,
      author: route.params.post?.author,
      id: route?.params?.id,
      category: selectedcategory,
    };
    setLoading(true);
    await updatePost(obj);
    setLoading(false);

    if (route?.params?.postRefresh) {
      route.params.postRefresh();
    }
    navigation.goBack();
  };

  return (
    <Container
      style={{ ...styles.content, marginHorizontal: AppHorizontalMargin }}
    >
      <StackHeader />
      <TextInputComponent
        value={title}
        maxLength={55}
        setValue={(val) => {
          setTitleError("");
          setTitle(val);
        }}
        placeholder="What's your List Title..."
        error={titleError}
      />
      <CustomDropDown
        dropDownStyle={{
          marginVertical: 10,
        }}
        placeHolder={"Select Category"}
        atSelect={(val) => {
          setSelectedCategory(val?.name);
          setCategoryError("");
        }}
        selected={selectedcategory?.name || selectedcategory}
        list={selector?.sliceReducer?.categoriesList}
        error={categoryError}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={_handleSubmit}
      >
        {({ handleChange, handleSubmit, setFieldValue, values, errors }) => (
          <FieldArray
            name="items"
            render={(arrayHelpers) => (
              <Content contentContainerStyle={styles.content}>
                <View center>
                  {values.items && values.items.length > 0
                    ? values.items.map((item, index) => (
                        <View
                          horizontal
                          key={index}
                          style={styles.dynamicFieldContainer}
                        >
                          {item?.image && typeof item?.image === "object" ? (
                            <FastImage
                              style={styles.img}
                              source={item?.image}
                            />
                          ) : item?.image && typeof item?.image === "string" ? (
                            <FastImage
                              style={styles.img}
                              source={{ uri: `${item?.image}` }}
                            />
                          ) : (
                            <View center>
                              <ImagePickerButton
                                btnSize="small"
                                style={styles.img}
                                onImageSelect={(img) =>
                                  setFieldValue(`items.${index}.image`, img)
                                }
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
                            errorText={
                              errors?.items && errors?.items[index]
                                ? errors?.items[index].name
                                : null
                            }
                            onChange={handleChange(`items.${index}.name`)}
                          />
                          <TextInput
                            value={item.description}
                            inputStyle={styles.input}
                            placeholder="Enter description..."
                            containerStyle={styles.inputContainer}
                            errorText={
                              errors?.items && errors?.items[index]
                                ? errors?.items[index].description
                                : null
                            }
                            onChange={handleChange(
                              `items.${index}.description`
                            )}
                          />
                          <Touchable
                            center
                            style={styles.deleteBtn}
                            onPress={() => _handleRemove(arrayHelpers, index)}
                          >
                            <DeleteIcon />
                          </Touchable>
                        </View>
                      ))
                    : null}
                  <Touchable
                    style={styles.addBtn}
                    onPress={() => _handleAdd(arrayHelpers)}
                  >
                    <AddIcon />
                  </Touchable>
                </View>
                <View center>
                  <Button
                    title="Upload"
                    loading={loading}
                    onPress={handleSubmit}
                  />
                </View>
              </Content>
            )}
          />
        )}
      </Formik>
    </Container>
  );
};

const schema = yup.object().shape({
  // title: yup.string().required("!Empty Field"),
  items: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("!Empty Field"),
        description: yup.string().required("!Empty Field"),
      })
    )
    .nullable(),
});

const styles = StyleSheet.create({
  dynamicFieldContainer: {
    width: "100%",
    alignItems: "flex-start",
    borderRadius: 20,
    marginTop: 20,
  },
  content: {
    justifyContent: "space-between",
  },
  indexCounter: {
    width: 30,
    height: 30,
    borderWidth: 2,
    paddingTop: 2,
    marginRight: 5,
    borderRadius: 30 / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    flex: 1,
    marginTop: 0,
    marginHorizontal: 5,
  },
  errorText: {
    color: "#6d14c4",
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
