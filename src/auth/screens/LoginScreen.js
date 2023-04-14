import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import {
  View,
  Text,
  Button,
  Content,
  TextInput,
  Touchable,
  Container,
  AppLogoHeader,
  StackHeader,
} from '../../common';

import { getLoading } from '../redux/selectors';
import { login as loginAction } from '../redux/actions';
import * as Colors from '../../config/colors';

/* =============================================================================
<LoginScreen />
============================================================================= */

const  regex= /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

const LoginScreen = ({ navigation, loading, login }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const disabled = !email || !password;

  const _handleRegisterPress = () => {
    navigation.navigate('Register')
  };

  const _handleForgotPasswordPress = () => {
    navigation.navigate('ForgotPassword')
  };

  const _handleSubmit = () => {
    if (!disabled) {
      if (regex.test(password)){
        console.log("passMatch ", password)
        login(email, password);
      }else{
        console.log("notpassMatch ", password)
        Alert.alert("Password must contain the following:", "- One upper letter\n- One special character\n- One number")

      }
      
      // 
    }
  };

  return (
    <Container>
      <StackHeader left={<View />} />
      <Content>
        <TextInput
          value={email}
          onChange={setEmail}
          placeholder='Enter Email'
        />
        <TextInput
          value={password}
          placeholder='Enter Password'
          secureTextEntry={true}
          onChange={setPassword}
        />
        <View center style={styles.btnContainer}>
          <Button loading={loading} title='Sign in' onPress={_handleSubmit} />
        </View>
        <Touchable center style={styles.link} onPress={_handleRegisterPress}>
          <Text sm style={styles.linkTxt}>Or Sign up</Text>
        </Touchable>
        <Touchable center style={styles.link} onPress={_handleForgotPasswordPress}>
          <Text sm style={styles.linkTxt}>Forgot Password ?</Text>
        </Touchable>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    marginTop: 20,
  },
  link: {
    marginTop: 20,
  },
  linkTxt: {
    color: Colors.primary,
  }
})

const mapStateToProps = (state) => ({
  loading: getLoading(state),
})

const mapDispatchToProps = {
  login: loginAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
