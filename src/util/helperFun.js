import AsyncStorage from "@react-native-async-storage/async-storage";
import ThreadManager from "../ChatModule/ThreadManger";
import moment from "moment";
export const getUserDraftPost = async () => {
  try {
    let user = await AsyncStorage.getItem("draftPost");
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  } catch (e) {
    console.log("Error ", e);
    return null;
  }
};
export const saveUserDraftPost = async (data) => {
  try {
    await AsyncStorage.setItem("draftPost", JSON.stringify(data));
  } catch (e) {
    console.log("Error storing draftPost", e);
  }
};

export const paginationLogic = (totalCount, limit) => {
  let totalPages = 0;
  return (totalPages = Math.ceil(totalCount / limit));
};

///Chat Module

export const setUpChat = async (userId, onComplete) => {
  let newId = userId?.toString();
  await ThreadManager.instance.getUserThread(newId, async (list) => {
    await ThreadManager.instance.setupParticipantListener(newId);
    await ThreadManager.instance.setupThreadListener(newId);
    onComplete(true);
  });
};

export const removeEmptyLines = (str) => {
  if (!str) return "";
  str = str.trim();
  return str.replace(/^\s+|\s+$/g, "");
};

export const makeObjForInitialChat = (data) => {
  let obj = {};
  obj["id"] = data?.userId?.toString();
  obj["_id"] = data?.userId?.toString();
  obj["image"] = data?.profileImage ? data?.profileImage : "";
  obj["username"] = data?.username ? data?.username : "";
  return obj;
};

export const filterListAndSorted = (threadList) => {
  let mList = [];
  if (threadList?.length > 0) {
    threadList.forEach((item) => {
      if (
        item?.lastMessage &&
        mList.findIndex((el) => el.channelID == item.channelID) == -1
      ) {
        mList.push(item);
      }
    });
  }
  mList = mList.sort(function (a, b) {
    return b.createdAt && a.createdAt
      ? moment.utc(b.createdAt.substring(0, 16)).toDate().getTime() -
          moment.utc(a.createdAt.substring(0, 16)).toDate().getTime()
      : null;
  });
  mList = mList.filter((item, index) => {
    return mList.indexOf(item) === index;
  });
  return mList;
};

export const capitalizeFirstLetter = (str) => {
  if (!str) {
    return "";
  }
  let firstChar = str.charAt(0);
  return firstChar.toUpperCase() + str.slice(1);
};
