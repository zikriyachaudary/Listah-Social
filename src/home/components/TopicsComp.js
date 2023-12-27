import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { AppColors, hv, normalized } from "../../util/AppConstant";
const TopicsComp = (props) => {
  return (
    <ScrollView
      style={{
        backgroundColor: "#4035AE",
        paddingHorizontal: normalized(10),
        height: 75,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {props?.topicsList.map((el) => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              ...styles.mainCont,
              backgroundColor:
                props?.selectedCat?.id == el?.id
                  ? AppColors.white.white
                  : "#322988",
            }}
            onPress={() => {
              // if (props?.selectedCat?.id == el?.id) {
              //   props?.setSelectedCat(null);
              // } else {
              //   props?.setSelectedCat(el);
              // }
            }}
          >
            <Text
              style={{
                fontSize: normalized(14),
                fontWeight: "500",
                color:
                  props?.selectedCat?.id == el?.id
                    ? "#322988"
                    : AppColors.white.white,
              }}
            >
              {el?.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  mainCont: {
    alignSelf: "center",
    height: normalized(30),
    paddingHorizontal: normalized(10),
    backgroundColor: "#322988",
    borderRadius: normalized(15),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: normalized(5),
  },
});
export default TopicsComp;
