/* eslint-disable max-len */
import React, {Component} from 'react';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import camera from './screens/camera';
import gallery from './screens/gallery';
import galleryimage from './screens/GalleryImage';

import {Root} from 'native-base';


class App extends Component {

  render() {
    return <AppContainer />;
  }
}









const Stack = createStackNavigator({

  camera: {
    screen: camera
  },
  gallery: {
    screen: gallery
  },
  galleryimage: {
    screen: galleryimage
  },

  });



const AppContainer = createAppContainer(Stack);
export default App;
