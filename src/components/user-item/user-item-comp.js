//  @flow

import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

import User from '../../models/user-mod';

type Props = { user: User };
export default class UserItem extends PureComponent<Props> {
  render() {
    console.log(this.props);
    const { user } = this.props;
    const { avatar, fullName } = user;
    return (
      <View style={ styles.container }>
        <Image
          style={ styles.avatar }
          source={ { uri: avatar } }
        />
        <Text>{ fullName() }</Text>
      </View>
    );
  }
}

const AVATAR_SIZE = 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    borderBottomWidth: 2,
    borderBottomColor: 'grey'
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2
  }
});
