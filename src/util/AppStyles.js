import { StyleSheet } from "react-native";
import { AppColors, normalized } from "./AppConstant";

export const AppStyles = StyleSheet.create({
  MainStyle: {
    flex: 1,
    backgroundColor: AppColors.white.white,
  },
  centeredCommon: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputTitleStyle: {
    color: AppColors.black.black,
    fontSize: normalized(14),
  },
  inputTextStyle: {
    color: AppColors.black.black,
    fontSize: normalized(14),
  },
});
