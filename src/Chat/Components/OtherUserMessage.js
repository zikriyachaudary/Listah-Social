import moment from "moment";
import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import Hyperlink from "react-native-hyperlink";
import SingleVideoItem from "./SingleVideoItem";
import SingleImageItem from "./SingleImageItem";
import SingleDocItem from "./SingleDocItem";
import {
  AppColors,
  darkModeColors,
  hv,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import { useSelector } from "react-redux";
import { Theme_Mode } from "../../util/Strings";
const OtherUserMessage = ({ item, onPdf, onImage, playVideo }) => {
  const setContainerComponent = () => {
    if (item["videoUrl"]) {
      return (
        <SingleVideoItem
          item={item}
          onPlay={() => {
            playVideo({
              videoUrl: item.videoUrl,
              thumbnailUrl: item?.thumbnail ? item?.thumbnail : "",
            });
          }}
        />
      );
    }
    if (item["url"]) {
      return <SingleImageItem item={item} onPress={() => onImage()} />;
    }
    if (item["documentUrl"]) {
      return <SingleDocItem item={item} onOpen={() => onPdf()} />;
    }
    return (
      <View style={styles.messageCon}>
        <Hyperlink
          linkStyle={{ color: "#2980b9", fontSize: normalized(16) }}
          onPress={(url, text) => {
            if (item?.callUrl) {
              console.log("item?.callUrl=====>", item?.callUrl);
              Linking.canOpenURL(item?.callUrl).then((supported) => {
                if (supported) {
                  Linking.openURL(item?.callUrl);
                } else {
                  Linking.openURL(item?.callUrl);
                  console.log("Don't know how to open URI: " + item?.callUrl);
                }
              });
            } else {
              Linking.canOpenURL(url).then((supported) => {
                if (supported) {
                  Linking.openURL(url);
                } else {
                  Linking.openURL(url);
                  console.log("Don't know how to open URI: " + url);
                }
              });
            }
          }}
        >
          <Text
            style={{
              ...styles.message,
            }}
          >
            {item.content}
          </Text>
        </Hyperlink>
      </View>
    );
  };
  return (
    <View>
      <View style={styles.container}>{setContainerComponent()}</View>
      <View style={styles.timeTextCon}>
        <Text style={styles.timeText}>
          {moment(item.time, "HH:mm:ss").format("hh:mm A")}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: hv(3),
    marginEnd: normalized(40),
  },
  other_person_image: {
    width: normalized(26),
    height: normalized(26),
    resizeMode: "contain",
  },
  messageCon: {
    marginStart: normalized(4),
    backgroundColor: AppColors.green.lightGreen,
    padding: normalized(8),
    borderRadius: normalized(15),
    borderBottomLeftRadius: 0,
  },
  message: {
    fontSize: normalized(14),
    color: AppColors.black.lightBlack,
  },
  timeTextCon: {
    alignSelf: "flex-start",
  },
  timeText: {
    fontSize: normalized(11),
    color: AppColors.black.lightBlack,
    marginStart: normalized(4),
  },
  image: {
    width: normalized(35),
    height: normalized(35),
    borderRadius: normalized(35 / 2),
  },
  online: {
    backgroundColor: AppColors.green.primaryLight,
    height: normalized(10),
    width: normalized(10),
    borderRadius: normalized(10 / 2),
    position: "absolute",
    alignSelf: "flex-end",
    top: hv(24),
  },
});
export default OtherUserMessage;
