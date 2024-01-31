import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCameraDevices, Camera } from "react-native-vision-camera";
import ImagePicker from "react-native-image-crop-picker";
import Permissions, { PERMISSIONS, RESULTS } from "react-native-permissions";
import { useDispatch } from "react-redux";
import { AppStyles } from "../../util/AppStyles";
import {
  AppColors,
  AppHorizontalMargin,
  hv,
  normalized,
} from "../../util/AppConstant";
import VideoRecorderBtn from "../Components/VideoRecorderBtn";

const VideoCreateScreen = (props) => {
  const dispatch = useDispatch();
  const cameraRef = useRef < any > {};
  const devices = useCameraDevices();
  const [deviceDir, setDeviceDir] = useState("back");
  const device = devices[deviceDir];
  const [flashMode, setFlashMode] = useState("off");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedPitchObj, setSelectedPitchObj] = useState(null);
  const [showTimerPopup, setShowTimerPopup] = useState(false);
  const [timerValue, setTimerValue] = useState < number > 0;

  const [recordingTypeIndex, setRecordingTypeIndex] = useState(0);
  const [isVideoRecording, setIsVideoRecording] = useState(false);

  const [showScreen, setShowScreen] = useState(false);
  useEffect(() => {
    getPermissions();

    setTimeout(() => {
      setShowScreen(true);
    }, 500);
  }, []);

  const getPermissions = async () => {
    const Result = await Permissions.requestMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ]);
    const cameraResult = Result[PERMISSIONS.ANDROID.CAMERA];
    const audioResult = Result[PERMISSIONS.ANDROID.RECORD_AUDIO];
    if (cameraResult == RESULTS.BLOCKED || audioResult == RESULTS.BLOCKED) {
      setShowConfirmationModal(true);
    }
  };

  ////Capture from Camera========>
  const handleStartRecordVideo = async () => {
    try {
      setIsVideoRecording(true);
      cameraRef?.current?.startRecording({
        flash: flashMode,
        onRecordingFinished: async (video) => {
          console.log("showVIDEO pAT - > ", video);
        },
        onRecordingError: (error) => {
          console.error("onRecordingError======>", error);
        },
      });
    } catch (error) {
      console.log("error in start Record Video------->");
    }
  };
  const handleStopRecordedVideo = async () => {
    try {
      await cameraRef?.current?.stopRecording();
    } catch (error) {
      console.log("error------->", error);
    } finally {
      setIsVideoRecording(false);
    }
  };

  const onImageClick = async () => {
    try {
      const photo = await cameraRef.current.takePhoto({
        flash: flashMode,
      });
      if (photo?.path) {
        console.log("photo?.path----->", photo?.path);
      }
    } catch (e) {
      console.log("Image click error ", e);
    }
  };
  const [startInterval, setStartInterval] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    var timerInterval: any;
    if (startInterval) {
      timerInterval = setInterval(() => {
        if (countdown > 0) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setCountdown(countdown - 1);
        } else {
          if (recordingTypeIndex == 0) {
            onImageClick();
          } else {
            handleStartRecordVideo();
          }
          clearInterval(timerInterval);
          setStartInterval(false);
        }
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [countdown, startInterval]);

  return (
    <View style={AppStyles.MainStyle}>
      {showScreen && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? hv(35) : hv(30)}
        >
          <ScrollView
            contentContainerStyle={styles.containerStyle}
            showsVerticalScrollIndicator={false}
          >
            {device && (
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={true}
                photo={recordingTypeIndex == 0}
                video={recordingTypeIndex == 1}
                audio={recordingTypeIndex == 1}
                preset="medium"
                zoom={device?.neutralZoom}
              />
            )}

            <View style={styles.bottomCont}>
              <TouchableOpacity onPress={() => {}}>
                <View style={styles.singleBottomEndBox}>
                  {/* <Image
                    source={
                      selectedPitchObj
                        ? AppImages.createVideo.doneIcon
                        : AppImages.createVideo.smileIcon
                    }
                    style={{ height: normalized(30), width: normalized(30) }}
                  /> */}
                  <Text style={styles.simpleDesTxt}>Pitch Ideas</Text>
                </View>
              </TouchableOpacity>
              <View style={{ alignItems: "center" }}>
                <VideoRecorderBtn
                  isImage={recordingTypeIndex == 0}
                  onImageClick={() => {
                    if (timerValue > 0) {
                      setCountdown(timerValue);
                      setStartInterval(true);
                    } else {
                      onImageClick();
                    }
                  }}
                  onVideRecordingStart={() => {
                    if (timerValue > 0) {
                      setCountdown(timerValue);
                      setStartInterval(true);
                    } else {
                      handleStartRecordVideo();
                    }
                  }}
                  onVideoRecordingEnd={handleStopRecordedVideo}
                  isVideoRecording={isVideoRecording}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerStyle: {
    flex: 1,
  },
  dummyTxt: {
    fontSize: normalized(14),
    color: AppColors.red.mainColor,
  },
  flashCont: {
    position: "absolute",
    top: normalized(90),
    zIndex: 100,
    right: AppHorizontalMargin,
  },
  flashTxt: {
    alignSelf: "center",
    fontSize: normalized(10),
    color: AppColors.white.white,
    marginTop: normalized(3),
  },
  bottomCont: {
    height: normalized(70),
    width: "100%",
    position: "absolute",
    justifyContent: "space-between",
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: AppHorizontalMargin,
    marginVertical: AppHorizontalMargin,
  },
  singleBottomEndBox: {
    alignItems: "center",
    width: normalized(60),
  },
  simpleDesTxt: {
    fontSize: normalized(10),
    color: AppColors.white.white,
  },
  permissionBtn: {
    color: AppColors.red.dark,
    fontSize: normalized(12),
    marginVertical: normalized(10),
  },
  emptyCont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default VideoCreateScreen;
