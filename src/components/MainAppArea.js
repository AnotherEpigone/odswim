import React, { Component } from 'react';
import {
  View } from 'react-native';
import CurrentJourney from './CurrentJourney';
import JourneySelecter from './JourneySelecter';

class MainAppArea extends Component {
  constructor() {
    super();
    this.navigate = this.navigate.bind(this);
  }

  state = {
    activePage: 0
  };

  navigate(newpage) {
    this.setState({ activePage: newpage });
  }

  render() {
    return (
      <View> {() => {
          switch (this.state.activePage) {
            case 0:
              return (<CurrentJourney parent={this} />);
            case 1:
              return (<JourneySelecter parent={this} />);
            default:
              return null;
            }
          }
        }
      </View>
    );
  }
}

export default MainAppArea;
