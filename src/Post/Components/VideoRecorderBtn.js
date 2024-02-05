import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import ProgressCircle from "react-native-progress-circle";
import { AppColors, normalized } from "../../util/AppConstant";

const VideoRecorderBtn = (props) => {
  return (
    <TouchableOpacity
      style={{}}
      activeOpacity={0.6}
      onPress={() => {
        if (props.isImage) {
          props.onImageClick();
        } else if (props.isVideoRecording) {
          props.onVideoRecordingEnd();
        } else {
          props.onVideRecordingStart();
        }
      }}
    >
      <View>
        {props.isVideoRecording ? (
          <AnimatedCircle onEnd={props.onVideoRecordingEnd} />
        ) : (
          <View style={styles.stopRecordCont} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const radius = 30;

export const styles = StyleSheet.create({
  svg: {
    width: 2 * radius,
    height: 2 * radius,
    transform: [
      {
        rotateZ: "-90deg",
      },
    ],
  },
  innerView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "red",
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  startRecordChildCont: {
    backgroundColor: AppColors.red.dark,
    height: normalized(20),
    width: normalized(20),
    borderRadius: normalized(5),
  },
  stopRecordCont: {
    backgroundColor: AppColors.red.darkRed,
    height: normalized(60),
    width: normalized(60),
    borderRadius: normalized(60 / 2),
    borderWidth: 5,
    borderColor: AppColors.red.lightRed,
  },
});

export default VideoRecorderBtn;

const AnimatedCircle = ({ onEnd }) => {
  const [duration, setDuration] = useState(0);
  const [radius, setRadius] = useState(30);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setRadius(40);
    let interval;
    interval = setInterval(() => {
      setDuration((prevDuration) => prevDuration + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (duration > 30) {
      onEnd();
    }
  }, [duration]);

  const convertToPercentage = () => {
    const clampedValue = Math.min(Math.max(duration, 1), 30);
    const percentage = (clampedValue / 30) * 100;
    return percentage;
  };

  return (
    <ProgressCircle
      percent={convertToPercentage()}
      radius={radius}
      borderWidth={5}
      color={AppColors.red.darkRed}
      shadowColor="#999"
      bgColor="black"
    >
      <View
        style={[styles.svg, { justifyContent: "center", alignItems: "center" }]}
      >
        <View style={styles.startRecordChildCont} />
      </View>
    </ProgressCircle>
  );
};
