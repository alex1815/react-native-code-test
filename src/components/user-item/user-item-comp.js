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
    const { user } = this.props;
    const { avatar, fullName } = user;
    
    return (
      <View style={ styles.container }>
        <Image
          style={ styles.avatar }
          source={ { uri: avatar } }
        />
        <View style={ styles.textContainer }>
          <Text style={ styles.name } >{ fullName() }</Text>
        </View>
      </View>
    );
  }
}

// can be inhertan from global styles.
const AVATAR_SIZE = 60;
const TEXT_FONT_SIZE = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    padding: 20,
    backgroundColor: '#F5FCFF',
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey'
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2
  },
  name: {
    fontSize: TEXT_FONT_SIZE
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 20
  }
});
