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
  getListItem: Function;

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
    this.getListItem = this.getListItem.bind(this);
  }

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

  getListHeader() {
    return <View style={ styles.headerContainer } >
      <Text style={ styles.title }>Users</Text>
    </View>
  }

  getListItem(item: any) {
    return item.index !== this.state.lastItemIndex
      ? <UserItem user={ item.item } />
      : <View>
        <UserItem user={ item.item } />
        <View style={ styles.noMoreUsersContainer }>
          <Text style={ styles.title } >No more users</Text>
        </View>
      </View>
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
              // it's not clear from task - should I add header in this way or as header in the app
              ListHeaderComponent={ this.getListHeader }
              renderItem={ this.getListItem }
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
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'silver',
    backgroundColor: 'silver'
  },
  title: {
    fontSize: TEXT_FONT_SIZE_NORMAL
  }
});
