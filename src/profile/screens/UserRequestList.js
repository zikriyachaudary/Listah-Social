import React, { useEffect, useState } from "react";
import { Container, StackHeader } from "../../common";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import {
  AppColors,
  AppHorizontalMargin,
  normalized,
} from "../../util/AppConstant";
import LoadingImage from "../../common/LoadingImage";
import {
  adminActionAtReq,
  fetchUserRequestedList,
} from "../../network/Services/ProfileServices";
import { RequestStatus } from "../../util/Strings";
import { useDispatch } from "react-redux";
import { setIsAlertShow } from "../../redux/action/AppLogics";

const UserRequestListScreen = (route) => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [data, setData] = useState([]);
  useEffect(() => {
    if (isFocused) {
      setLoader(true);
      fetchUserList();
    }
  }, [isFocused]);
  const fetchUserList = async () => {
    await fetchUserRequestedList((res) => {
      setLoader(false);
      setData(res);
    });
  };
  const updateStatus = async (payload) => {
    await adminActionAtReq(payload, (res) => {
      dispatch(
        setIsAlertShow({
          value: true,
          message: res?.message,
        })
      );

      if (res?.status) {
        route?.navigation.goBack();
      }
    });
  };
  return (
    <Container style={styles.content}>
      <StackHeader title={"User Request's"} />
      {data?.length > 0 ? (
        <FlatList
          style={styles.mainCont}
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => {
            return (
              <>
                <TouchableOpacity
                  style={styles.singleItemStyle}
                  onPress={() => {}}
                  activeOpacity={1}
                >
                  <LoadingImage
                    source={{ uri: `${item?.image}` }}
                    style={styles.profile}
                  />
                  <View style={styles.nameCont}>
                    <Text style={styles.nameTxt}>
                      {item?.name?.length > 0 ? item?.name : "No name"}
                      <Text
                        style={{
                          ...styles.nameTxt,
                          color: AppColors.grey.dark,
                        }}
                      >
                        {" request for verify account"}
                      </Text>
                    </Text>
                    <Text style={styles.emailTxt} numberOfLines={4}>
                      {item?.description?.length > 0
                        ? item?.description
                        : "No description"}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.btnCont}>
                  <TouchableOpacity
                    style={{ ...styles.mainBtn, backgroundColor: "#fca79f" }}
                    onPress={() => {
                      updateStatus({
                        id: item?.userId,
                        status: RequestStatus.rejected,
                      });
                    }}
                    activeOpacity={1}
                  >
                    <Text style={styles.btnTxt}>{"Cancel"}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      ...styles.mainBtn,
                      backgroundColor: "#6d14c4",
                    }}
                    onPress={() => {
                      updateStatus({
                        id: item?.userId,
                        status: RequestStatus.accepted,
                      });
                    }}
                    activeOpacity={1}
                  >
                    <Text style={styles.btnTxt}>{"Accept"}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.bottomLine} />
              </>
            );
          }}
        />
      ) : (
        <View style={styles.emptyCont}>
          {loader ? (
            <ActivityIndicator color={AppColors.blue.navy} size={"large"} />
          ) : (
            <Text style={styles.emptyTxt}>No Request found!</Text>
          )}
        </View>
      )}
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
  mainCont: {
    flex: 1,
    margin: AppHorizontalMargin,
  },
  singleItemStyle: {
    flexDirection: "row",
    padding: normalized(10),
    justifyContent: "flex-start",
    alignItems: "center",
  },
  profile: {
    width: normalized(55),
    height: normalized(55),
    borderRadius: normalized(55 / 2),
    marginVertical: normalized(5),
    borderWidth: 1.4,
    borderColor: AppColors.blue.navy,
  },
  nameCont: {
    marginHorizontal: normalized(10),
  },
  nameTxt: {
    fontSize: 14,
    color: AppColors.black.black,
    fontWeight: "400",
    marginVertical: 5,
  },
  emailTxt: {
    fontSize: 14,
    color: AppColors.grey.dark,
    fontWeight: "400",
    maxWidth: normalized(260),
  },
  bottomLine: {
    height: 1,
    width: "100%",
    backgroundColor: "#bcbec2",
  },
  mainBtn: {
    width: normalized(150),
    height: normalized(50),
    borderRadius: 50 / 2,
    borderWidth: 0,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
  },
  btnCont: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: normalized(10),
  },
});
export default UserRequestListScreen;
