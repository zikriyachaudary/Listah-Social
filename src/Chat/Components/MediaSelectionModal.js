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
  hv,
  isSmallDevice,
  mediaSelectionConstants,
  normalized,
} from "../../util/AppConstant";

const MediaSelectionModal = (props) => {
  return (
    <Modal transparent animationType="slide" onRequestClose={props.onClose}>
      <View style={styles.outerContainer}>
        <StatusBar
          barStyle={"light-content"}
          backgroundColor={AppColors.gradient.light}
        />
        <TouchableWithoutFeedback onPress={props.onClose} disabled={true}>
          <View style={styles.transparentBg} />
        </TouchableWithoutFeedback>
        <View style={styles.mainContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.headingText}>Select media type</Text>
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
            {mediaSelectionConstants.map((item, index) => (
              <TouchableOpacity
                onPress={() => {
                  if (props?.atPress) {
                    props?.atPress(item?.text);
                  }
                }}
                key={index}
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

export default MediaSelectionModal;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  transparentBg: {
    backgroundColor: AppColors.black.shadow,
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
  },
  pickerText: {
    color: AppColors.black.black,
    fontSize: normalized(12),
    marginTop: hv(10),
    textAlign: "center",
  },
});
