import moment from "moment";
import React, { useEffect, useState } from "react";
import { Text, View, Linking, StyleSheet, Image } from "react-native";
import Hyperlink from "react-native-hyperlink";
import {
  AppColors,
  AppImages,
  darkModeColors,
  hv,
  lightModeColors,
  normalized,
} from "../../util/AppConstant";
import SingleVideoItem from "./SingleVideoItem";
import SingleImageItem from "./SingleImageItem";
import SingleDocItem from "./SingleDocItem";
import { useSelector } from "react-redux";
import { Theme_Mode } from "../../util/Strings";

const MyMessage = ({ item, onPdf, onImage, playVideo }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const [messageRead, setMessageRead] = useState(false);
  useEffect(() => {
    checkMessageRead();
  }, [item]);

  const checkMessageRead = () => {
    if (item?.lastMessageSeeners?.length > 0) {
      setMessageRead(true);
    } else {
      setMessageRead(false);
    }
  };
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
      <View style={{ ...styles.messageCon }}>
        <Hyperlink
          linkStyle={{ color: "#2980b9", fontSize: normalized(16) }}
          onPress={(url, text) => {
            if (item?.callUrl) {
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
              color:
                themeType == Theme_Mode.isDark
                  ? darkModeColors.text
                  : lightModeColors.text,
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
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.timeText}>
            {moment(item?.time, "HH:mm:ss").format("hh:mm A")}
          </Text>
          <Image
            source={AppImages.Chat.msgSeen}
            style={{
              tintColor: messageRead ? AppColors.blue.navy : "#979797",
            }}
          />
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginStart: normalized(40),
    marginVertical: hv(3),
  },
  my_image: {
    width: normalized(26),
    height: normalized(26),
    resizeMode: "contain",
  },
  messageCon: {
    marginEnd: normalized(4),
    backgroundColor: AppColors.white.creamy,
    padding: normalized(15),
    borderRadius: normalized(15),
    borderBottomRightRadius: 0,
  },
  message: {
    fontSize: normalized(16),
    color: AppColors.black.black,
  },
  timeTextCon: {
    alignSelf: "flex-end",
  },
  timeText: {
    fontSize: normalized(11),
    color: AppColors.black.lightBlack,
    textAlign: "right",
    marginEnd: normalized(4),
  },
});

export default MyMessage;
