import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import { AppColors, AppImages, fullHeight, hv } from "../../util/AppConstant";
import SplashScreen from "react-native-splash-screen";
import { useDispatch } from "react-redux";
import { setIsShowSplash } from "../../redux/action/AppLogics";

export default function RNSplashScreen(props) {
  const bounceValue = useRef(new Animated.Value(250)).current;
  const animatedValue = useRef(new Animated.Value(1)).current;
  const dispatch = useDispatch();
  const animatingImg = () => {
    Animated.timing(animatedValue, {
      toValue: 1.1,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      animatingImg2();
    });
  };
  const animatingImg2 = () => {
    Animated.timing(animatedValue, {
      toValue: 0.8,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start(() => {
      animatingImg();
    });
  };
  const toggleSubview = () => {
    const obj = {
      toValue: 0,
      easing: Easing.bounce,
      duration: 1000,
      useNativeDriver: true,
    };
    Animated.timing(bounceValue, obj).start();
  };
  useEffect(() => {
    animatingImg();
    SplashScreen.hide();
    setTimeout(() => {
      toggleSubview();
    }, 500);
  }, []);

  const AnimatedImage = Animated.createAnimatedComponent(Image);
  return (
    <ImageBackground
      style={styles.container}
      resizeMode="cover"
      source={AppImages.Common.SplashBg}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <AnimatedImage
          resizeMode={"cover"}
          source={AppImages.Common.appLogo}
          style={{
            ...styles.img1,
            transform: [{ scaleX: animatedValue }, { scaleY: animatedValue }],
          }}
        />
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.blue.navy,
    justifyContent: "center",
    alignItems: "center",
  },

  web: {
    justifyContent: "center",
    width: "100%",
    alignSelf: "center",
    backgroundColor: "red",
  },
  img1: {
    width: hv(120),
    height: hv(120),
    borderRadius: 80,
  },
});
