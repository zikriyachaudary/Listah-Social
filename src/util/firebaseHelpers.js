/* eslint-disable import/prefer-default-export */
import firestore from "@react-native-firebase/firestore";

export const firestoreTimestampToDate = (timestamp) => {
  if (
    timestamp &&
    typeof timestamp._nanoseconds === "number" &&
    typeof timestamp._seconds === "number"
  ) {
    return new firestore.Timestamp(
      timestamp._seconds,
      timestamp._nanoseconds
    ).toDate();
  }
  if (
    timestamp &&
    typeof timestamp.nanoseconds === "number" &&
    typeof timestamp.seconds === "number"
  ) {
    return new firestore.Timestamp(
      timestamp.seconds,
      timestamp.nanoseconds
    ).toDate();
  }
  return timestamp ? new Date(timestamp) : new Date();
};
