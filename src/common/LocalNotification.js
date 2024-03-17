import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  AppImages,
  darkModeColors,
  lightModeColors,
  normalized,
} from "../util/AppConstant";
import { useSelector } from "react-redux";
import { Theme_Mode } from "../util/Strings";
const LocalNotification = (props) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  const translationY = useSharedValue(-100);
  const selector = useSelector((AppState) => AppState);
  useEffect(() => {
    showNoti();
    setTimeout(() => {
      showNoti();
      props.closeView();
    }, 5000);
  }, []);
  const showNoti = () => {
    translationY.value = withTiming(translationY.value == 0 ? -100 : 0, {
      duration: 500,
    });
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: 52,
      marginHorizontal: 15,
      borderRadius: 8,
      marginTop: Platform.OS === "android" ? 35 : 5,
      paddingHorizontal: 10,
      backgroundColor:
        themeType == Theme_Mode.isDark
          ? darkModeColors.background
          : lightModeColors.background,
      transform: [
        {
          translateY: translationY.value,
        },
      ],
      flexDirection: "row",
      paddingVertical: 5,
    };
  });
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        props.openView();
      }}
    >
      <Animated.View style={animatedStyle}>
        <Image
          style={{
            height: normalized(40),
            width: normalized(40),
            borderRadius: normalized(6),
            backgroundColor:
              themeType == Theme_Mode.isDark
                ? darkModeColors.background
                : lightModeColors.background,
          }}
          source={AppImages.Common.appLogo}
        />
        <View
          style={{
            flex: 1,
            marginLeft: 5,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: normalized(12),
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
          >
            {selector?.sliceReducer?.push_Noti?._title}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
          >
            {selector?.sliceReducer?.push_Noti?._body}
          </Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};
export default LocalNotification;
