import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useCameraDevices, Camera } from "react-native-vision-camera";
import { createThumbnail } from "react-native-create-thumbnail";
import Permissions, { PERMISSIONS, RESULTS } from "react-native-permissions";
import { useDispatch } from "react-redux";
import { AppStyles } from "../../util/AppStyles";
import {
  AppColors,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
} from "../../util/AppConstant";
import VideoRecorderBtn from "../Components/VideoRecorderBtn";
import CustomHeader from "../../common/CommonHeader";
import VideoPlayerModal from "../../common/VideoPlayerModal";
import { setIsAppLoader } from "../../redux/action/AppLogics";
import ThreadManager from "../../ChatModule/ThreadManger";
import LoadingImage from "../../common/LoadingImage";
import Video from "react-native-video";

const VideoCreateScreen = (props) => {
  const dispatch = useDispatch();
  const cameraRef = useRef({});
  const devices = useCameraDevices();
  const [isPlaying, setIsPlaying] = useState(true);
  const [deviceDir, setDeviceDir] = useState("back");
  const device = devices[deviceDir];
  const [openVideoModal, setOpenVideoModal] = useState("");
  const [flashMode, setFlashMode] = useState("off");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [mediaPreObj, setMediaPreObj] = useState(null);
  const [timerValue] = useState(0);

  const [recordingTypeIndex] = useState(props?.route?.params?.isImage ? 0 : 1);
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

  const uploadThumnail = async (path, onComlpete) => {
    await ThreadManager.instance.uploadMedia(path, false, (url) => {
      if (url !== "error") {
        onComlpete(url);
      } else {
        dispatch(setIsAppLoader(false));
        Alert.alert("", "Error while uploading media");
      }
    });
  };
  ////Capture from Camera========>
  const handleStartRecordVideo = async () => {
    try {
      setIsVideoRecording(true);
      cameraRef?.current?.startRecording({
        flash: flashMode,
        onRecordingFinished: async (video) => {
          if (!video?.path) {
            return;
          }
          createThumbnail({
            url: video?.path,
            timeStamp: 10000,
          })
            .then(async (response) => {
              let obj = {
                thumbnail: response?.path,
                video: { uri: video?.path },
              };
              setMediaPreObj(obj);
            })
            .catch((err) => {
              dispatch(setIsAppLoader(false));
              console.log("printImgErr ", err);
            });
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
        setMediaPreObj({ image: photo?.path });
      }
    } catch (e) {
      console.log("Image click error ", e);
    }
  };
  const [startInterval, setStartInterval] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    var timerInterval;
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
      <CustomHeader
        isStatusBar={true}
        atBackPress={() => {
          props?.navigation.goBack();
        }}
        leftIcon={AppImages.Common.backArrow}
        logo={AppImages.Common.appLogo}
        mainStyle={{ backgroundColor: AppColors.blue.royalBlue }}
        rightTxt={"Save"}
        isRightAction={mediaPreObj?.thumbnail || mediaPreObj?.image}
        atRightBtn={async () => {
          if (props?.route?.params?.atBack && mediaPreObj) {
            let obj = { ...mediaPreObj };
            if (mediaPreObj?.thumbnail || mediaPreObj?.image) {
              dispatch(setIsAppLoader(true));
              await uploadThumnail(
                mediaPreObj?.thumbnail || mediaPreObj?.image,
                (url) => {
                  if (url) {
                    dispatch(setIsAppLoader(false));
                    if (mediaPreObj?.thumbnail) {
                      obj["thumbnail"] = url;
                    } else {
                      obj["image"] = url;
                    }
                  }
                }
              );
            }
            setTimeout(() => {
              props?.route?.params?.atBack(obj);
              props?.navigation.goBack();
            }, 2000);
          }
        }}
      />
      {showScreen && (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? hv(35) : hv(30)}
        >
          {mediaPreObj?.thumbnail || mediaPreObj?.image ? (
            <>
              {mediaPreObj?.image ? (
                <LoadingImage
                  isDisable={true}
                  source={{ uri: `file://${mediaPreObj?.image}` }}
                  style={{
                    height: "98%",
                    width: "98%",
                  }}
                  resizeMode={"contain"}
                />
              ) : null}

              {mediaPreObj?.thumbnail &&
              (mediaPreObj?.video?.video?.uri
                ? mediaPreObj?.video?.video?.uri
                : mediaPreObj?.video?.uri) ? (
                <View style={styles.backgroundVideo}>
                  <Video
                    source={{
                      uri: mediaPreObj?.video?.video?.uri
                        ? mediaPreObj?.video?.video?.uri
                        : mediaPreObj?.video?.uri,
                    }}
                    paused={!isPlaying}
                    controls={true}
                    style={styles.backgroundVideo}
                    ignoreSilentSwitch="ignore"
                    onLoadStart={() => {}}
                    onLoad={() => {}}
                    onError={(err) => {
                      setIsPlaying(false);
                    }}
                    fullscreen={true}
                  />
                </View>
              ) : null}
            </>
          ) : (
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
                <TouchableOpacity
                  onPress={() => {
                    if (mediaPreObj?.thumbnail) {
                      setOpenVideoModal(
                        mediaPreObj?.video?.video?.uri
                          ? mediaPreObj?.video?.video?.uri
                          : mediaPreObj?.video
                      );
                    }
                  }}
                  activeOpacity={1}
                >
                  <LoadingImage
                    isDisable={mediaPreObj?.thumbnail}
                    source={{
                      uri: mediaPreObj?.image
                        ? `file://${mediaPreObj?.image}`
                        : mediaPreObj?.thumbnail,
                    }}
                    style={styles.img}
                  />
                  {mediaPreObj?.thumbnail ? (
                    <Image
                      source={AppImages.playbutton}
                      style={styles.playIcon}
                    />
                  ) : null}
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
                <View style={{ marginHorizontal: normalized(30) }} />
              </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      )}
      {openVideoModal ? (
        <VideoPlayerModal
          item={{ url: openVideoModal }}
          onClose={() => {
            setOpenVideoModal("");
          }}
        />
      ) : null}
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
    fontSize: normalized(12),
    color: AppColors.black.black,
    fontWeight: "400",
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
  img: {
    width: normalized(50),
    height: normalized(50),
    borderRadius: normalized(50 / 2),
    marginVertical: 0,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: normalized(3),
  },
  playIcon: {
    height: normalized(15),
    width: normalized(15),
    position: "absolute",
    alignSelf: "center",
    top: normalized(20),
  },
  backgroundVideo: {
    height: "100%",
    width: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: AppColors.black.black,
    alignSelf: "center",
  },
});
export default VideoCreateScreen;
