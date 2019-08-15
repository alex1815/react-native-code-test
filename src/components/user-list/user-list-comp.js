//  @flow

import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList
} from 'react-native';

import Spinner from '../spinner/spinner-comp';

import User from '../../models/user-mod';
import UserItem from '../user-item/user-item-comp';
import { getData } from '../../services/http/server';

type Props = {};
type State = { users: Array<User>, isLoading: boolean }
export default class UsersList extends PureComponent<Props, State> {
  state = {
    users: [],
    isLoading: true,
    // TODO - think - download the data and don't hardcode value 
    lastDownloadedPage: 3
  }

  async componentDidMount() {
    const users = await getData();
    this.setState({ users, isLoading: false });
  }

  async getNextData(page) {

  }

  render() {
    const { users, isLoading } = this.state;
    console.log(users)
    return (
      <View>
        {
          isLoading
            ? <Spinner shouldSpin={ isLoading } />
            : <FlatList
              style={ styles.list }
              data={ users }
              renderItem={ item => { return <UserItem user={ item.item } /> } }
              keyExtractor={ user => user.id.toString() }
              onEndReached={ this.getNextData }
              onEndReachedThreshold={ 1 }
            >
            </FlatList>
        }
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
  },
  list: {
    flex: 1,
    minWidth: '100%'
  }
});
