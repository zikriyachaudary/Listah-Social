import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as yup from "yup";
import { Formik, FieldArray, ErrorMessage } from "formik";
import FastImage from "react-native-fast-image";
import {
  View,
  Button,
  Content,
  Container,
  TextInput,
  Touchable,
  StackHeader,
  ImagePickerButton,
  Text,
} from "../../common";
import DeleteIcon from "../../assets/icons/edit-trash-icon.svg";
import AddIcon from "../../assets/icons/edit-plus-square.svg";
import { connect, useDispatch, useSelector } from "react-redux";

import { getLoading } from "../redux/selectors";
import { challengePost as challengePostAction } from "../redux/actions";
import { useEffect } from "react";
import { RadioGroup } from "react-native-radio-buttons-group";
import CheckBox from "@react-native-community/checkbox";
import { createPost as createPostAction } from "../redux/actions";
import { challengePost, createPost } from "../../home/redux/actions";
import { updateHomeData } from "../../home/redux/appLogics";
import { UPDATE_CHALLENGE_FEATURE } from "../redux/constants";


const AddChallengeListingScreen = ({
  createPost,
  challengePost,
  navigation,
  route,
}) => {
  const post = route.params.post;
  const items = post?.items;
  const [isShowAddBtn, setShowAddBtn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [radioButtons, setRadioButtons] = useState([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Ascending List",
      value: "ascendinglist",
      borderColor: "#6d14c4",
      selected: true,
    },
    {
      id: "2",
      label: "Descending List",
      value: "descendinglist",
      borderColor: "#6d14c4",
    },
  ]);
  const dispatch = useDispatch()
  const selector = useSelector((AppState) => AppState)

  const _handleAdd = (arrayHelpers) => {
    let arraySize = arrayHelpers.form.values.items.length + 1;
    arrayHelpers.push({
      name: "",
      image: "",
      description: "",
    });
    if (arraySize == 10 || arraySize > 10) {
      setShowAddBtn(false);
    } else {
      setShowAddBtn(true);
    }
  };

  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  const _handleRemove = (arrayHelpers, index) => {
    let arraySize = arrayHelpers.form.values.items.length - 1;

    arrayHelpers.remove(index);
    if (arraySize < 10) {
      setShowAddBtn(true);
    } else {
      setShowAddBtn(false);
    }
  };

  const _handleSubmit = async (values) => {
    console.log("clickkkkkk", values);
    values["order"] = radioButtons.find((item) => item.selected).id;
    values["isNumberShowInItems"] = toggleCheckBox;
    setLoading(true);
    await challengePost(values, post);
    setLoading(false);
    UPDATE_CHALLENGE_FEATURE.isUpdate = true
    dispatch(updateHomeData(!selector.Home.updateHomeData))

    navigation.goBack();
    navigation.goBack();
  };

  const onPressRadioButton = (radioButtonsArray) => {
    console.log("radiooooooo ", radioButtonsArray);
    setRadioButtons(radioButtonsArray);
  };
  return (
    <Container style={styles.content}>
      <StackHeader />
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={_handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
        }) => (
          <FieldArray
            name="items"
            render={(arrayHelpers) => (
              <Content contentContainerStyle={styles.content}>
                <View center>
                  <Text bold>Create your challenge list:</Text>
                  {values.items && values.items.length > 0
                    ? values.items.map((item, index) => (
                        <View
                          horizontal
                          key={index}
                          style={styles.dynamicFieldContainer}
                        >
                          {item?.image && item.image !== "a" ? (
                            <FastImage
                              style={{ ...styles.img, marginEnd: 10 }}
                              source={item?.image}
                            />
                          ) : (
                            <View center>
                              <ImagePickerButton
                                btnSize="small"
                                style={{
                                  ...styles.img,
                                  marginEnd: 10,
                                  marginHorizontal: 0,
                                }}
                                onImageSelect={(img) =>
                                  setFieldValue(`items.${index}.image`, img)
                                }
                              />
                              {/* {errors?.items && errors?.items[index] ? (
                            <Text sm style={styles.errorText}>
                              {errors?.items[index].image}
                            </Text>
                          ) : null} */}
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

                  <View
                    style={{
                      alignItems: "flex-start",
                      marginVertical: 10,
                      // backgroundColor: "red"
                    }}
                  >
                    <RadioGroup
                      radioButtons={radioButtons}
                      onPress={onPressRadioButton}
                      layout="row"
                      containerStyle={{
                        paddingHorizontal: 10,
                        paddingVertical: 25,
                      }}
                    />

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 18,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CheckBox
                        value={toggleCheckBox}
                        tintColor="#6d14c4"
                        onCheckColor="#6d14c4"
                        onTintColor="#6d14c4"
                        lineWidth={2}
                        style={{
                          transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
                        }}
                        boxType={"circle"}
                        onValueChange={(newValue) => {
                          // setShhowModal(false)
                          console.log("showNewValue - > ", newValue);
                          setToggleCheckBox(newValue);
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          marginStart: 5,
                          color: "black",
                        }}
                      >
                        Numbered List
                      </Text>
                    </View>
                  </View>

                  {isShowAddBtn ? (
                    <Touchable
                      style={styles.addBtn}
                      onPress={() => _handleAdd(arrayHelpers)}
                    >
                      <AddIcon />
                    </Touchable>
                  ) : null}
                </View>
                <View center>
                  <Button
                    title="Challenge"
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

const mapStateToProps = (state) => ({
  loading: getLoading(state),
});

const mapDispatchToProps = {
  challengePost: challengePost,
  createPost: createPost,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddChallengeListingScreen);

const initialValues = {
  items: [
    {
      name: "",
      image: "",
      description: "",
    },
  ],
};

const schema = yup.object().shape({
  //   title: yup.string().required("!Empty Field"),
  //   description: yup.string().required("!Empty Field"),
  items: yup.array().of(
    yup.object().shape({
      name: yup.string().required("!Empty Field"),
      // image: yup.object()
      //   .required('!Empty Field'),
      description: yup.string().required("!Empty Field"),
    })
  ),
});

const styles = StyleSheet.create({
  dynamicFieldContainer: {
    width: "100%",
    borderRadius: 20,
    alignItems: "flex-start",
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
  errorText: {
    color: "#6d14c4",
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
    width: 40,
    height: 40,
    borderRadius: 40 / 2,
    marginVertical: 0,
  },
  deleteBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
});
