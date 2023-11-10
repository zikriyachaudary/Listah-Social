import React, { useEffect, useRef, useState } from "react";
import { Container, StackHeader } from "../../common";
import {
  ActivityIndicator,
  Dimensions,
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
  hv,
  normalized,
} from "../../util/AppConstant";
import LoadingImage from "../../common/LoadingImage";
import {
  fetchAdminUserList,
  fetchAllUsersProfile,
  getUserListSize,
} from "../../network/Services/ProfileServices";
import { paginationLogic } from "../../util/helperFun";
import * as Colors from "../../config/colors";

const AppUserListScreen = (route) => {
  const isFocused = useIsFocused();
  const [isLoader, setIsLoader] = useState(false);
  const [adminData, setAdminData] = useState([]);
  const [userList, setUserList] = useState([]);
  const [totalUser, setTotalUser] = useState(0);

  useEffect(() => {
    if (isFocused) {
      fetchAdminUserList((res) => {
        setAdminData(res);
      });
      fetchUserList();
    }
  }, [isFocused]);

  const fetchUserList = async () => {
    try {
      setIsLoader(true);
      await fetchAllUsersProfile(async (onResponse) => {
        if (onResponse?.length > 0) {
          await getUserListSize((result) => {
            setTotalUser(result);
            let pageLimit = paginationLogic(result, 5);
            console.log("pageLimit------->", pageLimit);
          });
        }
        if (onResponse?.length > 0) {
          setUserList(onResponse);
        }
        setTimeout(() => {
          setIsLoader(false);
        }, 500);
      });
    } catch (e) {
      console.log("error listing----> ", e);
      setIsLoader(false);
    } finally {
    }
  };
  return (
    <Container style={styles.content}>
      <StackHeader title={"Users"} />
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={[1, 2, 3, 4]}
          keyExtractor={(index) => `${index}`}
          renderItem={({ item, index }) => {
            return index == 1 ? (
              adminData?.length > 0 ? (
                <View>
                  <View style={styles.titleCont}>
                    <Text style={styles.title}>{"Admins"}</Text>
                  </View>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={adminData}
                    keyExtractor={(index) => `${index}`}
                    renderItem={({ item, index }) => {
                      return (
                        <>
                          <TouchableOpacity
                            style={styles.singleItemStyle}
                            onPress={() => {}}
                            activeOpacity={1}
                          >
                            <View style = {{
                                width: normalized(70),
                                height: normalized(70)
                            }}>
                            <LoadingImage
                              source={{ uri: `${item?.image}` }}
                              style={styles.profile}
                            />

                            {item?.verified && (
                                  <Text
                                    style={{
                                      position : "absolute",
                                      bottom: -8,
                                      end : 0,
                                      fontFamily: "Poppins-Bold",
                                      fontSize: normalized(12),
                                      color: Colors.primary,
                                    }}
                                  >
                                    {`(A+)`}
                                  </Text>
                              )}
                            </View>
                          
                            <View style={styles.nameCont}>
                              <Text style={styles.nameTxt}>
                                {item?.name?.length > 0
                                  ? item?.name
                                  : "No name"}
                              </Text>
                              <Text style={styles.emailTxt}>
                                {item?.email?.length > 0
                                  ? item?.email
                                  : "No email"}
                              </Text>

                           
                            </View>
                          </TouchableOpacity>
                          <View style={styles.bottomLine} />
                        </>
                      );
                    }}
                  />
                </View>
              ) : null
            ) : index == 2 ? (
              userList?.length > 0 ? (
                <View>
                  <View style={{...styles.titleCont, marginTop : 10}}>
                    <Text
                      style={styles.title}
                    >{`Total Users (${totalUser})`}</Text>
                  </View>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={userList}
                    keyExtractor={(index) => `${index}`}
                    renderItem={({ item, index }) => {
                      return (
                        <>
                          <TouchableOpacity
                            style={styles.singleItemStyle}
                            onPress={() => {}}
                            activeOpacity={1}
                          >
                             <View style = {{
                                width: normalized(70),
                                height: normalized(70)
                            }}>
                            <LoadingImage
                              source={{ uri: `${item?.image}` }}
                              style={styles.profile}
                            />

                            {item?.verified && (
                                  <Text
                                    style={{
                                      position : "absolute",
                                      bottom: -8,
                                      end : 0,
                                      fontFamily: "Poppins-Bold",
                                      fontSize: normalized(12),
                                      color: Colors.primary,
                                    }}
                                  >
                                    {`(A+)`}
                                  </Text>
                              )}
                            </View>
                            <View style={styles.nameCont}>
                              <Text style={styles.nameTxt}>
                                {item?.name?.length > 0
                                  ? item?.name
                                  : "No name"}
                               
                              </Text>
                              <Text style={styles.emailTxt}>
                                {item?.email?.length > 0
                                  ? item?.email
                                  : "No email"}
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <View style={styles.bottomLine} />
                        </>
                      );
                    }}
                  />
                </View>
              ) : null
            ) : null;
          }}
        />
        {isLoader || (userList?.length == 0 && adminData?.length == 0) ? (
          <View style={styles.emptyCont}>
            {isLoader ? (
              <ActivityIndicator color={AppColors.blue.navy} size={"large"} />
            ) : userList?.length == 0 && adminData?.length == 0 ? (
              <Text style={styles.emptyTxt}>No User found!</Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </Container>
  );
};
const styles = StyleSheet.create({
  content: {
    justifyContent: "space-between",
  },
  emptyCont: {
    height: "100%",
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
    marginStart: normalized(10),
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
  },
  bottomLine: {
    height: 1,
    width: "100%",
    backgroundColor: "#bcbec2",
  },
  title: {
    marginHorizontal: normalized(15),
    fontSize: normalized(14),
    paddingVertical: hv(4),
    color: Colors.primary,
    textDecorationLine : "underline",
    fontWeight : "bold",
    textAlign: "center",
  },
  titleCont: {
    flex: 1,
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default AppUserListScreen;
