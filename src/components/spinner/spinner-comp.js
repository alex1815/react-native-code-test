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
import { getNameAsString } from '../../helpers/general-help';

const NUMBER_OF_CIRCLE = 3;
const DEFAULT_SPIN_TIME = 1.8;

const CIRCLE_BIG_SIZE = 400;

type Props = { shouldSpin: boolean, size?: string };
type State = { circleSize: number }
export default class Spinner extends Component<Props, State> {
  // current implementation can be improved by adding spinner size customization
  static defaultProps = {
    size: SPINNER_SIZE.big
  };

  constructor() {
    super();

    let circles = {};
    for (let i = 0; i < NUMBER_OF_CIRCLE; i++) {
      circles[this.generateCircleName(i)] = new Animated.Value(0);
    }

    this.state = Object.assign({}, circles, { circleSize: CIRCLE_BIG_SIZE });
  }

  generateCircleName(index: number) {
    return `growingCircle${ index.toString() }`;
  }

  componentDidMount() {
    for (let i = 0; i < NUMBER_OF_CIRCLE; i++) {
      const circleName: string = getNameAsString(this.generateCircleName(i));
      this.spin(circleName, i === 0 ? 0 : DEFAULT_SPIN_TIME * 1000 / i);
    }
  }

  spin(circleName: string, delay: number = 0) {
    this.generateSpinnerFunc(this.state[circleName], delay,
      (done) => {
        if (done.finished) {
          this.setState(
            { [circleName]: new Animated.Value(0) },
            () => { this.spin(circleName) }
          );
        }
      });
  }

  generateSpinnerFunc(timingValue: number, delay: number = 0, callback: Function) {
    if (!this.props.shouldSpin) {
      return;
    }

    Animated.timing(
      timingValue,
      {
        toValue: DEFAULT_SPIN_TIME,
        duration: DEFAULT_SPIN_TIME * 1000,
        easing: Easing.linear,
        delay
      }
    ).start(callback);
  }

  generateCircleProperties(value: Animated.Value) {
    const grow = value.interpolate({
      inputRange: [0, DEFAULT_SPIN_TIME],
      outputRange: [this.state.circleSize / 3, this.state.circleSize]
    });

    const changingColor = value.interpolate({
      inputRange: [0, DEFAULT_SPIN_TIME],
      outputRange: ['rgb(124,252,0)', 'rgb(144,238,144)']
    });

    const changingOpacity = value.interpolate({
      inputRange: [0, DEFAULT_SPIN_TIME - DEFAULT_SPIN_TIME / 3, DEFAULT_SPIN_TIME],
      outputRange: [0.08, 0.2, 0]
    });

    return { grow, changingColor, changingOpacity };
  }

  render() {
    const circles = [];

    for (let i = 0; i < NUMBER_OF_CIRCLE; i++) {
      const { grow, changingColor, changingOpacity } = this.generateCircleProperties(this.state[this.generateCircleName(i)]);
      circles.push(<Animated.View
        key={ this.generateCircleName(i) }
        style={ [styles.circle, {
          height: grow,
          width: grow,
          backgroundColor: changingColor,
          opacity: changingOpacity,
        }] } >
      </Animated.View>);
    }

    return (
      <View style={ styles.container }>
        <View style={ styles.centerCircle }></View>
        { circles }
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
    width: CIRCLE_BIG_SIZE,
    height: CIRCLE_BIG_SIZE
  },
  centerCircle: {
    width: CENTER_CIRCLE_SIZE,
    height: CENTER_CIRCLE_SIZE,
    backgroundColor: 'green',
    borderRadius: CENTER_CIRCLE_SIZE / 2,
    opacity: 1,
    position: 'absolute'
  },
  circle: {
    borderRadius: CIRCLE_BIG_SIZE / 2,
    position: 'absolute'
  }
});
