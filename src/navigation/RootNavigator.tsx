import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TabNavigator } from './TabNavigator';
import { AddTaskScreen } from '../screens/AddTaskScreen';
import { RootStackParamList } from '../types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
};
