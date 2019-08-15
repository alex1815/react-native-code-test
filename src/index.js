//  @flow

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import UsersList from './components/user-list/user-list-comp';

type Props = {};
export default class App extends Component<Props> {
  componentDidCatch(err: any) {
    console.log(err)
  }

  render() {
    return (
      <View style={ styles.container }>
        <UsersList />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
