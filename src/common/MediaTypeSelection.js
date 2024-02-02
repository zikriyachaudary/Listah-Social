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
} from "react-native";
import {
  AppColors,
  AppImages,
  ScreenSize,
  TYPE_SELECTION_ARR,
  hv,
  isSmallDevice,
  normalized,
} from "../util/AppConstant";
import { AppStrings } from "../util/Strings";

const MediaTypeSelection = (props) => {
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
            {TYPE_SELECTION_ARR.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  props?.atMediaTypeSelection(item?.text);
                }}
                key={index}
                activeOpacity={1}
                style={styles.singlePicker}
              >
                <Text style={styles.pickerText}>
                  {item?.text.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text
            style={{
              marginHorizontal: normalized(20),
              fontSize: normalized(13),
              fontWeight: "400",
              color: AppColors.black.black,
            }}
          >
            Note:{" "}
            <Text style={{ color: AppColors.grey.Analogous }}>
              {AppStrings.Validation.videoDurationError}
            </Text>
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default MediaTypeSelection;

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
    height: isSmallDevice ? "40%" : "35%",
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
    height: ScreenSize.height < 680 ? hv(170) : hv(150),
    marginTop: isSmallDevice ? hv(30) : hv(20),
    alignSelf: "center",
    alignItems: "center",
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
    fontSize: normalized(18),
    fontWeight: "500",
    textAlign: "center",
  },
});
