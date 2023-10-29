import React, { useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { connect, useDispatch, useSelector } from "react-redux";
import FastImage from "react-native-fast-image";
import { StyleSheet } from "react-native";
import { Formik, FieldArray } from "formik";

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
import { useToast } from "react-native-toast-notifications";
import { createPost as createPostAction } from "../redux/actions";
import { createAnnouncementPost as createAnnouncementPostAction } from "../redux/actions";
import { RadioGroup } from "react-native-radio-buttons-group";
import CheckBox from "@react-native-community/checkbox";
import { setPostRefresh } from "../redux/appLogics";
import { makeid } from "../../util/functions";
import {
  setCreatePostFailError,
  setDraftPost,
} from "../../redux/action/AppLogics";
import useBackButtonListener from "../../hooks/useBackButtonListener";
import AlertModal from "../../common/AlertModal";
import { saveUserDraftPost } from "../../util/helperFun";
import { useIsFocused } from "@react-navigation/native";

/* =============================================================================
<PostCreateScreen />
============================================================================= */
const PostCreateScreen = ({
  navigation,
  loading,
  createPost,
  route,
  createAnnouncementPost,
}) => {
  const toast = useToast();
  const isFocused = useIsFocused();
  const formikRef = useRef();
  const [initialValues, setInitialValues] = useState({});
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
  const [initialState, setInitialState] = useState({
    title: "",
    items: [
      {
        name: "",
        image: "",
        description: "",
      },
    ],
  });
  const [alertModal, setAlertModal] = useState({
    value: false,
    data: null,
    message: "",
  });
  const [isShowAddBtn, setShowAddBtn] = useState(true);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  useEffect(() => {
    formikRef.current?.resetForm();
    let data = route?.params?.data;
    if (isFocused && route?.params?.isEdit && data) {
      if (data?.isNumberShowInItems) {
        setToggleCheckBox(true);
      }
      if (data?.order == "2") {
        setRadioButtons([
          {
            id: "1", // acts as primary key, should be unique and non-empty string
            label: "Ascending List",
            value: "ascendinglist",
            borderColor: "#6d14c4",
          },
          {
            id: "2",
            label: "Descending List",
            value: "descendinglist",
            borderColor: "#6d14c4",
            selected: true,
          },
        ]);
      }
      let makeObj = {
        description: data?.description ? data?.description : "",
        title: data?.title ? data?.title : "",
        items:
          data?.items?.length > 0
            ? data?.items
            : [
                {
                  name: "",
                  image: "",
                  description: "",
                },
              ],
      };
      setInitialValues(makeObj);
    } else {
      setInitialValues({
        title: "",
        items: [
          {
            name: "",
            image: "",
            description: "",
          },
        ],
      });
    }
  }, [isFocused]);

  const dispatch = useDispatch();
  const selector = useSelector((AppState) => AppState);
  //Hardware Back Handler------->
  useBackButtonListener(() => {
    fetchCurrentStates();
    return true;
  });
  const fetchCurrentStates = () => {
    let isOpenAlert = false;
    if (initialState?.title?.length > 0) {
      isOpenAlert = true;
    } else if (initialState?.description?.length > 0) {
      isOpenAlert = true;
    } else if (initialState?.items?.length > 1) {
      isOpenAlert = true;
    } else if (
      initialState?.items?.length == 0 &&
      (initialState?.items[0]?.description?.length > 0 ||
        initialState?.items[0]?.title?.length > 0)
    ) {
      isOpenAlert = true;
    }

    if (isOpenAlert) {
      setAlertModal({
        value: true,
        data: {
          ...initialState,
          isNumberShowInItems: toggleCheckBox,
          order: radioButtons.find((item) => item.selected).id,
        },
        message: route?.params?.isEdit
          ? "Do you want to replace this post in your draft?"
          : "Do you want to save this post in your draft?",
      });
    } else {
      navigation?.goBack();
    }
  };
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

  const _handleRemove = (arrayHelpers, index) => {
    let arraySize = arrayHelpers.form.values.items.length - 1;
    arrayHelpers.remove(index);
    if (arraySize < 10) {
      setShowAddBtn(true);
    } else {
      setShowAddBtn(false);
    }
  };
  const _handleSubmit = async (values, { resetForm }) => {
    values["order"] = radioButtons.find((item) => item.selected).id;
    values["isNumberShowInItems"] = toggleCheckBox;
    if (route.params && route.params.isAnnouncement) {
      await createAnnouncementPost(values);
    } else {
      await createPost(values);
    }
    if (selector?.DraftPost?.createPostAPIFail !== "") {
      updateDraftFun(values);
    } else {
      // route.params.postRefresh();
      dispatch(setPostRefresh(!selector.Home.isPostRefresh));
      resetForm();
      navigation.goBack();
    }
  };
  const updateDraftFun = async (obj) => {
    let draftArr;
    if (route?.params?.isEdit) {
      let findInexValue = selector?.DraftPost?.draftPost.findIndex(
        (el) => el.draftPostId == route?.params?.data?.draftPostId
      );
      if (findInexValue != -1) {
        let previousData = [...selector?.DraftPost?.draftPost];
        previousData[findInexValue] = {
          ...obj,
          draftPostId: route?.params?.data?.draftPostId,
        };
        draftArr = previousData;
      }
    } else {
      draftArr = [
        ...selector?.DraftPost?.draftPost,
        { ...obj, draftPostId: makeid(7) },
      ];
    }
    dispatch(setDraftPost(draftArr));
    await saveUserDraftPost(draftArr);
    dispatch(setCreatePostFailError(""));
    setAlertModal({ value: false, data: null, message: "" });
    toast.show(
      route?.params?.isEdit
        ? "Post update in your draft list"
        : "Post save in your draft list"
    );
    dispatch(setPostRefresh(!selector.Home.isPostRefresh));
    formikRef.current?.resetForm();
    navigation.goBack();
  };
  const onPressRadioButton = (radioButtonsArray) => {
    setRadioButtons(radioButtonsArray);
  };
  return (
    <Container style={styles.content}>
      <StackHeader
        onLeftPress={() => {
          fetchCurrentStates();
        }}
      />
      <Formik
        enableReinitialize={true}
        innerRef={formikRef}
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
            render={(arrayHelpers) => {
              setInitialState(values);
              return (
                <Content contentContainerStyle={styles.content}>
                  <View center>
                    <TextInput
                      value={values.title}
                      onBlur={handleBlur("title")}
                      errorText={errors?.title}
                      maxLength={55}
                      onChangeText={handleChange("title")}
                      placeholder="What's your List Title..."
                    />
                    <TextInput
                      value={values.description}
                      onBlur={handleBlur("description")}
                      errorText={errors?.description}
                      onChangeText={handleChange("description")}
                      placeholder="Post description..."
                    />
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
                                  onImageSelect={(img) => {
                                    setFieldValue(`items.${index}.image`, img);
                                  }}
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
                      title="Upload"
                      loading={loading}
                      onPress={handleSubmit}
                    />
                  </View>
                </Content>
              );
            }}
          />
        )}
      </Formik>
      {alertModal?.value ? (
        <AlertModal
          visible={alertModal?.value}
          multipleBtn={true}
          atLeftBtn={() => {
            setAlertModal({ value: false, data: null, message: "" });
            dispatch(setPostRefresh(!selector.Home.isPostRefresh));
            formikRef.current?.resetForm();
            navigation.goBack();
          }}
          leftBtnLabel={"No"}
          rightBtnLabel={"Yes"}
          onPress={() => {
            updateDraftFun(alertModal?.data);
          }}
          message={alertModal?.message}
        />
      ) : null}
    </Container>
  );
};

const schema = yup.object().shape({
  title: yup.string().required("!Empty Field"),
  description: yup.string().required("!Empty Field"),
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

const mapStateToProps = (state) => ({
  // loading: getLoading(state),
});

const mapDispatchToProps = {
  createPost: createPostAction,
  createAnnouncementPost: createAnnouncementPostAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(PostCreateScreen);
