import React, { PureComponent } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Linking } from 'react-native';
import { RNCamera } from 'react-native-camera';

import { Navigation } from 'react-native-navigation';

Navigation.registerComponent(`navigation.Main`, () => MainScreen);
Navigation.registerComponent(`navigation.SearchRes`, () => SearchResScreen);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
            name: "navigation.Main"
          }
        }],
        options: {
          topBar: {
            visible: false
          }
        }
      }
    }
  });
});

export default class MainScreen extends PureComponent {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
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
    Navigation.push(this.props.componentId, {
      component: {
        name: 'navigation.SearchRes',
        passProps: {
          book: this.state.detectedTexts
        }
      }
    });
  };

}

class SearchResScreen extends PureComponent {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      searchresult: null,
      done: false

    };
}

componentDidMount(){
  fetch('https://www.googleapis.com/books/v1/volumes?q=' + this.props.book + '&maxResults=20') // + this.props.book
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    console.log(response.items[1].volumeInfo.title);
    this.setState({
      searchresult: response,
      done: true
    });
    console.log("this is state inside : " + this.state.searchresult.items[1].volumeInfo.title);
  }).catch((error) => {
    console.error(error);
  });
}

  render(){
    if (this.state.done){
      var list_books = [];

      for (let i = 0; i < this.state.searchresult.items.length; i++) {
        if (this.state.searchresult.items[i].volumeInfo != null 
          && this.state.searchresult.items[i].volumeInfo.title != null 
          && this.state.searchresult.items[i].volumeInfo.imageLinks != null 
          && this.state.searchresult.items[i].volumeInfo.authors != null 
          && this.state.searchresult.items[i].volumeInfo.publisher != null 
          && this.state.searchresult.items[i].volumeInfo.averageRating != null 
          && this.state.searchresult.items[i].volumeInfo.infoLink != null 
        ){
          list_books.push(
            <View key={i}>
              <Book
                title={this.state.searchresult.items[i].volumeInfo.title} 
                imgurl={this.state.searchresult.items[i].volumeInfo.imageLinks.smallThumbnail}
                author={this.state.searchresult.items[i].volumeInfo.authors}
                publisher={this.state.searchresult.items[i].volumeInfo.publisher}
                rating={this.state.searchresult.items[i].volumeInfo.averageRating}
                link={this.state.searchresult.items[i].volumeInfo.infoLink}
              />
            </View>
          );
        }
      }

      return(
        <ScrollView contentContainerStyle={styles.scrol}>
          {list_books}
        </ScrollView>
      );
    }
    else{
      return null
    }
  }
}

class Book extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render(){

    var authors = [];

    for (let i = 0; i < this.props.author.length; i++) {
      authors.push(
        <Text key={i}>{this.props.author[i]}</Text>
      );
    }

    return(
    <TouchableOpacity onPress={() => this.open(this.props.link)} style={styles.tile}>
      <Text style={styles.title}>{this.props.title}</Text>
      <Image
        style={{width: 128, height: 194, alignSelf: "center", marginBottom: 10}}
        source={{uri: this.props.imgurl}}
      />
      <View style={styles.tileBottom}>
        <View>
          <Text>Authors:</Text>
          {authors}
        </View>
        <View>
          <Text>Publisher: {this.props.publisher}</Text>
        </View>
        <View>
          <Text>Average Ratings: {this.props.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
    );
  }

  open = function(book) {
    Linking.openURL(book);
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
  tile: {
    backgroundColor: '#e0dcdb',
    marginTop: 10,
    padding: 20,
    fontFamily: "Arial",
    width: 350

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },
  scrol : {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileBottom: {
    marginLeft: 10
  }
});