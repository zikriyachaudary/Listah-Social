import React, { useEffect } from "react";
import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { AppColors, normalized } from "../util/AppConstant";
import { useSelector } from "react-redux";

const switchWidth = normalized(54);

const CustomSwitch = (props) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  const switchOffset = useSharedValue(
    props.value ? switchWidth / 2 - normalized(10) : 0
  );

  useEffect(() => {
    changeSwitch();
  }, [props.value]);

  const changeSwitch = () => {
    switchOffset.value = withTiming(
      props.value ? switchWidth / 2 - normalized(10) : 0
    );
  };

  const swtichMoveStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: switchOffset.value,
        },
      ],
    };
  });

  return (
    <TouchableWithoutFeedback onPress={() => props.onToggle(!props.value)}>
      <View style={props.outerContainerStyle}>
        <View
          style={[
            styles.main,
            {
              backgroundColor: props.value ? AppColors.blue.navy : "#E4DFDF",
            },
          ]}
        >
          <Animated.View style={[styles.switchStyle, swtichMoveStyle]} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default CustomSwitch;

const styles = StyleSheet.create({
  main: {
    width: switchWidth - normalized(18),
    height: switchWidth / 3,
    borderRadius: 25,
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: normalized(2.5),
  },
  switchStyle: {
    width: switchWidth / 3 - normalized(4),
    backgroundColor: AppColors.white.white,
    height: switchWidth / 3 - normalized(4),
    borderRadius: normalized(15),
  },
});
