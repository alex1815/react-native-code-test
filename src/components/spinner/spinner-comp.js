//  @flow

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing
} from 'react-native';
import { SPINNER_SIZE } from '../../models/spinner-mod';
import { green } from 'ansi-colors';

const DEFAULT_SPIN_TIME = 10;

type Props = { shouldSpin: boolean, size: String };
type State = { growValue: Animated.Value }
export default class Spinner extends Component<Props, State> {
  static defaultProps = {
    size: SPINNER_SIZE.big
  };

  state = {
    growValue: new Animated.Value(0)
  }

  componentDidMount() {
    this.spin();
    console.log('come in')
  }

  spin() {
    console.log("you're on the start")
    if (!this.props.shouldSpin) {
      return;
    }

    console.log("1 level")
    Animated.timing(
      this.state.growValue,
      {
        toValue: DEFAULT_SPIN_TIME,
        duration: DEFAULT_SPIN_TIME * 1000,
        easing: Easing.linear
      }
    ).start(() => this.spin())
  }

  render() {
    const grow = this.state.growValue.interpolate({
      inputRange: [0, DEFAULT_SPIN_TIME / 3, DEFAULT_SPIN_TIME],
      outputRange: [0, 200, 400]
    });

    const changingColor = this.state.growValue.interpolate({
      inputRange: [0, DEFAULT_SPIN_TIME],
      outputRange: ['rgba(100, 242, 97, 0.8)', 'rgba(230, 230, 230, 1.0)']
    });

    const changingOpacity = this.state.growValue.interpolate({
      inputRange: [0, DEFAULT_SPIN_TIME - DEFAULT_SPIN_TIME / 3, DEFAULT_SPIN_TIME],
      outputRange: [1, 1, 0]
    });

    return (
      <View style={ styles.container }>
        <View style={ styles.centerCircle }></View>
        <Animated.View
          style={ {
            height: grow,
            borderRadius: 400 / 2,
            width: grow,
            backgroundColor: changingColor,
            opacity: changingOpacity
          } } >            
        </Animated.View>
      </View>
    );
  }
}

const CENTER_CIRCLE_SIZE = 30;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 400,
    height: 400
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  centerCircle: {
    width: CENTER_CIRCLE_SIZE,
    height: CENTER_CIRCLE_SIZE,
    backgroundColor: 'green',
    borderRadius: CENTER_CIRCLE_SIZE / 2,
    opacity: 1,
    position: 'absolute'
  }
});
