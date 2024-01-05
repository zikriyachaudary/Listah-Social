import firestore from "@react-native-firebase/firestore";
import { Collections, RequestStatus } from "../../util/Strings";
import { categoriesArr } from "../../util/AppConstant";

export const checkUserAccountRequestStatus = async (id, onComplete) => {
  await firestore()
    .collection(Collections.ACCOUNT_VERIFY_REQUEST)
    .where("userId", "==", id)
    .get()
    .then((snapDoc) => {
      if (snapDoc?.docs?.length > 0) {
        onComplete(snapDoc.docs[0]?._data?.status);
      } else {
        onComplete(RequestStatus.newReq);
      }
    });
};

export const updateUserReqStatus = async (id, body, onComplete) => {
  await firestore()
    .collection(Collections.ACCOUNT_VERIFY_REQUEST)
    .where("userId", "==", id)
    .get()
    .then(async (snapDoc) => {
      let isUpdatedReq = snapDoc.docs.length > 0 ? true : false;
      if (isUpdatedReq) {
        await firestore()
          .collection(Collections.ACCOUNT_VERIFY_REQUEST)
          .doc(id)
          .update({
            status: body.status,
          })
          .then(() => {
            onComplete({ status: true, message: "Send Request Successfully!" });
          })
          .catch(() => {
            onComplete({
              status: false,
              message: "Error!",
            });
          });
      } else {
        await firestore()
          .collection(Collections.ACCOUNT_VERIFY_REQUEST)
          .doc(id)
          .set(body)
          .then(() => {
            onComplete({ status: true, message: "Send Request Successfully!" });
          })
          .catch(() => {
            onComplete({
              status: false,
              message: "Error!",
            });
          });
      }
    });
};

export const fetchAllUsersProfile = async (onUpdates) => {
  await firestore()
    .collection(Collections.profile)
    .get()
    .then((snapShot) => {
      let list = [];
      snapShot?.docs.forEach((doc, index) => {
        if (!doc?._data?.isAdmin) {
          list.push({
            email: doc?._data?.email,
            image: doc?._data?.profileImage,
            userId: doc?._data?.userId,
            name: doc?._data?.username,
            verified: doc?._data?.verified ? true : false,
          });
        }
      });
      setTimeout(() => {
        onUpdates(list);
      }, 1000);
    })
    .catch(() => {
      onUpdates([]);
    });
};
export const fetchAdminUserList = async (onComplete) => {
  await firestore()
    .collection(Collections.profile)
    .where("isAdmin", "==", true)
    .get()
    .then((snapShot) => {
      let list = [];
      snapShot?.docs.forEach((doc, index) => {
        list.push({
          email: doc?._data?.email,
          image: doc?._data?.profileImage,
          userId: doc?._data?.userId,
          name: doc?._data?.username,
          verified: doc?._data?.verified,
        });
      });
      setTimeout(() => {
        onComplete(list);
      }, 1000);
    });
};

export const getUserListSize = async (onComplete) => {
  await firestore()
    .collection(Collections.profile)
    .get()
    .then((snapShot) => {
      onComplete(snapShot.docs?.length);
    })
    .catch(() => {});
};

export const fetchUserRequestedList = async (onUpdates) => {
  await firestore()
    .collection(Collections.ACCOUNT_VERIFY_REQUEST)
    .get()
    .then((snapShot) => {
      let list = [];
      snapShot?.docs.forEach((doc, index) => {
        if (doc?._data?.status == RequestStatus.pending) {
          list.push(doc?._data);
        }
      });
      setTimeout(() => {
        onUpdates(list);
      }, 1000);
    })
    .catch(() => {
      onUpdates([]);
    });
};
export const updateCategiesList = async () => {
  await firestore()
    .collection(Collections.CATEGORIES)
    .doc()
    .set({ categoriesList: categoriesArr })
    .then(() => {
      console.log("update Categories Successfully");
    })
    .catch(() => {
      console.log("error-------->");
    });
};
export const fetchCategoriesList = async (onComplete) => {
  await firestore()
    .collection(Collections.CATEGORIES)
    .get()
    .then((snapShot) => {
      let arr = [];
      if (snapShot?.docs[0]?._data) {
        arr = snapShot?.docs[0]?._data;
      }
      onComplete(arr);
    })
    .catch(() => {});
};

export const adminActionAtReq = async (obj, onComplete) => {
  await firestore()
    .collection(Collections.ACCOUNT_VERIFY_REQUEST)
    .doc(obj?.id)
    .update({
      status: obj?.status,
    })
    .then(async () => {
      if (obj?.status == RequestStatus.accepted) {
        await firestore()
          .collection(Collections.profile)
          .doc(obj?.id)
          .update({
            verified: true,
          })
          .then(() => {
            onComplete({ status: true, message: "Updated Successfully!" });
          });
      } else {
        onComplete({ status: true, message: "Updated Successfully!" });
      }
    })
    .catch(() => {
      onComplete({
        status: false,
        message: "Error!",
      });
    });
};

export const fetchPostData = async (postId, onComplete) => {
  await firestore()
    .collection(Collections.POST)
    .where("id", "==", postId)
    .get()
    .then((snapDoc) => {
      if (snapDoc?.docs?.length > 0) {
        onComplete(snapDoc.docs[0]?._data);
      } else {
        onComplete(null);
      }
    });
};

export const filterPostReq = async (key, onComplete) => {
  await firestore()
    .collection(Collections.POST)
    .where("category", "==", key)
    .get()
    .then((snapDoc) => {
      let arr = [];
      if (snapDoc.docs.length > 0) {
        snapDoc.docs.forEach(async (doc) => {
          let result = { ...doc?._data };
          if (!result?.author?.userId) {
            let updatedAuth = null;
            await fetchUserProfile(result?.author, (res) => {
              updatedAuth = res;
            });
            result["author"] = updatedAuth;
          }
          arr.push(result);
        });
      }
      onComplete(arr);
    });
};
const fetchUserProfile = async (userId, atComplete) => {
  await firestore()
    .collection(Collections.profile)
    .where("userId", "==", userId)
    .get()
    .then((snapDoc) => {
      let data = snapDoc.docs[0]?._data;
      if (data?.username) {
        atComplete({
          profileImage: data?.profileImage,
          userId: data?.userId,
          username: data?.username,
          verified: data?.verified ? true : false,
        });
      }
    });
};
