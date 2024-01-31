import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { setShowToast } from "../redux/action/AppLogics";
import { AppColors, ScreenSize, normalized } from "../util/AppConstant";
import { capitalizeFirstLetter } from "../util/helperFun";

const ToastComp = () => {
  const timeOfAction = 700;
  const dispatch = useDispatch();

  const selector = useSelector((AppState) => AppState);
  const showToast = selector?.sliceReducer?.showToast;
  useEffect(() => {
    changeView();
    const t = setTimeout(() => {
      changeView(true);
    }, timeOfAction + 2500);
    return () => clearTimeout(t);
  }, []);
  const opacityOffset = useSharedValue(0);
  const changeView = (close = false) => {
    if (close) {
      opacityOffset.value = withTiming(0, {
        duration: timeOfAction,
      });
      setTimeout(() => {
        dispatch(setShowToast(""));
      }, timeOfAction);
    } else {
      opacityOffset.value = withTiming(1, {
        duration: timeOfAction,
      });
    }
  };
  const viewStyles = useAnimatedStyle(() => {
    return {
      opacity: opacityOffset.value,
    };
  });
  console.log("showToast----->", showToast);
  return (
    <View style={styles.outerContainer}>
      <Animated.View style={[styles.mainBox, viewStyles]}>
        <Text style={styles.text}>{capitalizeFirstLetter(showToast)}</Text>
      </Animated.View>
    </View>
  );
};
export default ToastComp;

const bottomPadding = 100;

const styles = StyleSheet.create({
  outerContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    alignItems: "center",
    height: bottomPadding,
    position: "absolute",
    bottom: 0,
    transform: [
      {
        translateY: ScreenSize.height - bottomPadding,
      },
    ],
  },
  mainBox: {
    backgroundColor: AppColors.blue.lightBlue,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: normalized(10),
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 15,
    maxWidth: "75%",
  },
  text: {
    color: AppColors.grey.dark,
    textAlign: "center",
    fontSize: 14,
  },
});
