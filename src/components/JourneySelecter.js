import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  AsyncStorage } from 'react-native';

class JourneySelecter extends Component {
  constructor() {
    super();
    this.onSelectJourney = this.onSelectJourney.bind(this);
    this.onSelectMordor = this.onSelectMordor.bind(this);
    this.onSelectDorchester = this.onSelectDorchester.bind(this);
  }

  onSelectMordor() {
    this.onSelectJourney('mordor', 'rivendell', 100000);
  }

  onSelectDorchester() {
    this.onSelectJourney('dorchester', 'woodstock', 90000);
  }

  onSelectJourney(destination, milestoneName, milestone) {
    AsyncStorage.setItem('currentJourney', destination);
    AsyncStorage.setItem('milestoneName', milestoneName);
    AsyncStorage.setItem('milestone', JSON.stringify(milestone));
    this.props.parent.navigate(0);
  }

  render() {
    const { textStyle, viewStyle } = styles;
    return (
      <View style={viewStyle}>
        <Text style={textStyle}>Select a fantastic journey!</Text>
        <Button
          onPress={this.onSelectMordor}
          title='Simply walk into Mordor'
          color='#841584'
        />
        <Button
          onPress={this.onSelectDorchester}
          title='Dorchester to Waterloo'
          color='#841584'
        />
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    backgroundColor: '#F8F8F8'
  },
  textStyle: {
  }
};

export default JourneySelecter;
