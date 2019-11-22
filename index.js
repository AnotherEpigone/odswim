import React from 'react';
import { View, AppRegistry } from 'react-native';
import Header from './src/components/header';
import MainAppArea from './src/components/MainAppArea';

const App = () => (
  <View>
    <Header headerText={'ODSWIM'} />
    <MainAppArea />
  </View>
);

AppRegistry.registerComponent('albums', () => App);
