import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from "react-native";
import Video from "react-native-video";
import { AppColors, AppImages, hv, normalized } from "../util/AppConstant";

const VideoPlayerModal = (props) => {
  const [onLoadStart, setOnLoadStart] = useState(false);
  const [isVideoError, setIsVideoError] = useState(false);
  const [url, setUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (props?.item?.url?.length > 0) {
      setUrl(props?.item?.url);
    }
  }, [props?.item]);

  return (
    <Modal animationType="slide" transparent onRequestClose={props.onClose}>
      <SafeAreaView />
      <View style={styles.headerSection}>
        <View
          style={{
            width: normalized(40),
          }}
        />
        <TouchableWithoutFeedback onPress={props?.onClose}>
          <View style={styles.crossView}>
            <Image
              source={AppImages.Common.cross}
              resizeMode="contain"
              style={styles.crossImg}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          backgroundColor: "rgba(0,0,0,0.9)",
        }}
      >
        <View style={styles.subContainer}>
          {props?.item ? (
            <View style={styles.mainContainer}>
              {isPlaying && url ? (
                <View style={styles.backgroundVideo}>
                  <Video
                    source={{ uri: url }}
                    paused={!isPlaying}
                    resizeMode="contain"
                    controls={true}
                    style={styles.backgroundVideo}
                    ignoreSilentSwitch="ignore"
                    onLoadStart={() => {
                      setOnLoadStart(true);
                    }}
                    onLoad={() => {
                      setOnLoadStart(false);
                    }}
                    onError={(err) => {
                      setOnLoadStart(false);
                      setIsVideoError(true);
                      setIsPlaying(false);
                    }}
                    fullscreen={true}
                  />
                </View>
              ) : null}
              {onLoadStart || isVideoError ? (
                <TouchableWithoutFeedback
                  onPress={() => {
                    setIsPlaying(!isPlaying);
                  }}
                >
                  <View style={styles.absoluteBox}>
                    {onLoadStart ? (
                      <ActivityIndicator
                        size="large"
                        color={AppColors.white.white}
                      />
                    ) : isVideoError ? (
                      <Image
                        source={AppImages.VideoError}
                        resizeMode="contain"
                        style={styles.videoError}
                      />
                    ) : !isPlaying ? (
                      <Image
                        source={AppImages.playbutton}
                        resizeMode="contain"
                        style={styles.playBtn}
                      />
                    ) : null}
                  </View>
                </TouchableWithoutFeedback>
              ) : null}
            </View>
          ) : (
            <View style={styles.emptyView}>
              <Text style={styles.emptyText}>No video found.</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default VideoPlayerModal;

const styles = StyleSheet.create({
  subContainer: {
    paddingVertical: hv(20),
  },
  mainContainer: {
    backgroundColor: AppColors.black.black,
    height: normalized(280),
    overflow: "hidden",
    borderRadius: normalized(10),
    borderWidth: 1,
    borderColor: AppColors.black.dark,
  },
  headerSection: {
    height: 60,
    backgroundColor: "rgba(0,0,0,0.9)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0,
  },
  backgroundVideo: {
    height: "100%",
    width: "100%",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: AppColors.black.black,
    alignSelf: "center",
  },
  absoluteBox: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  playBtn: {
    width: normalized(40),
    height: normalized(40),
    tintColor: AppColors.white.white,
  },
  videoError: {
    width: normalized(45),
    height: normalized(45),
    tintColor: AppColors.white.white,
  },
  emptyView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: normalized(16),
    color: AppColors.black.black,
  },
  crossView: {
    height: normalized(40),
    width: normalized(40),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
    margin: normalized(5),
  },
  crossImg: {
    height: normalized(22),
    width: normalized(22),
    tintColor: AppColors.white.white,
  },
  titleText: {
    color: AppColors.white.white,
    fontSize: normalized(18),
    maxWidth: "70%",
  },
});
