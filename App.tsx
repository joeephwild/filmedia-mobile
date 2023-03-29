import {Video} from '@huddle01/react-native/components';
import {
  useAudio,
  useEventListener,
  useHuddle01,
  useLobby,
  useMeetingMachine,
  usePeers,
  useRoom,
  useVideo,
} from '@huddle01/react-native/hooks';
import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {RTCView} from 'react-native-webrtc';

function App(): JSX.Element {
  const {state, send} = useMeetingMachine();
  const {initialize, isInitialized} = useHuddle01();
  const {joinLobby} = useLobby();
  const {
    fetchAudioStream,
    produceAudio,
    stopAudioStream,
    stopProducingAudio,
    stream: micStream,
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    stopVideoStream,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();
  const {joinRoom, leaveRoom} = useRoom();
  const {peers} = usePeers();

  const [streamURL, setStreamURL] = useState('');

  useEventListener('lobby:cam-on', () => {
    if (state.context.camStream) {
      console.log('camStream: ', state.context.camStream.toURL());
      setStreamURL(state.context.camStream.toURL());
    }
  });

  return (
    <ScrollView style={styles.background}>
      <Text style={styles.appTitle}>My Video Conferencing App</Text>

      <View style={styles.infoSection}>
        <View style={styles.infoTab}>
          <View style={styles.infoKey}>
            <Text style={styles.text}>Room State</Text>
          </View>
          <View style={styles.infoValue}>
            <Text style={styles.text}>{JSON.stringify(state.value)}</Text>
          </View>
        </View>
        <View style={styles.infoTab}>
          <View style={styles.infoKey}>
            <Text style={styles.text}>Me Id</Text>
          </View>
          <View style={styles.infoValue}>
            <Text style={styles.text}>
              {JSON.stringify(state.context.peerId)}
            </Text>
          </View>
        </View>
        <View style={styles.infoTab}>
          <View style={styles.infoKey}>
            <Text style={styles.text}>Peers</Text>
          </View>
          <View style={styles.infoValue}>
            <Text style={styles.text}>
              {JSON.stringify(state.context.peers)}
            </Text>
          </View>
        </View>
        <View style={styles.infoTab}>
          <View style={styles.infoKey}>
            <Text style={styles.text}>Consumers</Text>
          </View>
          <View style={styles.infoValue}>
            <Text style={styles.text}>
              {JSON.stringify(state.context.consumers)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.controlsSection}>
        <View style={styles.controlsColumn}>
          <View style={styles.controlGroup}>
            <Text style={styles.controlsGroupTitle}>Idle</Text>
            <View style={styles.button}>
              <Button
                title="INIT"
                disabled={!state.matches('Idle')}
                onPress={() => initialize('INIT')}
              />
            </View>
          </View>
          <View style={styles.controlGroup}>
            <Text style={styles.controlsGroupTitle}>Lobby</Text>
            <View>
              <View style={styles.button}>
                <Button
                  title="FETCH_VIDEO_STREAM"
                  disabled={!fetchVideoStream.isCallable}
                  onPress={fetchVideoStream}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="FETCH_AUDIO_STREAM"
                  disabled={!fetchAudioStream.isCallable}
                  onPress={fetchAudioStream}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="JOIN_ROOM"
                  disabled={!joinRoom.isCallable}
                  onPress={joinRoom}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="LEAVE_LOBBY"
                  disabled={!state.matches('Initialized.JoinedLobby')}
                  onPress={() => send('LEAVE_LOBBY')}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="STOP_VIDEO_STREAM"
                  disabled={!stopVideoStream.isCallable}
                  onPress={stopVideoStream}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="STOP_AUDIO_STREAM"
                  disabled={!stopAudioStream.isCallable}
                  onPress={stopAudioStream}
                />
              </View>
            </View>
          </View>
        </View>

        <View style={styles.controlsColumn}>
          <View style={styles.controlGroup}>
            <Text style={styles.controlsGroupTitle}>Initialized</Text>

            <View style={styles.button}>
              <Button
                title="JOIN_LOBBY"
                disabled={!joinLobby.isCallable}
                onPress={() => {
                  joinLobby('bcf-oplk-xyp');
                }}
              />
            </View>
          </View>

          <View style={styles.controlGroup}>
            <Text style={styles.controlsGroupTitle}>Room</Text>
            <View>
              <View style={styles.button}>
                <Button
                  title="PRODUCE_MIC"
                  disabled={!produceAudio.isCallable}
                  onPress={() => produceAudio(micStream)}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="PRODUCE_CAM"
                  disabled={!produceVideo.isCallable}
                  onPress={() => produceVideo(camStream)}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="STOP_PRODUCING_MIC"
                  disabled={!stopProducingAudio.isCallable}
                  onPress={() => stopProducingAudio()}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="STOP_PRODUCING_CAM"
                  disabled={!stopProducingVideo.isCallable}
                  onPress={() => stopProducingVideo()}
                />
              </View>

              <View style={styles.button}>
                <Button
                  title="LEAVE_ROOM"
                  disabled={!leaveRoom.isCallable}
                  onPress={leaveRoom}
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.videoSection}>
        <Text style={styles.text}>My Video:</Text>
        <View style={styles.myVideo}>
          <RTCView
            mirror={true}
            objectFit={'cover'}
            streamURL={streamURL}
            zOrder={0}
            style={{
              backgroundColor: 'white',
              width: '75%',
              height: '100%',
            }}
          />
        </View>
        <View>
          {Object.values(peers)
            .filter(peer => peer.cam)
            .map(peer => (
              <Video
                key={peer.peerId}
                peerId={peer.peerId}
                track={peer.cam}
                style={{
                  backgroundColor: 'white',
                  width: '75%',
                  height: '100%',
                }}
              />
            ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  appTitle: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  background: {
    backgroundColor: '#222222',
    height: '100%',
    width: '100%',
    paddingVertical: 50,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
  },
  infoSection: {
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
    padding: 10,
  },
  infoTab: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 6,
    marginTop: 4,
  },
  infoKey: {
    borderRightColor: '#fff',
    borderRightWidth: 2,
    padding: 4,
  },
  infoValue: {
    flex: 1,
    padding: 4,
  },
  controlsSection: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 2,
  },
  controlsColumn: {
    display: 'flex',
    alignItems: 'center',
  },
  button: {
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  controlsGroupTitle: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  controlGroup: {
    marginTop: 4,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  videoSection: {},
  myVideo: {
    height: 300,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
});

export default App;
