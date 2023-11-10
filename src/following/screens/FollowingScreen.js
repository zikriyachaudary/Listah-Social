import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { TabView, SceneMap } from "react-native-tab-view";

import { Container } from "../../common";
import FollowingTab from "../components/FollowingTab";
import AllUsersList from "../components/AllUsersList";
import FollowingUsersList from "../components/FollowingUsersList";

import {
  getAllUsers as getAllUsersAction,
  getUserFollowings as getUserFollowingsAction,
} from "../redux/actions";

/* =============================================================================
<FollowingScreen />
============================================================================= */
const FollowingScreen = ({ getUserFollowings, getAllUsers }) => {
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "all_users",
      title: "All Users",
    },
    {
      key: "following",
      title: "Following",
    },
  ]);

  // GET_ALL_USERS && USER_FOLLOWING
  useEffect(() => {
    if (isFocused) {
      getAllUsers();
      getUserFollowings();
    }
  }, [isFocused]);

  return (
    <Container>
      <TabView
        lazy
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
      />
    </Container>
  );
};

const renderScene = SceneMap({
  all_users: AllUsersList,
  following: FollowingUsersList,
});

const renderTabBar = (props) => <FollowingTab {...props} />;

const mapDispatchToProps = {
  getAllUsers: getAllUsersAction,
  getUserFollowings: getUserFollowingsAction,
};

/* Export
============================================================================= */
export default connect(null, mapDispatchToProps)(FollowingScreen);
