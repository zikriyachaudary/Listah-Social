import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SelectSuggestionScreen from './SelectSuggestionScreen';
import SuggestionChangeScreen from './SuggestionChangeScreen';
import SuggestionApproveScreen from './SuggestionApproveScreen';
import SuggestionAddScreen from './SuggestionAddScreen';
import SuggestionDeleteScreen from './SuggestionDeleteScreen';
import AddChallengeListingScreen from './AddChallengeListingScreen';

const Stack = createNativeStackNavigator();

/* =============================================================================
<SuggestionStack />
============================================================================= */
const SuggestionStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="SelectSuggestion" component={SelectSuggestionScreen} />
      <Stack.Screen name="SuggestionChange" component={SuggestionChangeScreen} />
      <Stack.Screen name='AddChalleenge' component={AddChallengeListingScreen} />

      <Stack.Screen name="SuggestionApprove" component={SuggestionApproveScreen} />
      <Stack.Screen name="SuggestionAdd" component={SuggestionAddScreen} />
      <Stack.Screen name="SuggestionDelete" component={SuggestionDeleteScreen} />
    </Stack.Navigator>
  );
};

export default SuggestionStack;
