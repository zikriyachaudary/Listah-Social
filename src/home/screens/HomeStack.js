import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {  useDispatch } from 'react-redux';

import HomeScreen from './HomeScreen';
import MyPostsScreen from './MyPostsScreen';
import PostCreateScreen from './PostCreateScreen';
import PostEditScreen from './PostEditScreen';
import ReportPost from './ReportPost'
import { getLoginUserNotificationCount } from '../../notification/redux/actions';

const Stack = createNativeStackNavigator();

/* =============================================================================
<HomeStack />
============================================================================= */
const HomeStack = () => {

  const dispatch = useDispatch()

  useEffect(()=>{
    checkNotificationCount()
  }, [])

  const checkNotificationCount = () => {
    console.log("trigger -- > ")
    getLoginUserNotificationCount(dispatch)

  }
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MyPosts" component={MyPostsScreen} />
      <Stack.Screen name='ReportPost' component={ReportPost}/>
      <Stack.Screen name="PostCreate" component={PostCreateScreen} />
      <Stack.Screen name="PostEdit" component={PostEditScreen} />
    </Stack.Navigator>
  );
};

export default HomeStack;
