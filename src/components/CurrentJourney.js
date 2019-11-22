import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  Linking,
  AsyncStorage }
  from 'react-native';
import qs from 'qs';
import config from '../config';

class CurrentJourney extends Component {
  constructor() {
    super();
    this.onPressFetchSteps = this.onPressFetchSteps.bind(this);
    this.onPressAuthorize = this.onPressAuthorize.bind(this);
    this.onPressClearCache = this.onPressClearCache.bind(this);
    this.onSelectJourney = this.onSelectJourney.bind(this);
  }

  state = {
    nextMilestoneName: 'nowhere',
    nextMilestoneSteps: 0,
    journey: 'none',
    todaySteps: 0,
    fetching: false,
    authorizing: false,
    authorized: false,
    fetchUrl: '',
  };

  componentWillMount() {
    let newsteps = 0;
    AsyncStorage.getItem(new Date().toISOString().split('T')[0])
      .then(value => {
        newsteps = value;
        console.log(`reading in steps: ${newsteps}`);
        if (newsteps) {
          this.setState({ todaySteps: newsteps });
        }
      });

    AsyncStorage.getItem('currentJourney')
      .then(value => {
        console.log(`reading in journey: ${value}`);
        if (value) {
          this.setState({ journey: value });
        }
      });

    AsyncStorage.getItem('milestoneName')
      .then(value => {
        console.log(`reading in milestoneName: ${value}`);
        if (value) {
          this.setState({ nextMilestoneName: value });
        }
      });

    AsyncStorage.getItem('milestone')
      .then(value => {
        const mileStoneSteps = JSON.parse(value);
        console.log(`reading in milestone: ${mileStoneSteps}`);
        if (mileStoneSteps) {
          this.setState({ nextMilestoneSteps: mileStoneSteps });
        }
      });

    Linking
    .getInitialURL()
    .then((url) => {
        if (url) {
          console.log(`Initial url is: ${url}`);
          if (url.startsWith('stcr://odswim')) {
            this.setState({
              fetchUrl: url,
              authorized: true,
              authorizing: false,
              fetching: false });
          }
        }
      })
    .catch(err => console.error('Error while handling link url', err));
  }

  onPressFetchSteps() {
    console.log('fetching steps');
    this.setState({ fetching: true });
    handleCallbackUrl(this.state.fetchUrl, this);
  }

  onPressAuthorize() {
    console.log('authorizing');
    this.setState({ authorizing: true });

    OAuth(config.clientId);
  }

  onPressClearCache() {
    AsyncStorage.clear();
    this.setState({
      nextMilestoneName: 'nowhere',
      nextMilestoneSteps: 0,
      totalSteps: 0,
      journey: 'none',
      todaySteps: 0,
      fetching: false,
      authorizing: false,
      authorized: false,
      fetchUrl: '',
    });
  }

  onSelectJourney() {
    this.props.parent.navigate(1);
  }

  setTodaysSteps(newsteps) {
    console.log(`saving: ${newsteps}`);
    this.setState({ fetching: false, todaySteps: newsteps });
    AsyncStorage.setItem(new Date().toISOString().split('T')[0], newsteps);
  }

  render() {
    console.log(`rendering. steps: ${this.state.todaySteps}`);
    const { textStyle, viewStyle, titleStyle, titleViewStyle } = styles;
    return (
      <View style={viewStyle}>
        <View style={titleViewStyle}>
          <Text style={titleStyle}>Your Progress</Text>
        </View>
        <Text style={textStyle}>Current journey: {this.state.journey}</Text>
        <Text style={textStyle}>
          Next milestone:
          {this.state.nextMilestoneSteps - this.state.todaySteps}
           to {this.state.nextMilestoneName}
        </Text>
        <Text style={textStyle}>Today's steps: {this.state.todaySteps}</Text>
        <Button
          onPress={this.onPressFetchSteps}
          title='Fetch steps'
          color='#841584'
          disabled={this.state.fetching || !this.state.authorized}
          accessibilityLabel='Attempt to update your progress from fitbit'
        />
        <Button
          onPress={this.onPressAuthorize}
          title='Authorize'
          color='#841584'
          disabled={this.state.authorizing || this.state.authorized}
          accessibilityLabel='Authorize this app  to access your fitbit data'
        />
        <Button
          onPress={this.onPressClearCache}
          title='Clear cache'
          color='#841584'
          disabled={false}
        />
        <Button
          onPress={this.onSelectJourney}
          title='Select journey'
          color='#841584'
          disabled={false}
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
  },
  titleStyle: {
    fontSize: 15
  },
  titleViewStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
  }
};

function OAuth(clientId) {
  const oauthurl = `https://www.fitbit.com/oauth2/authorize?${
            qs.stringify({
              client_id: clientId,
              response_type: 'token',
              scope: 'heartrate activity',
              redirect_uri: 'stcr://odswim',
              expires_in: '31536000',
              //state,
            })}`;
  console.log(oauthurl);

  Linking.openURL(oauthurl).catch(err => console.error('Error processing linking', err));
}

function handleCallbackUrl(url, component) {
  const [, queryString] = url.match(/#(.*)/);
  console.log(queryString);

  const query = qs.parse(queryString);
  console.log(`query: ${JSON.stringify(query)}`);

  getData(query.access_token, query.user_id, component);

  /*if (query.state === state) {
    cb(query.code, getProfileData, 'access_token');
  } else {
    console.error('Error authorizing oauth redirection');
  }*/
}

function getData(accessToken, userid, component) {
  //const fetchRequest = `https://api.fitbit.com/1/user/${userid}/activities/date/${new Date().toISOString().split('T')[0]}.json`;
  const fetchRequest = `https://api.fitbit.com/1/user/${userid}/activities/steps/date/today/1d.json`;
  console.log(`GET ${fetchRequest}`);
  fetch(
     fetchRequest,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      //body: `root=auto&path=${Math.random()}`
    }
  ).then((res) => {
    console.log('got response');
    return res.json();
  }).then((res) => {
    //console.log(res);
    console.log(`res: ${JSON.stringify(res)}`);
    component.setTodaysSteps(res['activities-steps'][0].value);
  }).catch((err) => {
    console.error('Error: ', err);
  });
}

export default CurrentJourney;
