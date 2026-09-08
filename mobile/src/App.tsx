/**
 * Mobile App Entry Point
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import './i18n/config';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        {/* Tab screens will be added here */}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;
