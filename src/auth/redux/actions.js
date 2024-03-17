import FireStore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import * as constants from "./constants";
import { Alert } from "react-native";
import { setUpdateFBToken } from "../../redux/action/AppLogics";

const ProfileCollection = FireStore().collection("profiles");

/**
 * AUTH_STATE_CHANGE
 */
export const changeAuthState = (payload) => ({
  type: constants.AUTH_STATE_CHANGE,
  payload,
});

/**
 * LOGIN
 */
export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: constants.LOGIN.REQUEST });
    await auth().signInWithEmailAndPassword(email, password);
    const currentUser = auth().currentUser.toJSON();
    dispatch({ type: constants.LOGIN.SUCCESS, payload: currentUser });
    dispatch(setUpdateFBToken(true));
  } catch (error) {
    const errList = error.message.split("] ");
    console.log("login -- > ", errList[errList.length - 1]);
    Alert.alert(errList[errList.length - 1]);
    dispatch({ type: constants.LOGIN.FAIL, error });
  } finally {
    dispatch({ type: constants.LOGIN.COMPLETE });
  }
};

export const deleteLoginAccount = () => async (dispatch) => {
  try {
    dispatch({ type: constants.LOGIN.REQUEST });
    const currentUser = auth().currentUser.toJSON();
    await auth().currentUser.delete();
    dispatch({ type: constants.LOGIN.SUCCESS, payload: currentUser });
  } catch (error) {
    Alert.alert(error.message);
    dispatch({ type: constants.LOGIN.FAIL, error });
  } finally {
    dispatch({ type: constants.LOGIN.COMPLETE });
  }
};

/**
 * FORGOT_PASSWORD
 */
export const forgotPassword = (email, cb) => async (dispatch) => {
  try {
    dispatch({ type: constants.FORGOT_PASSWORD.REQUEST });

    await auth().sendPasswordResetEmail(email);

    Alert.alert("A reset Email has been send to your email.");

    if (cb) {
      cb();
    }

    dispatch({ type: constants.FORGOT_PASSWORD.SUCCESS });
  } catch (error) {
    Alert.alert(error.message);
    dispatch({ type: constants.FORGOT_PASSWORD.FAIL, error });
  } finally {
    dispatch({ type: constants.FORGOT_PASSWORD.COMPLETE });
  }
};

/**
 * REGISTER
 */
export const register = (info) => async (dispatch) => {
  try {
    dispatch({ type: constants.REGISTER.REQUEST });
    const { email, password, username, profileImage } = info;
    await auth().createUserWithEmailAndPassword(email, password);
    await auth().currentUser.updateProfile({
      displayName: username,
      photoURL: profileImage,
    });

    const profileDoc = await ProfileCollection.doc(auth().currentUser.uid);
    console.log("profileDoc------->", profileDoc);
    const profile = {
      userId: auth().currentUser.uid,
      email,
      username,
      profileImage,
      likedPosts: [],
      followings: [],
      followers: [],
      notifications: [],
    };
    console.log("profile------->", profile);

    await profileDoc.set(profile);
    const currentUser = auth().currentUser.toJSON();
    dispatch({ type: constants.REGISTER.SUCCESS, payload: currentUser });
    dispatch(setUpdateFBToken(true));
  } catch (error) {
    Alert.alert(error.message);
    dispatch({ type: constants.REGISTER.FAIL, error });
  } finally {
    dispatch({ type: constants.REGISTER.COMPLETE });
  }
};

/**
 * LOGOUT
 */
export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: constants.LOGOUT.REQUEST });
    const user = auth().currentUser;
    if (user) {
      await auth().signOut();
    }
    dispatch({ type: constants.LOGOUT.SUCCESS });
  } catch (error) {
    Alert.alert(error.message);
    dispatch({ type: constants.LOGOUT.FAIL, error });
  } finally {
    dispatch({ type: constants.LOGOUT.COMPLETE });
  }
};

export const deleteUserAccount = () => async (dispatch) => {
  try {
    dispatch({ type: constants.LOGOUT.REQUEST });

    const user = auth().currentUser;

    if (user) {
      await ProfileCollection.doc(auth().currentUser.uid).delete();
      await auth().currentUser.delete();
    }
    dispatch({ type: constants.LOGOUT.SUCCESS });
  } catch (error) {
    console.log("showError - > ", error);
    Alert.alert(error.message);
    dispatch({ type: constants.LOGOUT.FAIL, error });
  } finally {
    dispatch({ type: constants.LOGOUT.COMPLETE });
  }
};
