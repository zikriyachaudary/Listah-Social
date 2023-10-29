import AsyncStorage from "@react-native-async-storage/async-storage";

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
