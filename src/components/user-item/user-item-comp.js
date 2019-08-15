//  @flow

import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import User from '../../models/user';

type Props = { user: User };
export default class UserItem extends PureComponent<Props> {
  render() {
    const { user } = this.props;
    const { avatar, fullName } = user;
    return (
      <View style={ styles.container }>
        <Image
          style={ { width: 50, height: 50 } }
          source={ { uri: avatar } }
        />
        <Text>{ fullName() }</Text>
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
