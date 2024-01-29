export const Collections = {
  ACCOUNT_VERIFY_REQUEST: "Account_Verification_Request",
  profile: "profiles",
  NOTIFICATION: "Notifications",
  CATEGORIES: "Categories",
  POST: "posts",
  BLOCKED_USER: "blockUsers",
};

export const RequestStatus = {
  newReq: "New Request",
  pending: "Pending",
  accepted: "Accepted",
  rejected: "Rejected",
};

export const Notification_Types = {
  follow: "Follow",
  unFollow: "UnFollow",
  like: "Like",
  unlike: "Unlike",
  suggestion: "Suggestion",
  challenge: "Challenge",
  comment: "Comment",
  announced: "Announced_Post",
  chat_messages: "Chat_messages",
};

export const Notification_Messages = {
  followMsg: "is now following you",
  likeMsg: "liked your post",
  suggestion: "gave a suggestion to your post",
  delSuggestion: "gave a suggestion to delete the item of post",
  changeSuggestion: "gave a suggestion to change the item of post",
  challenge: "challenged your post",
  comment: "commented on your post",
  announcment: "announced a post",
};
export const AppStrings = {
  Network: {
    somethingWrong: "Something went wrong",
  },
  Validation: {
    fieldsEmptyError: "Please fill the fields properly",
    invalidEmailError: "Email is invalid",
    passwordLengthError: "Password should not be less than 8 characters.",
    passwordNotMatchError: "Passwords does not match",
    emailEmptyError: "Email can't be empty",
    otpCodeEmptyError: "OTP Code can't be empty",
    maxImageSizeError:
      "The selected image size exceeds the maximum limit of 10MB.",
  },
};
