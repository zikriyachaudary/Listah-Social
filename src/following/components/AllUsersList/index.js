import React from "react";
import { connect } from "react-redux";
import { ActivityIndicator, FlatList, StyleSheet } from "react-native";

import { Text, View } from "../../../common";
import AllUsersListHeader from "./AllUsersListHeader";
import AllUsersListItem from "./AllUsersListItem";
import * as Colors from "../../../config/colors";

import { getAllUsers, getLoading } from "../../redux/selectors";
import { refreshAllUsers as refreshAllUsersAction } from "../../redux/actions";

/* =============================================================================
<AllUsersList />
============================================================================= */
const AllUsersList = ({ allUsers, refreshAllUsers, loading }) => {
  const _renderListEmptyComponent = () => (
    <View center style={styles.emptyComponentContainer}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <Text>No Users Found</Text>
      )}
    </View>
  );

  const _handleListEndReach = () => {
    if (allUsers && allUsers.length > 5) {
      refreshAllUsers(allUsers[allUsers.length - 1].userId);
    }
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={allUsers}
      refreshing={false}
      renderItem={renderItem}
      keyExtractor={renderKeyExtractor}
      ListHeaderComponent={AllUsersListHeader}
      ListEmptyComponent={_renderListEmptyComponent}
      contentContainerStyle={styles.content}
      onEndReached={_handleListEndReach}
    />
  );
};

const renderKeyExtractor = (item) => `${item?.userId}`;
const renderItem = ({ item, i }) => <AllUsersListItem key={i} user={item} />;

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 18,
  },
  emptyComponentContainer: {
    height: "100%",
  },
});

const mapStateToProps = (state) => ({
  allUsers: getAllUsers(state),
  loading: getLoading(state),
});

const mapDispatchToProps = {
  refreshAllUsers: refreshAllUsersAction,
};

/* Export
============================================================================= */
export default connect(mapStateToProps, mapDispatchToProps)(AllUsersList);
