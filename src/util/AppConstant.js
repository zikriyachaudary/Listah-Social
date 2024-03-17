import { Dimensions, Platform, PixelRatio } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
export const platformVersion = Platform.Version;

export type ScreenProps = NativeStackScreenProps<any, any>;
export const maxImageSizeInBytes = 20 * 1024 * 1024; // 20MB
export const ScreenSize = Dimensions.get("window");
const templateWidth = 375;
const templateHeight = 812;
export const isSmallDevice = ScreenSize.height < 700 ? true : false;

const widthRatio = ScreenSize.width / templateWidth;

const heightRatio = ScreenSize.height / templateHeight;

export const isLargeHeight = Dimensions.get("window").height > 750;

export const isLargeWidth = Dimensions.get("window").width > 390;

export const normalized = (value) =>
  PixelRatio.roundToNearestPixel(value * widthRatio);

export const hv = (value) =>
  PixelRatio.roundToNearestPixel(value * heightRatio);
let value = normalized(20) * 2;

export const horizontalScreenWithMargin = ScreenSize.width - value;

export const formFieldsHeight =
  Platform.OS == "android" ? normalized(45) : normalized(50);
export const { width: fullWidth, height: fullHeight } =
  Dimensions.get("window");

export const getWidthPercentage = (percentage) =>
  (fullWidth * percentage) / 100;

export const getHeightPercentage = (percentage) =>
  (fullHeight * percentage) / 100;

export const getHeightPixel = (pixel) => {
  const percent = (pixel / 812) * 100;
  return getHeightPercentage(percent);
};

export const getWidthPixel = (pixel) => {
  const percent = (pixel / 375) * 100;
  return getWidthPercentage(percent);
};

export const AppHorizontalMargin = normalized(18);

export const getResponsiveFont = (fontSize) => {
  const deviceWidth = Dimensions.get("window").width;
  const scaleFactor =
    deviceWidth < 400
      ? 1
      : deviceWidth < 500
      ? 1.2
      : deviceWidth < 600
      ? 1.3
      : 1.5;
  return Math.round(scaleFactor * fontSize);
};
export const EmailValidator = (email) => {
  let validEmailRegex = /^[\w.-]{1,25}@[\w-]{1,24}\.\w{2,10}$/i;
  return validEmailRegex.test(email);
};

export const lightModeColors = {
  text: "#222",
  textAccent: "#444",
  background: "#fff",
};
export const darkModeColors = {
  text: "#fff",
  textAccent: "#ccc",
  background: "#222",
};

export const AppColors = {
  blue: {
    navy: "#6d14c4",
    royalBlue: "#5647e4",
    lightNavy: "#544be3",
    light: "#1C5FAE",
    lightBlue: "#dce9f7",
  },
  gradient: {
    light: "#6d14c4",
  },
  white: {
    white: "#FFF",
    light: "#fbfbfb",
    simpleLight: "#EEEEEE",
    sky: "#fbfcff",
    lightSky: "#F9FBFC",
    skyBlue: "#E8EEF5",
  },
  black: {
    black: "#000",
    light: "#B4B1B6",
    dark: "#1E1E1F",
    shadow: "rgba(0,0,0, 0.4)",
    transparentColor: "rgba(0,0,0,0.5)",
    lightBlack: "#4B4B4B",
  },
  grey: {
    lightGrey: "#eeeeee",
    simpleGrey: "#CCCCCC",
    dark: "#767D90",
    simple: "#FBFBFB",
    Analogous: "#979797",
  },
  red: {
    dark: "#AC3049",
    light: "#e6406a",
  },
  green: {
    lightGreen: "#EFF3F2",
    primaryLight: "#76E2C6",
  },
};

export const AppImages = {
  appIcon: require("../assets/images/appIcon.png"),
  playbutton: require("../assets/images/playbutton.png"),
  VideoError: require("../assets/images/VideoError.png"),

  Common: {
    appLogo: require("../assets/images/Common/logo.png"),
    PlusBtn: require("../assets/images/Common/PlusBtn.png"),
    SplashBg: require("../assets/images/Common/SplashBg.png"),
    versus_icon: require("../assets/images/Common/versus-icon.png"),
    global: require("../assets/images/Common/global.png"),
    handIcon: require("../assets/images/Common/handIcon.png"),
    memberIcon: require("../assets/images/Common/memberIcon.png"),
    menuIcon: require("../assets/images/Common/menuIcon.png"),
    backArrow: require("../assets/images/Common/backArrow.png"),
    announcement: require("../assets/images/announcement-ic.png"),
    profile: require("../assets/images/Common/profile.png"),
    aPlusIcon: require("../assets/images/Common/aPlusIcon.jpeg"),
    sports: require("../assets/images/Common/sports.jpeg"),
    food: require("../assets/images/Common/food.jpeg"),
    beauty: require("../assets/images/Common/beauty.jpeg"),
    movie: require("../assets/images/Common/movie.jpeg"),
    books: require("../assets/images/Common/books.jpeg"),
    electronic: require("../assets/images/Common/electronic.jpeg"),
    other: require("../assets/images/Common/other.jpeg"),
    cross: require("../assets/images/Common/cross.png"),
    arrowDown: require("../assets/images/Common/arrowDown.png"),
    listahIcon: require("../assets/images/Common/listahIcon.jpeg"),
    crossIcon: require("../assets/images/Common/crossIcon.png"),
  },
  profile: {
    logout: require("../assets/images/logout.png"),
    delete: require("../assets/images/delete.png"),
    savePosts: require("../assets/images/Auth/save-posts.png"),
    darkThemeIcon: require("../assets/images/darkThemeIcon.png"),
  },
  Auth: {
    backIcon: require("../assets/images/Auth/backIcon.png"),
    Camera: require("../assets/images/Auth/Camera.png"),
    closeEye: require("../assets/images/Auth/closeEye.png"),
    eye: require("../assets/images/Auth/eye.png"),
    logo: require("../assets/images/Auth/logo.png"),
  },
  Chat: {
    SendIcon: require("../assets/images/Chat/SendIcon.png"),
    Voice: require("../assets/images/Chat/Voice.png"),
    Attachment: require("../assets/images/Chat/Attachment.png"),
    Camera: require("../assets/images/Chat/Camera.png"),
    Gallery: require("../assets/images/Chat/Gallery.png"),
    Video: require("../assets/images/Chat/Video.png"),
    Document: require("../assets/images/Chat/Document.png"),
    msgSeen: require("../assets/images/Chat/msgSeen.png"),
    emptyChat: require("../assets/images/Chat/emptyChat.png"),
    Microphone: require("../assets/images/Chat/Microphone.png"),
    chat: require("../assets/images/Chat/chat.png"),
    documentIcon: require("../assets/images/Chat/documentIcon.png"),
    chatStartIcon: require("../assets/images/Chat/chatStartIcon.png"),
  },
};

export const initial_Theme_Mode = [
  {
    id: 1,
    title: "Light Mode",
    isSelected: false,
  },
  { id: 2, title: "Dark Mode", isSelected: false },
  {
    id: 3,
    title: "Phone Mode",
    isSelected: false,
  },
];

export const topicsDummyData = [
  {
    id: 1,
    name: "Topics coming soon",
  },
];

export const categoriesArr = [
  {
    id: 1,
    name: "Shows & Movies",
    icon: "https://firebasestorage.googleapis.com/v0/b/listah-ae13c.appspot.com/o/categories%2Fmovie.jpeg?alt=media&token=f7a28ca3-2279-4f89-b2e2-17971b6fd653",
  },
  {
    id: 2,
    name: "Sports",
    icon: "https://firebasestorage.googleapis.com/v0/b/listah-ae13c.appspot.com/o/categories%2Fsports.jpeg?alt=media&token=ded58b34-c192-4870-a21f-e16bab53a269",
  },
  {
    id: 3,
    name: "Electronics & Tech",
    icon: "https://firebasestorage.googleapis.com/v0/b/listah-ae13c.appspot.com/o/categories%2Felectronic.jpeg?alt=media&token=18dc48ee-09c8-4eb1-b25a-b2c66d363b20",
  },
  {
    id: 4,
    name: "Books & Literature",
    icon: "https://firebasestorage.googleapis.com/v0/b/listah-ae13c.appspot.com/o/categories%2Fbooks.jpeg?alt=media&token=cd27b96c-2ad5-4c1c-bb6e-cd25bbffa96a",
  },
  {
    id: 5,
    name: "Food & Drinks",
    icon: "https://firebasestorage.googleapis.com/v0/b/listah-ae13c.appspot.com/o/categories%2Ffood.jpeg?alt=media&token=053d56d9-f810-461e-a5e8-3b8564ea365e",
  },
  {
    id: 6,
    name: "Music",
    icon: "https://firebasestorage.googleapis.com/v0/b/listah-ae13c.appspot.com/o/categories%2Fbeauty.jpeg?alt=media&token=d7c71a71-8e2b-41dd-8b77-13f1f717939f",
  },
  {
    id: 7,
    name: "Fashion & Beauty",
    icon: "https://firebasestorage.googleapis.com/v0/b/listah-ae13c.appspot.com/o/categories%2Fbeauty.jpeg?alt=media&token=d7c71a71-8e2b-41dd-8b77-13f1f717939f",
  },
  {
    id: 8,
    name: "Other",
    icon: "https://firebasestorage.googleapis.com/v0/b/listah-ae13c.appspot.com/o/categories%2Fother.jpeg?alt=media&token=ae5d118c-5cc6-4cf8-9d9a-5f9118ad97c6",
  },
];
export const mediaSelectionConstants = [
  {
    id: 1,
    image: AppImages.Chat.Gallery,
    text: "upload image",
  },
  {
    id: 2,
    image: AppImages.Chat.Document,
    text: "Upload document",
  },
];

export const imagePickerConstants = [
  {
    id: 1,
    image: AppImages.Chat.Gallery,
    text: "Upload from Gallery",
  },
  {
    id: 2,
    image: AppImages.Auth.Camera,
    text: "Upload from Camera",
  },
];

export const TYPE_SELECTION_ARR = [
  {
    id: 1,
    text: "video",
  },
  {
    id: 2,
    text: "photo",
  },
];
