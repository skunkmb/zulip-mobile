/* @flow */
import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';

import type { Actions, Auth } from '../types';
import { nullFunction } from '../nullObjects';
import { ZulipButton } from '../common';
import { subscriptionAdd, subscriptionRemove } from '../api';
import StreamList from '../streams/StreamList';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  button: {
    margin: 10,
  },
});

type Props = {
  actions: Actions,
  auth: Auth,
  streams: [],
  subscriptions: [],
};

type State = {
  filter: string,
};

export default class StreamListCard extends PureComponent<Props, State> {
  props: Props;

  state: State;

  state = {
    filter: '',
  };

  handleFilterChange = (filter: string) => this.setState({ filter });

  handleSwitchChange = (streamName: string, switchValue: boolean) => {
    const { auth } = this.props;

    if (switchValue) {
      subscriptionAdd(auth, [{ name: streamName }]);
    } else {
      subscriptionRemove(auth, [streamName]);
    }
  };

  clearInput = () => {
    this.setState({ filter: '' });
  };

  render() {
    const { actions, streams, subscriptions } = this.props;
    const filteredStreams = streams.filter(x => x.name.includes(this.state.filter));
    const subsAndStreams = filteredStreams.map(x => ({
      ...x,
      subscribed: subscriptions.some(s => s.stream_id === x.stream_id),
    }));

    return (
      <View style={styles.wrapper}>
        <ZulipButton
          style={styles.button}
          text="Create new stream"
          onPress={actions.navigateToCreateStream}
        />
        <StreamList
          streams={subsAndStreams}
          showSwitch
          showDescriptions
          onSwitch={this.handleSwitchChange}
          onPress={nullFunction}
          clearInput={this.clearInput}
        />
      </View>
    );
  }
}
