import React, { useState } from "react";
import { Alert } from "react-native";
import { connect, useSelector } from "react-redux";

import { TextInput, View } from "../../../common";

import {
  searchUser as searchUserAction,
  getAllUsers as getAllUsersAction,
} from "../../redux/actions";
import { Theme_Mode } from "../../../util/Strings";
import {
  AppColors,
  darkModeColors,
  lightModeColors,
} from "../../../util/AppConstant";

/* =============================================================================
<AllUsersListHeader />
============================================================================= */
const AllUsersListHeader = ({ searchUser, getAllUsers }) => {
  const themeType = useSelector((AppState) => AppState.sliceReducer.themeType);
  const [text, setText] = useState("");

  const _handleSubmit = () => {
    if (text) {
      if (text.length >= 3) {
        searchUser(text);
      } else {
        Alert.alert("Please Enter At least 3 characters");
      }
    } else {
      getAllUsers();
    }
  };

  return (
    <View>
      <TextInput
        contentContainerStyle={{
          backgroundColor:
            themeType == Theme_Mode.isDark
              ? darkModeColors.background
              : lightModeColors.background,
        }}
        inputStyle={{
          color:
            themeType == Theme_Mode.isDark
              ? AppColors.white.white
              : AppColors.black.black,
        }}
        value={text}
        onChange={setText}
        placeholder="Search User..."
        onSubmitEditing={_handleSubmit}
      />
    </View>
  );
};

const mapDispatchToProps = {
  searchUser: searchUserAction,
  getAllUsers: getAllUsersAction,
};

/* Export
============================================================================= */
export default connect(null, mapDispatchToProps)(AllUsersListHeader);
