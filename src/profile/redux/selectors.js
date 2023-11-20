import FireStore from "@react-native-firebase/firestore";

const ProfileCollection = FireStore().collection("profiles");

//  Get Profile
export const getProfile = (state) => state.Profile.profile;

//  Get Profile
export const getProfileById = async (state, { id }) => {
  const profile = await (await ProfileCollection.doc(id).get()).data();
  return {
    username: profile?.username,
    profileImage: profile.profileImage,
    userId: profile.userId,
  };
};

//  Get error

export const getError = (state) => state.Profile.error;

//  Get loading

export const getLoading = (state) => state.Profile.loading;
