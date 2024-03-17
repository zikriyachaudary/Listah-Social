import React from "react";
import { connect } from "react-redux";
import { ActivityIndicator, StyleSheet } from "react-native";

import { Text, View } from "../../common";
import * as Colors from "../../config/colors";

import { getLoading } from "../redux/selectors";

/* =============================================================================
<NotificationsListEmpty />
============================================================================= */
const NotificationsListEmpty = ({ loading }) => {
  return (
    <View center style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <Text sm>You don't have any notifications yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    marginTop: -20,
  },
});

const mapStateToProps = (state) => ({
  loading: getLoading(state),
});

export default connect(mapStateToProps)(NotificationsListEmpty);
