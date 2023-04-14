import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import {
  View,
  Button,
  Text,
  Content,
  StackHeader,
  TextInput,
  Container,
} from '../../common';

import { forgotPassword as forgotPasswordAction } from '../redux/actions';
import { getLoading } from '../redux/selectors';

/* =============================================================================
<ForgotPasswordScreen />
============================================================================= */
const ForgotPasswordScreen = ({ loading, forgotPassword, navigation }) => {
  const [email, setEmail] = useState('');

  const _handleForgotPassword = () => {
    if (email) {
      forgotPassword(email, () => navigation.goBack());
    };
  };

  return (
    <Container>
      <StackHeader />
      <Content>
        <Text sm>Enter your email to reset your password</Text>
        <TextInput placeholder='Email' value={email} onChange={setEmail} />
        <View center style={styles.btn}>
          <Button title='Submit' loading={loading} onPress={_handleForgotPassword} />
        </View>
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  btn: {
    marginTop: 20,
  }
})

const mapStateToProps = (state) => ({
  loading: getLoading(state),
})

const mapDispatchToProps = {
  forgotPassword: forgotPasswordAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordScreen);
