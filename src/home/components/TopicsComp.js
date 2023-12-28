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
        maxHeight: 50,
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {props?.topicsList.map((el, index) => {
        return (
          <TouchableOpacity
            activeOpacity={1}
            style={{
              ...styles.mainCont,
              backgroundColor:
                props?.selectedCat?.id == el?.id
                  ? AppColors.white.white
                  : "#322988",
              marginEnd: index == props?.topicsList?.length - 1 ? 20 : 0,
            }}
            onPress={() => {
              if (props?.selectedCat?.id == el?.id) {
                props?.setSelectedCat(null);
              } else {
                props?.setSelectedCat(el);
              }
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
    height: 30,
    paddingHorizontal: normalized(10),
    backgroundColor: "#322988",
    borderRadius: normalized(15),
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: normalized(5),
    marginVertical: 15,
  },
});
export default TopicsComp;
