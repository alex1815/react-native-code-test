//  @flow

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Spinner from './components/spinner/spinner-comp';

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={ styles.container }>
        <Spinner shouldSpin={ true } />
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
