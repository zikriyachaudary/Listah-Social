import React, { useState } from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';

import {
  Content,
  Container,
  StackHeader,
  Text,
} from '../../common';

import SuggestionApproveChange from '../components/SuggestionApproveChange';
import SuggestionApproveAdd from '../components/SuggestionApproveAdd';
import SuggestionApproveDelete from '../components/SuggestionApproveDelete';

import { suggestApprove as suggestApproveAction } from '../redux/actions';

/* =============================================================================
<SuggestionApproveScreen />
============================================================================= */
const SuggestionApproveScreen = ({ route, navigation, suggestApprove }) => {
  const suggestion = route?.params?.suggestion;
  const change = suggestion?.change;
  const postTitle = suggestion?.postTitle;
  const senderUsername = suggestion?.sender?.username;
  const [loading, setLoading] = useState(false);

  const _handleSubmit = async () => {
    setLoading(true);
    await suggestApprove(suggestion, async () => {
      setLoading(false);
      Alert.alert(
        'Suggestion Approved',
        `${senderUsername} suggestion is approved`,
        [
          { text: 'OK', onPress: () => navigation.goBack() }
        ],
      )
    });
  };

  return (
    <Container>
      <StackHeader title={`${senderUsername} Suggestion`} />
      <Content>
        {change?.type === 'change' ? (
          <SuggestionApproveChange
            loading={loading}
            change={change}
            postTitle={postTitle}
            onSubmit={_handleSubmit}
          />
        ) : change?.type === 'add' ? (
          <SuggestionApproveAdd
            loading={loading}
            change={change}
            postTitle={postTitle}
            onSubmit={_handleSubmit}
          />
        ) : change?.type === 'delete' ? (
          <SuggestionApproveDelete
            loading={loading}
            change={change}
            postTitle={postTitle}
            onSubmit={_handleSubmit}
          />
        ) : null}
      </Content>
    </Container>
  );
};

const mapDispatchToProps = {
  suggestApprove: suggestApproveAction,
};

export default connect(null, mapDispatchToProps)(SuggestionApproveScreen);
