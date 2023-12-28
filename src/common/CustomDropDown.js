import React, { useState } from "react";
import {
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors, AppImages, hv, normalized } from "../util/AppConstant";
const CustomDropDown = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleOptionSelect = (value) => {
    if (props?.atSelect) {
      props?.atSelect(value);
    }
    setIsOpen(false);
  };
  return (
    <View style={props?.dropDownStyle}>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          ...styles.mainContainer,
          borderColor: isOpen ? AppColors.blue.navy : "darkgrey",
        }}
        disabled={props?.isDisable}
        onPress={() => {
          if (props?.isDisable) {
          } else {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setIsOpen(!isOpen);
          }
        }}
      >
        <>
          <View style={{ flex: 1 }}>
            <Text
              style={
                props?.isDisable
                  ? {
                      color: AppColors.grey.dark,
                      fontSize: normalized(14),
                      fontWeight: "400",
                    }
                  : props?.selected?.length > 0
                  ? styles.selectedTxt
                  : styles.unSelectedTxt
              }
            >
              {props?.selected
                ? props?.selected?.cardName
                  ? props?.selected?.cardName
                  : props?.selected?.fullName
                  ? props?.selected?.fullName
                  : props?.selected
                : props?.placeHolder}
            </Text>
          </View>
          <View style={{ padding: normalized(5) }}>
            <Image
              source={AppImages.Common.arrowDown}
              style={{
                tintColor: AppColors.black.black,
                resizeMode: "contain",
                transform: [
                  {
                    rotateZ: isOpen ? `${180}deg` : `${0}deg`,
                  },
                ],
              }}
            />
          </View>
        </>
      </TouchableOpacity>
      {isOpen && (
        <View style={[styles.dropdownList, props?.listStyle]}>
          {props?.list.map((option, index) => {
            let value =
              props?.optionKey && option[props?.optionKey]?.length > 0
                ? option[props?.optionKey]
                : option?.name?.length > 0
                ? option?.name
                : option instanceof Object
                ? null
                : option;

            return (
              <TouchableOpacity
                activeOpacity={1}
                key={index}
                style={[
                  styles.dropdownOption,
                  value == props?.selected
                    ? { backgroundColor: AppColors.blue.lightNavy }
                    : null,
                ]}
                onPress={() => {
                  handleOptionSelect(option);
                }}
              >
                <Text
                  style={{
                    ...styles.options,
                    color:
                      value == props?.selected
                        ? AppColors.white.white
                        : AppColors.grey.dark,
                  }}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      {props?.error?.length > 0 ? (
        <Text
          style={{
            marginTop: normalized(3),
            color: AppColors.blue.navy,
          }}
        >
          {props?.error?.length > 0 ? props?.error : "!Empty Field"}
        </Text>
      ) : (
        <View style={{ marginVertical: normalized(10) }} />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: normalized(1),
    paddingHorizontal: normalized(15),
    borderRadius: normalized(10),
    height: normalized(60),
  },

  dropdownList: {
    maxHeight: 350,
    width: "100%",
    borderColor: "black",
    backgroundColor: AppColors.white.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  dropdownOption: {
    height: 40,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#E2E3E4",
  },
  options: {
    fontSize: 15,
    marginLeft: hv(20),
    fontWeight: "500",
    color: AppColors.black.black,
  },
  selectedTxt: {
    fontSize: normalized(14),
    fontWeight: "400",
    color: AppColors.black.black,
  },
  unSelectedTxt: {
    fontSize: normalized(14),
    fontWeight: "400",
    color: AppColors.grey.dark,
  },
});
export default CustomDropDown;
