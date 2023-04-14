import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { StyleSheet } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { Button, Container, Content, Text, View } from '../../common';
import ProfileHeader from '../components/ProfileHeader';
import NameIcon from '../../assets/icons/edit-name-icon.svg';
import EditIcon from '../../assets/icons/edit-email-icon.svg';

import { getProfile as selectProfile } from '../redux/selectors';
import { getProfile as getProfileAction } from '../redux/actions';
import { deleteUserAccount, logout as logoutAction } from '../../auth/redux/actions';

/* =============================================================================
<ProfileScreen />
============================================================================= */
const ProfileScreen = ({ profile, getProfile, logout, deleteUserAccount }) => {
  const isFocused = useIsFocused();
  const email = profile?.email;
  const profileImage = profile?.profileImage;
  const username = profile?.username;

  // GET PROFILE
  useEffect(() => {
    if (isFocused) {
      getProfile();
    }
    // console.log("profileID -- > " , JSON.stringify(profile.userId))
  }, [isFocused])

  const _handleLogout = () => {
    logout();
  };

  const _deleteAccount = () => {
    deleteUserAccount()
  };

  return (
    <Container>
      <ProfileHeader photoUrl={profileImage} />
      <Content contentContainerStyle={styles.content}>
        <View horizontal style={styles.item}>
          <NameIcon />
          <View style={styles.itemInfoContainer}>
            <Text xs>User Name:</Text>
            <Text normal>{username}</Text>
          </View>
        </View>
        <View horizontal style={styles.item}>
          <EditIcon />
          <View style={styles.itemInfoContainer}>
            <Text xs>Email:</Text>
            <Text normal>{email}</Text>
          </View>
        </View>
        
      </Content>
      
      <View center style={styles.btnContainer}>
        <Button title='Logout' onPress={_handleLogout} />
      </View>
      <View center style={styles.btnContainer}>
        <Button title='Delete Account' onPress={_deleteAccount} />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    marginTop: 40,
    paddingHorizontal: 30,
  },
  item: {
    marginBottom: 30,
  },
  itemInfoContainer: {
    marginLeft: 25,
  },
  btnContainer: {
    marginBottom: 20,
  }
});

const mapStateToProps = (state) => ({
  profile: selectProfile(state),
});

const mapDispatchToProps = {
  logout: logoutAction,
  deleteUserAccount: deleteUserAccount,
  getProfile: getProfileAction,

};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
