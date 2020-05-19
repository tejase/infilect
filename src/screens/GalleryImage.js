import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, ImageBackground, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Button } from 'native-base';
import { f, store } from '../components/firebase';
import {Icon} from "native-base";

var SharedPreferences = require('react-native-shared-preferences');

// import { Image } from 'react-native-animatable';
const WIDTH = Dimensions.get('window').width;
export default class GalleryImage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      url: '',
      uploaded: false
  };
  }

  componentDidMount(){
      console.log('compmounted');
      // this.setState({    
        
      //   url: "",
      //   uploaded: false
      // });
      console.log(this.props.navigation.state.params.data);
      const ref = this;
      SharedPreferences.getItem(ref.props.navigation.state.params.data, function(value){
        console.log(value);
        if(value === "Uploaded") {
          ref.setState({
            uploaded: true,
          });
        }
      });
    
  }

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

  gallery = (uri) => {
    // let data = await this.requestExternalStoragePermission();
    // console.log(data); 
    console.log('pressed a upload button ');
    
    //
    const ref = this;
    const storage = f.storage().ref();
        ref.uriToBlob(this.props.navigation.state.params.data).then(function (blob) {
          console.log('Outside urI');
          console.log(blob);
          ref.uploadToFirebase(blob).then(function (response) {
  
            storage.child(response.metadata.fullPath).getDownloadURL().then(function (url) {
              console.log('im in download');
              console.log(url);
              return uri;
            }).then(function (retUrl) {
              console.log('FireBase Uploaded');
              //console.log(response);
              ref.setState({ uploaded: true});
              

              SharedPreferences.setItem(ref.props.navigation.state.params.data,"Uploaded");
            
            });
          });
        });
    //

  };

  render() {

    let Image_Http_URL ={ uri: this.props.navigation.state.params.data};

    if(!this.state.uploaded){
    
    return (
        
        
            <ImageBackground source={Image_Http_URL} style = {{flex: 1, resizeMode : 'cover', margin: 5 }} >

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
                onPress={this.gallery.bind(this)}
                >
               <Icon name='md-cloud-upload' />
            </TouchableOpacity>

            </ImageBackground>
           
       
        
        
        
    
      
    );
  }//end of if

  return(
    <ImageBackground source={Image_Http_URL} style = {{flex: 1, resizeMode : 'cover', margin: 5 }} >

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
                //onPress={this.gallery.bind(this)}
                >
               <Icon name='ios-cloud-done' />
            </TouchableOpacity>
      </ImageBackground>

  );

  }
}
var styles = StyleSheet.create({
    container: {
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: '#F5FCFF',
         flexDirection: 'column',
    },
         backgroundImage:{
         width:320,
         height:480,
       }
});