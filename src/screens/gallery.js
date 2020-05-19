

import React, { Component } from "react";
import {
  AppRegistry,
  TouchableHighlight,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,

} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import {Icon} from "native-base";
import { f, store } from '../components/firebase';

import BackgroundJob from "react-native-background-job";
var SharedPreferences = require('react-native-shared-preferences');

const regularJobKey = "regularJobKey";
const exactJobKey = "exactJobKey";
const foregroundJobKey = "foregroundJobKey";

const everRunningJobKey = "everRunningJobKey";


BackgroundJob.register({
  jobKey: regularJobKey,
  job: () => {
    //
    uriToBlob = (uri) => {

      return new Promise((resolve, reject) => {
  
        const xhr = new XMLHttpRequest();
  
        xhr.onload = function () {
          resolve(xhr.response);
        };
  
        xhr.onerror = function () {
          reject(new Error('uriToBlob failed'));
        };
  
        xhr.responseType = 'blob';
  
        xhr.open('GET', uri, true);
        xhr.send(null);
  
      });
  
    }
  
    uploadToFirebase = (blob) => {
  
      return new Promise((resolve, reject) => {
  
        const sessionId = new Date().getTime()
        const storage = f.storage()
        storage.ref('images/Infilect').child(`${sessionId}`).put(blob, {
          contentType: 'image/jpeg'
        }).then((snapshot) => {
  
          blob.close();
  
          resolve(snapshot);
  
        }).catch((error) => {
  
          reject(error);
  
        });
  
      });
  
  
    }
    //
    //photohandler start
    photohandler = (uri) => {
      // let data = await this.requestExternalStoragePermission();
      // console.log(data); 
      console.log('pressed a upload button ');
      
      //
      const ref = this;
      SharedPreferences.getItem(uri, function(value){
        console.log(value);
        //console.log('uri inside shared preference',uri)
        if(value === 'Uploaded'){
          console.log('skipping this uri: ',uri);
        }
        else{
      
      const storage = f.storage().ref();
          ref.uriToBlob(uri).then(function (blob) {
            console.log('Outside urI');
            //console.log(blob);
            ref.uploadToFirebase(blob).then(function (response) {
    
              storage.child(response.metadata.fullPath).getDownloadURL().then(function (url) {
                console.log('im in download');
                console.log(url);
                return uri;
              }).then(function (retUrl) {
                console.log('FireBase Uploaded',retUrl);
                //console.log(response);
                //ref.setState({ loading: false, url: retUrl });
                //console.log(ref.state.url);
                //
                //SharedPreferences.setItem("key",retUrl);
                // SharedPreferences.getItem("key", function(value){
                //   console.log(value);
                //});
                var dt = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (dt + Math.random()*16)%16 | 0;
          dt = Math.floor(dt/16);
          return (c=='x' ? r :(r&0x3|0x8)).toString(16);
      });
      //console.log('uuid',uuid);
     SharedPreferences.setItem(retUrl,'Uploaded');
      // SharedPreferences.getAll(function(values){
      //   console.log(values);
      // });
      //SharedPreferences.clear();
                //
              
              });
            });
          });
  
        }
      //
    });
  
    };
    //photohandler end
    console.log(`Background Job fired!. Key = ${regularJobKey}`);
    CameraRoll.getPhotos({
      first: 30,
      assetType: 'Photos',
    })
    .then(res => {
      //this.setState({ data: res.edges });
      var bata = res.edges;
      //
      var x;

    //console.log(bata[0].node.group_name);
    for(x in bata){
      if(bata[x].node.group_name === 'Pictures'){
      
      console.log(bata[x].node.image.uri)
      this.photohandler(bata[x].node.image.uri);
      }
      else{
       console.log(bata[x].node.group_name)
      }
    }

   
      //
    })
    .catch((error) => {
       console.log(error);
    });
  }
});
BackgroundJob.register({
  jobKey: exactJobKey,
  job: () => {
    console.log(`${new Date()}Exact Job fired!. Key = ${exactJobKey}`);
  }
});
BackgroundJob.register({
  jobKey: foregroundJobKey,
  job: () => console.log(`Exact Job fired!. Key = ${foregroundJobKey}`)
});
BackgroundJob.register({
  jobKey: everRunningJobKey,
  job: () => console.log(`Ever Running Job fired! Key=${everRunningJobKey}`)
});

export default class backtest extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      jobs: [],
      data: ''
     };
     this.gallery = this.gallery.bind(this);
  }

  async componentDidMount(){
    if (Platform.OS === 'android') {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permission Explanation',
            message: 'We would like to access your photos!',
          },
        );
        if (result !== 'granted') {
          console.log('Access to pictures was denied');
          return;
        }
      }

      CameraRoll.getPhotos({
        first: 30,
        assetType: 'Photos',
      })
      .then(res => {
        this.setState({ data: res.edges });
      })
      .catch((error) => {
         console.log(error);
      });
    
  }

  uritry = (uri) => {
    // let data = await this.requestExternalStoragePermission();
    // console.log(data); 
    console.log('pressed a urytry');
    console.log('uri', uri);
    
  };

  gallery = (uri) => {
    // let data = await this.requestExternalStoragePermission();
    // console.log(data); 
    console.log('pressed a image');
    console.log('uri', uri);
    this.props.navigation.navigate('galleryimage', { data: uri });
  };

  uriToBlob = (uri) => {

    return new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        reject(new Error('uriToBlob failed'));
      };

      xhr.responseType = 'blob';

      xhr.open('GET', uri, true);
      xhr.send(null);

    });

  }

  uploadToFirebase = (blob) => {

    return new Promise((resolve, reject) => {

      const sessionId = new Date().getTime()
      const storage = f.storage()
      storage.ref('images/Infilect').child(`${sessionId}`).put(blob, {
        contentType: 'image/jpeg'
      }).then((snapshot) => {

        blob.close();

        resolve(snapshot);

      }).catch((error) => {

        reject(error);

      });

    });


  }


  photohandler = (uri) => {
    // let data = await this.requestExternalStoragePermission();
    // console.log(data); 
    console.log('pressed a upload button ');
    
    //
    const ref = this;
    SharedPreferences.getItem(uri, function(value){
      console.log(value);
      //console.log('uri inside shared preference',uri)
      if(value === 'Uploaded'){
        console.log('skipping this uri: ',uri);
      }
      else{
    
    const storage = f.storage().ref();
        ref.uriToBlob(uri).then(function (blob) {
          console.log('Outside urI');
          //console.log(blob);
          ref.uploadToFirebase(blob).then(function (response) {
  
            storage.child(response.metadata.fullPath).getDownloadURL().then(function (url) {
              console.log('im in download');
              console.log(url);
              return uri;
            }).then(function (retUrl) {
              console.log('FireBase Uploaded',retUrl);
              //console.log(response);
              //ref.setState({ loading: false, url: retUrl });
              //console.log(ref.state.url);
              //
              //SharedPreferences.setItem("key",retUrl);
              // SharedPreferences.getItem("key", function(value){
              //   console.log(value);
              //});
              var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    //console.log('uuid',uuid);
   SharedPreferences.setItem(retUrl,'Uploaded');
    // SharedPreferences.getAll(function(values){
    //   console.log(values);
    // });
    //SharedPreferences.clear();
              //
            
            });
          });
        });

      }
    //
  });

  };

  takePicture = () => {
    // let data = await this.requestExternalStoragePermission();
    // console.log(data); 
    console.log('aff')

    //console.log('store',f)

   var bata = this.state.data;

   //console.log('bata',bata[0].node.image)
    var x;

    //console.log(bata[0].node.group_name);
   for(x in bata){
       if(bata[x].node.group_name === 'Pictures'){
       
       console.log(bata[x].node.image.uri)
       this.photohandler(bata[x].node.image.uri);
       }
       else{
        console.log(bata[x].node.group_name)
       }
  }


      console.log('sfsf')
  };

  renderItem(item) {
    return (
        <TouchableOpacity   
                 style={{width: '33%',
                 height: 150,}} onPress={() => {this.gallery(item.node.image.uri); this.uritry(item.node.image.uri);} } >
                <Image style={{flex: 1}} resizeMode='cover' source={{ uri:  item.node.image.uri}}></Image>
        </TouchableOpacity>
    )
}



  render() {
    return (
      
      <View>
           
           
           {this.state.jobs.map(({ jobKey }) => jobKey)}
        
      <FlatList
        onPress={() => this.gallery(item.id)}
        data={this.state.data}
        numColumns={3}
        renderItem={({ item }) => this.renderItem(item) }
    />
      <TouchableOpacity
              style={{
                  borderWidth:1,
                  borderColor:'rgba(0,0,0,0.2)',
                  alignItems:'center',
                  justifyContent:'center',
                  width:70,
                  position: 'absolute',                                          
                  bottom: 10,                                                    
                  right: 10,
                  height:70,
                  backgroundColor:'#fff',
                  borderRadius:100,
              }}
              onPress={ () => {
                this.takePicture()
                console.log('yo presses');
                BackgroundJob.schedule({
                          jobKey: regularJobKey,
                          notificationTitle: "Notification title",
                          notificationText: "Notification text",
                          period: 15000
                        });
              }}
              >
             <Icon name='cloud' />
          </TouchableOpacity>
    </View>
      //
    );
  }
  
}

const styles = StyleSheet.create({
  // button: { padding: 20, backgroundColor: "#ccc", marginBottom: 10 },
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "#F5FCFF"
  // },
  // welcome: { fontSize: 20, textAlign: "center", margin: 10 },
  // instructions: { textAlign: "center", color: "#333333", marginBottom: 5 },
  //
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

AppRegistry.registerComponent("backtest", () => backtest);