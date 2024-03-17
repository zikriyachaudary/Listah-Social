import React, { useEffect, useState } from "react";
import { Appearance, FlatList, StyleSheet, Text, View } from "react-native";
import CustomSwitch from "../../common/CustomSwitch";
import { useIsFocused } from "@react-navigation/native";
import { getThemeType, saveThemeType } from "../../util/helperFun";
import { Container, StackHeader } from "../../common";
import {
  AppHorizontalMargin,
  darkModeColors,
  hv,
  initial_Theme_Mode,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import { Theme_Mode, Theme_Types } from "../../util/Strings";
import { setThemeType } from "../../redux/action/AppLogics";
import { useDispatch, useSelector } from "react-redux";
const ThemeChangingScreen = () => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [switchList, setSwitchList] = useState([{}]);
  useEffect(() => {
    if (isFocused) {
      const loadTheme = async () => {
        let themeType = await getThemeType();
        let newArr = initial_Theme_Mode.map((el) => {
          if (
            (themeType === Theme_Types.appLightMode && el?.id === 1) ||
            (themeType === Theme_Types.appDarkMode && el?.id === 2) ||
            ((themeType === Theme_Types.deviceDarkMode ||
              themeType === Theme_Types.deviceLightMode) &&
              el?.id === 3)
          ) {
            return { ...el, isSelected: true };
          }
          return el;
        });
        setSwitchList(newArr);
      };
      loadTheme();
    }
  }, [isFocused]);

  const updateThemeMode = (selectedItem) => {
    let updatedArr = [];
    switchList.map((el) => {
      updatedArr.push({ ...el, isSelected: el?.id == selectedItem?.id });
    });
    setSwitchList(updatedArr);
    if (selectedItem?.id == 1) {
      saveThemeType(Theme_Types.appLightMode);
      dispatch(setThemeType(Theme_Mode.isLight));
    } else if (selectedItem?.id == 2) {
      saveThemeType(Theme_Types.appDarkMode);
      dispatch(setThemeType(Theme_Mode.isDark));
    } else if (selectedItem?.id == 3) {
      const isDark = Appearance.getColorScheme() === "dark";
      saveThemeType(
        isDark ? Theme_Types.deviceDarkMode : Theme_Types.deviceLightMode
      );
      dispatch(setThemeType(isDark ? Theme_Mode.isDark : Theme_Mode.isLight));
    }
  };

  return (
    <Container
      style={{
        ...styles.content,
        backgroundColor:
          themeType == Theme_Mode.isDark
            ? darkModeColors.background
            : lightModeColors.background,
      }}
    >
      <StackHeader title={"Theme Change"} />
      <FlatList
        style={{ flex: 1, paddingHorizontal: AppHorizontalMargin }}
        data={switchList}
        keyExtractor={(index) => `${index}`}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingVertical: hv(10),
              }}
            >
              <Text
                style={{
                  fontSize: normalized(14),
                  fontWeight: "400",
                  color:
                    themeType == Theme_Mode.isDark
                      ? darkModeColors.text
                      : lightModeColors.text,
                }}
              >
                {item?.title}
              </Text>
              <CustomSwitch
                value={item?.isSelected}
                onToggle={(val) => {
                  updateThemeMode(item);
                }}
              />
            </View>
          );
        }}
      />
    </Container>
  );
};
const styles = StyleSheet.create({
  content: {
    justifyContent: "space-between",
  },
});
export default ThemeChangingScreen;
