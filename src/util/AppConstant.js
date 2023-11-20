import { Dimensions, Platform, PixelRatio } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
export const platformVersion = Platform.Version;

export type ScreenProps = NativeStackScreenProps<any, any>;

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

export const AppColors = {
  blue: {
    navy: "#6d14c4",
    light: "#1C5FAE",
    lightBlue: "#dce9f7",
  },
  white: {
    white: "#FFF",
    light: "#fbfbfb",
    simpleLight: "#EEEEEE",
    sky: "#fbfcff",
    simpleDark: "#e7eef5",
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
  orange: {
    creamy: "#f7f2e8",
    lightOrange: "#f5ecd8",
  },
  grey: {
    lightGrey: "#eeeeee",
    simpleGrey: "#CCCCCC",
    dark: "#767D90",
    simple: "#FBFBFB",
  },
  red: {
    dark: "#AC3049",
    light: "#e6406a",
  },
  yellow: {
    dark: "#D4A33C",
    light: "#D3A23B",
  },
};

export const AppImages = {
  appIcon: require("../assets/images/appIcon.png"),
  profile: {
    logout: require("../assets/images/logout.png"),
    delete: require("../assets/images/delete.png"),
  },
};
