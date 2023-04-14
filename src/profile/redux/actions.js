import FireStore from '@react-native-firebase/firestore';
import FireAuth from '@react-native-firebase/auth';
import * as constants from './constants';
import { Alert } from 'react-native';

const ProfileCollection = FireStore().collection('profiles');


/**
 * SET_PROFILE
 */
export const setProfile = payload => ({
  type: constants.SET_PROFILE,
  payload,
});

/**
 * GET_PROFILE
 */
export const getProfile = () => async (dispatch) => {
  try {
    dispatch({ type: constants.GET_PROFILE.REQUEST });
    const currentUser = FireAuth().currentUser.uid;
    const profile = await (await ProfileCollection.doc(currentUser).get()).data();

    dispatch({ type: constants.GET_PROFILE.SUCCESS, payload: profile });
  } catch (error) {
    Alert.alert(error.message);
    dispatch({ type: constants.GET_PROFILE.FAIL, error });
  } finally {
    dispatch({ type: constants.GET_PROFILE.COMPLETE });
  }
};

/**
 * GET_PROFILE_BY_ID
 */
export const getProfileById = (id, cb) => async (dispatch) => {
  try {
    dispatch({ type: constants.GET_PROFILE_BY_ID.REQUEST });

    const profile = await (await ProfileCollection.doc(id).get()).data();

    if (cb) {
      cb(profile);
    }

    dispatch({ type: constants.GET_PROFILE_BY_ID.SUCCESS });
    return profile;
  } catch (error) {
    Alert.alert(error.message);
    dispatch({ type: constants.GET_PROFILE_BY_ID.FAIL, error });
  } finally {
    dispatch({ type: constants.GET_PROFILE_BY_ID.COMPLETE });
  }
};

/**
 * PROFILE_UPDATE
 */
export const updateProfile = (changes) => async (dispatch) => {
  try {
    dispatch({ type: constants.PROFILE_UPDATE.REQUEST });
    const currentUser = FireAuth().currentUser;

    if (changes?.profileImage || changes?.username) {
      await currentUser.updateProfile({
        photoURL: changes?.profileImage,
        displayName: changes?.username,
      });
    }

    await ProfileCollection.doc(currentUser.uid).update(changes);

    const updatedProfile = await (await ProfileCollection.doc(currentUser.uid).get()).data();

    dispatch({ type: constants.PROFILE_UPDATE.SUCCESS, payload: updatedProfile });
  } catch (error) {
    Alert.alert(error.message);
    dispatch({ type: constants.PROFILE_UPDATE.FAIL, error });
  } finally {
    dispatch({ type: constants.PROFILE_UPDATE.COMPLETE });
  }
};