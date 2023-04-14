import { connect, useSelector } from 'react-redux';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Container } from '../../common';
import NotificationListItem from '../components/NotificationListItem';
import NotificationsListHeader from '../components/NotificationsListHeader';
import NotificationsListEmpty from '../components/NotificationsListEmpty';

import { getNotifications as selectNotifications } from '../redux/selectors';
import { getNotifications as getNotificationsAction } from '../redux/actions';

/* =============================================================================
<NotificationScreen />
============================================================================= */
const NotificationScreen = ({ notifications, getNotifications }) => {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const styles = getStyles(insets);
  const selector = useSelector((AppState) => AppState)

  // GET_NOTIFICATIONS
  useEffect(() => {
    if (isFocused) {
      getNotifications(selector.Home.notificationUnread);
    };
  }, [isFocused])

  return (
    <Container>
      <FlatList
        data={notifications}
        refreshing={false}
        renderItem={renderItem}
        keyExtractor={renderKeyExtractor}
        contentContainerStyle={styles.content}
        ListHeaderComponent={NotificationsListHeader}
        ListEmptyComponent={NotificationsListEmpty}
      />
    </Container>
  );
};

const renderItem = ({ item }) => <NotificationListItem id={item.id} notification={item} />;
const renderKeyExtractor = item => `${item.id}`;

const getStyles = (insets) => StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingTop: insets.top + 20,
    paddingHorizontal: 18,
  },
});

const mapStateToProps = (state) => ({
  notifications: selectNotifications(state),
});

const mapDispatchToProps = {
  getNotifications: getNotificationsAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationScreen);
