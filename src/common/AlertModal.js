import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Theme_Mode } from "../util/Strings";
import {
  darkModeColors,
  lightModeColors,
  normalized,
} from "../util/AppConstant";

export default function AlertModal(props) {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);

  return (
    <Modal animationType={"slide"} visible={props?.visible} transparent={true}>
      <View
        style={{
          ...styles.container,
          backgroundColor:
            themeType == Theme_Mode.isDark
              ? "rgba(0,0,0,0.6)"
              : "rgba(0,0,0,0.3)",
        }}
      >
        <View
          style={{
            ...styles.alertBox,
            backgroundColor:
              themeType == Theme_Mode.isDark
                ? darkModeColors.background
                : lightModeColors.background,
          }}
        >
          <Text style={styles.title}>Alert</Text>
          <Text
            style={{
              ...styles.label,
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
            }}
          >
            {props?.message}
          </Text>
          {props?.multipleBtn ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={{ ...styles.mainBtn, backgroundColor: "#fca79f" }}
                onPress={() => {
                  props?.atLeftBtn();
                }}
                activeOpacity={1}
              >
                <Text style={styles.btnTxt}>{props?.leftBtnLabel}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  ...styles.mainBtn,
                  backgroundColor: "#6d14c4",
                }}
                onPress={() => {
                  props?.onPress();
                }}
                activeOpacity={1}
              >
                <Text style={styles.btnTxt}>{props?.rightBtnLabel}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                ...styles.mainBtn,
                backgroundColor: "#6d14c4",
              }}
              onPress={() => {
                props?.onPress();
              }}
              activeOpacity={1}
            >
              <Text style={styles.btnTxt}>{"Ok"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  alertBox: {
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  btn: {
    width: "50%",
  },
  label: {
    fontSize: 14,
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: normalized(20),
    color: "#6d14c4",
    marginBottom: 20,
    fontWeight: "500",
  },
  mainBtn: {
    width: 140,
    height: 50,
    borderRadius: 40 / 2,
    borderWidth: 0,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  btnTxt: {
    fontSize: 15,
    fontWeight: "500",
    color: "white",
  },
});
