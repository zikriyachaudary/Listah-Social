import React, { useEffect, useState } from "react";
import { Container, StackHeader } from "../../common";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import DeleteIcon from "../../assets/icons/edit-trash-icon.svg";
import { setDraftPost } from "../../redux/action/AppLogics";
import { saveUserDraftPost } from "../../util/helperFun";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AlertModal from "../../common/AlertModal";
import { AppColors } from "../../util/AppConstant";

const DraftPostListScreen = (route) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const selector = useSelector((AppState) => AppState?.DraftPost);
  const [data, setData] = useState(selector?.draftPost);
  const [alertModal, setAlertModal] = useState({ value: false, data: null });
  useEffect(() => {
    if (isFocused && selector?.draftPost?.length > 0) {
      setData(selector?.draftPost);
    }
  }, [isFocused]);
  const deleteDraftPost = async (id) => {
    const updatedList = selector?.draftPost.filter(
      (item) => item.draftPostId !== id
    );
    setAlertModal({ value: false, data: null });
    setData(updatedList);
    dispatch(setDraftPost(updatedList));
    await saveUserDraftPost(updatedList);
  };
  return (
    <Container style={styles.content}>
      <StackHeader title={"Draft Post"} />
      {data?.length > 0 ? (
        <FlatList
          style={{ flex: 1, margin: 20 }}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => {
            return (
              <>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    padding: 10,
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    navigation.navigate("DiscoverStack", {
                      data: item,
                      isEdit: true,
                    });
                  }}
                  activeOpacity={1}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 14,
                        color: AppColors.black.black,
                        fontWeight: "400",
                        marginVertical: 5,
                      }}
                    >
                      {item?.title?.length > 0 ? item?.title : "No title"}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: AppColors.grey.dark,
                        fontWeight: "400",
                      }}
                    >
                      {item?.description?.length > 0
                        ? item?.description
                        : "No description"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setAlertModal({
                        value: true,
                        data: {
                          id: item?.draftPostId,
                        },
                      });
                    }}
                  >
                    <DeleteIcon />
                  </TouchableOpacity>
                </TouchableOpacity>
                <View
                  style={{
                    height: 1,
                    width: "100%",
                    backgroundColor: "#bcbec2",
                  }}
                />
              </>
            );
          }}
        />
      ) : (
        <View style={styles.emptyCont}>
          <Text style={styles.emptyTxt}>No Post found!</Text>
        </View>
      )}
      {alertModal?.value ? (
        <AlertModal
          visible={alertModal?.value}
          multipleBtn={true}
          atLeftBtn={() => {
            setAlertModal({ value: false, data: null });
          }}
          leftBtnLabel={"No"}
          rightBtnLabel={"Yes"}
          onPress={() => {
            deleteDraftPost(alertModal?.data?.id);
          }}
          message={"Do you want to delete this post from draft?"}
        />
      ) : null}
    </Container>
  );
};
const styles = StyleSheet.create({
  content: {
    justifyContent: "space-between",
  },
  emptyCont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTxt: {
    fontSize: 14,
    color: "black",
    fontWeight: "500",
  },
});
export default DraftPostListScreen;
