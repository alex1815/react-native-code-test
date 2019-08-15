//  @flow

// we need use this import for React for getting access to React.Node
import * as React from 'react';
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

export const CLOSING_SPINNER_DURATION = 0.3;

const CIRCLE_BIG_SIZE = 400;

const COLLAPSE_SPINNER_FINISH_VALUE = 1;

type Props = { shouldSpin: boolean, size?: string, children: React.Node };
type State = { circleSize: number, collapsingSpinner: Animated.Value }
export class Spinner extends React.Component<Props, State> {
  // current implementation can be improved by adding spinner size customization

  collapseSpinner: Function;

  static defaultProps = {
    size: SPINNER_SIZE.big
  };

  constructor() {
    super();

    let circles = {};
    for (let i = 0; i < NUMBER_OF_CIRCLE; i++) {
      circles[this.generateCircleName(i)] = new Animated.Value(0);
    }

    this.state = Object.assign({}, circles, {
      circleSize: CIRCLE_BIG_SIZE,
      collapsingSpinner: new Animated.Value(0)
    });

    this.collapseSpinner = this.collapseSpinner.bind(this);
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

  collapseSpinner() {
    Animated.timing(
      this.state.collapsingSpinner, {
        toValue: COLLAPSE_SPINNER_FINISH_VALUE,
        duration: CLOSING_SPINNER_DURATION * 1000
      }
    ).start();
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
    let sizeCoefficient: Animated.AnimatedInterpolation = new Animated.Value(1);
    const { shouldSpin } = this.props;

    if (!shouldSpin) {
      const { collapsingSpinner, circleSize } = this.state;

      // we don't want wait the end of animation - it's ok to show children now for getting smooth transition
      if (collapsingSpinner._value >= COLLAPSE_SPINNER_FINISH_VALUE / 2) {
        return this.props.children;
      }

      if (collapsingSpinner._value === 0) {
        this.collapseSpinner();
      }

      sizeCoefficient = collapsingSpinner.interpolate({
        inputRange: [0, COLLAPSE_SPINNER_FINISH_VALUE / 2],
        outputRange: [1, circleSize / 50]
      })
    }

    const circles = [];

    for (let i = 0; i < NUMBER_OF_CIRCLE; i++) {
      const circleName = this.generateCircleName(i);
      const { grow, changingColor, changingOpacity } = this.generateCircleProperties(this.state[circleName]);
      const size = Animated.divide(grow, sizeCoefficient);

      circles.push(<Animated.View
        key={ circleName }
        style={ [styles.circle, {
          height: size,
          width: size,
          backgroundColor: changingColor,
          opacity: changingOpacity,
        }] } >
      </Animated.View>);
    }

    const centerSize = Animated.divide(CENTER_CIRCLE_SIZE, sizeCoefficient);

    return (
      <View style={ styles.container }>
        <Animated.View style={ [styles.centerCircle, {
          width: centerSize,
          height: centerSize
        }] }></Animated.View>
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
