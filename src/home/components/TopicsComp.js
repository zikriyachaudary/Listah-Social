import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AppColors, normalized } from "../../util/AppConstant";
const TopicsComp = (props) => {
  return (
    <ScrollView
      style={{
        backgroundColor: "#4035AE",
        height: normalized(60),
        padding: normalized(8),
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {props?.topicsList.map((el) => {
        return (
          <TouchableOpacity
            style={{
              height: normalized(33),
              paddingHorizontal: normalized(10),
              backgroundColor: "#322988",
              borderRadius: normalized(15),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: normalized(14),
                fontWeight: "500",
                color: AppColors.white.white,
              }}
            >
              {el?.title}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
export default TopicsComp;
