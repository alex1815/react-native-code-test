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
import { getDataByPage, getInitialData, getTotalPages } from '../../services/http/server';
import { TEXT_FONT_SIZE_BIG, TEXT_FONT_SIZE_NORMAL } from '../styles/general';

type Props = {};
type State = { users: Array<User>, isLoading: boolean, lastDownloadedPage: number, totalPages: number, lastItemIndex: number }
export default class UsersList extends PureComponent<Props, State> {
  getNextData: Function;

  constructor() {
    super();

    this.state = {
      users: [],
      isLoading: true,
      lastDownloadedPage: 3,
      totalPages: -1,
      lastItemIndex: -1
    }

    this.getNextData = this.getNextData.bind(this);
  }
  // TODO - add "Users" header

  // TODO - fix flow errors

  async componentDidMount() {
    // TODO add delay in 3 seconds for getting data from server
    const users = await getInitialData(this.state.lastDownloadedPage);
    const totalPages = await getTotalPages();
    this.setState({ users, isLoading: false, totalPages });
  }

  async getNextData() {
    // todo - add downloading data during scrolling
    // todo - add "no data" if got all data
    const { lastDownloadedPage, totalPages, users } = this.state;
    const nextPage: number = lastDownloadedPage + 1;
    if (nextPage > totalPages) {
      this.setState({ lastItemIndex: users.length - 1 });
      return;
    }

    const res = await getDataByPage(nextPage);
    this.setState({
      lastDownloadedPage: nextPage,
      users: users.concat(res)
    });
  }

  render() {
    const { users, isLoading, lastItemIndex } = this.state;

    return (
      <View>
        {
          isLoading
            ? <Spinner shouldSpin={ isLoading } />
            : <FlatList
              style={ styles.list }
              data={ users }
              extraData={ this.state.lastItemIndex }
              renderItem={ item => {
                return item.index !== lastItemIndex
                  ? <UserItem user={ item.item } />
                  : <View>
                    <UserItem user={ item.item } />
                    <View style={ styles.noMoreUsersContainer }>
                      <Text style={ styles.noMoreUsers } >No more users</Text>
                    </View>
                  </View>
              } }
              keyExtractor={ user => user.id.toString() }
              onEndReached={ this.getNextData }
              onEndReachedThreshold={ 0.2 }
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
  },
  noMoreUsersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  noMoreUsers: {
    fontSize: TEXT_FONT_SIZE_NORMAL
  }
});
