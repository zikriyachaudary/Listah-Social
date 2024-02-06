import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
  Platform,
} from "react-native";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { useDispatch } from "react-redux";
import {
  AppColors,
  AppImages,
  ScreenSize,
  hv,
  imagePickerConstants,
  isSmallDevice,
  maxImageSizeInBytes,
  normalized,
} from "../util/AppConstant";
import { setIsAlertShow, setShowToast } from "../redux/action/AppLogics";
import { AppStrings } from "../util/Strings";
import Permissions, {
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";

const MediaPickerModal = (props) => {
  const dispatch = useDispatch();
  const pickImage = async (index) => {
    try {
      let options = {};
      if (props?.openMediaModal?.type == "video") {
        options = {
          videoQuality: "high",
          durationLimit: Platform.OS == 'ios' ? 30 : 30000,
          allowsEditing: true,
        };
      } else {
        options = {
          includeBase64: true,
        };
      }
      options["mediaType"] = props?.openMediaModal?.type;
      options["quality"] = 0.9;

      let maxDuration = 30;
      if (index == 0) {
        launchImageLibrary(options, (response) => {
          if (response?.assets?.length > 0) {
            if (response?.assets[0]?.type?.includes("video")) {
              if (response?.assets[0]?.duration <= maxDuration) {
                props?.onMediaSelection(response?.assets[0]);
              } else {
                props?.onClose();
                dispatch(setShowToast(AppStrings.Validation.maxDur));
              }
            } else {
              if (response?.assets) {
                if (response.assets[0].fileSize > maxImageSizeInBytes) {
                  props.onClose();
                  dispatch(
                    setShowToast(AppStrings.Validation.maxImageSizeError)
                  );
                  return;
                }
                props?.onMediaSelection(response?.assets[0]);
              }
            }
          }
        });
      } else {
        const Result = await Permissions.requestMultiple([
          PERMISSIONS.ANDROID.CAMERA,
          PERMISSIONS.ANDROID.RECORD_AUDIO,
        ]);
        const cameraResult = Result[PERMISSIONS.ANDROID.CAMERA];
        const audioResult = Result[PERMISSIONS.ANDROID.RECORD_AUDIO];
        if (cameraResult == RESULTS.BLOCKED || audioResult == RESULTS.BLOCKED) {
          Alert.alert(
            "Alert",
            "You need to enable camera and voice permissions first. Do you want to enable them from settings now",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              {
                text: "OK",
                onPress: () => {
                  openSettings().catch((e) => console.log("some problem ", e));
                },
              },
            ]
          );
        } else {
          launchCamera(options, (response) => {
            if (response?.assets?.length > 0) {
              console.log('response?.assets------->', response?.assets);
              if (response?.assets[0]?.type?.includes("video")) {
                maxDuration = response?.assets[0]?.duration > 1000 ? 30000 : 30;
                if (response?.assets[0]?.duration <= maxDuration) {
                  props?.onMediaSelection(response?.assets[0]);
                } else {
                  props?.onClose();
                  dispatch(setShowToast(AppStrings.Validation.maxDur));
                }
              } else {
                if (response?.assets) {
                  if (response.assets[0].fileSize > maxImageSizeInBytes) {
                    props.onClose();
                    dispatch(
                      setShowToast(AppStrings.Validation.maxImageSizeError)
                    );
                    return;
                  }
                  props?.onMediaSelection(response?.assets[0]);
                }
              }
            }
          });
        }
      }
    } catch (e) {
      console.log("Pick Image err ", e);
    }
  };

  return (
    <Modal transparent animationType="slide" onRequestClose={props.onClose}>
      <View style={styles.outerContainer}>
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={AppColors.black.black}
        />
        <TouchableWithoutFeedback onPress={props.onClose}>
          <View style={styles.transparentBg} />
        </TouchableWithoutFeedback>
        <View style={styles.mainContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headingText}>Upload Media</Text>
            <TouchableWithoutFeedback onPress={props.onClose}>
              <View style={styles.crossView}>
                <Image
                  source={AppImages.Common.cross}
                  resizeMode="contain"
                  style={styles.crossImg}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.pickersContainer}>
            {imagePickerConstants.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  pickImage(index);
                }}
                key={String(index)}
                activeOpacity={1}
                style={styles.singlePicker}
              >
                <Image
                  source={item.image}
                  style={styles.pickerImg}
                  resizeMode="contain"
                />
                <Text style={styles.pickerText}>{item.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MediaPickerModal;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  transparentBg: {
    backgroundColor: "rgba(0,0,0,0.4)",
    ...StyleSheet.absoluteFillObject,
  },
  mainContainer: {
    height: isSmallDevice ? "35%" : "30%",
    backgroundColor: AppColors.white.white,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: hv(5),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: normalized(40),
  },
  headingText: {
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
    position: "absolute",
    right: 0,
  },
  crossImg: {
    height: normalized(14),
    width: normalized(14),
  },
  pickersContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    height: ScreenSize.height < 680 ? hv(200) : hv(170),
    marginTop: isSmallDevice ? hv(50) : hv(30),
    alignSelf: "center",
  },
  singlePicker: {
    borderRadius: 15,
    width: "45%",
    height: "65%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: normalized(20),
    borderWidth: 3,
    borderColor: AppColors.grey.dark,
    borderStyle: "dashed",
  },
  pickerImg: {
    width: normalized(30),
    height: normalized(30),
    tintColor: AppColors.black.black,
  },
  pickerText: {
    color: AppColors.black.black,
    fontSize: normalized(12),
    marginTop: hv(10),
    textAlign: "center",
  },
});
