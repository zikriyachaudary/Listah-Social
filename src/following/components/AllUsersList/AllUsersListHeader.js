import React, { useState } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';

import { TextInput, View } from '../../../common';

import {
  searchUser as searchUserAction,
  getAllUsers as getAllUsersAction
} from '../../redux/actions';

/* =============================================================================
<AllUsersListHeader />
============================================================================= */
const AllUsersListHeader = ({ searchUser, getAllUsers }) => {
  const [text, setText] = useState('');

  const _handleSubmit = () => {
    if (text) {
      if (text.length >= 3) {
        searchUser(text);
      } else {
        Alert.alert('Please Enter At least 3 characters')
      }
    } else {
      getAllUsers()
    }
  };

  return (
    <View>
      <TextInput
        value={text}
        onChange={setText}
        placeholder='Search User...'
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
