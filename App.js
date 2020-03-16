import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

import {createAppContainer} from 'react-navigation'
import {createStackNavigator} from 'react-navigation-stack';

const AppNavigator = createStackNavigator(
  {
      Main: MainScreen,
      SearchRes: SearchResScreen
  },
  {
      initialRouteName: "MainScreen",
      defaultNavigationOptions: {
          
      },
      headerMode: 'none',
  }

);

const AppContainer = createAppContainer(AppNavigator);

export default class MainScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    detectedTexts: null
    };
}

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          onTextRecognized={({textBlocks}) => this.setState({ detectedTexts: textBlocks.map(b => b.value) })}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => this.search(this.state.detectedTexts)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}>{this.state.detectedTexts}</Text>
          </TouchableOpacity>
        </View>
        </RNCamera>
      </View>
    );
  }

  search = function(book) {
    this.props.navigation.navigate('SearchResScreen', { booktosearch: book});
  };

}

class SearchResScreen extends PureComponent {
  render(){
    return(
      <View>
        <Text>here will be the search result.</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});