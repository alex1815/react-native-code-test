//  @flow

import React, { PureComponent } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Animated,
  Dimensions
} from 'react-native';

import { Spinner, CLOSING_SPINNER_DURATION } from '../spinner/spinner-comp';

import User from '../../models/user-mod';
import UserItem from '../user-item/user-item-comp';
import { getDataByPage, getInitialData, getTotalPages } from '../../services/http/server';
import { TEXT_FONT_SIZE_BIG, TEXT_FONT_SIZE_NORMAL } from '../styles/general-styl';

const TO_VALUE_SHOWING_LIST = 1;
const SHOWING_LIST_DURATION = 0.5;

type Props = {};
type State = {
  users: Array<User>,
  isLoading: boolean,
  lastDownloadedPage: number,
  totalPages: number,
  lastItemIndex: number,
  currentBottomValue: Animated.Value
}
export default class UsersList extends PureComponent<Props, State> {

  getNextData: Function;
  getListItem: Function;
  showList: Function;

  constructor() {
    super();

    this.state = {
      users: [],
      isLoading: true,
      lastDownloadedPage: 3,
      totalPages: -1,
      lastItemIndex: -1,
      currentBottomValue: new Animated.Value(0)
    }

    this.getNextData = this.getNextData.bind(this);
    this.getListItem = this.getListItem.bind(this);
    this.showList = this.showList.bind(this);
  }

  async componentDidMount() {
    const users = await getInitialData(this.state.lastDownloadedPage);
    const totalPages = await getTotalPages();
    this.setState({ users, isLoading: false, totalPages }, this.showList);
  }

  async getNextData() {
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

  showList() {
    Animated.timing(this.state.currentBottomValue, {
      toValue: TO_VALUE_SHOWING_LIST,
      duration: SHOWING_LIST_DURATION * 1000,
      delay: CLOSING_SPINNER_DURATION * 1000
    }).start();
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
    const { users, isLoading, lastItemIndex, currentBottomValue } = this.state;

    const bottomValue = currentBottomValue.interpolate({
      inputRange: [0, TO_VALUE_SHOWING_LIST],
      outputRange: [Dimensions.get('window').height, 0]
    });

    return (
      // spinner will work correct without animation for children
      <Spinner shouldSpin={ isLoading } >
        <Animated.View style={ {
          bottom: bottomValue
        } } >
          <FlatList
            style={ styles.list }
            data={ users }
            extraData={ this.state.lastItemIndex }
            // it's not clear from task - should I add header in this way or as header in the app
            ListHeaderComponent={ this.getListHeader }
            renderItem={ this.getListItem }
            keyExtractor={ user => user.id.toString() }
            onEndReached={ this.getNextData }
            onEndReachedThreshold={ 0.3 }
          >
          </FlatList>
        </Animated.View>
      </Spinner>
    );
  }
}

const styles = StyleSheet.create({
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
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'silver',
    backgroundColor: 'silver'
  },
  title: {
    fontSize: TEXT_FONT_SIZE_NORMAL
  }
});
